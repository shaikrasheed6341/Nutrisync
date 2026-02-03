import { type Request, type Response } from "express";
import { db, users } from "@repo/database/src/index.js";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const user = await db.insert(users).values({ name, email, password }).returning();
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
};