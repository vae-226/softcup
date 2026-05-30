import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { answerQuestion, getAdminDashboard, recommendRoute } = require("../services/guide-service.js");

test("游客询问灵山大佛时获得相关景点讲解", () => {
  const result = answerQuestion("灵山大佛有什么特色？");

  assert.equal(result.spotName, "灵山大佛");
  assert.match(result.answer, /灵山大佛/);
  assert.match(result.answer, /五方五佛|216级|青铜|抱佛脚/);
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
