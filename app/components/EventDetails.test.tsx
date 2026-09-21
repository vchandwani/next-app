import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import EventDetails from "./EventDetails";

describe("EventDetails Component", () => {
  it("renders the event title when params contains valid JSON", async () => {
    const mockParams = Promise.resolve(JSON.stringify({ title: "React Summit 2026" }));

    // Resolve the async server component JSX
    const EventDetailsComponent = await EventDetails({ params: mockParams });
    render(EventDetailsComponent);

    expect(screen.getByRole("heading", { level: 1, name: "React Summit 2026" })).toBeInTheDocument();
  });

  it("renders fallback text 'Loading...' when title is missing in JSON", async () => {
    const mockParams = Promise.resolve(JSON.stringify({}));

    const EventDetailsComponent = await EventDetails({ params: mockParams });
    render(EventDetailsComponent);

    expect(screen.getByRole("heading", { level: 1, name: "Loading..." })).toBeInTheDocument();
  });

  it("throws an error when params contains invalid JSON", async () => {
    const mockParams = Promise.resolve("invalid-json");

    await expect(EventDetails({ params: mockParams })).rejects.toThrow(SyntaxError);
  });
});
