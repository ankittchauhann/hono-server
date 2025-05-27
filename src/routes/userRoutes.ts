import { Hono } from "hono";
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/UserController";
import { performanceMiddleware } from "../middleware/performance";

const userRoutes = new Hono();

// Apply performance middleware to all routes
userRoutes.use("*", performanceMiddleware);

// User routes
userRoutes.get("/", getAllUsers);
userRoutes.post("/", createUser);
userRoutes.get("/:userId", getUserById);
userRoutes.put("/:userId", updateUser);
userRoutes.delete("/:userId", deleteUser);

export default userRoutes;
