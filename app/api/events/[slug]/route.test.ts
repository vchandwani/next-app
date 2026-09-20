import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// Mock database connection
vi.mock("@/lib/mongodb", () => ({
    default: vi.fn(),
}));

// Mock Mongoose Event model
vi.mock("@/database/event.model", () => ({
    default: {
        findOne: vi.fn(),
    },
}));

describe("GET /api/events/[slug]", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns 200 and the event when found by slug", async () => {
        const mockEvent = {
            _id: "60d5ecb8b5c9c22b1c8c101a",
            title: "React Next Summit",
            slug: "react-next-summit",
            location: "Online",
        };

        // Chain findOne().lean()
        const mockLean = vi.fn().mockResolvedValue(mockEvent);
        vi.mocked(Event.findOne).mockReturnValue({ lean: mockLean } as any);

        const req = new NextRequest("http://localhost:3000/api/events/react-next-summit");
        const params = Promise.resolve({ slug: "react-next-summit" });

        const response = await GET(req, { params });
        const body = await response.json();

        expect(connectDB).toHaveBeenCalledTimes(1);
        expect(Event.findOne).toHaveBeenCalledWith({ slug: "react-next-summit" });
        expect(mockLean).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(body).toEqual({
            message: "Event fetched successfully",
            event: mockEvent,
        });
    });

    it("returns 404 when no event matches the given slug", async () => {
        const mockLean = vi.fn().mockResolvedValue(null);
        vi.mocked(Event.findOne).mockReturnValue({ lean: mockLean } as any);

        const req = new NextRequest("http://localhost:3000/api/events/non-existent-slug");
        const params = Promise.resolve({ slug: "non-existent-slug" });

        const response = await GET(req, { params });
        const body = await response.json();

        expect(Event.findOne).toHaveBeenCalledWith({ slug: "non-existent-slug" });
        expect(response.status).toBe(404);
        expect(body).toEqual({
            message: "Event not found",
        });
    });

    it("returns 400 when slug is empty or whitespace only", async () => {
        const req = new NextRequest("http://localhost:3000/api/events/   ");
        const params = Promise.resolve({ slug: "   " });

        const response = await GET(req, { params });
        const body = await response.json();

        expect(connectDB).not.toHaveBeenCalled();
        expect(Event.findOne).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(body).toEqual({
            message: "A valid slug is required",
        });
    });

    it("returns 500 when database connection or query throws an error", async () => {
        vi.mocked(connectDB).mockRejectedValueOnce(new Error("Database connection failure"));

        const req = new NextRequest("http://localhost:3000/api/events/react-next-summit");
        const params = Promise.resolve({ slug: "react-next-summit" });

        const response = await GET(req, { params });
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body).toEqual({
            message: "Failed to fetch event",
            error: "Database connection failure",
        });
    });
});