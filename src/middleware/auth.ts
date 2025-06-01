import type { Context, Next } from "hono";
import { auth } from "../lib/auth";

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });

        if (session) {
            c.set("user", session.user);
            c.set("session", session.session);
        }

        await next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        await next();
    }
};

export const requireAuth = async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
        return c.json(
            {
                success: false,
                message: "Authentication required",
            },
            401
        );
    }

    await next();
};

export const requireRole = (roles: string[]) => {
    return async (c: Context, next: Next) => {
        const user = c.get("user");

        if (!user) {
            return c.json(
                {
                    success: false,
                    message: "Authentication required",
                },
                401
            );
        }

        if (!roles.includes(user.role)) {
            return c.json(
                {
                    success: false,
                    message: "Insufficient permissions",
                },
                403
            );
        }

        await next();
    };
};
