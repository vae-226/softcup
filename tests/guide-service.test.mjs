import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const {
  answerQuestion,
  askAiGuide,
  buildAiContext,
  configureAdminStorage,
  getAdminDashboard,
  markFeedbackHandled,
  recommendRoute,
  saveAvatarConfig,
  toggleKnowledgeStatus,
  uploadKnowledgeItem
} = require("../services/guide-service.js");

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, value);
    }
  };
}

test("游客询问灵山大佛时获得相关景点讲解", () => {
  const result = answerQuestion("灵山大佛有什么特色？");

  assert.equal(result.spotName, "灵山大佛");
  assert.match(result.answer, /灵山大佛/);
  assert.match(result.answer, /五方五佛|216级|青铜|抱佛脚/);
});

test("构造千问接口上下文时包含知识库和景区身份", () => {
  const payload = buildAiContext("梵宫有什么艺术亮点？");

  assert.equal(payload.model, "qwen-plus");
  assert.equal(payload.context.scenicName, "灵山胜境");
  assert.ok(payload.knowledge.length >= 3);
  assert.match(payload.message, /梵宫/);
});

test("AI接口不可用时降级为本地知识库回答", async () => {
  const result = await askAiGuide("九龙灌浴适合孩子看吗？", {
    request: null,
    apiBase: ""
  });

  assert.equal(result.source, "local-rag");
  assert.match(result.answer, /九龙灌浴/);
});

test("AI接口成功时返回千问回答并保留景点上下文", async () => {
  const result = await askAiGuide("灵山大佛最值得看什么？", {
    apiBase: "http://mock.local",
    request(options) {
      options.success({
        statusCode: 200,
        data: {
          provider: "qwen",
          model: "qwen-plus",
          answer: "千问生成：灵山大佛值得看佛像手印、登云道和太湖山水格局。"
        }
      });
    }
  });

  assert.equal(result.source, "qwen");
  assert.equal(result.model, "qwen-plus");
  assert.match(result.answer, /千问生成/);
});

test("游客选择亲子兴趣时推荐亲子家庭路线", () => {
  const route = recommendRoute({ interest: "family", duration: "4小时" });

  assert.equal(route.audience, "亲子家庭");
  assert.match(route.focus, /孩子|亲子|互动/);
  assert.ok(route.stops.includes("九龙灌浴"));
  assert.ok(route.stops.includes("百子戏弥勒"));
});

test("管理后台提供运营概览、知识库和反馈数据", () => {
  const dashboard = getAdminDashboard();

  assert.ok(dashboard.metrics.some((item) => item.label === "今日服务人次"));
  assert.equal(dashboard.avatarConfig.name, "灵灵");
  assert.ok(dashboard.knowledge.some((item) => item.title.includes("灵山大佛")));
  assert.ok(dashboard.feedbacks.some((item) => item.action));
});

test("管理后台保存数字人配置后再次读取仍使用新配置", () => {
  configureAdminStorage(createMemoryStorage());

  const saved = saveAvatarConfig({
    name: "小灵",
    costume: "朱檐礼服",
    voice: "沉稳讲解",
    style: "文化专家"
  });

  assert.equal(saved.name, "小灵");
  assert.equal(getAdminDashboard().avatarConfig.costume, "朱檐礼服");
  assert.equal(getAdminDashboard().avatarConfig.voice, "沉稳讲解");
});

test("管理后台可以停用并重新启用知识库条目", () => {
  configureAdminStorage(createMemoryStorage());

  const disabled = toggleKnowledgeStatus("灵山大佛历史");
  assert.equal(disabled.status, "已停用");
  assert.equal(disabled.statusClass, "disabled");
  assert.equal(getAdminDashboard().knowledge[0].status, "已停用");

  const enabled = toggleKnowledgeStatus("灵山大佛历史");
  assert.equal(enabled.status, "已启用");
  assert.equal(getAdminDashboard().knowledge[0].status, "已启用");
});

test("管理后台可以标记游客反馈为已处理", () => {
  configureAdminStorage(createMemoryStorage());

  const handled = markFeedbackHandled("讲解很清晰，非常有文化内容，声音也很好听。");

  assert.equal(handled.handled, true);
  assert.equal(handled.action, "已处理");
  assert.equal(getAdminDashboard().feedbacks[0].handled, true);
});

test("管理后台可以模拟上传新的知识库资料", () => {
  configureAdminStorage(createMemoryStorage());

  const uploaded = uploadKnowledgeItem({
    title: "游客中心服务指南",
    category: "游客服务",
    spot: "游客中心"
  });

  assert.equal(uploaded.status, "待审核");
  assert.ok(getAdminDashboard().knowledge.some((item) => item.title === "游客中心服务指南"));
});
