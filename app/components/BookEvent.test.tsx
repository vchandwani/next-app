import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookEvent from "./BookEvent";
import { createBooking } from "@/lib/actions/bookings.actions";
import { posthog } from "posthog-js";

// Mock the server action
vi.mock("@/lib/actions/bookings.actions", () => ({
  createBooking: vi.fn(),
}));

// Mock PostHog
vi.mock("posthog-js", () => ({
  posthog: {
    capture: vi.fn(),
    captureException: vi.fn(),
  },
}));

describe("BookEvent Component", () => {
  const defaultProps = {
    eventId: "evt_123",
    slug: "react-summit-2026",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the email form initially", () => {
    render(<BookEvent {...defaultProps} />);

    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^submit$/i })).toBeInTheDocument();
    expect(screen.queryByText(/thank you for booking the event!/i)).not.toBeInTheDocument();
  });

  it("updates email input value when user types", async () => {
    const user = userEvent.setup();
    render(<BookEvent {...defaultProps} />);

    const input = screen.getByLabelText(/email:/i) as HTMLInputElement;
    await user.type(input, "developer@example.com");

    expect(input.value).toBe("developer@example.com");
  });

  it("submits booking successfully and displays confirmation message", async () => {
    const user = userEvent.setup();
    vi.mocked(createBooking).mockResolvedValueOnce({ success: true } as never);

    render(<BookEvent {...defaultProps} />);

    const input = screen.getByLabelText(/email:/i);
    const submitButton = screen.getByRole("button", { name: /^submit$/i });

    await user.type(input, "developer@example.com");
    await user.click(submitButton);

    expect(createBooking).toHaveBeenCalledWith("evt_123", "react-summit-2026", "developer@example.com");
    expect(posthog.capture).toHaveBeenCalledWith("event_booked", {
      eventId: "evt_123",
      slug: "react-summit-2026",
      email: "developer@example.com",
    });

    expect(screen.getByText(/thank you for booking the event!/i)).toBeInTheDocument();
  });

  it("handles booking failure gracefully without showing success message", async () => {
    const user = userEvent.setup();
    vi.mocked(createBooking).mockResolvedValueOnce({ success: false } as never);

    render(<BookEvent {...defaultProps} />);

    const input = screen.getByLabelText(/email:/i);
    const submitButton = screen.getByRole("button", { name: /^submit$/i });

    await user.type(input, "developer@example.com");
    await user.click(submitButton);

    expect(createBooking).toHaveBeenCalledWith("evt_123", "react-summit-2026", "developer@example.com");

    expect(console.error).toHaveBeenCalledWith("Booking creation failed");
    expect(posthog.captureException).toHaveBeenCalledWith("Booking creation failed");

    expect(posthog.capture).not.toHaveBeenCalled();
    expect(screen.queryByText(/thank you for booking the event!/i)).not.toBeInTheDocument();
  });
});
