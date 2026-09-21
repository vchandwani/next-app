import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock ThemeToggle component to isolate Navbar testing
vi.mock("./ThemeToggle", () => ({
  default: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the brand logo and name linking to home", () => {
    render(<Navbar />);

    const logoLink = screen.getByRole("link", { name: /devevents/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");

    const logoImage = screen.getByAltText("Logo");
    expect(logoImage).toBeInTheDocument();
  });

  it("renders all navigation links with correct destinations", () => {
    render(<Navbar />);

    const links = [
      { name: "Events", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Analytics", href: "/dashboard/analytics" },
      { name: "Users", href: "/dashboard/users" },
    ];

    links.forEach(({ name, href }) => {
      const link = screen.getByRole("link", { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", href);
    });
  });

  it("renders the ThemeToggle component inside the navigation menu", () => {
    render(<Navbar />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
