import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createBooking, getBookingByEvent } from './bookings.actions';
import { Booking } from "@/database";

// Mock database and model
vi.mock("@/database", () => ({
    Booking: {
        create: vi.fn(),
        find: vi.fn(),
    },
}));

vi.mock("../mongodb", () => ({
    default: vi.fn(),
}));

describe('createBooking', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create a booking successfully', async () => {
        vi.mocked(Booking.create).mockResolvedValueOnce({} as any);

        const result = await createBooking('test', 'slug', 'test@gmail.com');
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
    });

    it('should fail to create a booking when database throws an error', async () => {
        vi.mocked(Booking.create).mockRejectedValueOnce(new Error('Database error'));

        const result = await createBooking('test', 'slug', 'test@gmail.com');
        expect(result).toBeDefined();
        expect(result.success).toBe(false);
    });
});

describe('getBookingByEvent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should retrieve bookings by event ID successfully', async () => {
        const eventId = 'event123';
        const mockBookings = [{ eventId, slug: 'test-slug', email: 'test@gmail.com' }];

        const mockLean = vi.fn().mockResolvedValueOnce(mockBookings);
        vi.mocked(Booking.find).mockReturnValue({ lean: mockLean } as any);

        const result = await getBookingByEvent(eventId);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].eventId).toBe(eventId);
    });

    it('should return null for a non-existent event ID', async () => {
        const eventId = 'nonExistentEvent';

        const mockLean = vi.fn().mockResolvedValueOnce([]);
        vi.mocked(Booking.find).mockReturnValue({ lean: mockLean } as any);

        const result = await getBookingByEvent(eventId);
        expect(result).toBeNull();
    });

    it('should catch error and return null if fetching booking fails (covers lines 26-27)', async () => {
        // Force Booking.find to throw an error to hit the catch block
        vi.mocked(Booking.find).mockImplementationOnce(() => {
            throw new Error('Database read error');
        });

        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => { });

        const result = await getBookingByEvent('event123');
        expect(result).toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});