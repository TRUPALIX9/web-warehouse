// /lib/db.js
import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * globalThis.__mongooseCache is used to cache the MongoDB connection
 * across hot reloads in development. This prevents
 * creating multiple connections to the database.
 */
declare global {
  var __mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

if (!globalThis.__mongooseCache) {
  globalThis.__mongooseCache = { conn: null, promise: null };
}

const cached = globalThis.__mongooseCache;

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options: ConnectOptions = {};
    cached.promise = mongoose.connect(MONGODB_URI, options).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
