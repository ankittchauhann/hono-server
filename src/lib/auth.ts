import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Create MongoDB client and get database using the same connection as the main app
const mongoUri =
    process.env.MONGODB_URI ||
    "mongodb://root:123456@localhost:27018/TestDB?directConnection=true&authSource=admin&replicaSet=anya-rs";
const client = new MongoClient(mongoUri);
const db = client.db(); // Get the database from the client

// Connect to MongoDB
async function connectMongoDB() {
    try {
        await client.connect();
        console.log("Better Auth MongoDB client connected");
    } catch (error) {
        console.error("Better Auth MongoDB connection error:", error);
    }
}

// Initialize connection
connectMongoDB();

export const auth = betterAuth({
    secret:
        process.env.BETTER_AUTH_SECRET ||
        "demo-secret-key-change-in-production",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5005",
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
            },
            isActive: {
                type: "boolean",
                required: false,
                defaultValue: true,
            },
        },
    },
    trustedOrigins: ["http://localhost:5005"],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
