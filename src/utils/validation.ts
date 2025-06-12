export interface RobotValidationError {
    field: string;
    message: string;
}

export const validateRobotData = (data: any): RobotValidationError[] => {
    const errors: RobotValidationError[] = [];

    // Required fields validation
    const requiredFields = [
        "serialNumber",
        "type",
        "location",
        "charge",
        "status",
        "connectivity",
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            errors.push({
                field,
                message: `${field} is required`,
            });
        }
    }

    // Type validation
    const validTypes = ["TUGGER", "CONVEYOR", "FORKLIFT"];
    if (data.type && !validTypes.includes(data.type)) {
        errors.push({
            field: "type",
            message: `Type must be one of: ${validTypes.join(", ")}`,
        });
    }

    // Status validation
    const validStatuses = ["ACTIVE", "INACTIVE", "CHARGING"];
    if (data.status && !validStatuses.includes(data.status)) {
        errors.push({
            field: "status",
            message: `Status must be one of: ${validStatuses.join(", ")}`,
        });
    }

    // Connectivity validation
    if (data.connectivity !== undefined && typeof data.connectivity !== "boolean") {
        errors.push({
            field: "connectivity",
            message: "Connectivity must be a boolean value (true for connected, false for disconnected)",
        });
    }

    // Charge format validation
    if (data.charge && !/^\d{1,3}%$/.test(data.charge)) {
        errors.push({
            field: "charge",
            message: 'Charge must be in format like "85%" (0-100%)',
        });
    }

    // Serial number format validation
    if (data.serialNumber && !/^AR\d{3,}$/.test(data.serialNumber)) {
        errors.push({
            field: "serialNumber",
            message: 'Serial number must be in format like "AR001"',
        });
    }

    return errors;
};

export const formatResponse = (
    success: boolean,
    data?: any,
    message?: string,
    count?: number
) => {
    const response: any = { success };

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
