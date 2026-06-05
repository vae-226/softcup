const { encyclopedia, routes, scenic, services } = require("../../data/scenic");
const { ADMIN_TAP_THRESHOLD } = require("../../utils/tabbar");

Page({
  data: {
    scenic,
    services,
    currentRoute: routes[0],
    avatarSrc: "/assets/guide/avatar-cute.svg",
    avatarStyle: "可爱灵灵",
    voiceStyle: "温柔讲解音",
    avatarStyles: ["可爱灵灵", "古风讲解员", "真实景区形象"],
    voiceStyles: ["温柔讲解音", "活泼亲子音", "沉稳文化音"],
    stats: [
      { value: String(routes.length), label: "推荐路线" },
      { value: String(encyclopedia.length), label: "百科条目" },
      { value: "98%", label: "满意度" }
    ],
    settings: [
      { title: "沉浸式语音讲解", desc: "自动播放数字人讲解", enabled: true },
      { title: "个性化路线推荐", desc: "按亲子、历史、自然偏好推荐", enabled: true },
      { title: "游客感受度分析", desc: "把反馈整理为后台报告", enabled: true }
    ],
    menu: [
      { title: "浏览历史", desc: "8条记录", type: "history" },
      { title: "我的收藏", desc: "4个景点", type: "favorite" },
      { title: "游客反馈", desc: "提交建议", type: "feedback" },
      { title: "管理员入口", desc: "数据大屏", type: "admin" }
    ]
  },

  onAvatarStyleChange(event) {
    const value = event.detail.value;
    const avatarMap = [
      "/assets/guide/avatar-cute.svg",
      "/assets/guide/player-thumb.jpg",
      "/assets/guide/avatar.jpg"
    ];
    this.setData({
      avatarStyle: this.data.avatarStyles[value],
      avatarSrc: avatarMap[value]
    });
  },

  onVoiceStyleChange(event) {
    this.setData({ voiceStyle: this.data.voiceStyles[event.detail.value] });
  },

  saveGuideConfig() {
    wx.showToast({
      title: "数字人已保存",
      icon: "success"
    });
  },

  openMenu(event) {
    const type = event.currentTarget.dataset.type;
    if (type === "admin") {
      wx.navigateTo({ url: "/pages/admin/admin" });
      return;
    }
    const titleMap = {
      history: "浏览历史",
      favorite: "我的收藏",
      feedback: "游客反馈"
    };
    wx.navigateTo({ url: `/pages/detail/detail?type=service&title=${encodeURIComponent(titleMap[type] || "游客服务")}` });
  },

  openService(event) {
    wx.navigateTo({ url: `/pages/detail/detail?type=service&title=${encodeURIComponent(event.currentTarget.dataset.title)}` });
  },

  onTabItemTap() {
    const app = getApp();
    const nextCount = (app.globalData.profileTapCount || 0) + 1;
    app.globalData.profileTapCount = nextCount;
    if (nextCount >= ADMIN_TAP_THRESHOLD) {
      app.globalData.profileTapCount = 0;
      wx.navigateTo({ url: "/pages/admin/admin" });
    }
  }
});
