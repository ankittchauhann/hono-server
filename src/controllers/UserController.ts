import type { Context } from "hono";
import {
    User,
    userSchema,
    updateUserSchema,
    authUserSchema,
    resetPasswordSchema,
} from "../models/User";
import { buildQuery } from "../utils/queryParser";

// Get all users with filtering, sorting, pagination
export const getAllUsers = async (c: Context) => {
    try {
        const {
            query: filter,
            options,
            pagination,
        } = buildQuery(c.req.query(), [
            "name",
            "email",
            "role",
            "isActive",
            "invalid",
            "createdBy",
            "updatedBy",
            "createdAt",
            "updatedAt",
        ]);

        const users = await User.find(filter)
            .sort(options.sort)
            .limit(pagination.limit)
            .skip(pagination.skip)
            .select(options.select)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .lean();

        const totalCount = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return c.json({
            success: true,
            data: users,
            pagination: {
                currentPage: pagination.page,
                totalPages,
                totalCount,
                limit: pagination.limit,
                hasNext: pagination.page < totalPages,
                hasPrev: pagination.page > 1,
            },
            count: users.length,
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return c.json(
            {
                success: false,
                error: "Failed to fetch users",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
};

// Get user by ID
export const getUserById = async (c: Context) => {
    try {
        const id = c.req.param("id");

        const user = await User.findById(id)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .lean();

        if (!user) {
            return c.json(
                {
                    success: false,
                    error: "User not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error in getUserById:", error);
        return c.json(
            {
                success: false,
                error: "Failed to fetch user",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
};

// Create new user
export const createUser = async (c: Context) => {
    try {
        const userData = await c.req.json();

        // Validate with zod schema
        const validatedData = userSchema.parse(userData);

        const user = new User(validatedData);
        await user.save();

        // Generate auth token
        const token = user.generateAuthToken();

        // Remove password from response
        const { password, ...userResponse } = user.toObject();

        return c.json(
            {
                success: true,
                data: {
                    user: userResponse,
                    token,
                },
                message: "User created successfully",
            },
            201
        );
    } catch (error) {
        console.error("Error in createUser:", error);

        if (error instanceof Error && error.message.includes("duplicate key")) {
            return c.json(
                {
                    success: false,
                    error: "User with this email already exists",
                },
                409
            );
        }

        // Handle zod validation errors
        if (error instanceof Error && error.name === "ZodError") {
            return c.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: JSON.parse(error.message),
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                error: "Failed to create user",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            400
        );
    }
};

// Update user
export const updateUser = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const requestData = await c.req.json();

        // Validate with update schema
        const validatedData = updateUserSchema.parse(requestData);

        const user = await User.findByIdAndUpdate(id, validatedData, {
            new: true,
            runValidators: true,
        })
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email")
            .lean();

        if (!user) {
            return c.json(
                {
                    success: false,
                    error: "User not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            data: user,
            message: "User updated successfully",
        });
    } catch (error) {
        console.error("Error in updateUser:", error);

        // Handle zod validation errors
        if (error instanceof Error && error.name === "ZodError") {
            return c.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: JSON.parse(error.message),
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                error: "Failed to update user",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            400
        );
    }
};

// Delete user
export const deleteUser = async (c: Context) => {
    try {
        const id = c.req.param("id");

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return c.json(
                {
                    success: false,
                    error: "User not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        return c.json(
            {
                success: false,
                error: "Failed to delete user",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
};

// Authenticate user
export const authenticateUser = async (c: Context) => {
    try {
        const authData = await c.req.json();

        // Validate with auth schema
        const validatedData = authUserSchema.parse(authData);

        const user = await User.findOne({ email: validatedData.email });

        if (!user) {
            return c.json(
                {
                    success: false,
                    error: "Invalid email or password",
                },
                401
            );
        }

        // In production, use proper password hashing comparison (bcrypt)
        if (user.password !== validatedData.password) {
            return c.json(
                {
                    success: false,
                    error: "Invalid email or password",
                },
                401
            );
        }

        if (!user.isActive) {
            return c.json(
                {
                    success: false,
                    error: "Account is deactivated",
                },
                403
            );
        }

        // Generate auth token
        const token = user.generateAuthToken();

        // Remove password from response
        const { password, ...userResponse } = user.toObject();

        return c.json({
            success: true,
            data: {
                user: userResponse,
                token,
            },
            message: "Authentication successful",
        });
    } catch (error) {
        console.error("Error in authenticateUser:", error);

        // Handle zod validation errors
        if (error instanceof Error && error.name === "ZodError") {
            return c.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: JSON.parse(error.message),
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                error: "Authentication failed",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
};

// Reset password
export const resetPassword = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const passwordData = await c.req.json();

        // Validate with reset password schema
        const validatedData = resetPasswordSchema.parse(passwordData);

        const user = await User.findById(id);

        if (!user) {
            return c.json(
                {
                    success: false,
                    error: "User not found",
                },
                404
            );
        }

        // In production, use proper password hashing comparison (bcrypt)
        if (user.password !== validatedData.authPassword) {
            return c.json(
                {
                    success: false,
                    error: "Current password is incorrect",
                },
                401
            );
        }

        // Update password (in production, hash the new password)
        user.password = validatedData.newPassword;
        await user.save();

        return c.json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error in resetPassword:", error);

        // Handle zod validation errors
        if (error instanceof Error && error.name === "ZodError") {
            return c.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: JSON.parse(error.message),
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                error: "Failed to reset password",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
};
