import mongoose, { Document, Schema } from "mongoose";

export interface IRobot extends Document {
    serialNumber: string;
    type: "TUGGER" | "CONVEYOR" | "FORKLIFT";
    location: string;
    charge: string;
    status: "ACTIVE" | "INACTIVE" | "CHARGING";
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
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["ACTIVE", "INACTIVE", "CHARGING"],
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
