// Role types configuration
export const roleTypes = ["user", "admin", "operator", "viewer"] as const;
export type RoleType = (typeof roleTypes)[number];

// JWT configuration
export const jwtUserProperties = {
    id: "_id",
    name: "name",
    email: "email",
    role: "role",
} as const;

// Default role
export const DEFAULT_ROLE: RoleType = "user";
