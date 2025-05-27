import { Hono } from "hono";
import { UserController } from "../controllers/UserController";
import { performanceMiddleware } from "../middleware/performance";

const userRoutes = new Hono();

// Apply performance middleware to all routes
userRoutes.use("*", performanceMiddleware);

// User routes
userRoutes.get("/", UserController.getAllUsers);
userRoutes.post("/", UserController.createUser);
userRoutes.get("/:userId", UserController.getUserById);
userRoutes.put("/:userId", UserController.updateUser);
userRoutes.delete("/:userId", UserController.deleteUser);

export default userRoutes;
