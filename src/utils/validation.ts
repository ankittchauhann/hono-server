export interface RobotValidationError {
    field: string;
    message: string;
}

export const validateRobotData = (data: unknown): RobotValidationError[] => {
    const errors: RobotValidationError[] = [];
    
    // Type guard to ensure data is an object
    if (!data || typeof data !== 'object') {
        errors.push({
            field: 'data',
            message: 'Invalid data format',
        });
        return errors;
    }
    
    const robotData = data as Record<string, unknown>;

    // Required fields validation
    const requiredFields = [
        "serialNumber",
        "type",
        "manufacturer",
        "location",
        "charge",
        "status",
        "connectivity",
    ];

    for (const field of requiredFields) {
        if (!robotData[field]) {
            errors.push({
                field,
                message: `${field} is required`,
            });
        }
    }

    // Type validation
    const validTypes = ["TUGGER", "CONVEYOR", "FORKLIFT"];
    if (robotData.type && !validTypes.includes(robotData.type as string)) {
        errors.push({
            field: "type",
            message: `Type must be one of: ${validTypes.join(", ")}`,
        });
    }

    // Status validation
    const validStatuses = ["ACTIVE", "INACTIVE", "CHARGING", "ERROR"];
    if (robotData.status && !validStatuses.includes(robotData.status as string)) {
        errors.push({
            field: "status",
            message: `Status must be one of: ${validStatuses.join(", ")}`,
        });
    }

    // Connectivity validation
    if (robotData.connectivity !== undefined && typeof robotData.connectivity !== "boolean") {
        errors.push({
            field: "connectivity",
            message: "Connectivity must be a boolean value (true for connected, false for disconnected)",
        });
    }

    // Charge validation (should be a number between 0-100)
    if (robotData.charge !== undefined) {
        const charge = Number(robotData.charge);
        if (Number.isNaN(charge) || charge < 0 || charge > 100) {
            errors.push({
                field: "charge",
                message: 'Charge must be a number between 0 and 100',
            });
        }
    }

    // Serial number format validation
    if (robotData.serialNumber && typeof robotData.serialNumber === 'string' && !/^AR\d{3,}$/.test(robotData.serialNumber)) {
        errors.push({
            field: "serialNumber",
            message: 'Serial number must be in format like "AR001"',
        });
    }

    // Manufacturer validation
    if (robotData.manufacturer && typeof robotData.manufacturer === 'string') {
        const manufacturer = robotData.manufacturer.trim();
        if (manufacturer.length < 2) {
            errors.push({
                field: "manufacturer",
                message: 'Manufacturer name must be at least 2 characters long',
            });
        }
    }

    return errors;
};

export const formatResponse = (
    success: boolean,
    data?: unknown,
    message?: string,
    count?: number
) => {
    const response: Record<string, unknown> = { success };

    if (success) {
        if (data !== undefined) response.data = data;
        if (message) response.message = message;
        if (count !== undefined) response.count = count;
    } else {
        if (data) response.error = data;
        if (message) response.message = message;
    }

    return response;
};
