import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    role: "admin" | "operator" | "viewer";
    department: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            match: /^USR\d{4}$/,
            description: "UserId field",
        },
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "operator", "viewer"],
            default: "viewer",
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
UserSchema.index({ userId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ department: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
