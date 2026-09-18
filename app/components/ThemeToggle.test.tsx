import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ThemeToggle from "./ThemeToggle";

function mockMatchMedia(matches: boolean) {
  const addEventListener = vi.fn();
  const removeEventListener = vi.fn();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches,
      media: "(prefers-color-scheme: dark)",
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  return { addEventListener, removeEventListener };
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
    delete document.documentElement.dataset.theme;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uses the saved theme from localStorage", async () => {
    window.localStorage.setItem("theme", "dark");
    const { removeEventListener } = mockMatchMedia(false);
    const removeWindowListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<ThemeToggle />);

    const button = screen.getByRole("button");

    await waitFor(() => {
      expect(button).toHaveAttribute("aria-label", "Switch to light theme");
      expect(document.documentElement).toHaveClass("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "luxury");
    });

    unmount();

    expect(removeWindowListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    expect(removeWindowListenerSpy).toHaveBeenCalledWith("themechange", expect.any(Function));
    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("falls back to the system preference when no saved theme exists", async () => {
    mockMatchMedia(true);

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "luxury");
    });
  });

  it("toggles the theme and persists it", async () => {
    mockMatchMedia(false);

    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Switch to dark theme" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.localStorage.getItem("theme")).toBe("dark");
      expect(document.documentElement).toHaveClass("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "luxury");
      expect(button).toHaveAttribute("aria-label", "Switch to light theme");
    });
  });

  it("updates when a storage event changes the saved theme", async () => {
    mockMatchMedia(false);

    render(<ThemeToggle />);

    window.localStorage.setItem("theme", "dark");
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "dark" }));

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
      expect(document.documentElement).toHaveAttribute("data-theme", "luxury");
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Switch to light theme");
    });
  });
});
