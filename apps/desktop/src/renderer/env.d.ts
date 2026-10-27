/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_HUTIAN_WEB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
