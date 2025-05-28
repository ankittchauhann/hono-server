import mongoose, { type Document, Schema } from "mongoose";

export interface IRobot extends Document {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    location: string;
    charge: number;
    status: "ACTIVE" | "INACTIVE" | "CHARGING" | "ERROR";
    connectivity: "CONNECTED" | "DISCONNECTED";
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
            type: String,
            required: true,
            enum: ["CONNECTED", "DISCONNECTED"],
        },
    },
    {
        timestamps: true,
    }
);

export const Robot = mongoose.model<IRobot>("Robot", robotSchema);
