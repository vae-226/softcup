const {
  getAdminDashboard,
  markFeedbackHandled,
  saveAvatarConfig,
  toggleKnowledgeStatus,
  uploadKnowledgeItem
} = require("../../services/guide-service");

const dashboard = getAdminDashboard();

Page({
  data: {
    dashboard,
    avatarForm: dashboard.avatarConfig
  },

  onLoad() {
    this.refreshDashboard();
  },

  refreshDashboard() {
    const nextDashboard = getAdminDashboard();
    this.setData({
      dashboard: nextDashboard,
      avatarForm: nextDashboard.avatarConfig
    });
  },

  onAvatarInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [`avatarForm.${field}`]: event.detail.value
    });
  },

  saveAvatar() {
    saveAvatarConfig(this.data.avatarForm);
    this.refreshDashboard();
    wx.showToast({
      title: "已保存",
      icon: "success"
    });
  },

  toggleKnowledge(event) {
    toggleKnowledgeStatus(event.currentTarget.dataset.title);
    this.refreshDashboard();
  },

  uploadKnowledge() {
    uploadKnowledgeItem({
      title: "游客中心服务指南",
      category: "游客服务",
      spot: "游客中心"
    });
    this.refreshDashboard();
    wx.showToast({
      title: "已上传",
      icon: "success"
    });
  },

  editKnowledge() {
    wx.showToast({
      title: "编辑入口已保留",
      icon: "none"
    });
  },

  handleFeedback(event) {
    markFeedbackHandled(event.currentTarget.dataset.content);
    this.refreshDashboard();
  }
});
