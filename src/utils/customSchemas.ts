import { z } from "zod";

// Custom schema for MongoDB ObjectId validation
export const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");
