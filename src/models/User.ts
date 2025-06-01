import {
    type RoleType,
    jwtUserProperties,
    roleTypes,
} from "../constants/config";
import { objectIdSchema } from "../utils/customSchemas";
import { generateJWTtoken } from "../utils/generateJWTtoken";
import { type Document, type ObjectId, Schema, model } from "mongoose";
import { z } from "zod";

// Zod schema for User
export const userSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
        })
        .min(3)
        .max(50),
    email: z
        .string({
            required_error: "Email is required",
        })
        .email("Please enter a valid email address.")
        .max(255),
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(6)
        .max(255),
    role: z.enum(roleTypes),
    isActive: z.boolean().default(true),
    invalid: z.boolean().optional(),
});

export const authUserSchema = userSchema.pick({ email: true, password: true });

export const updateUserSchema = userSchema
    .pick({
        name: true,
        email: true,
        isActive: true,
        role: true,
    })
    .partial();

export const resetPasswordSchema = z.object({
    authPassword: z.string().min(6).max(255),
    newPassword: z.string().min(6).max(255),
});

// MongoDB document interface for User
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: RoleType;
    isActive: boolean;
    invalid: boolean;
    generateAuthToken: () => string;
}

// Mongoose schema for User
const userMongooseSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 5,
            maxlength: 255,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            maxlength: 1024,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: roleTypes,
            default: roleTypes[0],
        },
        invalid: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
    }
);

userMongooseSchema.methods.generateAuthToken = function () {
    return generateJWTtoken(jwtUserProperties, this);
};

// Create indexes
userMongooseSchema.index({ role: 1 });
userMongooseSchema.index({ isActive: 1 });

// User model
export const User = model<IUser>("User", userMongooseSchema);
