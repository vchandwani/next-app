import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';

// Extend Global interface to declare the global mongoose cache cleanly
declare global {
    /* eslint-disable-next-line no-var */
    var mongoose: {
        conn: unknown;
        promise: Promise<unknown> | null;
    } | undefined;
}

vi.mock('mongoose', () => ({
    default: {
        connect: vi.fn(),
    },
}));

describe('connectDB', () => {
    beforeEach(() => {
        // Clear mocks and module cache to allow process.env changes to be read
        vi.clearAllMocks();
        vi.resetModules();

        // Reset the global cache object
        delete global.mongoose;
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('should throw an error if MONGODB_URI environment variable is missing', async () => {
        // Ensure environment variable is empty
        vi.stubEnv('MONGODB_URI', '');

        // Use dynamic import to evaluate top-level variables (const MONGODB_URI = ...)
        const connectDB = (await import('./mongodb')).default;

        await expect(connectDB()).rejects.toThrow(
            'Please define the MONGODB_URI environment variable inside .env.local'
        );
    });

    it('should successfully establish a new connection and cache it', async () => {
        vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/testdb');
        const connectDB = (await import('./mongodb')).default;

        const mockConnection = { connections: [{ readyState: 1 }] };
        vi.mocked(mongoose.connect).mockResolvedValueOnce(mockConnection as unknown as typeof mongoose);

        const conn = await connectDB();

        expect(mongoose.connect).toHaveBeenCalledTimes(1);
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb', {
            bufferCommands: false,
        });

        // Validate it returns the connection and stores it in the global cache
        expect(conn).toEqual(mockConnection);
        expect(global.mongoose?.conn).toEqual(mockConnection);
    });

    it('should return the cached connection if one already exists', async () => {
        vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/testdb');
        const mockCachedConnection = { connections: [{ readyState: 1 }] };

        // Pre-populate the global cache simulating an existing connection
        global.mongoose = {
            conn: mockCachedConnection,
            promise: Promise.resolve(mockCachedConnection),
        };

        const connectDB = (await import('./mongodb')).default;
        const conn = await connectDB();

        // Ensure mongoose.connect is skipped
        expect(mongoose.connect).not.toHaveBeenCalled();
        expect(conn).toEqual(mockCachedConnection);
    });

    it('should return the existing promise if a connection is currently establishing', async () => {
        vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/testdb');

        const mockConnection = { connections: [{ readyState: 1 }] };
        const mockPromise = Promise.resolve(mockConnection);

        // Pre-populate only the promise simulating a connection in progress
        global.mongoose = {
            conn: null,
            promise: mockPromise,
        };

        const connectDB = (await import('./mongodb')).default;
        const conn = await connectDB();

        expect(mongoose.connect).not.toHaveBeenCalled();
        expect(conn).toEqual(mockConnection);
        expect(global.mongoose?.conn).toEqual(mockConnection);
    });

    it('should reset the promise to null if the connection fails', async () => {
        vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/testdb');
        const connectDB = (await import('./mongodb')).default;

        const dbError = new Error('Database connection failed');
        vi.mocked(mongoose.connect).mockRejectedValueOnce(dbError);

        await expect(connectDB()).rejects.toThrow('Database connection failed');

        // Ensure the promise is wiped so subsequent calls can retry
        expect(global.mongoose?.promise).toBeNull();
    });
});