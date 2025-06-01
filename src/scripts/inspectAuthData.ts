import { MongoClient } from "mongodb";

const mongoUri =
    "mongodb://root:123456@localhost:27018/TestDB?directConnection=true&authSource=admin&replicaSet=anya-rs";

async function inspectBetterAuthData() {
    const client = new MongoClient(mongoUri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db();

        // List all collections
        const collections = await db.listCollections().toArray();
        console.log("\n📁 Collections in database:");
        collections.forEach((collection) => {
            console.log(`  - ${collection.name}`);
        });

        // Check user collection
        const userCount = await db.collection("user").countDocuments();
        console.log(`\n👥 Users in database: ${userCount}`);

        if (userCount > 0) {
            const users = await db.collection("user").find({}).toArray();
            console.log("\n👤 User data:");
            users.forEach((user) => {
                console.log(`  - ID: ${user.id || user._id}`);
                console.log(`  - Email: ${user.email}`);
                console.log(`  - Name: ${user.name}`);
                console.log(`  - Role: ${user.role}`);
                console.log(`  - Created: ${user.createdAt}`);
                console.log("  ---");
            });
        }

        // Check session collection
        const sessionCount = await db.collection("session").countDocuments();
        console.log(`\n🔐 Sessions in database: ${sessionCount}`);

        if (sessionCount > 0) {
            const sessions = await db.collection("session").find({}).toArray();
            console.log("\n📝 Session data:");
            sessions.forEach((session) => {
                console.log(`  - ID: ${session.id || session._id}`);
                console.log(`  - User ID: ${session.userId}`);
                console.log(`  - Expires: ${session.expiresAt}`);
                console.log(`  - User Agent: ${session.userAgent}`);
                console.log("  ---");
            });
        }
    } catch (error) {
        console.error("Error inspecting database:", error);
    } finally {
        await client.close();
    }
}

inspectBetterAuthData();
