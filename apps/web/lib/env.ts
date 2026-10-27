import { z } from "zod";

/**
 * 环境变量的唯一入口。业务代码从这里导入，不直接读 process.env。
 * 校验失败时抛出，让进程在启动阶段就停下来，而不是带着空配置运行。
 */
const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
});
