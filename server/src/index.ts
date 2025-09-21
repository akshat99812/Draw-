import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import roomRouter from './routes/room';
import { initializeSocket } from "./socket/handler";

// Load environment variables from .env file
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// --- API Routes ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/room", roomRouter);

// --- Initialize Socket.IO ---
initializeSocket(io);

// --- Start Server ---
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server and WebSocket running on http://localhost:${PORT}`);
});
