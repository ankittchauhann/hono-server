import mongoose, { type Document, Schema } from "mongoose";

export interface IRobot extends Document {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    manufacturer: string;
    location: string;
    charge: number;
    status: "ACTIVE" | "INACTIVE" | "CHARGING" | "ERROR";
    connectivity: boolean;
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
        charge: {
            type: Number,
            required: true,
            min: [0, "Charge cannot be negative"],
            max: [100, "Charge cannot exceed 100%"],
        },
        status: {
            type: String,
            required: true,
            enum: ["ACTIVE", "INACTIVE", "CHARGING", "ERROR"],
        },
        connectivity: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Robot = mongoose.model<IRobot>("Robot", robotSchema);
