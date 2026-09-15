import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface EventDocument extends IEvent, Document { }

// Converts a title into a lowercase, hyphenated, URL-safe slug.
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

// Normalizes any parseable date string to a strict ISO "YYYY-MM-DD" format.
function normalizeDate(date: string): string {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        throw new TypeError(`Invalid date value: "${date}"`);
    }
    return parsed.toISOString().split("T")[0];
}

// Normalizes 12-hour ("5:30 PM") or 24-hour ("17:30") input to 24-hour "HH:MM".
function normalizeTime(time: string): string {
    const trimmed = time.trim();

    const twentyFourHourPattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (twentyFourHourPattern.test(trimmed)) {
        return trimmed;
    }

    const twelveHourPattern = /^(\d{1,2}):([0-5]\d)\s*(AM|PM)$/i;
    const match = twelveHourPattern.exec(trimmed);
    if (!match) {
        throw new TypeError(`Invalid time value: "${time}"`);
    }

    const [, hoursRaw, minutes, meridiem] = match;
    let hours = Number.parseInt(hoursRaw, 10);
    const isPM = meridiem.toUpperCase() === "PM";
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Shared validator ensuring a string field is non-empty once trimmed.
const nonEmptyStringValidator = {
    validator: (value: string) => value.trim().length > 0,
    message: "Value cannot be empty.",
};

// Shared validator ensuring an array field has at least one element.
const nonEmptyArrayValidator = {
    validator: (value: string[]) => Array.isArray(value) && value.length > 0,
    message: "At least one value is required.",
};

const eventSchema = new Schema<EventDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        slug: {
            type: String,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        overview: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        image: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        venue: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        location: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        date: {
            type: String,
            required: true,
            trim: true,
        },
        time: {
            type: String,
            required: true,
            trim: true,
        },
        mode: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        audience: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        agenda: {
            type: [String],
            required: true,
            validate: nonEmptyArrayValidator,
        },
        organizer: {
            type: String,
            required: true,
            trim: true,
            validate: nonEmptyStringValidator,
        },
        tags: {
            type: [String],
            required: true,
            validate: nonEmptyArrayValidator,
        },
    },
    { timestamps: true },
);

eventSchema.index({ slug: 1 }, { unique: true });

eventSchema.pre("save", function (next) {
    try {
        // Only regenerate the slug when the title is new or has changed.
        if (this.isModified("title")) {
            this.slug = generateSlug(this.title);
        }

        this.date = normalizeDate(this.date);
        this.time = normalizeTime(this.time);

        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error(String(error)));
    }
});

export const Event: Model<EventDocument> =
    (mongoose.models.Event as Model<EventDocument>) ||
    mongoose.model<EventDocument>("Event", eventSchema);
