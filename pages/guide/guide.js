const { encyclopedia, routes, scenic, services } = require("../../data/scenic");
const { askAiGuide, recommendRoute } = require("../../services/guide-service");

const welcomeMessage = "你好，我是灵山胜境的AI数字人导游灵灵。你可以问我景点知识、演出安排、购票服务，也可以让我按亲子、历史或自然偏好推荐路线。";

Page({
  data: {
    scenic,
    routes,
    encyclopedia,
    services,
    avatarSrc: "/assets/guide/avatar-cute.svg",
    dialogue: welcomeMessage,
    currentSpotName: "灵山大佛",
    currentMood: "smile",
    currentRoute: routes[0],
    question: "",
    isAsking: false,
    isPlaying: false,
    playIconClass: "play",
    progress: 48,
    aiSourceText: "千问AI待命",
    messages: [
      { role: "assistant", content: welcomeMessage, meta: "数字人欢迎语" }
    ],
    quickQuestions: [
      "灵山大佛最值得看什么？",
      "九龙灌浴几点表演？",
      "带孩子怎么游览不累？",
      "梵宫有什么艺术亮点？",
      "帮我安排半日路线",
      "景区有哪些餐饮和服务？"
    ]
  },

  onQuestionInput(event) {
    this.setData({ question: event.detail.value });
  },

  askQuestion() {
    this.sendQuestion(this.data.question || "灵山大佛最值得看什么？");
  },

  useQuickQuestion(event) {
    this.sendQuestion(event.currentTarget.dataset.question);
  },

  sendQuestion(question) {
    const text = String(question || "").trim();
    if (!text || this.data.isAsking) return;

    this.setData({
      isAsking: true,
      question: "",
      aiSourceText: "数字人正在思考...",
      messages: [
        ...this.data.messages,
        { role: "user", content: text, meta: "游客提问" }
      ]
    });

    askAiGuide(text).then((result) => {
      const sourceText = result.source === "qwen"
        ? `千问AI回答 · ${result.model || "qwen-plus"}`
        : result.statusText;
      this.setData({
        dialogue: result.answer,
        currentSpotName: result.spotName,
        currentMood: result.mood,
        aiSourceText: sourceText,
        isAsking: false,
        messages: [
          ...this.data.messages,
          { role: "assistant", content: result.answer, meta: sourceText }
        ]
      });
    });
  },

  chooseRoute(event) {
    const route = recommendRoute({ interest: event.currentTarget.dataset.interest });
    const content = `已切换到“${route.displayTitle}”：${route.path}。${route.focus}`;
    this.setData({
      currentRoute: route,
      dialogue: content,
      messages: [
        ...this.data.messages,
        { role: "assistant", content, meta: "路线推荐" }
      ]
    });
    wx.navigateTo({ url: `/pages/detail/detail?type=route&id=${route.id}` });
  },

  openFact(event) {
    wx.navigateTo({ url: `/pages/detail/detail?type=spot&title=${encodeURIComponent(event.currentTarget.dataset.title)}` });
  },

  openService(event) {
    wx.navigateTo({ url: `/pages/detail/detail?type=service&title=${encodeURIComponent(event.currentTarget.dataset.title)}` });
  },

  goTicket() {
    wx.switchTab({ url: "/pages/ticket/ticket" });
  },

  goExplain() {
    wx.switchTab({ url: "/pages/explain/explain" });
  },

  togglePlay() {
    const isPlaying = !this.data.isPlaying;
    this.setData({
      isPlaying,
      playIconClass: isPlaying ? "pause" : "play",
      progress: isPlaying ? 74 : 48
    });
  }
});
