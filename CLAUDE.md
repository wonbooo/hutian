# 壶天（hutian）

壶天是一块可以自己布置的桌面。常用的东西从坊市取回来，放进壶中，变成一颗星子；不用了，再送回坊市。星子可以拖动、排列，点开之后各自展开成一个窗口。

本文档是给 AI 编码助手的项目约束。在本仓库中生成、修改代码或提议依赖时，必须遵守以下规定。与本文档冲突的通用建议，以本文档为准。

## 形态

服务端与桌面端分离：
- `apps/web` 是 Next.js 服务，部署在服务器上，持有数据库、认证和全部业务逻辑。
- `apps/desktop` 是 Electron 壳，只负责开一个系统窗口加载 `apps/web` 的地址。它不打包 Next.js 的构建产物，也不持有任何业务数据。

Next.js 的 App Router 依赖 Node 服务端运行时，Electron 的渲染进程是纯浏览器环境，两者不能合并进同一个应用，所以仓库使用 pnpm workspace。

## 技术栈

| 层         | 选型                                  | 说明                                               |
| ---------- | ------------------------------------- | -------------------------------------------------- |
| 框架       | Next.js 16（App Router）              | 基于 React 19。路由、渲染、数据变更都走 App Router |
| 语言       | TypeScript（strict）                  | 禁止 `any`，必要时用 `unknown` 再收窄              |
| 包管理     | pnpm 10.28 及以上                     | 唯一允许的包管理器                                 |
| 样式       | Tailwind CSS v4                       | 用 CSS 变量做设计 token，不写行内样式对象          |
| 组件       | shadcn/ui                             | 代码直接位于仓库内，可修改                         |
| 服务端状态 | TanStack Query                        | 所有客户端数据请求、缓存、失效                     |
| 客户端状态 | Zustand                               | 仅用于真正的客户端状态，不缓存服务端数据           |
| 表单       | React Hook Form + Zod                 | schema 为唯一校验来源                              |
| 表格       | TanStack Table                        | 列表、分页、筛选                                   |
| 数据库     | Drizzle ORM + Postgres                | schema 定义在仓库内，类型从 schema 推导            |
| 认证       | Better Auth                           | 自托管                                             |
| 测试       | Vitest + Testing Library + Playwright | 单测与端到端                                       |
| 代码检查   | ESLint + Biome                        | Biome 负责格式化，ESLint 复用 `eslint-config-next` |
| 桌面壳     | Electron                              | 经 electron-vite 构建，electron-builder 打包       |
| 自动更新   | electron-updater                      | 发布源留空，接入时再配置                           |

版本号以项目锁定时的最新稳定版为准。上表给出的是编写本文档时的主版本，升级主版本前先确认本文档是否需要同步修改。

## 包管理（pnpm）

- 只使用 pnpm。禁止出现 `package-lock.json`、`yarn.lock`、`bun.lock`，禁止运行 `npm install`、`yarn`、`bun install`。
- 依赖一律写入 `package.json` 再安装。禁止手动编辑 `node_modules`，禁止提交 `node_modules`。
- 新增依赖必须是该用途的主流维护中方案，不引入与上表职责重叠的库。例如已有 TanStack Query 时，不再引入 SWR、axios 封装层或其他请求缓存库。
- 安装命令使用 `pnpm add <pkg>`，开发依赖使用 `pnpm add -D <pkg>`，运行脚本使用 `pnpm <script>`。
- 工作区（workspace）场景下，内部包依赖使用 `workspace:` 协议。

### node_modules 与 IDE

pnpm 默认用符号链接组织 `node_modules`，WebStorm 2026.2 系列对此存在已知缺陷（WEB-78214）：依赖无法解析、补全失效、误报 module not found，且清除缓存无法修复。

因此本项目固定使用扁平的 node_modules 布局。仓库根目录的 `.npmrc` 必须包含：

```
node-linker=hoisted
```

这会让依赖直接展开到 `node_modules`，WebStorm 可以正常索引。代价是失去 pnpm 的依赖隔离，未声明的依赖也能被导入。作为补偿，代码审查和 AI 生成代码时都要保证每个导入都能在 `package.json` 中找到对应声明，不得依赖这种泄漏。

`shamefully-hoist=true` 只是部分缓解，不作为本项目的方案。

## 目录与文件约定

- 路由与页面放在 `apps/web/app/`，遵循 App Router 的文件约定：`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`、`route.ts`。
- 可复用组件放在 `apps/web/components/`，shadcn/ui 生成的基础组件放在 `apps/web/components/ui/`，不要把业务逻辑写进 `components/ui/`。
- 服务端逻辑（数据库访问、认证、外部 API 调用）放在 `apps/web/server/` 或与路由同级的 server-only 模块中，并在文件顶部加 `import "server-only"`，防止被客户端打包。
- 校验 schema 放在 `apps/web/lib/validation/` 之类的共享位置，让表单和服务端动作引用同一份 Zod schema。
- 路径别名统一用 `@/`，指向 `apps/web/`。
- 数据库连接、Drizzle 实例、认证配置分别放在 `apps/web/server/db/` 与 `apps/web/server/auth/`。Drizzle 的 schema 文件放在 `apps/web/server/db/schema.ts`，由 `drizzle.config.ts` 指向。
- 环境变量集中在 `apps/web/lib/env.ts` 用 Zod 解析后导出，业务代码不直接读 `process.env`。
- 环境变量文件放在各自的应用目录：`apps/web/.env` 与 `apps/desktop/.env`，模板是对应的 `.env.example`。仓库根目录不放 `.env`，Next.js 和 electron-vite 都只读应用自己的目录。

## 数据获取

- 服务端组件中直接访问数据库或调用服务端函数，不绕道通过自己的 HTTP 接口。
- 客户端组件需要请求、缓存、轮询、乐观更新时，使用 TanStack Query。query key 要稳定、可序列化，并把过滤条件包含在 key 内。
- 数据变更优先使用 Server Actions：以 `"use server"` 标记，入参用 Zod 解析，返回可辨识的结果对象而不是抛出用于流程控制的异常。
- 不在客户端组件里直接导入数据库客户端、Drizzle 实例或任何带密钥的模块。

## 组件与样式

- 交互元素优先复用 `components/ui/` 中的 shadcn/ui 组件，而不是重新手写按钮、对话框、下拉菜单。需要调整时直接改生成的源码。
- 新版 shadcn CLI 生成的组件默认从 `cn` 包导入类名合并函数。这里统一改成从 `@/lib/utils` 导入：仓库只用 clsx + tailwind-merge，再装一个功能重复的 `cn` 包会违反“不引入职责重叠的库”。每次 `shadcn add` 之后检查一下这个 import。
- 样式只用 Tailwind 类。动态类名用显式拼接或 `clsx`/`tailwind-merge`，不要用字符串插值拼出 Tailwind 无法扫描到的类名。
- 颜色、间距、圆角等设计变量定义在全局 CSS 的 `@theme` 中，组件里引用这些 token，不写死十六进制颜色。
- 服务端组件是默认。只有用到状态、事件、浏览器 API 时才在文件顶部加 `"use client"`，并且尽量把客户端边界下推到叶子组件。

## 表单

- 每个表单有一份 Zod schema。客户端用 React Hook Form 配 `@hookform/resolvers/zod` 做即时校验，服务端动作里对收到的数据再用同一份 schema 解析一遍。
- 不信任客户端校验结果。服务端是唯一的最终校验。

## 类型

- 开启 `strict`。不使用 `any`，不使用 `as` 断言来绕过类型错误，除非有注释说明为什么安全。
- 数据库行的类型从 Drizzle schema 推导（`$inferSelect`、`$inferInsert`），不手写重复的接口。
- 环境变量通过一份 Zod schema 集中解析和导出，业务代码不直接读 `process.env`。

## 测试

- 单元测试和组件测试用 Vitest + Testing Library，文件与源码同目录或放在 `__tests__/`，命名 `*.test.ts(x)`。
- 端到端测试用 Playwright，放在 `apps/web/e2e/`。
- 测试应断言用户可观察的行为，而不是实现细节。

## 桌面端（Electron）

`apps/desktop` 的全部源码都在这里约定。

### 构建与产物

- 用 electron-vite 构建，配置在 `apps/desktop/electron.vite.config.ts`。它产出三份独立构建：主进程（`src/main`，输出 `out/main`）、preload（`src/preload`，输出 `out/preload`）、渲染进程（`src/renderer`，输出 `out/renderer`）。
- Electron 45 的 npm 包不再自带安装脚本，二进制由 `apps/desktop` 的 `postinstall` 调用 `install-electron` 下载。二进制文件来自 GitHub Releases，`.npmrc` 里的 `electron_mirror` 提供镜像。
- `package.json` 的 `main` 字段指向 `./out/main/index.js`。
- 打包用 electron-builder，配置在 `apps/desktop/electron-builder.yml`。Windows 产出 NSIS 安装包，macOS 产出 dmg，Linux 产出 AppImage。
- 代码签名和自动更新的发布源从环境变量读取。没有配置时跳过签名、不做发布，保证没有证书也能打出安装包。接入发布渠道属于后续工作，不在初始化范围内。

### 窗口只加载远程页面

- 渲染进程没有自己的界面。`src/renderer/index.html` 里的脚本在加载时把窗口跳转到页面地址。
- 页面地址在构建时从 `apps/desktop/.env` 注入，两个变量必须填同一个地址：`MAIN_VITE_HUTIAN_WEB_URL` 给主进程（拼出导航白名单），`RENDERER_VITE_HUTIAN_WEB_URL` 给渲染进程（跳转目标）。都没设置时开发环境用 `http://localhost:3000`，打包后的应用启动时会直接报错，不会静默打开空白窗口。
- 运行时可以用 `HUTIAN_WEB_URL` 覆盖主进程的取值，仅供调试，不影响渲染进程的跳转目标。
- 这个包刻意不声明 `"type": "module"`：沙箱化的 preload 不支持 ESM，electron-vite 只有在这种情况下才产出与代码路径一致的 `out/main/index.js` 和 `out/preload/index.js`。改回去之前先确认 preload 与主进程的路径都同步改了。
- 因为渲染的是另一个源的页面，preload 脚本不会运行在那个页面里，桌面端也不通过 IPC 向页面暴露任何能力。preload 只保留空入口，供以后需要时扩展。

### 安全

这些设置是默认值，改动前需要说明理由：
- `contextIsolation: true`、`nodeIntegration: false`、`sandbox: true`。渲染进程拿不到 Node.js 能力。
- `webSecurity` 保持开启，不设置 `allowRunningInsecureContent`。
- 导航限制：主框架只允许停留在页面地址的源，以及开发时的 DevTools。跳转到其他来源的链接改为调用系统浏览器打开，而不是在窗口内导航。
- 不允许创建新的 `BrowserWindow` 承载任意网页。`window.open` 同样转交系统浏览器。
- 不开启 `remote` 模块，不在渲染进程使用 `electron` 包。

### 系统集成

当前只做三件事，都在主进程内完成：
- 系统托盘：关闭窗口时隐藏到托盘而不是退出，托盘菜单提供显示窗口和退出。
- 原生通知：主进程封装一个通知函数，供以后的功能调用。
- 单实例锁：第二个实例启动时聚焦已有窗口并退出自己。

文件对话框、全局快捷键、深链接（`hutian://`）不在当前范围，需要时再加。

### 开发

- 根目录 `pnpm dev` 并行启动 `apps/web` 和 `apps/desktop`。壳在开发模式下加载 `http://localhost:3000`，并打开 DevTools。
- `apps/web` 单独用 `pnpm dev:web` 启动，桌面端不参与。

## 禁止事项

- 不引入 jQuery、Moment、Lodash 全量包。日期用原生 `Temporal` 或已有的轻量库，工具函数优先用原生。
- 不新增与现有选型重复的状态管理、请求库、UI 库或 CSS 方案（例如 Redux、styled-components、另一套组件库）。
- 不把密钥、连接串、token 写进代码或提交进仓库，统一走环境变量。
- 不在未要求的情况下把项目改造成 monorepo 或更换包管理器。workspace 只用于隔离 `apps/web` 与 `apps/desktop`，不为此再拆内部包。
- 不在 `apps/desktop` 里实现业务逻辑、不让桌面端直连数据库、不把服务端密钥打进安装包。
