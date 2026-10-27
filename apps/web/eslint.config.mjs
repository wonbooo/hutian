import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next";

const eslintConfig = defineConfig([
  ...nextConfig,
  globalIgnores([".next/**", "out/**", "coverage/**", "next-env.d.ts"]),
]);

export default eslintConfig;
