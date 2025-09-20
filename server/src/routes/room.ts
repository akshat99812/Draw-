import { Router } from "express";
import { CreateRoomSchema } from "../types/types";
import prismaClient from "../db/client";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/middleware";

const router = Router();

// All routes in this file are protected by the auth middleware.
router.use(authMiddleware);

// POST /api/v1/room - Create a new room
router.post("/", async (req: AuthenticatedRequest, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Incorrect inputs", errors: parsedData.error.flatten() });
    }

    const userId = Number(req.userId);

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });
        res.status(201).json({ roomId: room.id, slug: room.slug });
    } catch(e) {
        res.status(409).json({ message: "A room with this name already exists." });
    }
});

router.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: { roomId },
            orderBy: { createdAt: "asc" },
            take: 500 // Limit the number of messages fetched
        });
        res.json({ messages });
    } catch(e) {
        res.status(500).json({ messages: [] });
    }
});

router.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({ where: { slug } });

    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    res.json({ room });
});

export default router;
