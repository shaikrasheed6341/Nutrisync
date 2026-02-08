import { db, dietPlans, dietPlanDays, dietPlanItems } from "@repo/database";
import { type Request, type Response } from "express";
import { eq } from "drizzle-orm"

export const createdietplan = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        const { name, description, items } = req.body;

        // 1. Create the diet plan
        const [newPlan] = await db.insert(dietPlans).values({
            user_id: userId,
            name: name || `My Plan`,
            description: description || `Personalized diet plan for My Plan`,
            isActive: true
        }).returning();

        if (!newPlan) {
            return res.status(500).json({ message: "Failed to create diet plan" });
        }

        let createdDays: any[] = [];
        let createdItems: any[] = [];

        // 2. Process items if provided
        if (items && Array.isArray(items) && items.length > 0) {
            const dayMapping: Record<string, "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7"> = {
                monday: "day1",
                tuesday: "day2",
                wednesday: "day3",
                thursday: "day4",
                friday: "day5",
                saturday: "day6",
                sunday: "day7"
            };

            // Group items by valid day
            const itemsByDay: Record<string, any[]> = {};

            items.forEach((item: any) => {
                if (!item.day) return;
                const dbDay = dayMapping[item.day.toLowerCase()];
                if (!dbDay) return;

                if (!itemsByDay[dbDay]) {
                    itemsByDay[dbDay] = [];
                }
                itemsByDay[dbDay].push(item);
            });

            // 3. Insert Days and Items
            for (const [dayEnum, dayItems] of Object.entries(itemsByDay)) {
                // Create DietPlanDay
                const [newDay] = await db.insert(dietPlanDays).values({
                    diet_plan_id: newPlan.id,
                    day: dayEnum as "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7",
                }).returning();

                if (!newDay) continue;

                createdDays.push(newDay);

                // Prepare items for this day
                const itemsToInsert = dayItems.map(item => ({
                    diet_plan_day_id: newDay.id,
                    food_code: item.food_code,
                    meal: item.meal || 'meal_1',
                    quantity: Number(item.quantity) || 1,
                    reminder_time: item.reminder_time ? String(item.reminder_time) : null,
                    is_reminder_enabled: Boolean(item.is_reminder_enabled) || false
                }));

                if (itemsToInsert.length > 0) {
                    const inserted = await db.insert(dietPlanItems).values(itemsToInsert).returning();
                    createdItems.push(...inserted);
                }
            }
        }

        return res.status(201).json({
            message: "Diet plan created successfully",
            plan: newPlan,
            days: createdDays,
            items: createdItems,
            meta: {
                goal: "My Plan",
                bodyType: "My Plan"
            }
        });

    } catch (error) {
        console.error("Error creating diet plan:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
}

