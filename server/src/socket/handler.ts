import { Server, Socket } from "socket.io";

const roomHistory = new Map();

export function initializeSocket(io: Server) {
    
    io.on("connection", (socket: Socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on("join-room", (roomId: string) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);

            if (roomHistory.has(roomId)) {
                socket.emit('canvas-state', roomHistory.get(roomId));
            }
        });
        
        socket.on('draw-data', (data) => {
            if (data.roomId) {
                const history = roomHistory.get(data.roomId) || [];
                history.push(data);
                roomHistory.set(data.roomId, history);
                socket.to(data.roomId).emit('draw-data', data);
            }
        });

        socket.on('clear-canvas', (data) => {
            if (data.roomId) {
                roomHistory.set(data.roomId, []);
                socket.to(data.roomId).emit('clear-canvas');
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
           
            for (const roomId of socket.rooms) {
                // We don't care about the personal socket ID room.
                if (roomId !== socket.id) {
                    // Check how many clients are left in the room.
                    // The 'io.sockets.adapter.rooms.get(roomId)' returns a Set of socket IDs.
                    const clientsInRoom = io.sockets.adapter.rooms.get(roomId)?.size || 0;
                    
                    if (clientsInRoom === 0) {
                        // If the room is empty, delete its history from our Map.
                        roomHistory.delete(roomId);
                        console.log(`🧹 Room ${roomId} is empty. Cleared drawing history.`);
                    }
                }
            }
        });
    });
}