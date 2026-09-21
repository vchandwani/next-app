import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import posthog from "posthog-js";
import GlobalError from "./global-error";

// Mock posthog-js
vi.mock("posthog-js", () => ({
  default: {
    captureException: vi.fn(),
  },
}));

describe("GlobalError Component", () => {
  const mockReset = vi.fn();
  const mockError = new Error("Test error");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "");
  });

  it("renders the default UI elements and triggers reset on button click", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    // Assert UI elements rendered by the component
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByText("Please try again.")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Try again" });
    expect(button).toBeInTheDocument();

    // Trigger reset callback
    fireEvent.click(button);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("captures exception with posthog when env vars are defined", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_123456789");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://app.posthog.com");

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(posthog.captureException).toHaveBeenCalledWith(mockError);
    expect(posthog.captureException).toHaveBeenCalledTimes(1);
  });

  it("does not capture exception with posthog when env vars are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "");

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(posthog.captureException).not.toHaveBeenCalled();
  });
});
