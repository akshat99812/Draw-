import { Router } from "express";
import { CreateUserSchema, SigninSchema } from "../types/zod-schemas";
import prismaClient from "../db/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

// POST /api/v1/auth/signup
router.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Incorrect inputs", errors: parsedData.error.flatten() });
    }

    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        });
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.status(201).json({ token, message: "User created successfully" });

    } catch(e) {
        res.status(409).json({ message: "User already exists with this email" });
    }
});

// POST /api/v1/auth/signin
router.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: "Incorrect inputs", errors: parsedData.error.flatten() });
    }

    const user = await prismaClient.user.findFirst({
        where: { email: parsedData.data.username }
    });

    if (!user || !await bcrypt.compare(parsedData.data.password, user.password)) {
        return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
});

export default router;

