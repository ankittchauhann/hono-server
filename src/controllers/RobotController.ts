import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { Robot, type IRobot } from "../models/Robot";
import { buildQuery, BadRequestError } from "../utils/queryParser";

let streamId = 0;

// Stream robots with filtering and sorting capabilities
export async function streamRobots(c: Context) {
    console.log('streamRobots function called');
    return streamSSE(
        c,
        async (stream) => {
            console.log('Stream callback started');
            // Handle client disconnection
            stream.onAbort(() => {
                console.log('Robot stream client disconnected');
            });

            // Continuously send filtered and sorted robot data
            while (true) {
                try {
                    const {
                        query: filter,
                        options,
                        pagination,
                    } = buildQuery(c.req.query(), [
                        "serialNumber",
                        "type",
                        "location",
                        "charge",
                        "status",
                        "connectivity",
                        "createdAt",
                        "updatedAt",
                    ]);

                    const robots = await Robot.find(filter)
                        .sort(options.sort || { createdAt: -1 })
                        .limit(pagination.limit)
                        .skip(pagination.skip)
                        .select(options.select)
                        .lean();

                    const totalCount = await Robot.countDocuments(filter);
                    const totalPages = Math.ceil(totalCount / pagination.limit);

                    await stream.writeSSE({
                        data: JSON.stringify({
                            success: true,
                            data: robots,
                            pagination: {
                                currentPage: pagination.page,
                                totalPages,
                                totalCount,
                                limit: pagination.limit,
                                hasNext: pagination.page < totalPages,
                                hasPrev: pagination.page > 1,
                            },
                            count: robots.length,
                        }),
                        event: 'robot:data',
                        id: String(streamId++),
                    });
                    
                } catch (error) {
                    console.error('Error in robot stream:', error);
                    await stream.writeSSE({
                        data: JSON.stringify({
                            success: false,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            timestamp: new Date().toISOString(),
                        }),
                        event: 'robot:error',
                        id: String(streamId++),
                    });
                }

                await stream.sleep(2000); // Send update every 2 seconds
            }
        },
        async (err, stream) => {
            console.error('Robot stream error:', err);
            await stream.writeSSE({
                data: JSON.stringify({
                    success: false,
                    error: 'Stream error occurred',
                    timestamp: new Date().toISOString(),
                }),
                event: 'error',
                id: String(streamId++),
            });
        }
    );
}

// Get all robots with advanced querying
export async function getAllRobots(c: Context) {
    try {
        const {
            query: filter,
            options,
            pagination,
        } = buildQuery(c.req.query(), [
            "serialNumber",
            "type",
            "location",
            "charge",
            "status",
            "connectivity",
            "createdAt",
            "updatedAt",
        ]);

        const robots = await Robot.find(filter)
            .sort(options.sort)
            .limit(pagination.limit)
            .skip(pagination.skip)
            .select(options.select)
            .lean();

        const totalCount = await Robot.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return c.json({
            success: true,
            data: robots,
            pagination: {
                currentPage: pagination.page,
                totalPages,
                totalCount,
                limit: pagination.limit,
                hasNext: pagination.page < totalPages,
                hasPrev: pagination.page > 1,
            },
            count: robots.length,
        });
    } catch (error) {
        console.error("Error in getAllRobots:", error);

        if (error instanceof BadRequestError) {
            return c.json(
                {
                    success: false,
                    error: error.message,
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                error: "Failed to fetch robots",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
}

// Get all robots without any query limitations
export async function getAllRobotsUnlimited(c: Context) {
    try {
        const robots = await Robot.find({}).lean();

        return c.json({
            success: true,
            data: robots,
            count: robots.length,
            message: "All robots fetched successfully (no pagination)",
        });
    } catch (error) {
        console.error("Error in getAllRobotsUnlimited:", error);
        return c.json(
            {
                success: false,
                error: "Failed to fetch all robots",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
}

// Get robot by serial number
export async function getRobotBySerial(c: Context) {
    try {
        const serialNumber = c.req.param("serialNumber");
        const robot = await Robot.findOne({ serialNumber }).lean();

        if (!robot) {
            return c.json(
                {
                    success: false,
                    error: "Robot not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            data: robot,
        });
    } catch (error) {
        console.error("Error in getRobotBySerial:", error);
        return c.json(
            {
                success: false,
                error: "Failed to fetch robot",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
}

// Create new robot
export async function createRobot(c: Context) {
    try {
        const robotData = await c.req.json();

        const robot = new Robot(robotData);
        await robot.save();

        return c.json(
            {
                success: true,
                data: robot,
                message: "Robot created successfully",
            },
            201
        );
    } catch (error) {
        console.error("Error in createRobot:", error);

        if (error instanceof Error && error.message.includes("duplicate key")) {
            return c.json(
                {
                    success: false,
                    error: "Robot with this serial number already exists",
                },
                409
            );
        }

        return c.json(
            {
                success: false,
                error: "Failed to create robot",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            400
        );
    }
}

// Update robot by serial number
export async function updateRobot(c: Context) {
    try {
        const serialNumber = c.req.param("serialNumber");
        const requestData = await c.req.json();

        // Remove fields that shouldn't be updated using destructuring
        const {
            serialNumber: _,
            createdAt,
            updatedAt,
            __v,
            _id,
            ...updateData
        } = requestData;

        const robot = await Robot.findOneAndUpdate(
            { serialNumber },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).lean();

        if (!robot) {
            return c.json(
                {
                    success: false,
                    error: "Robot not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            data: robot,
            message: "Robot updated successfully",
        });
    } catch (error) {
        console.error("Error in updateRobot:", error);
        return c.json(
            {
                success: false,
                error: "Failed to update robot",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            400
        );
    }
}

// Delete robot by serial number
export async function deleteRobot(c: Context) {
    try {
        const id = c.req.param("id");

        const robot = await Robot.findByIdAndDelete(id);

        if (!robot) {
            return c.json(
                {
                    success: false,
                    error: "Robot not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            message: "Robot deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteRobot:", error);
        return c.json(
            {
                success: false,
                error: "Failed to delete robot",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
}

// Get robots by type
export async function getRobotsByType(c: Context) {
    try {
        const type = c.req.param("type") as IRobot["type"];

        const {
            query: filter,
            options,
            pagination,
        } = buildQuery(c.req.query(), [
            "serialNumber",
            "location",
            "charge",
            "status",
            "connectivity",
            "createdAt",
            "updatedAt",
        ]);

        // Add type filter
        filter.type = type;

        const robots = await Robot.find(filter)
            .sort(options.sort)
            .limit(pagination.limit)
            .skip(pagination.skip)
            .select(options.select)
            .lean();

        const totalCount = await Robot.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / pagination.limit);

        return c.json({
            success: true,
            data: robots,
            pagination: {
                currentPage: pagination.page,
                totalPages,
                totalCount,
                limit: pagination.limit,
                hasNext: pagination.page < totalPages,
                hasPrev: pagination.page > 1,
            },
            count: robots.length,
            filter: { type },
        });
    } catch (error) {
        console.error("Error in getRobotsByType:", error);

        if (error instanceof BadRequestError) {
            return c.json(
                {
                    success: false,
                    error: error.message,
                },
                400
            );
        }

        return c.json(
            {
                success: false,
                error: "Failed to fetch robots by type",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
}

// Get robot by ID
export async function getRobotById(c: Context) {
    try {
        const id = c.req.param("id");
        const robot = await Robot.findById(id).lean();

        if (!robot) {
            return c.json(
                {
                    success: false,
                    error: "Robot not found",
                },
                404
            );
        }

        return c.json({
            success: true,
            data: robot,
        });
    } catch (error) {
        console.error("Error in getRobotById:", error);
        return c.json(
            {
                success: false,
                error: "Failed to fetch robot",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            },
            500
        );
    }
}