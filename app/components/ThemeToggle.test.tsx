import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";

// Helper to mock window.matchMedia
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.dataset.theme = "";
    mockMatchMedia(false); // Default to light system preference
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders light theme by default when no local storage is present", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /switch to dark theme/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("☾")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("pastel");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("reads dark theme preference from system media query", () => {
    mockMatchMedia(true); // Dark system preference

    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /switch to light theme/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText("☀")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("luxury");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("reads theme from localStorage over system preference", () => {
    localStorage.setItem("theme", "dark");
    mockMatchMedia(false); // System says light, but localStorage says dark

    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("luxury");
  });

  it("toggles theme on click and updates localStorage and document attributes", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /switch to dark theme/i });
    await user.click(button);

    // After clicking, theme should switch to dark
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("luxury");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();

    // Toggle back to light
    await user.click(button);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("pastel");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("responds to storage and custom themechange events", () => {
    render(<ThemeToggle />);

    // Trigger localStorage theme change externally
    localStorage.setItem("theme", "dark");
    window.dispatchEvent(new Event("storage"));

    expect(document.documentElement.dataset.theme).toBe("pastel");
  });
});
