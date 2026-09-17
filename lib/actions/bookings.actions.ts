'use server';

import { Booking } from "@/database";
import connectDB from "../mongodb";

export const createBooking = async (eventId: string, slug: string, email: string) => {

    try {
        await connectDB();
        await Booking.create({ eventId, slug, email });
        return { success: true };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false };
        // throw error;
    }
};


export const getBookingByEvent = async (id: string) => {
    try {
        await connectDB();
        const bookings = await Booking.find({ eventId: id.trim() }).lean();
        return bookings.length > 0 ? JSON.parse(JSON.stringify(bookings)) : null;
    } catch (error) {
        console.error("Error fetching booking:", error);
        return null;
    }
};