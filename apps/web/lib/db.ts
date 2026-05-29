import mongoose from "mongoose"

// 1. Declare a variable to hold the cached connection
// In TypeScript, we extend the global object to cache the connection in development mode.
declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

// 2. Get the connection string from the environment
const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

// 3. Initialize the cache object
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Global database connection singleton.
 * Prevents Next.js from creating thousands of DB connections during hot-reloads in development.
 */
export async function connectToDatabase() {
  // If we already have a successful connection, return it immediately
  if (cached.conn) {
    return cached.conn
  }

  // If a connection is currently being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "PhBarExams", // Explicitly specify the database name
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection
    })
  }
  
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
