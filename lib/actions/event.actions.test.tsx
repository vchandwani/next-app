import { describe, expect, it, vi, beforeEach } from "vitest";
import { getAllEvents, getEventBySlug, getSimilarEventsBySlug } from "./event.actions";
import { Event } from "@/database";

// Mock database and model
vi.mock("@/database", () => ({
  Event: {
    create: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
  },
}));

vi.mock("../mongodb", () => ({
  default: vi.fn(),
}));

describe("getAllEvents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve all events successfully", async () => {
    const mockEvents = [{ _id: "event123", slug: "test-slug", email: "test@gmail.com" }];

    const mockLean = vi.fn().mockResolvedValueOnce(mockEvents);
    const mockSort = vi.fn().mockReturnValue({ lean: mockLean });
    vi.mocked(Event.find).mockReturnValue({ sort: mockSort } as unknown as ReturnType<typeof Event.find>);

    const result = await getAllEvents();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]._id).toBe("event123");
  });

  it("should return an empty array if no events are found", async () => {
    const mockLean = vi.fn().mockResolvedValueOnce([]);
    const mockSort = vi.fn().mockReturnValue({ lean: mockLean });
    vi.mocked(Event.find).mockReturnValue({ sort: mockSort } as unknown as ReturnType<typeof Event.find>);

    const result = await getAllEvents();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("should catch error and return an empty array if getAllEvents fails (covers lines 12-13)", async () => {
    vi.mocked(Event.find).mockImplementationOnce(() => {
      throw new Error("Database read error");
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getAllEvents();
    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe("getEventBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve an event by slug successfully", async () => {
    const slug = "test-slug";
    const mockEvent = { _id: "event123", slug, email: "test@gmail.com" };

    const mockLean = vi.fn().mockResolvedValueOnce(mockEvent);
    vi.mocked(Event.findOne).mockReturnValue({ lean: mockLean } as unknown as ReturnType<typeof Event.findOne>);

    const result = await getEventBySlug(slug);
    expect(result).toBeDefined();
    expect(result?.slug).toBe(slug);
  });

  it("should return null for a non-existent event slug", async () => {
    const slug = "nonExistentSlug";

    const mockLean = vi.fn().mockResolvedValueOnce(null);
    vi.mocked(Event.findOne).mockReturnValue({ lean: mockLean } as unknown as ReturnType<typeof Event.findOne>);

    const result = await getEventBySlug(slug);
    expect(result).toBeNull();
  });

  it("should catch error and return null if fetching event by slug fails", async () => {
    vi.mocked(Event.findOne).mockImplementationOnce(() => {
      throw new Error("Database read error");
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getEventBySlug("test-slug");
    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

describe("getSimilarEventsBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve similar events successfully (covers lines 30-38)", async () => {
    const slug = "test-slug";
    const mockEvent = { _id: "event123", slug, tags: ["tech"] };
    const mockSimilarEvents = [{ _id: "event456", slug: "other-slug", tags: ["tech"] }];

    // Event.findOne is awaited directly without .lean() in this function
    vi.mocked(Event.findOne).mockResolvedValueOnce(mockEvent as unknown as ReturnType<typeof Event.findOne>);

    // Event.find uses .lean()
    const mockFindLean = vi.fn().mockResolvedValueOnce(mockSimilarEvents);
    vi.mocked(Event.find).mockReturnValue({ lean: mockFindLean } as unknown as ReturnType<typeof Event.find>);

    const result = await getSimilarEventsBySlug(slug);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]._id).toBe("event456");
  });

  it("should catch error and return an empty array if getSimilarEventsBySlug fails", async () => {
    vi.mocked(Event.findOne).mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await getSimilarEventsBySlug("test-slug");
    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
