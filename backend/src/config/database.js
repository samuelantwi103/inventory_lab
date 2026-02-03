import mongoose from 'mongoose';

/**
 * Database Configuration
 * Handles MongoDB connection with proper error handling
 */
class DatabaseConfig {
  /**
   * Connect to MongoDB database
   */
  static async connect() {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Disconnect from MongoDB database
   */
  static async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('✅ MongoDB Disconnected');
    } catch (error) {
      console.error(`❌ MongoDB Disconnection Error: ${error.message}`);
    }
  }
}

export default DatabaseConfig;
