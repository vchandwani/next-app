import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { Event } from "./event.model";

export interface IBooking {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BookingDocument extends IBooking, Document { }

// Lightweight email validation avoids regex backtracking concerns.
function isValidEmail(value: string): boolean {
    const trimmed = value.trim();
    const atIndex = trimmed.indexOf("@");
    if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@")) {
        return false;
    }

    const localPart = trimmed.slice(0, atIndex);
    const domainPart = trimmed.slice(atIndex + 1);
    const dotIndex = domainPart.indexOf(".");
    return localPart.length > 0 && dotIndex > 0 && dotIndex < domainPart.length - 1;
}

const bookingSchema = new Schema<BookingDocument>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (value: string) => isValidEmail(value),
                message: "Invalid email address.",
            },
        },
    },
    { timestamps: true },
);

// Speeds up lookups by event for booking queries.
bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function () {
    // Ensure the booking points to a real event before it is persisted.
    if (this.isModified("eventId")) {
        const eventExists = await Event.exists({ _id: this.eventId });
        if (!eventExists) {
            throw new Error(`Event with id "${this.eventId.toString()}" does not exist.`);
        }
    }
});

export const Booking: Model<BookingDocument> =
    (mongoose.models.Booking as Model<BookingDocument>) ||
    mongoose.model<BookingDocument>("Booking", bookingSchema);