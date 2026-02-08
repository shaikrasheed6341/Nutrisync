import { db, mealLogs, foods } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const trackFood = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const { food_code, date, meal, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!food_code || !date || !meal || !quantity) {
            return res.status(400).json({ message: "Missing required fields: food_code, date (YYYY-MM-DD), meal, quantity" });
        }

        // Validate meal type
        const validMeals = ["meal_1", "meal_2", "meal_3", "meal_4", "meal_5", "meal_6", "meal_7", "meal_8", "meal_9", "meal_10"];
        if (!validMeals.includes(meal)) {
            return res.status(400).json({ message: "Invalid meal type" });
        }

        // Verify food exists
        const [food] = await db.select().from(foods).where(eq(foods.food_code, food_code));
        if (!food) {
            return res.status(404).json({ message: "Food code not found" });
        }

        // Insert log
        const [log] = await db.insert(mealLogs).values({
            user_id: userId,
            food_code: food_code,
            date: date,
            meal: meal,
            quantity: Number(quantity)
        }).returning();

        return res.status(201).json({
            message: "Food tracked successfully",
            log: log
        });

    } catch (error) {
        console.error("Error tracking food:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
};
