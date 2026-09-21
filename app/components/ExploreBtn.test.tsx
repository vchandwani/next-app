import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import posthog from "posthog-js";
import ExploreBtn from "./ExploreBtn";

// Mock posthog-js
vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
  },
}));

// Mock Icons component if needed
vi.mock("@/components/icons/Icons", () => ({
  Icons: () => <span data-testid="icon-arrow-down" />,
}));

describe("ExploreBtn Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders the button and anchor link pointing to #events", () => {
    render(<ExploreBtn />);

    const link = screen.getByRole("link", { name: /explore events/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#events");
  });

  it("triggers posthog event when env variables are present", async () => {
    const user = userEvent.setup();

    // Stub posthog env vars
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_mock_token");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://app.posthog.com");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<ExploreBtn />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(consoleSpy).toHaveBeenCalledWith("Explore button clicked!");
    expect(posthog.capture).toHaveBeenCalledWith("explore_events_clicked");

    consoleSpy.mockRestore();
  });

  it("does not trigger posthog when env variables are missing", async () => {
    const user = userEvent.setup();

    // Ensure env variables are undefined
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "");

    render(<ExploreBtn />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
