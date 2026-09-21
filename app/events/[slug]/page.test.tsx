import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import EventDetailsPage, { EventDetailsItem, EventAgenda, EventTags, EventDetailsContent } from "./page";
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { getBookingByEvent } from "@/lib/actions/bookings.actions";

// 1. Mock Next.js navigation & cache
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
}));

// 2. Mock next/image to render a basic img tag
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

// 3. Mock dependent Server Actions
vi.mock("@/lib/actions/event.actions", () => ({
  getEventBySlug: vi.fn(),
  getSimilarEventsBySlug: vi.fn(),
}));

vi.mock("@/lib/actions/bookings.actions", () => ({
  getBookingByEvent: vi.fn(),
}));

// 4. Mock child components
vi.mock("@/components/icons/Icons", () => ({
  Icons: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

vi.mock("@/app/components/BookEvent", () => ({
  default: () => <div data-testid="book-event-component" />,
}));

vi.mock("@/app/components/EventCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

// Mock Data Fixtures
const mockEvent = {
  _id: "evt_123",
  slug: "tech-conference-2026",
  title: "Tech Conference 2026",
  description: "Annual Tech Gathering",
  image: "/images/event.jpg",
  overview: "Detailed overview of the tech event.",
  date: "2026-10-15",
  time: "10:00 AM",
  location: "Melbourne Convention Centre",
  mode: "In-Person",
  agenda: ["Keynote", "Networking", "Panels"],
  audience: "Developers & Tech Enthusiasts",
  tags: ["Tech", "React", "Next.js"],
  organizer: "Tech Corp",
};

const mockSimilarEvent = {
  _id: "evt_456",
  slug: "ai-summit-2026",
  title: "AI Summit 2026",
  description: "AI Innovations",
  image: "/images/ai.jpg",
  overview: "AI overview",
  date: "2026-11-01",
  time: "09:00 AM",
  location: "Online",
  mode: "Virtual",
  agenda: ["Keynote"],
  audience: "AI Engineers",
  tags: ["AI", "ML"],
  organizer: "AI Association",
};

describe("EventDetailsItem", () => {
  it("renders icon and label correctly", () => {
    render(<EventDetailsItem icon="calendar" label="2026-10-15" />);
    expect(screen.getByText("2026-10-15")).toBeInTheDocument();
    expect(screen.getByTestId("icon-calendar")).toBeInTheDocument();
  });
});

describe("EventAgenda", () => {
  it("renders list of agenda items", () => {
    render(<EventAgenda agendaItems={["Keynote", "Networking"]} />);
    expect(screen.getByText("Agenda")).toBeInTheDocument();
    expect(screen.getByText("Keynote")).toBeInTheDocument();
    expect(screen.getByText("Networking")).toBeInTheDocument();
  });
});

describe("EventTags", () => {
  it("renders tag pills", () => {
    render(<EventTags tags={["React", "Next.js"]} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });
});

describe("EventDetailsContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders full event content when data exists (with bookings > 0)", async () => {
    vi.mocked(getEventBySlug).mockResolvedValue(mockEvent as unknown as ReturnType<typeof getEventBySlug>);
    vi.mocked(getBookingByEvent).mockResolvedValue([{ id: "b1" }, { id: "b2" }] as unknown as ReturnType<typeof getBookingByEvent>);
    vi.mocked(getSimilarEventsBySlug).mockResolvedValue([mockSimilarEvent] as unknown as ReturnType<typeof getSimilarEventsBySlug>);

    const params = Promise.resolve({ slug: "tech-conference-2026" });

    // Await the Async Server Component execution
    const JSX = await EventDetailsContent({ params });
    render(JSX);

    expect(screen.getByRole("heading", { level: 1, name: "Tech Conference 2026" })).toBeInTheDocument();
    expect(screen.getByText("Annual Tech Gathering")).toBeInTheDocument();
    expect(screen.getByText("Detailed overview of the tech event.")).toBeInTheDocument();
    expect(screen.getByText("Join 2 people who have already booked this event.")).toBeInTheDocument();
    expect(screen.getByText("AI Summit 2026")).toBeInTheDocument();
  });

  it("renders first booking callout when bookings count is 0", async () => {
    vi.mocked(getEventBySlug).mockResolvedValue(mockEvent as unknown as ReturnType<typeof getEventBySlug>);
    vi.mocked(getBookingByEvent).mockResolvedValue([] as unknown as ReturnType<typeof getBookingByEvent>);
    vi.mocked(getSimilarEventsBySlug).mockResolvedValue([]);

    const params = Promise.resolve({ slug: "tech-conference-2026" });

    const JSX = await EventDetailsContent({ params });
    render(JSX);

    expect(screen.getByText("Be the first one to book this event.")).toBeInTheDocument();
  });

  it("triggers notFound when event is not returned", async () => {
    vi.mocked(getEventBySlug).mockResolvedValue(null as unknown as ReturnType<typeof getEventBySlug>);
    const params = Promise.resolve({ slug: "invalid-slug" });

    await expect(EventDetailsContent({ params })).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("triggers notFound when event description is missing", async () => {
    vi.mocked(getEventBySlug).mockResolvedValue({
      ...mockEvent,
      description: "",
    } as unknown as ReturnType<typeof getEventBySlug>);
    const params = Promise.resolve({ slug: "no-desc-slug" });

    await expect(EventDetailsContent({ params })).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("EventDetailsPage", () => {
  it("renders Suspense wrapper and inner component correctly", () => {
    vi.mocked(getEventBySlug).mockResolvedValue(mockEvent as unknown as ReturnType<typeof getEventBySlug>);
    vi.mocked(getBookingByEvent).mockResolvedValue([] as unknown as ReturnType<typeof getBookingByEvent>);
    vi.mocked(getSimilarEventsBySlug).mockResolvedValue([]);

    const params = Promise.resolve({ slug: "tech-conference-2026" });

    render(<EventDetailsPage params={params} />);

    // Verify main layout renders with suspense boundary
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
