import { db, mealLogs, foods } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const getDailyLog = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const { date } = req.query;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!date || typeof date !== 'string') {
            return res.status(400).json({ message: "Date query parameter is required (YYYY-MM-DD)" });
        }

        const logs = await db.select({
            id: mealLogs.id,
            food_code: mealLogs.food_code,
            food_name: foods.food_name,
            meal: mealLogs.meal,
            quantity: mealLogs.quantity,
            calories: foods.energy_kcal,
            protein: foods.protein_g,
            carbs: foods.carb_g,
            fats: foods.fat_g,
            image: foods.image
        })
            .from(mealLogs)
            .leftJoin(foods, eq(mealLogs.food_code, foods.food_code))
            .where(and(
                eq(mealLogs.user_id, userId),
                eq(mealLogs.date, date)
            ));

        // Calculate totals
        const totals = logs.reduce((acc: any, item: any) => {
            acc.calories += (item.calories || 0) * item.quantity;
            acc.protein += (item.protein || 0) * item.quantity;
            acc.carbs += (item.carbs || 0) * item.quantity;
            acc.fats += (item.fats || 0) * item.quantity;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        // Group by meal
        const byMeal = logs.reduce((acc: any, item: any) => {
            if (!acc[item.meal]) {
                acc[item.meal] = [];
            }
            acc[item.meal].push(item);
            return acc;
        }, {});

        return res.status(200).json({
            date: date,
            totals: totals,
            schedule: byMeal
        });

    } catch (error) {
        console.error("Error fetching daily log:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
};
