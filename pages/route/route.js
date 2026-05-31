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
  }
});
