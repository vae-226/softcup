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

function answerQuestion(question) {
  const text = String(question || "");
  const matched = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => text.includes(keyword))
  ) || knowledgeBase[0];

  return {
    scenicName: scenic.name,
    guideName: scenic.guideName,
    spotName: matched.spotName,
    mood: matched.mood,
    answer: matched.answer
  };
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
  return {
    metrics: adminMetrics,
    avatarConfig,
    sentimentReport,
    knowledge: adminKnowledge,
    feedbacks
  };
}

module.exports = {
  answerQuestion,
  getAdminDashboard,
  recommendRoute
};
