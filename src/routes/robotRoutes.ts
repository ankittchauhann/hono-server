import { Hono } from "hono";
import {
    createRobot,
    deleteRobot,
    getAllRobots,
    getAllRobotsStats,
    getRobotById,
    getRobotsByType,
    streamRobots,
    streamRobotsStats,
    updateRobot,
    updateRobotUsageLevel,
} from "../controllers/RobotController";

const robotRoutes = new Hono();

// GET /robots - Get all robots
robotRoutes.get("/abc", getAllRobots);

// GET /robots/stream - Stream robots with filtering/sorting
robotRoutes.get("/", streamRobots);

// GET /robots/stats - Get all robots without pagination
// robotRoutes.get("/stats", getAllRobotsStats);

// GET /robots/stats/stream - Stream robots with filtering/sorting
robotRoutes.get("/status", streamRobotsStats);

// GET /robots/:id - Get robot by _id
robotRoutes.get("/:id", getRobotById); // <-- Update route and handler

// POST /robots - Create a new robot
robotRoutes.post("/", createRobot);

// PUT /robots/:id - Update robot by _id
robotRoutes.put("/:id", updateRobot); // <-- Update route

// PATCH /robots/update-usage-level/:id - Update robot usage level by _id
robotRoutes.patch("/update-usage-level/:id", updateRobotUsageLevel);

// DELETE /robots/:id - Delete robot by _id
robotRoutes.delete("/:id", deleteRobot); // <-- Update route

// GET /robots/type/:type - Get robots by type
robotRoutes.get("/type/:type", getRobotsByType);

export { robotRoutes };
