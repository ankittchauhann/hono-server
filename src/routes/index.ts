import { Hono } from "hono";
import { robotRoutes } from "./robotRoutes";
import userRoutes from "./userRoutes";
import { requireAuth } from "../middleware/auth";

const routes = new Hono();

// Mount robot routes
routes.route("/robots", robotRoutes);

// Mount user routes (legacy - consider migrating to better-auth)
routes.route("/users", userRoutes);

// Test protected endpoint
routes.get("/protected", requireAuth, (c) => {
    const user = c.get("user") as any; // Type assertion for demo
    return c.json({
        success: true,
        message: "Access granted to protected resource",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

// Note: Better-auth routes are handled directly in index.ts

export { routes };
