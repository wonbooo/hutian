import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 Tailwind 类名。动态类名一律走这里，不用字符串插值拼接。 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
