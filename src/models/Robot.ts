import mongoose, { type Document, Schema } from "mongoose";

export interface IRobot extends Document {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    manufacturer: string;
    location: string;
    batteryCharge: number;
    status: "active" | "inactive" | "charging" | "error";
    connectivity: boolean;
    emergencyStop: boolean;
    softwareStatus: 0 | 1 | 2 | 3;
    hardwareStatus: 0 | 1 | 2 | 3;
    batteryStatus: 0 | 1 | 2 | 3;
    networkStatus: 0 | 1 | 2 | 3;
    createdAt: Date;
    updatedAt: Date;
}

const robotSchema: Schema<IRobot> = new Schema(
    {
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["TUGGER", "CONVEYOR", "FORKLIFT"],
        },
        manufacturer: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        batteryCharge: {
            type: Number,
            required: true,
            min: [0, "Battery charge cannot be negative"],
            max: [100, "Battery charge cannot exceed 100%"],
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inactive", "charging", "error"],
        },
        connectivity: {
            type: Boolean,
            required: true,
        },
        emergencyStop: {
            type: Boolean,
            required: true,
            default: false,
        },
        softwareStatus: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3],
            default: 0,
        },
        hardwareStatus: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3],
            default: 0,
        },
        batteryStatus: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3],
            default: 0,
        },
        networkStatus: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3],
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Robot = mongoose.model<IRobot>("Robot", robotSchema);
