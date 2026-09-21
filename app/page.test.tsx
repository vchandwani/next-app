import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Home, { FeaturedEvents } from "./page";
import { getAllEvents } from "@/lib/actions/event.actions";

// Mock child components
vi.mock("./components/EventCard", () => ({
  default: ({ title }: { title: string }) => <div data-testid="event-card">{title}</div>,
}));

vi.mock("./components/ExploreBtn", () => ({
  default: () => <button>Explore</button>,
}));

// Mock Next.js cache directives
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

// Mock server action
vi.mock("@/lib/actions/event.actions", () => ({
  getAllEvents: vi.fn(),
}));

describe("Home Page", () => {
  it("renders the static home layout and fallback inside suspense boundary", () => {
    render(<Home />);

    expect(screen.getByText(/The Hub for Every Dev/i)).toBeInTheDocument();
    expect(screen.getByText(/Events you cant miss/i)).toBeInTheDocument();
    expect(screen.getByText("Meetups, conferences, and more!")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Featured Events" })).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("FeaturedEvents Async Component", () => {
  const mockEvents = [
    { slug: "dev-conf-2026", title: "Dev Conference 2026" },
    { slug: "react-meetup", title: "React Meetup" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a list of events when data fetching succeeds", async () => {
    vi.mocked(getAllEvents).mockResolvedValueOnce(mockEvents as never);

    const ResolvedFeaturedEvents = await FeaturedEvents();
    render(ResolvedFeaturedEvents);

    expect(getAllEvents).toHaveBeenCalledTimes(1);

    const eventCards = screen.getAllByTestId("event-card");
    expect(eventCards).toHaveLength(2);
    expect(screen.getByText("Dev Conference 2026")).toBeInTheDocument();
    expect(screen.getByText("React Meetup")).toBeInTheDocument();
  });

  it("renders an empty list when no events are returned", async () => {
    vi.mocked(getAllEvents).mockResolvedValueOnce([]);

    const ResolvedFeaturedEvents = await FeaturedEvents();
    render(ResolvedFeaturedEvents);

    expect(getAllEvents).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId("event-card")).not.toBeInTheDocument();
  });
});
