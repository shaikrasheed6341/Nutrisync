import { db, dietPlans, dietPlanDays, dietPlanItems, foods } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const getDietPlan = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const diet_plan_id = req.params.diet_plan_id as string;
        const day = req.query.day as string | undefined;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!diet_plan_id || !uuidRegex.test(diet_plan_id)) {
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

        // 2. Build query conditions for DAYS
        const conditions = [eq(dietPlanDays.diet_plan_id, diet_plan_id)];

        if (day && typeof day === 'string') {
            const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            if (validDays.includes(day.toLowerCase())) {
                const dayMapping: Record<string, "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7"> = {
                    monday: "day1", tuesday: "day2", wednesday: "day3", thursday: "day4", friday: "day5", saturday: "day6", sunday: "day7"
                };
                const mappedDay = dayMapping[day.toLowerCase()];
                if (mappedDay) {
                    conditions.push(eq(dietPlanDays.day, mappedDay));
                }
            }
        }

        // 3. Fetch days with their items
        const results = await db.select({
            // Day Data
            day_id: dietPlanDays.id,
            day: dietPlanDays.day,
            day_notes: dietPlanDays.notes,
            // Item Data
            id: dietPlanItems.id,
            meal: dietPlanItems.meal,
            food_code: dietPlanItems.food_code,
            quantity: dietPlanItems.quantity,
            reminder_time: dietPlanItems.reminder_time,
            is_reminder_enabled: dietPlanItems.is_reminder_enabled,
            // Food Data
            food_name: foods.food_name,
            calories: foods.energy_kcal,
            protein: foods.protein_g,
            carbs: foods.carb_g,
            fats: foods.fat_g,
            image: foods.image
        })
            .from(dietPlanDays)
            .leftJoin(dietPlanItems, eq(dietPlanDays.id, dietPlanItems.diet_plan_day_id))
            .leftJoin(foods, eq(dietPlanItems.food_code, foods.food_code))
            .where(and(...conditions));

        // Group by day
        const groupedByDay: Record<string, any[]> = {};

        results.forEach(row => {
            if (!row.day) return;
            const dayKey = row.day;

            if (!groupedByDay[dayKey]) {
                groupedByDay[dayKey] = [];
            }

            // Only push if there is an item (left join might be null)
            if (row.id) {
                groupedByDay[dayKey].push({
                    id: row.id,
                    meal: row.meal,
                    food_code: row.food_code,
                    food_name: row.food_name,
                    quantity: row.quantity,
                    calories: row.calories,
                    protein: row.protein,
                    carbs: row.carbs,
                    fats: row.fats,
                    reminder_time: row.reminder_time,
                    is_reminder_enabled: row.is_reminder_enabled,
                    image: row.image
                });
            }
        });

        return res.status(200).json({
            plan: plan,
            schedule: groupedByDay
        });

    } catch (error) {
        console.error("Error fetching diet plan:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
};
