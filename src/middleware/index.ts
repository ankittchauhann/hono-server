import type { Context, Next } from "hono";
import mongoose from "mongoose";

// Middleware to check database connection
export const checkDatabaseConnection = async (c: Context, next: Next) => {
    if (mongoose.connection.readyState !== 1) {
        return c.json(
            {
                success: false,
                error: "Database connection unavailable",
                message: "Please ensure MongoDB is running and try again",
            },
            503
        );
    }
    await next();
};

// Middleware to validate JSON payload
export const validateJSON = async (c: Context, next: Next) => {
    if (c.req.header("content-type")?.includes("application/json")) {
        try {
            await c.req.json();
        } catch (error) {
            return c.json(
                {
                    success: false,
                    error: "Invalid JSON payload",
                    message: "Please provide valid JSON data",
                },
                400
            );
        }
    }
    await next();
};

// Request timing middleware
export const requestTimer = async (c: Context, next: Next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    c.res.headers.set("X-Response-Time", `${duration}ms`);
};
