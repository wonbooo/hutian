/// <reference types="vite/client" />

// electron-vite 只注入 MAIN_VITE_ 与 VITE_ 前缀的变量到主进程。
interface ImportMetaEnv {
  readonly MAIN_VITE_HUTIAN_WEB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
