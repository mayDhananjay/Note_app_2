import mongoose from "mongoose";

export const connectDb = async () => {
    mongoose.set('bufferCommands', false); // Fail fast rather than hanging
    
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("your_mongodb_connection_string")) {
        console.warn("[AI Studio] MONGO_URI is not set or is using placeholder. Running in MEMORY fallback mode.");
        global.useMemoryDb = true;
        return;
    }
    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
        });
        console.log(`[AI Studio] Mongodb connected: ${conn.connection.host}`);
        global.useMemoryDb = false;
    }
    catch (err) {
        console.warn("[AI Studio] MongoDB connection failed, running in MEMORY fallback mode:", err.message);
        global.useMemoryDb = true;
    }
}
