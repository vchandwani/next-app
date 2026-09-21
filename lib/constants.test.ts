import { describe, expect, it } from "vitest";
import events, { type EventItem } from "./constants";

describe("constants", () => {
    const eventsName = ['event1', 'event2', 'event3', 'event4', 'event5', 'event6'];

    it("should have all expected event image names in the events array", () => {
        // Iterate through our expected names and ensure the array has an event for each
        eventsName.forEach((name) => {
            const hasEvent = events.some((event: EventItem) => event.image.includes(name));
            expect(hasEvent).toBe(true);
        });
    });

    it("should have an event-full image in the events array", () => {
        // Use .some() instead of .every() because only one event has the 'event-full' image
        const hasEventFull = events.some((event: EventItem) => event.image.includes("event-full"));
        expect(hasEventFull).toBe(true);
    });

    it("should ensure all events have a valid image path format", () => {
        // Extra validation to ensure the data is shaped correctly
        events.forEach((event: EventItem) => {
            expect(event.image).toContain("/images/");
            expect(event.image).toMatch(/\.png$/);
        });
    });
});