import { join } from "node:path";
import {
  app,
  BrowserWindow,
  Menu,
  type MenuItemConstructorOptions,
  Notification,
  nativeImage,
  shell,
  Tray,
} from "electron";

import { allowedOrigins, DEV_WEB_URL, isAllowedNavigation } from "../shared/navigation";

const APP_ID = "com.hutian.app";

let mainWindow: BrowserWindow | null = null;

/** 用户从托盘菜单明确要求退出时为 true，用来区分关闭窗口和退出应用。 */
let isQuitting = false;

/**
 * 打包时由 apps/desktop/.env 的 MAIN_VITE_HUTIAN_WEB_URL 注入。
 * 开发时通常为空，走 DEV_WEB_URL。
 */
const BUILD_WEB_URL = import.meta.env.MAIN_VITE_HUTIAN_WEB_URL ?? "";

function webUrl(): string {
  const fromEnv = process.env.HUTIAN_WEB_URL;

  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }

  if (BUILD_WEB_URL.length > 0) {
    return BUILD_WEB_URL;
  }

  if (!app.isPackaged) {
    return DEV_WEB_URL;
  }

  throw new Error(
    "打包后的应用必须指定页面地址：在 apps/desktop/.env 里设置 MAIN_VITE_HUTIAN_WEB_URL",
  );
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    title: "壶天",
    backgroundColor: "#0a0a0a",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      // 渲染进程只加载远程页面，不给它任何 Node.js 能力。
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.once("ready-to-show", () => {
    window.show();
  });

  const allowed = allowedOrigins(webUrl(), !app.isPackaged);

  // 主框架只允许停留在自己的源里。窗口内点到的外部链接转给系统浏览器。
  window.webContents.on("will-navigate", (event, targetUrl) => {
    if (!isAllowedNavigation(targetUrl, allowed)) {
      event.preventDefault();
      void shell.openExternal(targetUrl);
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (!isAllowedNavigation(url, allowed)) {
      void shell.openExternal(url);
    }

    return { action: "deny" };
  });

  // 渲染进程没有自己的界面，加载后会立刻跳到页面地址。
  void window.loadFile(join(__dirname, "../renderer/index.html"));

  if (!app.isPackaged) {
    window.webContents.openDevTools({ mode: "detach" });
  }

  window.on("close", (event) => {
    // 关闭按钮收起到托盘，真正退出走托盘菜单。
    if (!isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });

  return window;
}

function createTray(window: BrowserWindow): Tray {
  // 没有设计图标之前用一个空图标占位，托盘仍然能点开菜单。
  const icon = nativeImage.createEmpty();
  const created = new Tray(icon);

  created.setToolTip("壶天");

  const template: MenuItemConstructorOptions[] = [
    {
      label: "显示窗口",
      click: () => {
        window.show();
        window.focus();
      },
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ];

  created.setContextMenu(Menu.buildFromTemplate(template));

  created.on("click", () => {
    window.show();
    window.focus();
  });

  return created;
}

/**
 * 发送一条系统通知。业务事件发生在远程页面里，桌面端不主动发通知；
 * 这个函数留给以后主进程需要提醒用户的场景。
 */
export function notify(title: string, body: string): void {
  if (!Notification.isSupported()) {
    return;
  }

  new Notification({ title, body }).show();
}

// 包名是 @hutian/desktop，不设名字的话用户数据目录会变成 "Roaming/@hutian/desktop"。
// 必须在拿单实例锁之前设置，否则锁和数据目录会落在不同的名字下。
app.setName("hutian");

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) {
      return;
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
    mainWindow.focus();
  });

  void app.whenReady().then(() => {
    app.setAppUserModelId(APP_ID);

    mainWindow = createWindow();
    // 持有引用，避免托盘图标被垃圾回收后消失。
    createTray(mainWindow);
  });

  app.on("before-quit", () => {
    isQuitting = true;
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    mainWindow?.show();
  });
}
