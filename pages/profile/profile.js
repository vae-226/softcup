const { encyclopedia, routes, scenic, services } = require("../../data/scenic");
const { ADMIN_TAP_THRESHOLD } = require("../../utils/tabbar");

Page({
  data: {
    scenic,
    services,
    currentRoute: routes[0],
    stats: [
      { value: "3", label: "已推荐路线" },
      { value: String(encyclopedia.length), label: "百科条目" },
      { value: "98%", label: "匹配度" }
    ]
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
