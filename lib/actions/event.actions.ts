'use server';

import { Event } from "@/database";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    // Implement the logic to fetch similar events by slug
    try {
        // Fetch similar events logic here
        await connectDB(); // Assuming you have a function to connect to your database
        const event = await Event.findOne({ slug }); // Assuming you have an Event model and slug field
        const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean(); // Assuming events have a category field and you want to exclude the current event
        return JSON.parse(JSON.stringify(similarEvents));
    } catch (error) {
        console.error("Error fetching similar events:", error);
        return [];
    }
};