import type { Context, Next } from "hono";

export const performanceMiddleware = async (c: Context, next: Next) => {
    const start = Date.now();

    await next();

    const duration = Date.now() - start;

    // Add performance headers
    c.header("X-Response-Time", `${duration}ms`);

    // Log slow queries (> 100ms)
    if (duration > 100) {
        console.warn(
            `Slow query detected: ${c.req.method} ${c.req.url} took ${duration}ms`
        );
    }

    // Log query info for analytics
    if (c.req.method === "GET" && c.req.url.includes("/api/robots?")) {
        const queryParams = Object.keys(c.req.query()).length;
        console.log(`Query executed: ${queryParams} parameters, ${duration}ms`);
    }
};
