import { Hono } from "hono";
import {
    createRobot,
    deleteRobot,
    getAllRobots,
    getRobotBySerial,
    getRobotsByType,
    // RobotController,
    updateRobot,
} from "../controllers/RobotController";

const robotRoutes = new Hono();

// GET /robots - Get all robots
robotRoutes.get("/", getAllRobots);

// GET /robots/:serialNumber - Get robot by serial number
robotRoutes.get("/:serialNumber", getRobotBySerial);

// POST /robots - Create a new robot
robotRoutes.post("/", createRobot);

// PUT /robots/:serialNumber - Update robot by serial number
robotRoutes.put("/:serialNumber", updateRobot);

// DELETE /robots/:serialNumber - Delete robot by serial number
robotRoutes.delete("/:serialNumber", deleteRobot);

// GET /robots/type/:type - Get robots by type
robotRoutes.get("/type/:type", getRobotsByType);

// GET /robots/status/:status - Get robots by status
// robotRoutes.get("/status/:status", getRobotsByStatus);

// POST /robots/bulk - Bulk create robots
// robotRoutes.post("/bulk", bulkCreateRobots);

export { robotRoutes };
