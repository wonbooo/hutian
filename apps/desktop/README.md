# 桌面端

Electron 壳。只负责开一个系统窗口加载 `apps/web` 部署后的地址，不含业务逻辑。

## 安装

`pnpm install` 时这个包的 `postinstall` 会调用 `install-electron` 下载 Electron 二进制。Electron 45 的 npm 包自己不再带这个步骤。二进制不在 npm registry 里，默认从 GitHub Releases 下载；仓库根目录 `.npmrc` 里的 `electron_mirror` 指向国内镜像，网络正常的机器可以删掉那一行。

## 开发

在仓库根目录运行，会同时启动前端和壳：

```bash
pnpm dev
```

只启动壳，加载已经在 `http://localhost:3000` 运行的前端：

```bash
pnpm dev:desktop
```

开发时不需要配置地址，未设置就加载 `http://localhost:3000`。

## 打包

先把 `.env.example` 复制成 `.env`，两个变量填同一个部署地址：

```
MAIN_VITE_HUTIAN_WEB_URL=https://your-host.example
RENDERER_VITE_HUTIAN_WEB_URL=https://your-host.example
```

前者注入主进程，用于导航白名单；后者注入渲染进程，用于窗口跳转。然后：

```bash
pnpm dist:desktop
```

产物在 `apps/desktop/dist/`。Windows 是 NSIS 安装包，macOS 是 dmg，Linux 是 AppImage。

运行时可以用环境变量 `HUTIAN_WEB_URL` 覆盖主进程的取值，只用于调试。

签名还没接入。需要签名时，构建前设置 `CSC_LINK` 和 `CSC_KEY_PASSWORD`，electron-builder 会自动读取；不设置则打出未签名的安装包。

自动更新还没接入。接入时补 `electron-builder.yml` 的 `publish` 段，并在主进程里接 `electron-updater`。
