// testMongoConnection.ts

import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://projectUser:ConnectTrueDbProject@project-playground.nfrzo.mongodb.net/?retryWrites=true&w=majority"
);

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    const db = client.db('Warehouse');
    const collection = db.collection('Inventory');
    const inventory = await collection.find({}).toArray();
    console.log(inventory);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
  }
}

testConnection();
