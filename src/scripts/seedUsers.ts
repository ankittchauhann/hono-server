import { connectDatabase, disconnectDatabase } from "../config/database";
import { User } from "../models/User";

const sampleUsers = [
    // System admin user (root user)
    {
        name: "System Administrator",
        email: "admin@robotmanagement.com",
        password: "admin123",
        role: "admin",
        isActive: true,
    },
    // Regular users
    {
        name: "John Smith",
        email: "john.smith@company.com",
        password: "password123",
        role: "user",
        isActive: true,
    },
    {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        password: "password123",
        role: "operator",
        isActive: true,
    },
    {
        name: "Mike Wilson",
        email: "mike.wilson@company.com",
        password: "password123",
        role: "viewer",
        isActive: true,
    },
    {
        name: "Emma Davis",
        email: "emma.davis@company.com",
        password: "password123",
        role: "user",
        isActive: true,
    },
    {
        name: "David Brown",
        email: "david.brown@company.com",
        password: "password123",
        role: "operator",
        isActive: true,
    },
    {
        name: "Lisa Garcia",
        email: "lisa.garcia@company.com",
        password: "password123",
        role: "admin",
        isActive: true,
    },
    {
        name: "Robert Taylor",
        email: "robert.taylor@company.com",
        password: "password123",
        role: "viewer",
        isActive: true,
    },
    {
        name: "Jennifer Martinez",
        email: "jennifer.martinez@company.com",
        password: "password123",
        role: "user",
        isActive: true,
    },
    {
        name: "Christopher Lee",
        email: "christopher.lee@company.com",
        password: "password123",
        role: "operator",
        isActive: false, // Inactive user for testing
    },
    {
        name: "Amanda White",
        email: "amanda.white@company.com",
        password: "password123",
        role: "user",
        isActive: true,
    },
    {
        name: "Kevin Anderson",
        email: "kevin.anderson@company.com",
        password: "password123",
        role: "viewer",
        isActive: true,
    },
    {
        name: "Michelle Thompson",
        email: "michelle.thompson@company.com",
        password: "password123",
        role: "admin",
        isActive: true,
    },
    {
        name: "Daniel Jackson",
        email: "daniel.jackson@company.com",
        password: "password123",
        role: "user",
        isActive: true,
    },
    {
        name: "Rachel Clark",
        email: "rachel.clark@company.com",
        password: "password123",
        role: "operator",
        isActive: true,
    },
];

const seedUsers = async () => {
    try {
        await connectDatabase();

        // Clear existing users
        await User.deleteMany({});
        console.log("Cleared existing users");

        // Create admin user first to use as createdBy for others
        const adminUser = new User(sampleUsers[0]);
        await adminUser.save();
        console.log("Created admin user");

        // Create remaining users with admin as createdBy
        const remainingUsers = sampleUsers.slice(1).map((user) => ({
            ...user,
            createdBy: adminUser._id,
        }));

        const users = await User.insertMany(remainingUsers);
        console.log(`Inserted ${users.length + 1} users (including admin)`);

        // Show role distribution
        const roleCounts = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 },
                },
            },
        ]);
        console.log("Role distribution:", roleCounts);

        // Show active/inactive distribution
        const activeCounts = await User.aggregate([
            {
                $group: {
                    _id: "$isActive",
                    count: { $sum: 1 },
                },
            },
        ]);
        console.log("Active status distribution:", activeCounts);

        console.log("User database seeded successfully!");
        console.log("Admin credentials: admin@robotmanagement.com / admin123");
    } catch (error) {
        console.error("Error seeding user database:", error);
    } finally {
        await disconnectDatabase();
    }
};

// Run the seed function
seedUsers();
