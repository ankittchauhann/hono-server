import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { connectDatabase } from "./config/database";
import { routes } from "./routes";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Connect to database
connectDatabase();

// Health check endpoint
app.get("/", (c) => {
    return c.json({
        message: "Robot Management API",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.route("/api", routes);

// 404 handler
app.notFound((c) => {
    return c.json({ message: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
    console.error("Error:", err);
    return c.json(
        {
            message: "Internal Server Error",
            error: err.message,
        },
        500
    );
});

export default {
    port: 5005,
    fetch: app.fetch,
};
