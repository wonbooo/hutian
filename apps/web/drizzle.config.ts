import { defineConfig } from "drizzle-kit";

// 只在生成迁移时读取。运行时的连接串由 lib/env.ts 校验。
export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://hutian:hutian@localhost:5432/hutian",
  },
});
