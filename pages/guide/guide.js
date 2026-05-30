const { encyclopedia, routes, scenic, services } = require("../../data/scenic");
const { answerQuestion, recommendRoute } = require("../../services/guide-service");

Page({
  data: {
    scenic,
    routes,
    encyclopedia,
    services,
    dialogue: "",
    currentSpotName: "灵山大佛",
    currentMood: "thinking",
    currentRoute: null,
    question: "",
    isPlaying: false,
    progress: 48,
    navItems: [
      { label: "首页", icon: "⌂", active: true },
      { label: "讲解", icon: "言", active: false },
      { label: "路线", icon: "线", active: false },
      { label: "我的", icon: "人", active: false }
    ]
  },

  onLoad() {
    const result = answerQuestion("灵山大佛有什么特色？");
    this.setData({
      dialogue: `“${result.answer}”`,
      currentSpotName: result.spotName,
      currentMood: result.mood,
      currentRoute: routes[0]
    });
  },

  onQuestionInput(event) {
    this.setData({ question: event.detail.value });
  },

  askQuestion() {
    const result = answerQuestion(this.data.question || "灵山大佛有什么特色？");
    this.setData({
      dialogue: `“${result.answer}”`,
      currentSpotName: result.spotName,
      currentMood: result.mood,
      question: ""
    });
  },

  useQuickQuestion(event) {
    const question = event.currentTarget.dataset.question;
    const result = answerQuestion(question);
    this.setData({
      dialogue: `“${result.answer}”`,
      currentSpotName: result.spotName,
      currentMood: result.mood
    });
  },

  chooseRoute(event) {
    const route = recommendRoute({ interest: event.currentTarget.dataset.interest });
    this.setData({
      currentRoute: route,
      dialogue: `“已为您切换到${route.audience}路线：${route.focus}”`
    });
  },

  togglePlay() {
    this.setData({ isPlaying: !this.data.isPlaying });
  }
});
