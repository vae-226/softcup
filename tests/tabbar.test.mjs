import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { buildTabItems, getTabRoute } = require("../utils/tabbar.js");

test("用户端 tab 指向独立页面", () => {
  assert.equal(getTabRoute("home"), "/pages/guide/guide");
  assert.equal(getTabRoute("explain"), "/pages/explain/explain");
  assert.equal(getTabRoute("route"), "/pages/route/route");
  assert.equal(getTabRoute("profile"), "/pages/profile/profile");
});

test("管理端 tab 显示管理页并保持激活图标", () => {
  const items = buildTabItems("admin", { showAdmin: true });
  const adminItem = items.find((item) => item.key === "admin");

  assert.equal(items.length, 5);
  assert.equal(adminItem.page, "/pages/admin/admin");
  assert.equal(adminItem.activeClass, "active");
  assert.equal(adminItem.displayIcon, "/assets/tabbar/admin-active.svg");
});
