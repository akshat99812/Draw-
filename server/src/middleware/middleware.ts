import type { NextFunction, Request as ExpressRequest, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

// Extend the Express Request interface to include our custom `userId` property.
export interface AuthenticatedRequest extends ExpressRequest {
    userId?: string; 
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized: Token is missing or invalid."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            // Attach userId to the request for downstream handlers.
            // Ensure the userId from the token is a string for consistency.
            req.userId = String((decoded as { userId: any }).userId);
            next();
        } else {
            throw new Error("Invalid token payload");
        }
    } catch (error) {
        return res.status(403).json({
            message: "Forbidden: Invalid or expired token."
        });
    }
}
