import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const formData = await request.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (err) {
            return NextResponse.json({ message: 'Invalid JSON data format', error: (err as Error).message }, { status: 400 });
        }
        // Here you would typically call your database logic to create a new event
        // For example: const newEvent = await Event.create(event);
        const createdEvent = await Event.create(event);
        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Event creation failed', error: (error as Error).message }, { status: 500 });
    }
}
