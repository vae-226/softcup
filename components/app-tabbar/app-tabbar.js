const { ADMIN_TAP_THRESHOLD, buildTabItems, getTabRoute } = require("../../utils/tabbar");

Component({
  properties: {
    active: {
      type: String,
      value: "home"
    },
    showAdmin: {
      type: Boolean,
      value: false
    }
  },

  data: {
    items: []
  },

  lifetimes: {
    attached() {
      this.refreshItems();
    }
  },

  observers: {
    "active, showAdmin": function () {
      this.refreshItems();
    }
  },

  methods: {
    refreshItems() {
      this.setData({
        items: buildTabItems(this.properties.active, {
          showAdmin: this.properties.showAdmin
        })
      });
    },

    handleTap(event) {
      const tab = event.currentTarget.dataset.tab;
      const app = getApp();
      if (tab === "profile") {
        const nextCount = (app.globalData.profileTapCount || 0) + 1;
        app.globalData.profileTapCount = nextCount;
        if (nextCount >= ADMIN_TAP_THRESHOLD) {
          app.globalData.profileTapCount = 0;
          wx.navigateTo({ url: "/pages/admin/admin" });
          return;
        }
      } else {
        app.globalData.profileTapCount = 0;
      }

      if (tab === this.properties.active) {
        return;
      }

      const url = getTabRoute(tab, {
        showAdmin: this.properties.showAdmin
      });
      if (url) {
        wx.switchTab({ url });
      }
    }
  }
});
