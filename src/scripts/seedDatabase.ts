import { connectDatabase, disconnectDatabase } from "../config/database";
import { Robot } from "../models/Robot";

const sampleRobots = [
    {
        serialNumber: "AR001",
        type: "TUGGER",
        location: "Waypoint 1",
        charge: "85%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR002",
        type: "CONVEYOR",
        location: "Waypoint 3",
        charge: "45%",
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR003",
        type: "FORKLIFT",
        location: "Waypoint 2",
        charge: "92%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR004",
        type: "TUGGER",
        location: "Waypoint 5",
        charge: "12%",
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR005",
        type: "CONVEYOR",
        location: "Waypoint 4",
        charge: "78%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR006",
        type: "FORKLIFT",
        location: "Waypoint 6",
        charge: "23%",
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR007",
        type: "TUGGER",
        location: "Waypoint 7",
        charge: "67%",
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR008",
        type: "CONVEYOR",
        location: "Waypoint 8",
        charge: "3%",
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
];

const seedDatabase = async () => {
    try {
        await connectDatabase();

        // Clear existing robots
        await Robot.deleteMany({});
        console.log("Cleared existing robots");

        // Insert sample robots
        const robots = await Robot.insertMany(sampleRobots);
        console.log(`Inserted ${robots.length} robots`);

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await disconnectDatabase();
    }
};

// Run the seed function
seedDatabase();
