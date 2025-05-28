import { connectDatabase, disconnectDatabase } from "../config/database";
import { Robot } from "../models/Robot";

const sampleRobots = [
    {
        serialNumber: "AR001",
        type: "TUGGER",
        location: "Waypoint 1",
        charge: 85,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR002",
        type: "CONVEYOR",
        location: "Waypoint 3",
        charge: 45,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR003",
        type: "FORKLIFT",
        location: "Waypoint 2",
        charge: 92,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR004",
        type: "TUGGER",
        location: "Waypoint 5",
        charge: 12,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR005",
        type: "CONVEYOR",
        location: "Waypoint 4",
        charge: 78,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR006",
        type: "FORKLIFT",
        location: "Waypoint 6",
        charge: 23,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR007",
        type: "TUGGER",
        location: "Waypoint 7",
        charge: 67,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR008",
        type: "CONVEYOR",
        location: "Waypoint 8",
        charge: 3,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR009",
        type: "FORKLIFT",
        location: "Waypoint 9",
        charge: 56,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR010",
        type: "TUGGER",
        location: "Waypoint 10",
        charge: 34,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR011",
        type: "CONVEYOR",
        location: "Waypoint 11",
        charge: 88,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR012",
        type: "FORKLIFT",
        location: "Waypoint 12",
        charge: 41,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR013",
        type: "TUGGER",
        location: "Waypoint 13",
        charge: 95,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR014",
        type: "CONVEYOR",
        location: "Waypoint 14",
        charge: 29,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR015",
        type: "FORKLIFT",
        location: "Waypoint 15",
        charge: 61,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR016",
        type: "TUGGER",
        location: "Waypoint 16",
        charge: 17,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR017",
        type: "CONVEYOR",
        location: "Waypoint 17",
        charge: 80,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR018",
        type: "FORKLIFT",
        location: "Waypoint 18",
        charge: 54,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR019",
        type: "TUGGER",
        location: "Waypoint 19",
        charge: 73,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR020",
        type: "CONVEYOR",
        location: "Waypoint 20",
        charge: 8,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR021",
        type: "FORKLIFT",
        location: "Waypoint 21",
        charge: 66,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR022",
        type: "TUGGER",
        location: "Waypoint 22",
        charge: 39,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR023",
        type: "CONVEYOR",
        location: "Waypoint 23",
        charge: 90,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR024",
        type: "FORKLIFT",
        location: "Waypoint 24",
        charge: 21,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR025",
        type: "TUGGER",
        location: "Waypoint 25",
        charge: 82,
        status: "ACTIVE",
        connectivity: "CONNECTED",
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
