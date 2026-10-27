import { expect, test } from "@playwright/test";

test("首页可以打开", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "壶天" })).toBeVisible();
});
