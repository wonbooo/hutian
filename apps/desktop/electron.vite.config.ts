import { defineConfig } from "electron-vite";

// 渲染进程没有自己的界面，只有一个负责跳转到远程页面的 HTML。
// 主进程和 preload 走 electron-vite 的默认入口：src/main/index.ts、src/preload/index.ts，
// 输出 CommonJS 的 out/main/index.js 与 out/preload/index.js。这个包刻意不声明
// "type": "module"：沙箱化的 preload 不支持 ESM，产出 .cjs 会与代码里写的路径对不上。
export default defineConfig({
  main: {},
  preload: {},
  renderer: {},
});
