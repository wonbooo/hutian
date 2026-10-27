import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import HomePage from "./page";

test("首页展示应用名", () => {
  render(<HomePage />);

  expect(screen.getByRole("heading", { name: "壶天" })).toBeInTheDocument();
});
