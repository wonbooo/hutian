import { expect, test } from "vitest";

import { cn } from "./utils";

test("后写的类覆盖先写的同类样式", () => {
  expect(cn("px-2", "px-4")).toBe("px-4");
});

test("条件为假的类名被去掉", () => {
  expect(cn("block", false && "hidden")).toBe("block");
});
