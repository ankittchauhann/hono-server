import { Hono } from "hono";
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    authenticateUser,
    resetPassword,
} from "../controllers/UserController";
import { performanceMiddleware } from "../middleware/performance";

const userRoutes = new Hono();

// Apply performance middleware to all routes
userRoutes.use("*", performanceMiddleware);

// User routes
userRoutes.get("/", getAllUsers);
userRoutes.post("/", createUser);
userRoutes.get("/:id", getUserById);
userRoutes.put("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

// Authentication routes
userRoutes.post("/auth", authenticateUser);
userRoutes.post("/:id/reset-password", resetPassword);

export default userRoutes;
