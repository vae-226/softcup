const { knowledgeBase, scenic } = require("../../data/scenic");
const { answerQuestion, askAiGuide } = require("../../services/guide-service");

Page({
  data: {
    scenic,
    avatarSrc: "/assets/guide/avatar-cute.svg",
    quickQuestions: knowledgeBase.map((item) => item.title),
    dialogue: "我会根据你所在位置和提问，讲解灵山胜境的历史、建筑与祈福故事。",
    currentSpotName: "灵山大佛",
    currentMood: "smile",
    question: "",
    showQuestionBox: true,
    isRecording: false
  },

  onQuestionInput(event) {
    this.setData({ question: event.detail.value });
  },

  toggleQuestionBox() {
    this.setData({ showQuestionBox: !this.data.showQuestionBox });
  },

  askQuestion() {
    const question = this.data.question || "灵山大佛有什么特色？";
    askAiGuide(question).then((result) => {
      this.setData({
        dialogue: result.answer,
        currentSpotName: result.spotName,
        currentMood: result.mood,
        question: "",
        showQuestionBox: true
      });
    });
  },

  useQuickQuestion(event) {
    const result = answerQuestion(event.currentTarget.dataset.question);
    this.setData({
      dialogue: result.answer,
      currentSpotName: result.spotName,
      currentMood: result.mood
    });
  },

  requestRecord() {
    wx.authorize({
      scope: "scope.record",
      success: () => {
        this.setData({
          isRecording: true,
          dialogue: "录音权限已获取。演示版已进入语音采集状态，真实上线可接入 Whisper 或阿里云语音识别。"
        });
      },
      fail: () => {
        wx.showModal({
          title: "需要麦克风权限",
          content: "请在设置中允许录音权限，数字人才能进行语音问答。",
          confirmText: "去设置",
          success: (res) => {
            if (res.confirm) wx.openSetting();
          }
        });
      }
    });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const file = res.tempFiles && res.tempFiles[0];
        this.setData({
          dialogue: `已收到图片${file ? "，正在模拟识别景点内容" : ""}。真实上线可接入多模态大模型做景点识别和讲解。`,
          currentMood: "thinking"
        });
      }
    });
  }
});
