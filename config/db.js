const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance using Mongoose.
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

  try {
    const conn = await mongoose.connect(connectionString);
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
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
