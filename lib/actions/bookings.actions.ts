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