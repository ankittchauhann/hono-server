import type { Context } from "hono";
import { User } from "../models/User";
import { buildQuery } from "../utils/queryParser";

export class UserController {
    // Get all users with filtering, sorting, pagination
    static async getAllUsers(c: Context) {
        try {
            const {
                query: filter,
                options,
                pagination,
            } = buildQuery(c.req.query(), [
                "userId",
                "username",
                "email",
                "role",
                "department",
                "isActive",
                "createdAt",
                "updatedAt",
            ]);

            const users = await User.find(filter)
                .sort(options.sort)
                .limit(pagination.limit)
                .skip(pagination.skip)
                .select(options.select)
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
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                500
            );
        }
    }

    // Get user by userId
    static async getUserById(c: Context) {
        try {
            const userId = c.req.param("userId");

            const user = await User.findOne({ userId }).lean();

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
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                500
            );
        }
    }

    // Create new user
    static async createUser(c: Context) {
        try {
            const userData = await c.req.json();

            const user = new User(userData);
            await user.save();

            return c.json(
                {
                    success: true,
                    data: user,
                    message: "User created successfully",
                },
                201
            );
        } catch (error) {
            console.error("Error in createUser:", error);

            if (
                error instanceof Error &&
                error.message.includes("duplicate key")
            ) {
                return c.json(
                    {
                        success: false,
                        error: "User with this userId or email already exists",
                    },
                    409
                );
            }

            return c.json(
                {
                    success: false,
                    error: "Failed to create user",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                400
            );
        }
    }

    // Update user
    static async updateUser(c: Context) {
        try {
            const userId = c.req.param("userId");
            const requestData = await c.req.json();

            // Remove fields that shouldn't be updated using destructuring
            const {
                userId: _,
                createdAt,
                updatedAt,
                __v,
                _id,
                ...updateData
            } = requestData;

            const user = await User.findOneAndUpdate({ userId }, updateData, {
                new: true,
                runValidators: true,
            }).lean();

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
            return c.json(
                {
                    success: false,
                    error: "Failed to update user",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                400
            );
        }
    }

    // Delete user
    static async deleteUser(c: Context) {
        try {
            const userId = c.req.param("userId");

            const user = await User.findOneAndDelete({ userId });

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
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                500
            );
        }
    }
}
