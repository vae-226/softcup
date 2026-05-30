import {
  analytics as seedAnalytics,
  avatarProfiles as seedAvatarProfiles,
  knowledgeBase as seedKnowledgeBase,
  routes,
  scenicSpot,
  scenicSpots
} from "./data.js";

const STORAGE_KEY = "softcup-lingshan-guide-state-v2";
const API_LOG_LIMIT = 12;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadStore() {
  const fallback = {
    knowledgeBase: clone(seedKnowledgeBase),
    avatarProfiles: clone(seedAvatarProfiles),
    feedbacks: clone(seedAnalytics.feedbacks),
    apiLogs: [],
    visitorProfile: {
      name: "游客001",
      interest: "history",
      duration: "2小时",
      groupType: "个人",
      language: "中文"
    }
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed
    };
  } catch {
    return fallback;
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getStore() {
  return loadStore();
}

function updateStore(updater) {
  const current = loadStore();
  const next = updater(clone(current));
  saveStore(next);
  return next;
}

function createApiResult(endpoint, method, data, message = "接口调用成功") {
  const result = {
    code: 0,
    endpoint,
    method,
    message,
    data,
    requestId: `REQ-${Date.now()}`,
    time: new Date().toLocaleString()
  };

  updateStore((store) => {
    store.apiLogs = [
      {
        endpoint,
        method,
        message,
        requestId: result.requestId,
        time: result.time
      },
      ...(store.apiLogs || [])
    ].slice(0, API_LOG_LIMIT);
    return store;
  });

  return result;
}

const emotionMap = {
  history: "thinking",
  cultural: "thinking",
  natural: "smile",
  family: "excited",
  service: "calm",
  default: "smile"
};

function detectIntent(message) {
  const text = message.toLowerCase();
  if (/(历史|古城|城墙|朝代|文化|博物馆)/.test(text)) return "history";
  if (/(自然|风光|湿地|拍照|观鸟|栈道|晚霞)/.test(text)) return "natural";
  if (/(亲子|孩子|家庭|手作|体验)/.test(text)) return "family";
  if (/(厕所|停车|服务|餐饮|母婴|无障碍)/.test(text)) return "service";
  if (/(几点|时间|夜游|演出)/.test(text)) return "cultural";
  return "default";
}

function activeKnowledgeBase() {
  return loadStore().knowledgeBase.filter((item) => item.status !== "已停用");
}

function searchKnowledge(message, spotId) {
  const text = message.trim();
  const base = activeKnowledgeBase();
  const matches = base
    .map((item) => {
      let score = 0;
      item.keywords.forEach((keyword) => {
        if (text.includes(keyword)) score += 2;
      });
      if (text.includes(item.category)) score += 1;
      if (text.includes(item.title)) score += 2;
      if (spotId && item.spotId === spotId) score += 3;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  return matches[0]?.item || base[0];
}

function recommendRoute(message, interest) {
  const intent = detectIntent(message);
  if (intent === "history" || intent === "cultural" || interest === "history") return routes[0];
  if (intent === "natural" || interest === "nature") return routes[1];
  if (intent === "family" || interest === "family" || interest === "service") return routes[2];
  return routes[0];
}

function summarizeFeedback(feedback) {
  const summary = feedback.content || "游客提交了简短反馈。";
  const suggestion = feedback.emotion === "不满" || feedback.score <= 2
    ? "建议优先回看该时段的交互链路和景点导览内容。"
    : "建议保留当前服务风格，并继续丰富多语种讲解。";
  return {
    user: feedback.user,
    sentiment: scoreToSentiment(feedback.score, feedback.emotion),
    summary,
    suggestion
  };
}

function scoreToSentiment(score, emotion) {
  if (score >= 4 || ["满意", "惊喜"].includes(emotion)) return "积极";
  if (score === 3 || emotion === "中性") return "中性";
  return "待改善";
}

function computeAnalytics() {
  const store = loadStore();
  const base = clone(seedAnalytics);
  const dynamicFeedbacks = store.feedbacks;
  const avgScore =
    dynamicFeedbacks.reduce((sum, item) => sum + (item.score || 4), 0) / Math.max(dynamicFeedbacks.length, 1);

  const satisfaction = Number((avgScore / 5 * 100).toFixed(1));
  const hotQuestions = [
    "夜游演艺几点开始？",
    "哪里适合拍照看晚霞？",
    "亲子路线怎么安排？",
    "城墙遗址有哪些看点？"
  ];

  return {
    ...base,
    satisfaction,
    hotQuestions,
    feedbacks: dynamicFeedbacks.map(summarizeFeedback)
  };
}

export function getScenicProfile() {
  return scenicSpot;
}

export function getAvatarProfiles() {
  return loadStore().avatarProfiles;
}

export function getKnowledgeBase() {
  return loadStore().knowledgeBase;
}

export function getRoutes() {
  return routes;
}

export function getAnalytics() {
  return computeAnalytics();
}

export function createLiveSnapshot() {
  return {
    scenic: scenicSpot,
    avatars: getAvatarProfiles(),
    knowledge: getKnowledgeBase(),
    routes: getRoutes(),
    analytics: getAnalytics(),
    spots: scenicSpots,
    apiLogs: loadStore().apiLogs || []
  };
}

export function updateVisitorProfile(profile) {
  const store = updateStore((draft) => {
    draft.visitorProfile = profile;
    return draft;
  });

  return createApiResult(
    "/api/visitor/profile",
    "PUT",
    store.visitorProfile,
    "游客档案已更新，路线推荐接口已重新计算"
  );
}

export function switchGuideScene(spotId) {
  const spot = scenicSpots.find((item) => item.id === spotId) || scenicSpots[0];
  return createApiResult(
    "/api/guide/scene",
    "POST",
    { spot },
    `已切换到${spot.name}讲解场景`
  );
}

export function startSpotGuide(spotId, mode = "text") {
  const spot = scenicSpots.find((item) => item.id === spotId) || scenicSpots[0];
  const relatedKnowledge = activeKnowledgeBase().filter((item) => item.spotId === spot.id);
  return createApiResult(
    "/api/guide/spot/start",
    "POST",
    {
      spot,
      mode,
      script: spot.script,
      knowledge: relatedKnowledge,
      nextQuestions: [
        `${spot.name}最值得看的是什么？`,
        `帮我讲讲${spot.name}的历史故事。`,
        `从${spot.name}下一站应该去哪？`
      ]
    },
    `已进入${spot.name}数字人讲解`
  );
}

export function planRouteToSpot(spotId, interest = "history") {
  const spot = scenicSpots.find((item) => item.id === spotId) || scenicSpots[0];
  const route = recommendRoute(spot.name, interest);
  return createApiResult(
    "/api/routes/spot-plan",
    "POST",
    {
      targetSpot: spot,
      route,
      eta: "12 分钟",
      navigationTips: [
        "沿主路前行，避开施工区域。",
        "若 GPS 信号弱，可扫描沿途二维码继续定位。",
        "到达后自动切换数字人讲解词。"
      ]
    },
    `已生成前往${spot.name}的路线`
  );
}

export function switchRoute(routeId) {
  const route = routes.find((item) => item.id === routeId) || routes[0];
  return createApiResult(
    "/api/routes/active",
    "PUT",
    { route },
    `已切换到${route.audience}`
  );
}

export function updateVisitorProfileLegacy(profile) {
  updateStore((store) => {
    store.visitorProfile = profile;
    return store;
  });
}

export function chatWithGuide(message, context = {}) {
  const source = searchKnowledge(message, context.spotId);
  const route = recommendRoute(message, context.interest);
  const intent = detectIntent(message);
  const emotion = emotionMap[intent] || emotionMap.default;
  const spot = scenicSpots.find((item) => item.id === context.spotId) || scenicSpots[0];
  const answer =
    `你好，${context.visitorName || "游客"}。这里是${scenicSpot.name}数字导游。` +
    `${source.content}` +
    ` 当前你所在的讲解场景是${spot.name}。` +
    ` 我推荐你参考“${route.audience}”路线，重点站点包括${route.stops.join("、")}。` +
    ` 如果需要，我还可以继续细讲每个站点的故事、拍照点和休息服务。`;

  const payload = {
    channel: context.channel || "text",
    answer,
    sourceTitle: source.title,
    route,
    emotion
  };

  return createApiResult(
    "/api/guide/chat",
    "POST",
    payload,
    "数字人问答接口已返回"
  );
}

export async function chatWithQwenGuide(message, context = {}) {
  const localResult = chatWithGuide(message, context);

  try {
    const requestBody = JSON.stringify({
      message,
      context,
      knowledge: activeKnowledgeBase(),
      model: "qwen-plus"
    });
    const origins = [
      window.location.origin,
      "http://127.0.0.1:8000",
      "http://localhost:8000"
    ].filter(Boolean);
    let response = null;
    let lastError = null;

    for (const origin of [...new Set(origins)]) {
      try {
        response = await fetch(`${origin}/api/qwen/chat`, {
          method: "POST",
          mode: "cors",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: requestBody
        });
        if (response.ok) break;
        lastError = new Error(`Qwen proxy returned ${response.status}`);
      } catch (error) {
        lastError = error;
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error("Qwen proxy request failed");
    }

    const data = await response.json();
    const qwenPayload = {
      ...localResult.data,
      answer: data.answer,
      sourceTitle: "千问 Qwen + 本地景区知识库",
      provider: data.provider || "qwen",
      model: data.model || "qwen-plus"
    };

    return createApiResult(
      "/api/qwen/chat",
      "POST",
      qwenPayload,
      `千问 ${qwenPayload.model} 已生成回答`
    );
  } catch (error) {
    return createApiResult(
      "/api/qwen/chat",
      "POST",
      {
        ...localResult.data,
        provider: "local-fallback",
        model: "local-rag",
        error: error.message
      },
      "千问未启用或请求失败，已降级到本地知识库回答"
    );
  }
}

export function addKnowledgeItem({ title, category, keywords, content }) {
  const store = updateStore((store) => {
    store.knowledgeBase.unshift({
      id: `kb-${Date.now()}`,
      title,
      category,
      keywords: keywords.split(",").map((item) => item.trim()).filter(Boolean),
      content,
      status: "已启用",
      spotId: "wall"
    });
    return store;
  });

  return createApiResult(
    "/api/admin/knowledge",
    "POST",
    { total: store.knowledgeBase.length, item: store.knowledgeBase[0] },
    "知识条目已新增并完成索引"
  );
}

export function toggleKnowledgeStatus(id) {
  let updated = null;
  updateStore((store) => {
    const item = store.knowledgeBase.find((entry) => String(entry.id) === String(id));
    if (item) {
      item.status = item.status === "已启用" ? "已停用" : "已启用";
      updated = item;
    }
    return store;
  });

  return createApiResult(
    `/api/admin/knowledge/${id}/status`,
    "PATCH",
    { item: updated },
    updated ? `知识条目已${updated.status === "已启用" ? "启用" : "停用"}` : "未找到知识条目"
  );
}

export function removeKnowledgeItem(id) {
  const store = updateStore((store) => {
    store.knowledgeBase = store.knowledgeBase.filter((entry) => String(entry.id) !== String(id));
    return store;
  });

  return createApiResult(
    `/api/admin/knowledge/${id}`,
    "DELETE",
    { total: store.knowledgeBase.length },
    "知识条目已删除"
  );
}

export function saveAvatarProfile(profile) {
  updateStore((store) => {
    store.avatarProfiles = store.avatarProfiles.map((item) =>
      item.id === profile.id ? { ...item, ...profile } : item
    );
    return store;
  });

  return createApiResult(
    `/api/admin/avatar/${profile.id}`,
    "PUT",
    { profile },
    "数字人配置已保存"
  );
}

export function submitVisitorFeedback(feedback) {
  const store = updateStore((store) => {
    store.feedbacks.unshift({
      user: feedback.user,
      score: feedback.score,
      emotion: feedback.emotion,
      content: feedback.content,
      sentiment: scoreToSentiment(feedback.score, feedback.emotion)
    });
    return store;
  });

  return createApiResult(
    "/api/visitor/feedback",
    "POST",
    { feedback: store.feedbacks[0], total: store.feedbacks.length },
    "游客反馈已提交并进入感受度分析"
  );
}

export function buildFeedbackReport() {
  const analytics = computeAnalytics();
  const positiveCount = analytics.feedbacks.filter((item) => item.sentiment === "积极").length;
  const neutralCount = analytics.feedbacks.filter((item) => item.sentiment === "中性").length;
  const negativeCount = analytics.feedbacks.length - positiveCount - neutralCount;

  return {
    positiveRate: ((positiveCount / analytics.feedbacks.length) * 100).toFixed(1),
    neutralRate: ((neutralCount / analytics.feedbacks.length) * 100).toFixed(1),
    negativeRate: ((negativeCount / analytics.feedbacks.length) * 100).toFixed(1),
    keywords: ["夜游体验", "路线推荐", "风噪识别", "亲子互动", "多语种讲解"],
    advice: [
      "在湿地及风口区域启用降噪 ASR 模型和离线文本快捷提问。",
      "将夜游内容与热门打卡点绑定，提升游客停留时长与二次消费转化。",
      "增加英文、日语和无障碍模式，扩展国际游客与特殊人群服务能力。"
    ]
  };
}
