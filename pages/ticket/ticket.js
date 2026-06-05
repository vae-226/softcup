const { tickets } = require("../../data/scenic");

Page({
  data: {
    tickets: tickets.map((item) => ({ ...item, count: item.id === "adult" ? 1 : 0 })),
    buyerName: "",
    buyerPhone: "",
    visitDate: "今天入园",
    visitDateOptions: ["今天入园", "明天入园", "本周末入园"],
    total: 198,
    orders: []
  },

  updateTotal(ticketsList = this.data.tickets) {
    const total = ticketsList.reduce((sum, item) => sum + item.price * item.count, 0);
    this.setData({ total });
  },

  changeCount(event) {
    const id = event.currentTarget.dataset.id;
    const delta = Number(event.currentTarget.dataset.delta);
    const ticketsList = this.data.tickets.map((item) => {
      if (item.id !== id) return item;
      return { ...item, count: Math.max(0, item.count + delta) };
    });
    this.setData({ tickets: ticketsList });
    this.updateTotal(ticketsList);
  },

  onInput(event) {
    this.setData({ [event.currentTarget.dataset.field]: event.detail.value });
  },

  chooseDate(event) {
    this.setData({ visitDate: this.data.visitDateOptions[event.detail.value] });
  },

  submitOrder() {
    const count = this.data.tickets.reduce((sum, item) => sum + item.count, 0);
    if (!count) {
      wx.showToast({ title: "请先选择票数", icon: "none" });
      return;
    }
    const order = {
      id: `LS${Date.now()}`,
      name: this.data.buyerName || "游客",
      phone: this.data.buyerPhone || "未填写",
      date: this.data.visitDate,
      count,
      total: this.data.total,
      status: "待模拟支付"
    };
    this.setData({ orders: [order, ...this.data.orders] });
    wx.showModal({
      title: "模拟订单已生成",
      content: `${order.name}，${order.count}张票，金额￥${order.total}。`,
      showCancel: false
    });
  }
});
