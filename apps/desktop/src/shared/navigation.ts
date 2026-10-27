/** 开发时未配置地址就连本地的 Next.js 开发服务器。 */
export const DEV_WEB_URL = "http://localhost:3000";

/**
 * 窗口允许停留的源。生产环境只有部署地址一个；开发环境额外放开 localhost，
 * 方便页面在本地服务之间跳转。
 */
export function allowedOrigins(webUrl: string, isDev: boolean): string[] {
  const origins = [new URL(webUrl).origin];

  if (isDev) {
    origins.push(new URL(DEV_WEB_URL).origin);
  }

  return origins;
}

/**
 * 判断一次主框架导航是否应该留在窗口内。
 * DevTools 和窗口内部的源始终放行，其余一律交给系统浏览器。
 */
export function isAllowedNavigation(targetUrl: string, allowed: readonly string[]): boolean {
  let parsed: URL;

  try {
    parsed = new URL(targetUrl);
  } catch {
    return false;
  }

  if (parsed.protocol === "devtools:") {
    return true;
  }

  return allowed.includes(parsed.origin);
}
