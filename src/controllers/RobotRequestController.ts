
import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { Robot, type IRobot } from "../models/Robot";
import { buildQuery, BadRequestError } from "../utils/queryParser";

let streamId = 0;

// GET /robots/stats/stream - Stream robots with filtering/sorting
export async function streamRobotRequestStats(c: Context) {
    console.log('streamRobotRequestStats function called');
    return streamSSE(
        c,
        async (stream) => {
            console.log('Stream callback started');
            // Handle client disconnection
            stream.onAbort(() => {
                console.log('Robot Request stream client disconnected');
            });

            // Continuously send filtered and sorted robot data
            while (true) {
                try {
                    const {
                        query: filter,
                        options,
                    } = buildQuery(c.req.query(), [
                        "createdAt",
                    ]);

                    const tempRobotRequestMatrics = {
                        total: 100,
                        processing: 50,
                        completed: 20,
                        cancelled: 20,
                        aborted: 10,
                    }


                    await stream.writeSSE({
                        data: JSON.stringify({
                            success: true,
                            data: tempRobotRequestMatrics,
                        }),
                        event: 'robot:data',
                        id: String(streamId++),
                    });
                    
                } catch (error) {
                    console.error('Error in robot stream:', error);
                    await stream.writeSSE({
                        data: JSON.stringify({
                            success: false,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            timestamp: new Date().toISOString(),
                        }),
                        event: 'robot:error',
                        id: String(streamId++),
                    });
                }

                await stream.sleep(2000); // Send update every 2 seconds
            }
        },
        async (err, stream) => {
            console.error('Robot stream error:', err);
            await stream.writeSSE({
                data: JSON.stringify({
                    success: false,
                    error: 'Stream error occurred',
                    timestamp: new Date().toISOString(),
                }),
                event: 'error',
                id: String(streamId++),
            });
        }
    );
}