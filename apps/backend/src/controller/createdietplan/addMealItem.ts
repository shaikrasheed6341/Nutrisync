import { db, dietPlanItems, dietPlans, foods } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const addMealItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const { diet_plan_id } = req.params;
        const { food_code, day, meal, quantity, reminder_time, is_reminder_enabled } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!diet_plan_id || typeof diet_plan_id !== 'string') {
            return res.status(400).json({ message: "Invalid diet plan ID" });
        }

        // 1. Verify that the diet plan exists and belongs to the user
        const [plan] = await db.select()
            .from(dietPlans)
            .where(and(
                eq(dietPlans.id, diet_plan_id),
                eq(dietPlans.user_id, userId)
            ));

        if (!plan) {
            return res.status(404).json({ message: "Diet plan not found or access denied" });
        }

        if (!food_code || typeof food_code !== 'string') {
            return res.status(400).json({ message: "Invalid food code" });
        }

        // 2. Verify that the food exists
        const [food] = await db.select().from(foods).where(eq(foods.food_code, food_code));
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        // 3. Insert the meal item
        const [newItem] = await db.insert(dietPlanItems).values({
            diet_plan_id: diet_plan_id,
            food_code: food_code,
            day: day as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
            meal: (meal as "meal_1" | "meal_2" | "meal_3" | "meal_4" | "meal_5" | "meal_6" | "meal_7" | "meal_8" | "meal_9" | "meal_10") || 'meal_1',
            quantity: Number(quantity) || 1,
            reminder_time: reminder_time ? String(reminder_time) : null,
            is_reminder_enabled: Boolean(is_reminder_enabled) || false
        }).returning();

        return res.status(201).json({
            message: "Meal item added successfully",
            item: newItem
        });

    } catch (error) {
        console.error("Error adding meal item:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
};
