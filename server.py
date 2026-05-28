import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
QWEN_ENDPOINT = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"


class GuideHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path in ("/api/qwen/chat", "/api/qwen/chat/"):
            self.handle_qwen_chat()
            return
        self.send_json(404, {"code": 404, "message": "接口不存在"})

    def handle_qwen_chat(self):
        api_key = os.getenv("DASHSCOPE_API_KEY", "").strip()
        if not api_key:
            self.send_json(
                503,
                {
                    "code": 503,
                    "message": "未配置 DASHSCOPE_API_KEY，已由前端自动降级到本地知识库回答。",
                },
            )
            return

        try:
            payload = self.read_json()
            user_message = payload.get("message", "")
            context = payload.get("context", {})
            knowledge = payload.get("knowledge", [])
            model = payload.get("model") or os.getenv("QWEN_MODEL", "qwen-plus")

            system_prompt = (
                "你是“灵山胜境”的AI数字人导游，名字叫灵灵。"
                "你只能围绕灵山胜境、灵山大佛、九龙灌浴、灵山梵宫、五印坛城、祥符禅寺、太湖风光、佛教文化和游客服务回答。"
                "不要把上下文里的 spotId 当成英文单词，它只是景区点位ID。"
                "必须优先依据给定景区知识库回答；知识库没有的信息，要说明需要向景区服务中心确认。"
                "语气要像真人导游，亲切、简洁、可继续追问。"
                "不要输出 Markdown 标题，不要使用表情符号，不要提到你是大模型。"
            )
            knowledge_text = "\n".join(
                f"- {item.get('title')}: {item.get('content')}" for item in knowledge[:8]
            )
            scene_map = {
                "buddha": "灵山大佛",
                "bath": "九龙灌浴",
                "palace": "灵山梵宫",
                "tantric": "五印坛城",
            }
            context["scenicName"] = "灵山胜境"
            context["spotName"] = scene_map.get(context.get("spotId"), "灵山大佛")
            user_prompt = (
                f"游客问题：{user_message}\n"
                f"游客上下文：{json.dumps(context, ensure_ascii=False)}\n"
                f"景区知识库：\n{knowledge_text}\n"
                "请直接以数字人导游身份回答游客这一句话，回答不要超过180字。"
            )

            qwen_payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.6,
                "top_p": 0.8,
            }

            request = Request(
                QWEN_ENDPOINT,
                data=json.dumps(qwen_payload, ensure_ascii=False).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urlopen(request, timeout=30) as response:
                raw = response.read().decode("utf-8")
                data = json.loads(raw)

            content = data["choices"][0]["message"]["content"]
            self.send_json(
                200,
                {
                    "code": 0,
                    "provider": "qwen",
                    "model": model,
                    "answer": content,
                    "raw": data,
                },
            )
        except HTTPError as exc:
            message = exc.read().decode("utf-8", errors="ignore")
            self.send_json(exc.code, {"code": exc.code, "message": message})
        except (URLError, TimeoutError) as exc:
            self.send_json(504, {"code": 504, "message": str(exc)})
        except Exception as exc:
            self.send_json(500, {"code": 500, "message": str(exc)})

    def read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8", errors="replace")
        return json.loads(raw or "{}")

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main():
    port = int(os.getenv("PORT", "8000"))
    server = ThreadingHTTPServer(("127.0.0.1", port), GuideHandler)
    print(f"灵境导游服务已启动：http://127.0.0.1:{port}")
    print("千问接口：POST /api/qwen/chat")
    print("配置环境变量 DASHSCOPE_API_KEY 后启用真实千问回答。")
    server.serve_forever()


if __name__ == "__main__":
    main()
