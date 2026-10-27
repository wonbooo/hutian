import { defineConfig } from "vitest/config";

// 只测不依赖 Electron 运行时的纯逻辑。主进程的窗口行为需要真的
// 把应用跑起来才能验证，不放在这里。
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
