import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://root:123456@localhost:27018/admin?directConnection=true&authSource=admin&replicaSet=anya-rs";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export const disconnectDatabase = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("MongoDB disconnection error:", error);
    }
};
