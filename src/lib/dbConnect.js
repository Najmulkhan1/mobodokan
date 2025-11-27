// lib/dbConnect.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// 1. Initialize a global cache variable
let cachedClient = global.mongo;

if (!cachedClient) {
  cachedClient = global.mongo = { client: null, promise: null };
}

async function dbConnect() {
  // 2. If a client is already cached, return it immediately.
  if (cachedClient.client) {
    return cachedClient.client;
  }

  // 3. If there's no connection promise, create a new one.
  if (!cachedClient.promise) {
    const client = new MongoClient(uri);
    
    // Store the connection promise
    cachedClient.promise = client.connect().then(() => client);
  }

  // 4. Wait for the promise to resolve and store the connected client.
  cachedClient.client = await cachedClient.promise;
  
  // 5. Return the connected client.
  return cachedClient.client;
}

export default dbConnect;