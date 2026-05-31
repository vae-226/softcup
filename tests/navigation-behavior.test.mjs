import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);

function loadPage(path) {
  let options;
  global.Page = (nextOptions) => {
    options = nextOptions;
  };
  delete require.cache[require.resolve(path)];
  require(path);
  delete global.Page;
  return options;
}

test("管理页返回用户端时使用原生 tab 切换", () => {
  const adminPage = loadPage("../pages/admin/admin.js");
  const calls = [];
  global.wx = {
    switchTab(options) {
      calls.push(options.url);
    }
  };

  adminPage.backToGuide();

  delete global.wx;

  assert.deepEqual(calls, ["/pages/guide/guide"]);
});

test("原生我的 tab 连续点击五次进入管理页", () => {
  const profilePage = loadPage("../pages/profile/profile.js");
  const app = { globalData: { profileTapCount: 0 } };
  const calls = [];
  global.getApp = () => app;
  global.wx = {
    navigateTo(options) {
      calls.push(options.url);
    }
  };

  for (let index = 0; index < 5; index += 1) {
    profilePage.onTabItemTap();
  }

  delete global.wx;
  delete global.getApp;

  assert.deepEqual(calls, ["/pages/admin/admin"]);
  assert.equal(app.globalData.profileTapCount, 0);
});
