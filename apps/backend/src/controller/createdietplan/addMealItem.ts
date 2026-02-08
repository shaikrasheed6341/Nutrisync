import { db, dietPlanItems, dietPlanDays, dietPlans, foods } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const addMealItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const diet_plan_id = req.params.diet_plan_id as string;
        const { food_code, day, meal, quantity, reminder_time, is_reminder_enabled } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!diet_plan_id || !uuidRegex.test(diet_plan_id)) {
            return res.status(400).json({ message: "Invalid diet plan ID" });
        }

        const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        if (!day || !validDays.includes(day.toLowerCase())) {
            return res.status(400).json({ message: "Invalid day. Must be one of: " + validDays.join(", ") });
        }

        const dayMapping: Record<string, "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7"> = {
            monday: "day1",
            tuesday: "day2",
            wednesday: "day3",
            thursday: "day4",
            friday: "day5",
            saturday: "day6",
            sunday: "day7"
        };

        const dbDay = dayMapping[day.toLowerCase()];

        if (!dbDay) {
            return res.status(400).json({ message: "Invalid day selection" });
        }

        if (!meal || typeof meal !== 'string') {
            return res.status(400).json({ message: "Invalid meal name" });
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

        // 3. Find or Create the DietPlanDay
        let [dayRecord] = await db.select()
            .from(dietPlanDays)
            .where(and(
                eq(dietPlanDays.diet_plan_id, diet_plan_id),
                eq(dietPlanDays.day, dbDay)
            ));

        if (!dayRecord) {
            const [created] = await db.insert(dietPlanDays).values({
                diet_plan_id: diet_plan_id,
                day: dbDay
            }).returning();
            dayRecord = created;
        }

        if (!dayRecord) {
            return res.status(500).json({ message: "Failed to process day record" });
        }

        // 4. Insert the meal item linked to the day ID
        const [newItem] = await db.insert(dietPlanItems). values({
            diet_plan_day_id: dayRecord.id,
            food_code: food_code,
            meal: meal,
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
