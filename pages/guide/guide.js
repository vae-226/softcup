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
    currentTab: "home",
    scrollTarget: "",
    isPlaying: false,
    playIconClass: "play",
    progress: 48,
    navItems: [
      { label: "首页", icon: "⌂", tab: "home", target: "home-section", activeClass: "active" },
      { label: "讲解", icon: "言", tab: "guide", target: "guide-section", activeClass: "" },
      { label: "路线", icon: "线", tab: "route", target: "route-section", activeClass: "" },
      { label: "我的", icon: "人", tab: "profile", target: "profile-section", activeClass: "" }
    ]
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
  },

  handleNav(event) {
    const { page, tab, target } = event.currentTarget.dataset;
    if (page) {
      wx.navigateTo({ url: page });
      return;
    }
    const navItems = this.data.navItems.map((item) => ({
      ...item,
      activeClass: item.tab === tab ? "active" : ""
    }));
    this.setData({
      currentTab: tab,
      navItems,
      scrollTarget: target
    });
  }
});
