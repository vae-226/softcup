const ADMIN_TAP_THRESHOLD = 5;

const userTabs = [
  {
    key: "home",
    label: "首页",
    iconPath: "/assets/tabbar/home.svg",
    activeIconPath: "/assets/tabbar/home-active.svg",
    page: "/pages/guide/guide"
  },
  {
    key: "explain",
    label: "讲解",
    iconPath: "/assets/tabbar/guide.svg",
    activeIconPath: "/assets/tabbar/guide-active.svg",
    page: "/pages/explain/explain"
  },
  {
    key: "route",
    label: "路线",
    iconPath: "/assets/tabbar/route.svg",
    activeIconPath: "/assets/tabbar/route-active.svg",
    page: "/pages/route/route"
  },
  {
    key: "profile",
    label: "我的",
    iconPath: "/assets/tabbar/profile.svg",
    activeIconPath: "/assets/tabbar/profile-active.svg",
    page: "/pages/profile/profile"
  }
];

const adminTab = {
  key: "admin",
  label: "管理",
  iconPath: "/assets/tabbar/admin.svg",
  activeIconPath: "/assets/tabbar/admin-active.svg",
  page: "/pages/admin/admin"
};

function getTabs(showAdmin = false) {
  if (!showAdmin) {
    return userTabs;
  }
  return [...userTabs.slice(0, 3), adminTab, userTabs[3]];
}

function buildTabItems(activeKey, options = {}) {
  return getTabs(options.showAdmin).map((item) => ({
    ...item,
    activeClass: item.key === activeKey ? "active" : "",
    displayIcon: item.key === activeKey ? item.activeIconPath : item.iconPath
  }));
}

function getTabRoute(key, options = {}) {
  const found = getTabs(options.showAdmin).find((item) => item.key === key);
  return found ? found.page : "";
}

module.exports = {
  ADMIN_TAP_THRESHOLD,
  buildTabItems,
  getTabRoute
};
