import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
}

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

// Reuse the same cache across hot reloads in development.
const globalCache = globalThis as typeof globalThis & {
    mongooseCache?: MongooseCache;
};

const cached = globalCache.mongooseCache ??= {
    conn: null,
    promise: null,
};

globalCache.mongooseCache = cached;

export default async function connectToDatabase(): Promise<Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        // Keep connection options explicit so startup behavior is predictable.
        cached.promise = mongoose
            .connect(MONGODB_URI!, {
                bufferCommands: false,
            })
            .then((instance) => instance);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}