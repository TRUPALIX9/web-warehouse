// src/lib/mongodb.ts

import { MongoClient } from 'mongodb';

// Connection URI from environment variables
const uri = process.env.MONGODB_URI || '';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export const connectToDatabase = async () => {
  // If there's already a cached client and db, return them
  if (cachedClient && cachedDb) {
    console.log('Using cached database connection');
    return { db: cachedDb, client: cachedClient };
  }

  // Otherwise, establish a new connection
  try {
    console.log('Establishing new database connection...');
    const client = new MongoClient(uri);
    await client.connect();
    
    // Use your MongoDB database name
    const db = client.db('Warehouse');  // Replace 'Warehouse' with your DB name if needed
    
    // Cache the database and client for future reuse
    cachedClient = client;
    cachedDb = db;
    
    return { db, client };  // Return the db and client objects
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database');
  }
};
