'use server';

import { Event } from "@/database";
import connectDB from "../mongodb";

export const getAllEvents = async () => {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug: slug.trim() }).lean();
        return event ? JSON.parse(JSON.stringify(event)) : null;
    } catch (error) {
        console.error("Error fetching event:", error);
        return null;
    }
};

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