import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Icons, IconName } from "./Icons";

const validIconNames: IconName[] = ["arrow-down", "audience", "calendar", "clock", "file", "globe", "mode", "next", "pin", "vercel", "window"];

describe("Icons Component", () => {
  // Test every valid icon name dynamically
  validIconNames.forEach((iconName) => {
    it(`renders the '${iconName}' icon correctly`, () => {
      const { container } = render(<Icons name={iconName} />);
      expect(container.firstChild).toBeInTheDocument();
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("applies custom className correctly", () => {
    const { container } = render(<Icons name="arrow-down" className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies custom size prop correctly", () => {
    const { container } = render(<Icons name="arrow-down" size={48} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });

  it("applies custom width and height props over size", () => {
    const { container } = render(<Icons name="arrow-down" size={24} width={32} height={64} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "64");
  });
});
