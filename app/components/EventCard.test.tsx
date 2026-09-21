import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventCard from "./EventCard";
import posthog from "posthog-js";

// Mock posthog-js
vi.mock("posthog-js", () => ({
  default: {
    capture: vi.fn(),
  },
}));

describe("EventCard Component", () => {
  const defaultProps = {
    title: "React Summit 2026",
    date: "2026-05-15",
    location: "Online",
    image: "/react-summit-2026.jpg",
    slug: "react-summit-2026",
    time: "10:00 AM",
  };

  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("renders event card correctly", () => {
    render(<EventCard {...defaultProps} />);

    expect(screen.getByText(/react summit 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-05-15/i)).toBeInTheDocument();
    expect(screen.getByText(/online/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00 am/i)).toBeInTheDocument();
  });

  it("triggers posthog.capture when card is clicked and environment variables are set", async () => {
    const user = userEvent.setup();

    // Set PostHog env variables to trigger lines 15-16
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "phc_test_token_123";
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://app.posthog.com";

    render(<EventCard {...defaultProps} />);

    const cardLink = screen.getByRole("link");
    await user.click(cardLink);

    expect(posthog.capture).toHaveBeenCalledWith("event_card_selected");
  });

  it("does not trigger posthog.capture when environment variables are missing", async () => {
    const user = userEvent.setup();

    delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    delete process.env.NEXT_PUBLIC_POSTHOG_HOST;

    render(<EventCard {...defaultProps} />);

    const cardLink = screen.getByRole("link");
    await user.click(cardLink);

    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
