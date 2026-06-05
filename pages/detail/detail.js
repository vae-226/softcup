const { encyclopedia, knowledgeBase, routes, services } = require("../../data/scenic");
const { answerQuestion } = require("../../services/guide-service");

Page({
  data: {
    title: "详情",
    image: "/assets/guide/route-history.jpg",
    content: "",
    tags: [],
    route: null,
    actions: []
  },

  onLoad(query) {
    const type = query.type || "spot";
    const title = decodeURIComponent(query.title || "");
    const id = query.id || "";
    if (type === "route") {
      this.loadRoute(id);
      return;
    }
    if (type === "service") {
      this.loadService(title);
      return;
    }
    this.loadSpot(title);
  },

  loadSpot(title) {
    const item = knowledgeBase.find((spot) => spot.title === title || spot.spotName === title) || knowledgeBase[0];
    this.setData({
      title: item.title,
      image: item.image,
      content: item.answer,
      tags: ["景区百科", "AI讲解", item.spotName],
      actions: ["开始讲解", "收藏", "问数字人"]
    });
  },

  loadRoute(id) {
    const route = routes.find((item) => item.id === id) || routes[0];
    this.setData({
      title: route.displayTitle,
      image: route.image,
      content: `${route.path}。${route.focus}`,
      route,
      tags: [route.category, route.displayDuration, route.tag],
      actions: ["开始游览", "收藏路线", "生成讲解"]
    });
  },

  loadService(title) {
    const item = services.find((service) => service.label === title) || services[0];
    this.setData({
      title: item.label,
      image: "/assets/guide/route-culture.jpg",
      content: item.detail,
      tags: ["游客服务", "实时咨询", "景区运营"],
      actions: ["查看位置", "呼叫服务", "提交反馈"]
    });
  },

  runAction(event) {
    const action = event.currentTarget.dataset.action;
    const result = answerQuestion(this.data.title);
    wx.showModal({
      title: action,
      content: action.includes("问") || action.includes("讲解") ? result.answer : `${action} 已完成演示。`,
      showCancel: false
    });
  }
});
