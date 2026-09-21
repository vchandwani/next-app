import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import ErrorPage from "./error";

describe("ErrorPage Client Component", () => {
  const mockRetry = vi.fn();
  const mockError = new Error("Something failed in the component tree");

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.error to prevent pollution during test runs
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders error heading and retry button", () => {
    render(<ErrorPage error={mockError} retry={mockRetry} />);

    expect(screen.getByRole("heading", { level: 2, name: "Something went wrong!" })).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Try again" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("error-retry");
  });

  it("logs the error to console on mount via useEffect", () => {
    render(<ErrorPage error={mockError} retry={mockRetry} />);

    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("calls the retry callback when 'Try again' button is clicked", () => {
    render(<ErrorPage error={mockError} retry={mockRetry} />);

    const button = screen.getByRole("button", { name: "Try again" });
    fireEvent.click(button);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
