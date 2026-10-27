// 这个文件跑在渲染进程里，只做一件事：把窗口交到远程页面手上。
// 地址由构建时注入。electron-vite 只暴露 RENDERER_VITE_ 前缀的变量，
// 所以打包时设置的是 RENDERER_VITE_HUTIAN_WEB_URL，而不是 HUTIAN_WEB_URL。
const DEV_WEB_URL = "http://localhost:3000";

const configured = import.meta.env.RENDERER_VITE_HUTIAN_WEB_URL;
const target = configured && configured.length > 0 ? configured : DEV_WEB_URL;

window.location.replace(target);
