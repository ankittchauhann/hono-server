import type { jwtUserProperties } from "../constants/config";

// Simple JWT token generation (for demo purposes)
// In production, you'd use a proper JWT library like jsonwebtoken
export const generateJWTtoken = (
    properties: typeof jwtUserProperties,
    user: Record<string, unknown>
): string => {
    // This is a simplified implementation for demo purposes
    // In production, use a proper JWT library with signing
    const payload = {
        id: user[properties.id],
        name: user[properties.name],
        email: user[properties.email],
        role: user[properties.role],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    // In production, use proper JWT signing
    return Buffer.from(JSON.stringify(payload)).toString("base64");
};
