import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { ADMIN_TAP_THRESHOLD } = require("../utils/tabbar.js");

test("隐藏后台入口需要连续点击我的 tab 五次", () => {
  assert.equal(ADMIN_TAP_THRESHOLD, 5);
});
