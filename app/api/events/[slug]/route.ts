import connectDB from '@/lib/mongodb';
import Event, { IEvent } from '@/database/event.model';
import { NextRequest, NextResponse } from 'next/server';

interface RouteContext {
    params: Promise<{ slug: string }>;
}

// GET /api/events/[slug] - fetch a single event by its slug
export async function GET(request: NextRequest, { params }: RouteContext) {
    try {
        const { slug } = await params;

        if (!slug || typeof slug !== 'string' || !slug.trim()) {
            return NextResponse.json({ message: 'A valid slug is required' }, { status: 400 });
        }

        await connectDB();

        const event = await Event.findOne({ slug: slug.trim() }).lean<IEvent | null>();

        if (!event) {
            return NextResponse.json({ message: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Event fetched successfully', event }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch event', error: (error as Error).message }, { status: 500 });
    }
}
