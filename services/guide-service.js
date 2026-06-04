const {
  adminKnowledge,
  adminMetrics,
  avatarConfig,
  feedbacks,
  knowledgeBase,
  routes,
  scenic,
  sentimentReport
} = require("../data/scenic");

const ADMIN_STATE_KEY = "lingjing-admin-state";

let adminStorage = null;

function getStorage() {
  if (adminStorage) {
    return adminStorage;
  }
  if (typeof wx !== "undefined") {
    return {
      getItem: (key) => wx.getStorageSync(key) || null,
      setItem: (key, value) => wx.setStorageSync(key, value)
    };
  }
  return null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readAdminState() {
  const storage = getStorage();
  if (!storage) {
    return {};
  }
  const raw = storage.getItem(ADMIN_STATE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeAdminState(state) {
  const storage = getStorage();
  if (storage) {
    storage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
  }
}

function configureAdminStorage(storage) {
  adminStorage = storage;
}

function matchKnowledge(question) {
  const text = String(question || "");
  return knowledgeBase.find((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  ) || knowledgeBase[0];
}

function answerQuestion(question) {
  const matched = matchKnowledge(question);
  return {
    scenicName: scenic.name,
    guideName: scenic.guideName,
    spotName: matched.spotName,
    mood: matched.mood,
    answer: matched.answer,
    source: "local-rag"
  };
}

function buildAiContext(question) {
  const matched = matchKnowledge(question);
  return {
    message: String(question || ""),
    context: {
      scenicName: scenic.name,
      guideName: scenic.guideName,
      spotId: matched.id,
      spotName: matched.spotName
    },
    knowledge: knowledgeBase.map((item) => ({
      title: item.title,
      content: item.answer
    })),
    model: "qwen-plus"
  };
}

function askAiGuide(question, options = {}) {
  const fallback = answerQuestion(question);
  const request = options.request || (typeof wx !== "undefined" ? wx.request : null);
  const apiBase = options.apiBase || scenic.apiBase;

  if (!request || !apiBase) {
    return Promise.resolve({
      ...fallback,
      source: "local-rag",
      statusText: "本地知识库回答"
    });
  }

  return new Promise((resolve) => {
    request({
      url: `${apiBase}/api/qwen/chat`,
      method: "POST",
      data: buildAiContext(question),
      timeout: 30000,
      success(response) {
        const data = response.data || {};
        if (response.statusCode >= 200 && response.statusCode < 300 && data.answer) {
          resolve({
            ...fallback,
            answer: data.answer,
            source: data.provider || "qwen",
            model: data.model || "qwen-plus",
            statusText: "千问AI回答"
          });
          return;
        }
        resolve({
          ...fallback,
          source: "local-rag",
          statusText: `AI接口异常，已使用本地知识库（${response.statusCode || "unknown"}）`
        });
      },
      fail(error) {
        resolve({
          ...fallback,
          source: "local-rag",
          statusText: `AI接口未连接，已使用本地知识库（${error.errMsg || "request failed"}）`
        });
      }
    });
  });
}

function recommendRoute(profile = {}) {
  const interest = String(profile.interest || "");
  if (interest === "family" || interest.includes("亲子") || interest.includes("孩子")) {
    return routes.find((route) => route.id === "family");
  }
  if (interest === "nature" || interest.includes("自然") || interest.includes("风光")) {
    return routes.find((route) => route.id === "nature");
  }
  return routes.find((route) => route.id === "history");
}

function getAdminDashboard() {
  const state = readAdminState();
  const knowledgeState = state.knowledge || {};
  const uploadedKnowledge = state.uploadedKnowledge || [];
  const feedbackState = state.feedbacks || {};
  const knowledge = [
    ...clone(adminKnowledge),
    ...uploadedKnowledge
  ];
  return {
    metrics: clone(adminMetrics),
    avatarConfig: {
      ...avatarConfig,
      ...state.avatarConfig
    },
    sentimentReport: clone(sentimentReport),
    knowledge: knowledge.map((item) => {
      const nextItem = {
        ...item,
        ...knowledgeState[item.title]
      };
      return {
        ...nextItem,
        statusAction: nextItem.status === "已启用" ? "停用" : "启用"
      };
    }),
    feedbacks: clone(feedbacks).map((item) => {
      const nextItem = {
        ...item,
        ...feedbackState[item.content]
      };
      return {
        ...nextItem,
        handledClass: nextItem.handled ? "handled" : ""
      };
    })
  };
}

function saveAvatarConfig(nextConfig) {
  const state = readAdminState();
  const avatar = {
    ...avatarConfig,
    ...state.avatarConfig,
    ...nextConfig
  };
  writeAdminState({
    ...state,
    avatarConfig: avatar
  });
  return avatar;
}

function toggleKnowledgeStatus(title) {
  const state = readAdminState();
  const dashboard = getAdminDashboard();
  const current = dashboard.knowledge.find((item) => item.title === title);
  if (!current) {
    return null;
  }
  const next = current.status === "已启用"
    ? { status: "已停用", statusClass: "disabled" }
    : { status: "已启用", statusClass: "enabled" };
  const knowledge = {
    ...(state.knowledge || {}),
    [title]: next
  };
  writeAdminState({
    ...state,
    knowledge
  });
  return {
    ...current,
    ...next
  };
}

function markFeedbackHandled(content) {
  const state = readAdminState();
  const dashboard = getAdminDashboard();
  const current = dashboard.feedbacks.find((item) => item.content === content);
  if (!current) {
    return null;
  }
  const next = {
    handled: true,
    action: "已处理"
  };
  const feedbacksState = {
    ...(state.feedbacks || {}),
    [content]: next
  };
  writeAdminState({
    ...state,
    feedbacks: feedbacksState
  });
  return {
    ...current,
    ...next
  };
}

function uploadKnowledgeItem(item) {
  const state = readAdminState();
  const nextItem = {
    title: item.title,
    category: item.category,
    spot: item.spot,
    status: "待审核",
    statusClass: "pending"
  };
  writeAdminState({
    ...state,
    uploadedKnowledge: [
      ...(state.uploadedKnowledge || []),
      nextItem
    ]
  });
  return nextItem;
}

module.exports = {
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
};
