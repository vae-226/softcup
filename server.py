import json
import os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT_DIR = Path(__file__).resolve().parent
PREVIEW_FILE = ROOT_DIR / "preview.html"
DOTENV_FILE = ROOT_DIR / ".env"
QWEN_ENDPOINT = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"


def load_env_file() -> None:
    if not DOTENV_FILE.exists():
        return

    for raw_line in DOTENV_FILE.read_text(encoding="utf-8-sig", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file()


class AiGuideHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/", "/index.html"):
            self.serve_preview_page()
            return
        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if urlparse(self.path).path in ("/api/qwen/chat", "/api/qwen/chat/"):
            self.handle_qwen_chat()
            return
        self.send_json(404, {"code": 404, "message": "接口不存在"})

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()

    def serve_preview_page(self):
        if not PREVIEW_FILE.exists():
            self.send_error(404, "Preview page not found")
            return

        body = PREVIEW_FILE.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def handle_qwen_chat(self):
        payload = self.read_json()
        message = str(payload.get("message", "")).strip()
        context = payload.get("context", {})
        knowledge = payload.get("knowledge", [])
        model = str(payload.get("model") or os.getenv("QWEN_MODEL", "qwen-plus")).strip()
        api_key = str(payload.get("apiKey") or os.getenv("DASHSCOPE_API_KEY", "")).strip()

        if not message:
            self.send_json(400, {"code": 400, "message": "message 不能为空"})
            return

        if not api_key:
            self.send_json(503, {
                "code": 503,
                "message": "未配置 DASHSCOPE_API_KEY，当前只能使用本地知识库。"
            })
            return

        try:
            knowledge_text = "\n".join(
                f"- {item.get('title', '')}: {item.get('content', '')}"
                for item in knowledge[:10]
                if isinstance(item, dict)
            )
            system_prompt = (
                "你是灵山胜境的AI数字人导游，名字叫灵灵。"
                "回答必须围绕灵山胜境、灵山大佛、九龙灌浴、灵山梵宫、五印坛城、游客服务与景区路线。"
                "必须优先依据给定景区知识库；如果资料没有明确事实，要提醒游客以景区公告或游客中心为准。"
                "回答要像真人导游一样亲切自然、简洁清楚，不要提到自己是大模型。"
            )
            user_prompt = (
                f"游客问题：{message}\n"
                f"游客上下文：{json.dumps(context, ensure_ascii=False)}\n"
                f"景区知识库：\n{knowledge_text}\n"
                "请直接回答游客，控制在180字以内。"
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
                data = json.loads(response.read().decode("utf-8"))

            answer = data["choices"][0]["message"]["content"]
            self.send_json(200, {
                "code": 0,
                "provider": "qwen",
                "model": model,
                "answer": answer,
                "raw": data,
            })
        except HTTPError as exc:
            message_text = exc.read().decode("utf-8", errors="ignore")
            self.send_json(exc.code, {
                "code": exc.code,
                "message": message_text or "千问接口返回错误",
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
