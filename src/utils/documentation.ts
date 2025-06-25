export const apiDocumentation = {
    title: "🤖 Robot Management API Documentation",
    version: "1.0.0",
    description: "RESTful API for managing warehouse robots",
    baseUrl: "http://localhost:5005/api",
    endpoints: {
        robots: {
            "GET /robots": {
                description: "Get all robots with advanced query support",
                parameters: {
                    // Basic filtering
                    status: "Filter by status (ACTIVE, INACTIVE, CHARGING)",
                    type: "Filter by type (TUGGER, CONVEYOR, FORKLIFT)",
                    connectivity:
                        "Filter by connectivity (CONNECTED, DISCONNECTED)",

                    // Multiple values (OR filtering)
                    "type with multiple values": "?type=TUGGER,FORKLIFT",

                    // MongoDB operators (use URL encoding: [ = %5B, ] = %5D)
                    "charge[gte]": "Charge greater than or equal to value",
                    "charge[lt]": "Charge less than value",
                    "charge[ne]": "Charge not equal to value",
                    "type[in]": "Type in array (comma-separated)",
                    "type[nin]": "Type not in array (comma-separated)",
                    "location[regex]": "Regex pattern for location",

                    // Regex filtering
                    location: "Use /pattern/ for regex (e.g., /Waypoint/)",

                    // Sorting
                    sort: "Sort by fields: 'charge' (asc) or '-charge' (desc), comma-separated for multiple",

                    // Pagination
                    page: "Page number (default: 1)",
                    limit: "Items per page (default: 10)",

                    // Field selection
                    fields: "Select specific fields (comma-separated): 'serialNumber,charge,type'",
                },
                examples: [
                    "?status=ACTIVE&sort=-charge&limit=5",
                    "?type=TUGGER,FORKLIFT&fields=serialNumber,charge",
                    "?charge%5Bgte%5D=50&charge%5Blt%5D=90",
                    "?location=/Waypoint/&status=ACTIVE",
                    "?type%5Bin%5D=TUGGER,FORKLIFT&sort=charge&page=2",
                ],
                response: {
                    success: true,
                    data: "Array of robot objects",
                    count: "Number of robots",
                },
            },
            "GET /robots/:serialNumber": {
                description: "Get robot by serial number",
                parameters: {
                    serialNumber: "Robot serial number (e.g., AR001)",
                },
                response: {
                    success: true,
                    data: "Robot object",
                },
            },
            "POST /robots": {
                description: "Create a new robot",
                body: {
                    serialNumber: "string (required, format: AR001)",
                    type: "string (required, enum: TUGGER|CONVEYOR|FORKLIFT)",
                    location: "string (required)",
                    batteryCharge: "string (required, format: 85%)",
                    status: "string (required, enum: active|inactive|charging|error)",
                    connectivity: "boolean (required, true=connected, false=disconnected)",
                    emergencyStop: "boolean (required, true=emergency stop active, false=normal)",
                    softwareStatus: "number (required, enum: 0|1|2|3)",
                    hardwareStatus: "number (required, enum: 0|1|2|3)",
                    batteryStatus: "number (required, enum: 0|1|2|3)",
                    networkStatus: "number (required, enum: 0|1|2|3)",
                    usageLevel: "string (required, enum: ACKNOWLEDGED|POSITION_ACKNOWLEDGED|IGNORED)",
                },
                response: {
                    success: true,
                    data: "Created robot object",
                    message: "Robot created successfully",
                },
            },
            "PUT /robots/:serialNumber": {
                description: "Update robot by serial number",
                parameters: {
                    serialNumber: "Robot serial number",
                },
                body: "Partial robot object",
                response: {
                    success: true,
                    data: "Updated robot object",
                    message: "Robot updated successfully",
                },
            },
            "DELETE /robots/:serialNumber": {
                description: "Delete robot by serial number",
                parameters: {
                    serialNumber: "Robot serial number",
                },
                response: {
                    success: true,
                    message: "Robot deleted successfully",
                },
            },
            "GET /robots/status/:status": {
                description: "Get robots by status",
                parameters: {
                    status: "Robot status (ACTIVE|INACTIVE|CHARGING)",
                },
                response: {
                    success: true,
                    data: "Array of robots with specified status",
                    count: "Number of robots",
                },
            },
            "GET /robots/type/:type": {
                description: "Get robots by type",
                parameters: {
                    type: "Robot type (TUGGER|CONVEYOR|FORKLIFT)",
                },
                response: {
                    success: true,
                    data: "Array of robots with specified type",
                    count: "Number of robots",
                },
            },
            "GET /robots/stats": {
                description: "Get robot statistics",
                parameters: {},
                response: {
                    success: true,
                    data: {
                        total: "Total number of robots",
                        status: {
                            active: "Number of active robots",
                            inactive: "Number of inactive robots",
                            charging: "Number of charging robots",
                        },
                        connectivity: {
                            connected: "Number of connected robots",
                            disconnected: "Number of disconnected robots",
                        },
                        byType: {
                            tugger: "Number of tugger robots",
                            conveyor: "Number of conveyor robots",
                            forklift: "Number of forklift robots",
                        },
                    },
                },
            },
        },
        utility: {
            "GET /health": {
                description: "Health check endpoint",
                response: {
                    status: "OK",
                    timestamp: "Current timestamp",
                    service: "Robot Management API",
                },
            },
            "GET /info": {
                description: "API information",
                response: {
                    name: "Robot Management API",
                    version: "1.0.0",
                    description: "API description",
                    endpoints: "Available endpoints",
                },
            },
            "GET /docs": {
                description: "API documentation",
                response: "This documentation object",
            },
        },
    },
    examples: {
        createRobot: {
            method: "POST",
            url: "/api/robots",
            body: {
                serialNumber: "AR009",
                type: "TUGGER",
                location: "Waypoint 9",
                batteryCharge: "95%",
                status: "active",
                connectivity: "CONNECTED",
                emergencyStop: false,
                softwareStatus: 0,
                hardwareStatus: 0,
                batteryStatus: 1,
                networkStatus: 0,
                usageLevel: "ACKNOWLEDGED",
            },
        },
        updateRobot: {
            method: "PUT",
            url: "/api/robots/AR009",
            body: {
                charge: "75%",
                location: "Waypoint 10",
            },
        },
    },
};
