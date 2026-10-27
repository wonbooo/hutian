import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { calculateDockScale, Dock } from "./dock";

test("renders the dock navigation and its labels", () => {
  render(<Dock />);

  expect(screen.getByRole("complementary", { name: "壶天应用栏" })).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: "应用" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "坊市" })).toHaveAttribute("title", "坊市");
  expect(screen.getByRole("button", { name: "设置" })).toHaveAttribute("title", "设置");
});

test("selects an application without leaving the desktop", () => {
  render(<Dock />);

  const spaceButton = screen.getAllByRole("button", { name: "星图" })[0];

  if (!spaceButton) {
    throw new Error("星图按钮未渲染");
  }

  expect(spaceButton).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(spaceButton);
  expect(spaceButton).toHaveAttribute("aria-pressed", "true");
});

test("magnifies the item closest to the pointer", () => {
  expect(calculateDockScale(0)).toBeGreaterThan(calculateDockScale(56));
  expect(calculateDockScale(56)).toBeGreaterThan(calculateDockScale(132));
  expect(calculateDockScale(132)).toBeGreaterThan(1);
});
