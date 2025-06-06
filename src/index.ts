import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createServer } from "node:http";
import { connectDatabase } from "./config/database";
import { routes } from "./routes";
import { auth } from "./lib/auth";
import { authMiddleware } from "./middleware/auth";
import { initializeSocket } from "./socket";

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

// Create HTTP server for Socket.IO integration
const httpServer = createServer();
const port = 5005;

// Initialize Socket.IO with HTTP server
initializeSocket(httpServer);

// Handle non-Socket.IO requests with Hono
httpServer.on("request", async (req, res) => {
    // Skip Socket.IO requests - let Socket.IO handle them
    if (req.url?.startsWith('/socket/v1/')) {
        return;
    }

    // Convert Node.js request headers to Headers object
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        }
    }

    // Create Request object for Hono
    let body: BodyInit | null = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
    }

    const request = new Request(`http://localhost:${port}${req.url}`, {
        method: req.method,
        headers,
        body,
    });

    try {
        const response = await app.fetch(request);
        
        // Check if response has already been sent
        if (res.headersSent) {
            return;
        }
        
        // Set response headers
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        
        // Set status code
        res.statusCode = response.status;
        
        // Handle streaming responses (Server-Sent Events)
        if (response.headers.get('content-type')?.includes('text/event-stream')) {
            // For SSE, we need to pipe the stream directly
            if (response.body) {
                const reader = response.body.getReader();
                
                const pump = async () => {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            res.write(value);
                        }
                        res.end();
                    } catch (error) {
                        console.error('Streaming error:', error);
                        res.end();
                    }
                };
                
                pump();
            } else {
                res.end();
            }
        } else {
            // Send response body for non-streaming responses
            if (response.body) {
                const buffer = await response.arrayBuffer();
                res.end(Buffer.from(buffer));
            } else {
                res.end();
            }
        }
    } catch (error) {
        console.error("Error handling request:", error);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.end("Internal Server Error");
        }
    }
});

httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
