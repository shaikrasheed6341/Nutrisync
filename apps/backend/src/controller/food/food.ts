import { db, foods } from "@repo/database";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";

export const getallfoods = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const fooddata = await db.select().from(foods).limit(limit).offset(offset);
        if (!fooddata) {
            return res.status(404).json({ error: "Food data not found" });
        }
        return res.status(200).json({ fooddata });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getfoodbyname = async (req: Request, res: Response) => {
    try {
        const food_name = req.params.food_name as string;

        if (!food_name) {
            return res.status(400).json({ error: "Food name is required" });
        }

        const fooddata = await db.select().from(foods).where(eq(foods.food_name, food_name));

        if (!fooddata.length) {
            return res.status(404).json({ error: "Food data not found" });
        }
        return res.status(200).json({ fooddata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
