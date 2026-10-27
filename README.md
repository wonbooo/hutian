# hutian

壶天是一块可以自己布置的桌面。常用的东西从坊市取回来，放进壶中，变成一颗星子；不用了，再送回坊市。星子可以拖动、排列，点开之后各自展开成一个窗口。 名字取自一个旧故事：市集上有人卖药，收摊时跳进自己的葫芦，里面另有日月。这里只借这个意思——一块不大的地方，把零散的应用收进来，各自安放。

## 结构

- `apps/web`：Next.js 服务，持有数据库、认证和全部业务逻辑，部署在服务器上。
- `apps/desktop`：Electron 壳，只开窗口加载 `apps/web` 的地址。

技术栈与代码约定见 [CLAUDE.md](CLAUDE.md)。

## 开发

需要 Node.js 22.12 以上、pnpm 10.28 以上。

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm dev
```

`pnpm dev` 会同时启动 Next.js（`http://localhost:3000`）和 Electron 窗口。只想跑网页时用 `pnpm dev:web`。

常用命令：

| 命令                | 作用                       |
| ------------------- | -------------------------- |
| `pnpm typecheck`    | 两个应用的 TypeScript 检查 |
| `pnpm lint`         | Biome 与 ESLint            |
| `pnpm test`         | 单元测试                   |
| `pnpm build`        | 生产构建                   |
| `pnpm dist:desktop` | 打桌面安装包               |

桌面端的地址配置见 [apps/desktop/README.md](apps/desktop/README.md)。
