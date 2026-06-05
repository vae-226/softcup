const { routes, scenic } = require("../../data/scenic");
const { recommendRoute } = require("../../services/guide-service");

Page({
  data: {
    scenic,
    routes,
    currentRoute: routes[0]
  },

  chooseRoute(event) {
    const route = recommendRoute({ interest: event.currentTarget.dataset.interest });
    this.setData({ currentRoute: route });
  },

  startRoute(event) {
    const route = routes.find((item) => item.id === event.currentTarget.dataset.id) || this.data.currentRoute;
    wx.navigateTo({ url: `/pages/detail/detail?type=route&id=${route.id}` });
  },

  openStop(event) {
    wx.navigateTo({ url: `/pages/detail/detail?type=spot&title=${encodeURIComponent(event.currentTarget.dataset.title)}` });
  }
});
