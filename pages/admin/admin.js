const { getAdminDashboard } = require("../../services/guide-service");

const dashboard = getAdminDashboard();

Page({
  data: {
    dashboard
  },

  onLoad() {
    this.setData({ dashboard: getAdminDashboard() });
  },

  goGuide() {
    wx.navigateTo({ url: "/pages/guide/guide" });
  }
});
