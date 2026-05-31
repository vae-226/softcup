import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appConfig = JSON.parse(fs.readFileSync("app.json", "utf8"));

const tabPages = [
  "pages/guide/guide",
  "pages/explain/explain",
  "pages/route/route",
  "pages/profile/profile"
];

test("游客主导航使用微信原生 tabBar 切换独立页面", () => {
  assert.ok(appConfig.tabBar);

  const configuredPages = appConfig.tabBar.list.map((item) => item.pagePath);
  assert.deepEqual(configuredPages, tabPages);

  for (const item of appConfig.tabBar.list) {
    assert.match(item.iconPath, /\.png$/);
    assert.match(item.selectedIconPath, /\.png$/);
    assert.ok(fs.existsSync(item.iconPath), `${item.iconPath} should exist`);
    assert.ok(fs.existsSync(item.selectedIconPath), `${item.selectedIconPath} should exist`);
  }
});

test("tabBar 页面不再挂载自定义底部导航组件", () => {
  for (const page of tabPages) {
    const json = JSON.parse(fs.readFileSync(`${page}.json`, "utf8"));
    const wxml = fs.readFileSync(`${page}.wxml`, "utf8");

    assert.equal(json.usingComponents?.["app-tabbar"], undefined);
    assert.equal(wxml.includes("<app-tabbar"), false);
  }
});
