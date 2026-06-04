# 灵境导游 - 微信小程序版

面向“中国软件杯 A5 - 景区导览服务 AI 数字人”赛题的小程序原型。当前版本以 `jqxx` 示范景区公开资料包中的“灵山胜境”为基础知识库，提供游客端数字人导览和管理后台。

## 当前能力

- 游客端 AI 数字人导游首页
- 数字人对话区：显示游客问题、数字人返回内容和回答来源
- 优先调用后端千问 Qwen 接口，失败时降级到本地景区知识库
- 灵山大佛、九龙灌浴、灵山梵宫、五印坛城等知识问答
- 历史文化、自然风光、亲子家庭路线推荐
- 景区百科、周边服务、悬浮讲解控制条
- 管理后台：运营指标、知识库管理、数字人配置、游客感受度报告

## 目录结构

```text
.
├─ app.js / app.json / app.wxss
├─ pages/
│  ├─ guide/      游客导览端
│  ├─ explain/    讲解页
│  ├─ route/      路线页
│  ├─ profile/    我的页，连续点击可进入后台
│  └─ admin/      管理后台
├─ data/scenic.js
├─ services/guide-service.js
├─ server.py      千问 Qwen 本地代理接口
├─ tests/
├─ jqxx/          示范景区公开资料包
└─ 备份/          旧 Web 原型备份
```

## 小程序运行

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择仓库根目录。
4. AppID 可使用测试号，或替换 `project.config.json` 中的配置。
5. 编译后进入 `pages/guide/guide`。

管理后台入口：

- 在“我的”页连续点击 tab，可进入 `pages/admin/admin`。
- 开发者工具中也可以直接打开 `pages/admin/admin`。

## 启用千问 Qwen 接口

小程序不能在前端保存 API Key。真实 AI 对话需要启动本地或线上后端代理：

```powershell
$env:DASHSCOPE_API_KEY="你的阿里云百炼 DashScope API Key"
python server.py
```

默认接口地址：

```text
http://127.0.0.1:8000/api/qwen/chat
```

小程序端 `data/scenic.js` 中的 `apiBase` 默认指向 `http://127.0.0.1:8000`。上线时需要改成 HTTPS 后端域名，并在微信小程序后台配置 request 合法域名。

如果没有启动代理服务，游客端仍可使用本地知识库回答，页面会标记为“本地知识库回答”。

## 测试

```bash
node --test tests/guide-service.test.mjs
```

## 安全说明

- 不要把真实 API Key 写入仓库。
- `.env` 已被 `.gitignore` 排除。
- 如果 API Key 曾经发到聊天或截图里，建议立即在平台作废并重新生成。
