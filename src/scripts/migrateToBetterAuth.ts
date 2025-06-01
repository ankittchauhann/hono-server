import mongoose from "mongoose";
import { connectDatabase } from "../config/database";
import { User } from "../models/User";

const migrateToBetterAuth = async () => {
    try {
        await connectDatabase();
        console.log("Connected to database for migration...");

        // Get all existing users
        const existingUsers = await User.find({});
        console.log(`Found ${existingUsers.length} existing users to migrate`);

        // Create better-auth collections if they don't exist
        const db = mongoose.connection.db;

        // Create user collection for better-auth
        const userCollection = db.collection("user");
        const sessionCollection = db.collection("session");

        // Migrate users to better-auth format
        for (const user of existingUsers) {
            const betterAuthUser = {
                id: user._id.toString(),
                email: user.email,
                emailVerified: false, // Set based on your requirements
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                createdBy: user.createdBy?.toString(),
                updatedBy: user.updatedBy?.toString(),
                invalid: user.invalid || false,
                createdAt: user.createdAt || new Date(),
                updatedAt: user.updatedAt || new Date(),
            };

            // Create account record for email/password auth
            const accountRecord = {
                id: new mongoose.Types.ObjectId().toString(),
                userId: user._id.toString(),
                accountId: user.email,
                providerId: "credential",
                accessToken: null,
                refreshToken: null,
                expiresAt: null,
                password: user.password, // In production, this should be hashed
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            try {
                // Insert into better-auth user collection
                await userCollection.updateOne(
                    { id: user._id.toString() },
                    { $set: betterAuthUser },
                    { upsert: true }
                );

                // Insert into account collection
                await db
                    .collection("account")
                    .updateOne(
                        {
                            userId: user._id.toString(),
                            providerId: "credential",
                        },
                        { $set: accountRecord },
                        { upsert: true }
                    );

                console.log(`Migrated user: ${user.email}`);
            } catch (error) {
                console.error(`Error migrating user ${user.email}:`, error);
            }
        }

        console.log("Migration completed successfully!");
        console.log("You can now use the new better-auth endpoints:");
        console.log("- POST /api/auth/signup");
        console.log("- POST /api/auth/signin");
        console.log("- POST /api/auth/signout");
        console.log("- GET /api/auth/session");
        console.log("- POST /api/auth/change-password");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

// Run migration if called directly
if (import.meta.main) {
    migrateToBetterAuth();
}

export { migrateToBetterAuth };
