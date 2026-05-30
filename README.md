# 灵境导游 - 微信小程序版

这是面向“中国软件杯 A5-景区导览服务AI数字人”赛题的小程序原型。当前版本先实现游客导览首页，UI 参考 `备份/digital-human-guide.html` 的水墨绢本、朱砂红、圆形数字人、推荐路线卡片、百科磁贴和底部导航风格，内容替换为灵山胜境。

## 当前能力

- AI 数字人导游首页
- 本地景区知识库问答
- 历史文化、自然风光、亲子家庭路线推荐
- 景区百科磁贴
- 周边服务入口
- 悬浮讲解控制条

## 目录结构

```text
.
├─ app.js
├─ app.json
├─ app.wxss
├─ project.config.json
├─ sitemap.json
├─ pages/
│  └─ guide/
├─ data/
│  └─ scenic.js
├─ services/
│  └─ guide-service.js
├─ tests/
└─ 备份/
   ├─ index.html
   ├─ styles.css
   ├─ server.py
   └─ src/
```

## 运行方式

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择本仓库根目录。
4. AppID 可先使用测试号或替换 `project.config.json` 中的占位值。
5. 编译后进入 `pages/guide/guide`。

## 测试

本地服务逻辑使用 Node 测试验证：

```bash
node --test tests/guide-service.test.mjs
```

## 说明

旧 Web 原型已移动到 `备份/`。赛题、总体设计文档、部署与使用手册和示范景区资料包仍保留在根目录，便于提交和查阅。
