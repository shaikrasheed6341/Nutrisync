import { db, dietPlanItems, dietPlans, foods, dietPlanDays } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const updateMealItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const diet_plan_id = req.params.diet_plan_id as string;
        const item_id = req.params.item_id as string;
        const { food_code, day, meal, quantity, reminder_time, is_reminder_enabled } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!diet_plan_id || !uuidRegex.test(diet_plan_id)) {
            return res.status(400).json({ message: "Invalid diet plan ID" });
        }
        if (!item_id || !uuidRegex.test(item_id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }

        // 1. Verify diet plan ownership
        const [plan] = await db.select()
            .from(dietPlans)
            .where(and(
                eq(dietPlans.id, diet_plan_id),
                eq(dietPlans.user_id, userId)
            ));

        if (!plan) {
            return res.status(404).json({ message: "Diet plan not found or access denied" });
        }

        // 2. Verify item exists and fetch its current day info
        const [existingItem] = await db.select({
            id: dietPlanItems.id,
            diet_plan_day_id: dietPlanItems.diet_plan_day_id,
            food_code: dietPlanItems.food_code,
            meal: dietPlanItems.meal,
            quantity: dietPlanItems.quantity,
            reminder_time: dietPlanItems.reminder_time,
            is_reminder_enabled: dietPlanItems.is_reminder_enabled,
            day: dietPlanDays.day, // Get current day enum
            plan_id: dietPlanDays.diet_plan_id
        })
            .from(dietPlanItems)
            .leftJoin(dietPlanDays, eq(dietPlanItems.diet_plan_day_id, dietPlanDays.id))
            .where(eq(dietPlanItems.id, item_id));

        if (!existingItem) {
            return res.status(404).json({ message: "Meal item not found" });
        }

        if (existingItem.plan_id !== diet_plan_id) {
            return res.status(400).json({ message: "Item does not belong to the specified plan" });
        }

        // 3. Prepare updates
        const updates: any = {
            updated_at: new Date()
        };

        // Handle Day Change
        if (day) {
            const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
            if (!validDays.includes(day.toLowerCase())) {
                return res.status(400).json({ message: "Invalid day" });
            }

            const dayMapping: Record<string, "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7"> = {
                monday: "day1", tuesday: "day2", wednesday: "day3", thursday: "day4", friday: "day5", saturday: "day6", sunday: "day7"
            };
            const targetDbDay = dayMapping[day.toLowerCase()];

            if (targetDbDay !== existingItem.day) {
                // Determine target DietPlanDay ID
                let [targetDayRecord] = await db.select()
                    .from(dietPlanDays)
                    .where(and(
                        eq(dietPlanDays.diet_plan_id, diet_plan_id),
                        eq(dietPlanDays.day, targetDbDay!)
                    ));

                if (!targetDayRecord) {
                    const [createdTarget] = await db.insert(dietPlanDays).values({
                        diet_plan_id: diet_plan_id,
                        day: targetDbDay!
                    }).returning();
                    targetDayRecord = createdTarget;
                }

                if (targetDayRecord) {
                    updates.diet_plan_day_id = targetDayRecord.id;
                }
            }
        }

        if (meal) updates.meal = meal;
        if (quantity !== undefined) updates.quantity = Number(quantity);
        if (reminder_time !== undefined) updates.reminder_time = reminder_time ? String(reminder_time) : null;
        if (is_reminder_enabled !== undefined) updates.is_reminder_enabled = Boolean(is_reminder_enabled);

        if (food_code) {
            const [food] = await db.select().from(foods).where(eq(foods.food_code, food_code));
            if (!food) {
                return res.status(404).json({ message: "Food item not found" });
            }
            updates.food_code = food_code;
        }

        // 4. Update the item
        const [updatedItem] = await db.update(dietPlanItems)
            .set(updates)
            .where(eq(dietPlanItems.id, item_id))
            .returning();

        return res.status(200).json({
            message: "Meal item updated successfully",
            item: updatedItem
        });

    } catch (error) {
        console.error("Error updating meal item:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
};
