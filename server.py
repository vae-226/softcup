import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


QWEN_ENDPOINT = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"


class AiGuideHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
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
            self.send_json(503, {
                "code": 503,
                "message": "未配置 DASHSCOPE_API_KEY，小程序会自动降级到本地知识库回答。"
            })
            return

        try:
            payload = self.read_json()
            message = payload.get("message", "")
            context = payload.get("context", {})
            knowledge = payload.get("knowledge", [])
            model = payload.get("model") or os.getenv("QWEN_MODEL", "qwen-plus")

            knowledge_text = "\n".join(
                f"- {item.get('title', '')}: {item.get('content', '')}"
                for item in knowledge[:10]
            )
            system_prompt = (
                "你是灵山胜境的AI数字人导游，名字叫灵灵。"
                "只能围绕灵山胜境、灵山大佛、九龙灌浴、灵山梵宫、五印坛城、祥符禅寺、太湖风光和游客服务回答。"
                "必须优先依据给定知识库；如果知识库没有明确事实，要提示游客以景区公告或游客中心为准。"
                "回答要像真人导游，亲切、自然、简洁，不要提到你是大模型。"
            )
            user_prompt = (
                f"游客问题：{message}\n"
                f"游客上下文：{json.dumps(context, ensure_ascii=False)}\n"
                f"景区知识库：\n{knowledge_text}\n"
                "请直接回复游客，控制在180字以内。"
            )
            qwen_payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.6,
                "top_p": 0.8
            }

            request = Request(
                QWEN_ENDPOINT,
                data=json.dumps(qwen_payload, ensure_ascii=False).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))

            answer = data["choices"][0]["message"]["content"]
            self.send_json(200, {
                "code": 0,
                "provider": "qwen",
                "model": model,
                "answer": answer,
                "raw": data
            })
        except HTTPError as exc:
            self.send_json(exc.code, {
                "code": exc.code,
                "message": exc.read().decode("utf-8", errors="ignore")
            })
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
    server = ThreadingHTTPServer(("127.0.0.1", port), AiGuideHandler)
    print(f"AI代理服务已启动：http://127.0.0.1:{port}")
    print("接口：POST /api/qwen/chat")
    server.serve_forever()


if __name__ == "__main__":
    main()
