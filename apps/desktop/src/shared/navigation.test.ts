import { expect, test } from "vitest";

import { allowedOrigins, isAllowedNavigation } from "./navigation";

const PRODUCTION = ["https://hutian.example.com"];

test("生产环境只放行部署地址的源", () => {
  expect(isAllowedNavigation("https://hutian.example.com/app", PRODUCTION)).toBe(true);
  expect(isAllowedNavigation("https://hutian.example.com/app?tab=1#top", PRODUCTION)).toBe(true);
});

test("其他来源的 http 链接不放行", () => {
  expect(isAllowedNavigation("https://evil.example.com/phish", PRODUCTION)).toBe(false);
  expect(isAllowedNavigation("http://hutian.example.com/app", PRODUCTION)).toBe(false);
});

test("开发工具的地址放行", () => {
  expect(isAllowedNavigation("devtools://devtools/bundled/inspector.html", PRODUCTION)).toBe(true);
});

test("无法解析的地址不放行", () => {
  expect(isAllowedNavigation("not a url", PRODUCTION)).toBe(false);
});

test("开发模式下额外放行本地服务", () => {
  const allowed = allowedOrigins("https://hutian.example.com", true);

  expect(isAllowedNavigation("http://localhost:3000/app", allowed)).toBe(true);
  expect(isAllowedNavigation("https://hutian.example.com/app", allowed)).toBe(true);
});

test("打包后不放行本地服务", () => {
  const allowed = allowedOrigins("https://hutian.example.com", false);

  expect(isAllowedNavigation("http://localhost:3000/app", allowed)).toBe(false);
});

test("地址缺少协议时直接报错", () => {
  expect(() => allowedOrigins("hutian.example.com", false)).toThrow();
});
