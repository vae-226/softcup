const { encyclopedia, routes, scenic, services } = require("../../data/scenic");
const { askAiGuide, recommendRoute } = require("../../services/guide-service");

const welcomeMessage = "您好，我是灵山胜境的AI数字人导游灵灵。您可以问我灵山大佛、九龙灌浴、梵宫、五印坛城，也可以让我按亲子、历史或自然偏好推荐路线。";

Page({
  data: {
    scenic,
    routes,
    encyclopedia,
    services,
    dialogue: welcomeMessage,
    currentSpotName: "灵山大佛",
    currentMood: "smile",
    currentRoute: null,
    question: "",
    isAsking: false,
    isPlaying: false,
    playIconClass: "play",
    progress: 48,
    aiSourceText: "等待提问",
    messages: [
      {
        role: "assistant",
        content: welcomeMessage,
        meta: "数字人欢迎语"
      }
    ],
    quickQuestions: [
      "灵山大佛最值得看什么？",
      "九龙灌浴几点表演？",
      "带孩子怎么玩不累？",
      "梵宫有什么艺术亮点？",
      "帮我安排半日路线",
      "哪里适合拍太湖风光？"
    ]
  },

  onLoad() {
    this.setData({
      currentRoute: routes[0]
    });
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
    if (!text || this.data.isAsking) {
      return;
    }

    this.setData({
      isAsking: true,
      question: "",
      aiSourceText: "数字人正在思考...",
      messages: [
        ...this.data.messages,
        {
          role: "user",
          content: text,
          meta: "游客提问"
        }
      ]
    });

    askAiGuide(text).then((result) => {
      const sourceText = result.source === "qwen"
        ? `AI来源：千问 ${result.model || "qwen-plus"}`
        : result.statusText;
      this.setData({
        dialogue: result.answer,
        currentSpotName: result.spotName,
        currentMood: result.mood,
        aiSourceText: sourceText,
        isAsking: false,
        messages: [
          ...this.data.messages,
          {
            role: "assistant",
            content: result.answer,
            meta: sourceText
          }
        ]
      });
    });
  },

  chooseRoute(event) {
    const route = recommendRoute({ interest: event.currentTarget.dataset.interest });
    const content = `已为您切换到“${route.displayTitle}”：${route.path}。${route.focus}`;
    this.setData({
      currentRoute: route,
      dialogue: content,
      messages: [
        ...this.data.messages,
        {
          role: "assistant",
          content,
          meta: "路线推荐"
        }
      ]
    });
  },

  togglePlay() {
    const isPlaying = !this.data.isPlaying;
    this.setData({
      isPlaying,
      playIconClass: isPlaying ? "pause" : "play"
    });
  }
});
