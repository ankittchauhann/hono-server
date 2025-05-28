import { Hono } from "hono";
import {
    createRobot,
    deleteRobot,
    getAllRobots,
    getRobotById,
    getRobotsByType,
    updateRobot,
} from "../controllers/RobotController";

const robotRoutes = new Hono();

// GET /robots - Get all robots
robotRoutes.get("/", getAllRobots);

// GET /robots/:id - Get robot by _id
robotRoutes.get("/:id", getRobotById); // <-- Update route and handler

// POST /robots - Create a new robot
robotRoutes.post("/", createRobot);

// PUT /robots/:id - Update robot by _id
robotRoutes.put("/:id", updateRobot); // <-- Update route

// DELETE /robots/:id - Delete robot by _id
robotRoutes.delete("/:id", deleteRobot); // <-- Update route

// GET /robots/type/:type - Get robots by type
robotRoutes.get("/type/:type", getRobotsByType);

export { robotRoutes };
