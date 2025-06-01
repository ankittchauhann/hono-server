import { Hono } from "hono";
import type { Context } from "hono";
import { auth } from "../lib/auth";
import { requireAuth } from "../middleware/auth";
import { z } from "zod";

const authRoutes = new Hono();

// Registration schema
const registerSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(255),
    role: z.enum(["user", "admin", "operator", "viewer"]).default("user"),
});

// Sign up endpoint
authRoutes.post("/signup", async (c: Context) => {
    try {
        const body = await c.req.json();
        const validatedData = registerSchema.parse(body);

        const result = await auth.api.signUpEmail({
            body: {
                email: validatedData.email,
                password: validatedData.password,
                name: validatedData.name,
                role: validatedData.role,
            },
            headers: c.req.raw.headers,
        });

        if (result.error) {
            return c.json(
                {
                    success: false,
                    message: result.error.message,
                },
                400
            );
        }

        return c.json(
            {
                success: true,
                data: {
                    user: result.data.user,
                    session: result.data.session,
                },
                message: "User registered successfully",
            },
            201
        );
    } catch (error) {
        console.error("Signup error:", error);

        if (error instanceof Error && error.name === "ZodError") {
            return c.json(
                {
                    success: false,
                    message: "Validation failed",
                    details: JSON.parse(error.message),
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                message: "Registration failed",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
});

// Sign in endpoint
authRoutes.post("/signin", async (c: Context) => {
    try {
        const body = await c.req.json();

        const result = await auth.api.signInEmail({
            body: {
                email: body.email,
                password: body.password,
            },
            headers: c.req.raw.headers,
        });

        if (result.error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid email or password",
                },
                401
            );
        }

        return c.json({
            success: true,
            data: {
                user: result.data.user,
                session: result.data.session,
            },
            message: "Authentication successful",
        });
    } catch (error) {
        console.error("Signin error:", error);
        return c.json(
            {
                success: false,
                message: "Authentication failed",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
});

// Sign out endpoint
authRoutes.post("/signout", requireAuth, async (c: Context) => {
    try {
        const result = await auth.api.signOut({
            headers: c.req.raw.headers,
        });

        if (result.error) {
            return c.json(
                {
                    success: false,
                    message: result.error.message,
                },
                400
            );
        }

        return c.json({
            success: true,
            message: "Signed out successfully",
        });
    } catch (error) {
        console.error("Signout error:", error);
        return c.json(
            {
                success: false,
                message: "Sign out failed",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
});

// Get current session
authRoutes.get("/session", async (c: Context) => {
    try {
        const result = await auth.api.getSession({
            headers: c.req.raw.headers,
        });

        if (!result || !result.user) {
            return c.json(
                {
                    success: false,
                    message: "No active session",
                },
                401
            );
        }

        return c.json({
            success: true,
            data: {
                user: result.user,
                session: result.session,
            },
        });
    } catch (error) {
        console.error("Session error:", error);
        return c.json(
            {
                success: false,
                message: "Failed to get session",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
});

// Change password endpoint
authRoutes.post("/change-password", requireAuth, async (c: Context) => {
    try {
        const body = await c.req.json();
        const user = c.get("user");

        const result = await auth.api.changePassword({
            body: {
                newPassword: body.newPassword,
                currentPassword: body.currentPassword,
            },
            headers: c.req.raw.headers,
        });

        if (result.error) {
            return c.json(
                {
                    success: false,
                    message: result.error.message,
                },
                400
            );
        }

        return c.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        return c.json(
            {
                success: false,
                message: "Failed to change password",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
});

export { authRoutes };
