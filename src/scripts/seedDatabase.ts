import { connectDatabase, disconnectDatabase } from "../config/database";
import { Robot } from "../models/Robot";

const sampleRobots = [
    // Robots 1-10
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
        status: "ERROR",
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
        status: "ERROR",
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

    // Robots 11-20
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
        status: "ERROR",
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

    // Robots 21-30
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
        status: "ERROR",
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
    {
        serialNumber: "AR026",
        type: "CONVEYOR",
        location: "Waypoint 26",
        charge: 47,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR027",
        type: "FORKLIFT",
        location: "Waypoint 27",
        charge: 91,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR028",
        type: "TUGGER",
        location: "Waypoint 28",
        charge: 15,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR029",
        type: "CONVEYOR",
        location: "Waypoint 29",
        charge: 76,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR030",
        type: "FORKLIFT",
        location: "Waypoint 30",
        charge: 33,
        status: "ERROR",
        connectivity: "DISCONNECTED",
    },

    // Robots 31-40
    {
        serialNumber: "AR031",
        type: "TUGGER",
        location: "Waypoint 31",
        charge: 69,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR032",
        type: "CONVEYOR",
        location: "Waypoint 32",
        charge: 52,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR033",
        type: "FORKLIFT",
        location: "Waypoint 33",
        charge: 84,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR034",
        type: "TUGGER",
        location: "Waypoint 34",
        charge: 19,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR035",
        type: "CONVEYOR",
        location: "Waypoint 35",
        charge: 75,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR036",
        type: "FORKLIFT",
        location: "Waypoint 36",
        charge: 42,
        status: "ERROR",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR037",
        type: "TUGGER",
        location: "Waypoint 37",
        charge: 87,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR038",
        type: "CONVEYOR",
        location: "Waypoint 38",
        charge: 26,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR039",
        type: "FORKLIFT",
        location: "Waypoint 39",
        charge: 63,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR040",
        type: "TUGGER",
        location: "Waypoint 40",
        charge: 11,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },

    // Robots 41-50
    {
        serialNumber: "AR041",
        type: "CONVEYOR",
        location: "Waypoint 41",
        charge: 89,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR042",
        type: "FORKLIFT",
        location: "Waypoint 42",
        charge: 37,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR043",
        type: "TUGGER",
        location: "Waypoint 43",
        charge: 71,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR044",
        type: "CONVEYOR",
        location: "Waypoint 44",
        charge: 14,
        status: "ERROR",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR045",
        type: "FORKLIFT",
        location: "Waypoint 45",
        charge: 93,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR046",
        type: "TUGGER",
        location: "Waypoint 46",
        charge: 48,
        status: "CHARGING",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR047",
        type: "CONVEYOR",
        location: "Waypoint 47",
        charge: 77,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR048",
        type: "FORKLIFT",
        location: "Waypoint 48",
        charge: 24,
        status: "INACTIVE",
        connectivity: "DISCONNECTED",
    },
    {
        serialNumber: "AR049",
        type: "TUGGER",
        location: "Waypoint 49",
        charge: 86,
        status: "ACTIVE",
        connectivity: "CONNECTED",
    },
    {
        serialNumber: "AR050",
        type: "CONVEYOR",
        location: "Waypoint 50",
        charge: 55,
        status: "ERROR",
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

        // Show status distribution
        const statusCounts = await Robot.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        console.log("Status distribution:", statusCounts);

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await disconnectDatabase();
    }
};

// Run the seed function
seedDatabase();
