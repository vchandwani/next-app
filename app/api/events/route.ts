import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

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

        // agenda/tags arrive as JSON-encoded strings since FormData only supports string values.
        try {
            const agendaRaw = formData.get('agenda');
            const tagsRaw = formData.get('tags');
            event.agenda = agendaRaw ? JSON.parse(agendaRaw as string) : [];
            event.tags = tagsRaw ? JSON.parse(tagsRaw as string) : [];
        } catch (err) {
            return NextResponse.json({ message: 'Invalid agenda/tags format, expected a JSON array', error: (err as Error).message }, { status: 400 });
        }
        // Here you would typically call your database logic to create a new event
        // For example: const newEvent = await Event.create(event);

        const file = formData.get('image');
        // `formData.get` returns a string when the field wasn't sent as a real file upload.
        if (!file || typeof file === 'string') {
            console.error('Image field rejected:', {
                present: formData.has('image'),
                type: typeof file,
                value: typeof file === 'string' ? file.slice(0, 100) : file,
            });
            return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
        }

        const tags = event.tags;
        const agenda = event.agenda;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload rejected:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });

        const createdEvent = await Event.create({
            ...event,
            image: (uploadResult as { secure_url: string }).secure_url,
            tags: tags,
            agenda: agenda,
        });
        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Event creation failed', error: (error as Error).message }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to fetch events', error: (error as Error).message }, { status: 500 });
    }
}
