import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { connectDatabase } from "./config/database";
import { routes } from "./routes";
import { auth } from "./lib/auth";
import { authMiddleware } from "./middleware/auth";

const app = new Hono();

// Get frontend URL from environment or use defaults
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = [
    frontendUrl,
    "http://localhost:3000", // React default
    "http://localhost:5173", // Vite default
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8080", // Vue/Webpack default
    "http://localhost:4200", // Angular default
];

// Middleware
app.use(
    "*",
    cors({
        origin: allowedOrigins,
        credentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
    })
);
app.use("*", logger());
app.use("*", authMiddleware);

// Connect to database
connectDatabase();

// Better-auth API routes
app.on(["POST", "GET"], "/api/auth/*", (c) => {
    return auth.handler(c.req.raw);
});

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
