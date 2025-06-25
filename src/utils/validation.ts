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
        "batteryCharge",
        "status",
        "connectivity",
        "emergencyStop",
        "softwareStatus",
        "hardwareStatus",
        "batteryStatus",
        "networkStatus",
        "usageLevel",
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
    const validStatuses = ["active", "inactive", "charging", "error"];
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

    // Battery charge validation (should be a number between 0-100)
    if (robotData.batteryCharge !== undefined) {
        const batteryCharge = Number(robotData.batteryCharge);
        if (Number.isNaN(batteryCharge) || batteryCharge < 0 || batteryCharge > 100) {
            errors.push({
                field: "batteryCharge",
                message: 'Battery charge must be a number between 0 and 100',
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

    // Emergency stop validation
    if (robotData.emergencyStop !== undefined && typeof robotData.emergencyStop !== "boolean") {
        errors.push({
            field: "emergencyStop",
            message: "Emergency stop must be a boolean value (true or false)",
        });
    }

    // Status fields validation (should be 0, 1, 2, or 3)
    const statusFields = ["softwareStatus", "hardwareStatus", "batteryStatus", "networkStatus"];
    const validStatusValues = [0, 1, 2, 3];
    
    for (const field of statusFields) {
        if (robotData[field] !== undefined && !validStatusValues.includes(Number(robotData[field]))) {
            errors.push({
                field,
                message: `${field} must be one of: ${validStatusValues.join(", ")}`,
            });
        }
    }

    // Usage level validation
    const validUsageLevels = ["ACKNOWLEDGED", "POSITION_ACKNOWLEDGED", "IGNORED"];
    if (robotData.usageLevel && !validUsageLevels.includes(robotData.usageLevel as string)) {
        errors.push({
            field: "usageLevel",
            message: `Usage level must be one of: ${validUsageLevels.join(", ")}`,
        });
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
