const mongoose = require('mongoose');

let cachedPromise = null;

/**
 * Connect to MongoDB instance using Mongoose.
 * Reuses existing connection in serverless environments (e.g. Vercel Functions).
 * @param {string} [uri] - Optional MongoDB URI (defaults to process.env.MONGODB_URI)
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async (uri) => {
  const connectionString = uri || process.env.MONGODB_URI;

  if (!connectionString) {
    const errorMsg = 'MONGODB_URI is not defined in environment variables';
    console.error(`[Database Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  // If already connected, reuse connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If connection is in progress, await the cached promise
  if (cachedPromise) {
    return cachedPromise;
  }

  try {
    cachedPromise = mongoose.connect(connectionString, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const conn = await cachedPromise;
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    cachedPromise = null;
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnect from MongoDB instance.
 * Useful for test suites and graceful shutdown.
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    cachedPromise = null;
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('[Database] MongoDB disconnected cleanly');
    }
  } catch (error) {
    console.error(`[Database Error] Error during disconnection: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB
};

