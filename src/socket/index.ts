import { Server } from "socket.io";
import { Robot } from "../models/Robot";
import { createServer } from "node:http";
import type { Server as HTTPServer } from "node:http";

let io: Server;

export function initializeSocket(httpServer: HTTPServer) {
    // Create Socket.IO server with custom path
    io = new Server(httpServer, {
        path: "/socket/v1",
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    // Emit all robots every 2 seconds
    setInterval(async () => {
        try {
            const robots = await Robot.find({}).lean();
            io.emit("get:all:robots", {
                success: true,
                data: robots,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error emitting robots:", error);
        }
    }, 2000);

    console.log("Socket.IO server running on http://localhost:5005/socket/v1");
    return io;
}
