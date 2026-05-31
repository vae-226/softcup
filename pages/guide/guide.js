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
    showQuestionBox: false,
    isPlaying: false,
    playIconClass: "play",
    progress: 48
  },

  onLoad() {
    this.setData({
      dialogue: "“您好，我是灵山胜境的智能导览小灵，欢迎来到太湖佛国！”",
      currentSpotName: "灵山大佛",
      currentMood: "smile",
      currentRoute: routes[0]
    });
  },

  onQuestionInput(event) {
    this.setData({ question: event.detail.value });
  },

  toggleQuestionBox() {
    this.setData({ showQuestionBox: !this.data.showQuestionBox });
  },

  askQuestion() {
    const result = answerQuestion(this.data.question || "灵山大佛有什么特色？");
    this.setData({
      dialogue: `“${result.answer}”`,
      currentSpotName: result.spotName,
      currentMood: result.mood,
      question: "",
      showQuestionBox: false
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
      dialogue: `“已为您切换到${route.displayTitle || route.audience}：${route.path || route.focus}”`
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
