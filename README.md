# 灵境导游 - AI数字人景区导览系统

这是一个面向比赛初赛演示的可运行原型，覆盖游客交互端与管理后台两大场景，突出以下能力：

- 多模态交互：文本输入、语音输入模拟、数字人口型/表情状态联动
- 智能问答：基于本地景区知识库的事实问答与讲解
- 个性化推荐：按历史文化、自然风光、亲子家庭等兴趣路线推荐
- 管理后台：知识库管理、数字人配置、游客感受度报告、运营数据概览

## 目录结构

```text
.
├─ index.html
├─ styles.css
├─ src
│  ├─ data.js
│  ├─ main.js
│  └─ service.js
├─ README.md
├─ 部署与使用手册.md
└─ 总体设计文档.md
```

## 快速运行

### 方式一：直接打开

双击 `index.html` 即可在浏览器中查看演示系统。

### 方式二：本地静态服务

如果你希望通过本地服务访问，可在项目目录执行：

```powershell
python -m http.server 8000
```

然后打开 [http://localhost:8000](http://localhost:8000)。

### 方式三：启用千问 Qwen 接口

系统已提供本地后端代理 `server.py`，用于安全调用阿里云百炼 DashScope 千问接口。

```powershell
$env:DASHSCOPE_API_KEY="你的DashScope API Key"
python server.py
```

然后打开 [http://127.0.0.1:8000](http://127.0.0.1:8000)。

未配置 `DASHSCOPE_API_KEY` 时，系统会自动降级到本地知识库问答。

## 当前原型说明

当前版本是静态演示实现，便于初赛展示和录制视频。核心数据和逻辑位于：

- `src/data.js`：景区资料、知识库、路线、运营数据
- `src/service.js`：模拟 AI 问答、路线推荐、反馈报告生成
- `src/main.js`：游客端和管理后台渲染逻辑

## 工程化落地建议

后续可将本原型升级为正式系统：

1. 使用 FastAPI/Flask/NestJS 构建真实后端接口
2. 接入多模态大模型 API，如 Qwen-Omni、GLM-4.1V、GPT-4o。本原型已内置千问 Qwen 代理接口。
3. 使用 Whisper/FunASR 进行语音识别
4. 使用 Edge-TTS/ChatTTS/商业 TTS 进行语音合成
5. 使用向量数据库构建景区知识库检索问答
6. 使用 Live2D 或 2D 数字人 SDK 驱动口型与表情

## 比赛提交物对应关系

- 源代码：当前仓库全部文件
- 部署与使用手册：`部署与使用手册.md`
- 总体设计文档：`总体设计文档.md`
