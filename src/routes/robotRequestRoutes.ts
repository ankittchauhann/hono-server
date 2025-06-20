import { Hono } from "hono";
import { streamRobotRequestStats } from "../controllers/RobotRequestController";

const robotRequestRoutes = new Hono();

// GET /robots/stream - Stream robots with filtering/sorting
robotRequestRoutes.get("/", streamRobotRequestStats);

export { robotRequestRoutes };