const { knowledgeBase, scenic } = require("../../data/scenic");
const { answerQuestion } = require("../../services/guide-service");

Page({
  data: {
    scenic,
    quickQuestions: knowledgeBase.map((item) => item.title),
    dialogue: "",
    currentSpotName: "灵山大佛",
    currentMood: "smile",
    question: "",
    showQuestionBox: false
  },

  onLoad() {
    this.setData({
      dialogue: "“我会根据您所在位置和提问，讲解灵山胜境的历史、建筑与祈福故事。”"
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
    const result = answerQuestion(event.currentTarget.dataset.question);
    this.setData({
      dialogue: `“${result.answer}”`,
      currentSpotName: result.spotName,
      currentMood: result.mood
    });
  }
});
