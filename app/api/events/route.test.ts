import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "./route";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

// Mock database connection
vi.mock("@/lib/mongodb", () => ({
    default: vi.fn(),
}));

// Mock Mongoose model
vi.mock("@/database/event.model", () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
    },
}));

// Mock Cloudinary SDK stream
vi.mock("cloudinary", () => ({
    v2: {
        uploader: {
            upload_stream: vi.fn(),
        },
    },
}));

describe("Events API Route Handlers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("GET /api/events", () => {
        it("fetches events successfully and returns 200", async () => {
            const mockEvents = [
                { _id: "1", title: "React Conf" },
                { _id: "2", title: "Next.js Conf" },
            ];

            const mockSort = vi.fn().mockResolvedValue(mockEvents);
            vi.mocked(Event.find).mockReturnValue({ sort: mockSort } as any);

            const response = await GET();
            const body = await response.json();

            expect(connectDB).toHaveBeenCalledTimes(1);
            expect(Event.find).toHaveBeenCalledTimes(1);
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(response.status).toBe(200);
            expect(body).toEqual({
                message: "Events fetched successfully",
                events: mockEvents,
            });
        });

        it("returns status 500 when database connection or query fails", async () => {
            vi.mocked(connectDB).mockRejectedValueOnce(new Error("Database connection failed"));

            const response = await GET();
            const body = await response.json();

            expect(response.status).toBe(500);
            expect(body).toEqual({
                message: "Failed to fetch events",
                error: "Database connection failed",
            });
        });
    });

    describe("POST /api/events", () => {
        const mockFile = new File(["dummy image content"], "poster.png", { type: "image/png" });

        const createMockFormData = (overrides: Record<string, any> = {}) => {
            const formData = new FormData();
            formData.append("title", overrides.title ?? "Tech Summit 2026");
            formData.append("agenda", overrides.agenda ?? JSON.stringify(["Keynote", "Q&A"]));
            formData.append("tags", overrides.tags ?? JSON.stringify(["tech", "react"]));

            if (overrides.image !== undefined) {
                if (overrides.image !== null) {
                    formData.append("image", overrides.image);
                }
            } else {
                formData.append("image", mockFile);
            }

            return formData;
        };

        // Helper to create a NextRequest with mockable .formData() method
        const createMockRequest = (formData: FormData) => {
            const req = new NextRequest("http://localhost:3000/api/events", {
                method: "POST",
            });
            // Override formData method directly to bypass stream reading lock
            vi.spyOn(req, "formData").mockResolvedValue(formData);
            return req;
        };

        const setupCloudinaryMock = (shouldSuccess = true, secureUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg") => {
            vi.mocked(cloudinary.uploader.upload_stream).mockImplementation((options: any, callback: any) => {
                const stream = {
                    end: vi.fn().mockImplementation((buffer: Buffer) => {
                        if (shouldSuccess) {
                            callback(null, { secure_url: secureUrl });
                        } else {
                            callback(new Error("Cloudinary error"), null);
                        }
                    }),
                };
                return stream as any;
            });
        };

        it("creates an event successfully and returns status 201", async () => {
            setupCloudinaryMock(true);

            const createdEvent = {
                _id: "event_123",
                title: "Tech Summit 2026",
                image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                tags: ["tech", "react"],
                agenda: ["Keynote", "Q&A"],
            };

            vi.mocked(Event.create).mockResolvedValueOnce(createdEvent as any);

            const formData = createMockFormData();
            const req = createMockRequest(formData);

            const response = await POST(req);
            const body = await response.json();

            expect(connectDB).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(201);
            expect(body).toEqual({
                message: "Event created successfully",
                event: createdEvent,
            });
        });

        it("returns 400 when agenda/tags fail JSON parsing", async () => {
            const formData = createMockFormData({ agenda: "invalid-json-string" });
            const req = createMockRequest(formData);

            const response = await POST(req);
            const body = await response.json();

            expect(response.status).toBe(400);
            expect(body.message).toBe("Invalid agenda/tags format, expected a JSON array");
        });

        it("returns 400 when image file is missing or passed as text string", async () => {
            const formData = createMockFormData({ image: "not-a-file-object" });
            const req = createMockRequest(formData);

            const response = await POST(req);
            const body = await response.json();

            expect(response.status).toBe(400);
            expect(body.message).toBe("Image file is required");
        });

        it("returns 500 when Cloudinary upload fails", async () => {
            setupCloudinaryMock(false);

            const formData = createMockFormData();
            const req = createMockRequest(formData);

            const response = await POST(req);
            const body = await response.json();

            expect(response.status).toBe(500);
            expect(body.message).toBe("Event creation failed");
            expect(body.error).toBe("Cloudinary error");
        });

        it("returns 400 when JSON.parse fails for agenda or tags", async () => {
            const formData = new FormData();
            formData.append("title", "Sample Event");
            formData.append("agenda", "invalid-json-string");

            const req = createMockRequest(formData);

            const response = await POST(req);
            const body = await response.json();

            expect(response.status).toBe(400);
            // Updated to match your route's actual error message
            expect(body.message).toMatch(/Invalid agenda\/tags format/i);
        });

        it("returns 500 when database creation fails", async () => {
            const formData = createMockFormData();

            vi.spyOn(Event, "create").mockRejectedValueOnce(new Error("Database connection failed"));

            const req = createMockRequest(formData);

            const response = await POST(req);
            const body = await response.json();

            expect(response.status).toBe(500);
            // Updated to match your route's actual error message
            expect(body.message).toBe("Event creation failed");
        });

    });
});