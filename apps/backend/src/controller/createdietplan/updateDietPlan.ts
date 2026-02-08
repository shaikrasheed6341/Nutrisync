import { db, dietPlans } from "@repo/database";
import { type Request, type Response } from "express";
import { eq, and } from "drizzle-orm";

export const updateDietPlan = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;
        const diet_plan_id = req.params.diet_plan_id as string;
        const { name, description, isActive } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!diet_plan_id || !uuidRegex.test(diet_plan_id)) {
            return res.status(400).json({ message: "Invalid diet plan ID" });
        }

        // 1. Verify that the diet plan exists and belongs to the user
        const [existingPlan] = await db.select()
            .from(dietPlans)
            .where(and(
                eq(dietPlans.id, diet_plan_id),
                eq(dietPlans.user_id, userId)
            ));

        if (!existingPlan) {
            return res.status(404).json({ message: "Diet plan not found or access denied" });
        }

        // 2. Update the plan
        const [updatedPlan] = await db.update(dietPlans)
            .set({
                name: name || existingPlan.name,
                description: description || existingPlan.description,
                isActive: isActive !== undefined ? isActive : existingPlan.isActive,
                updated_at: new Date()
            })
            .where(eq(dietPlans.id, diet_plan_id))
            .returning();

        return res.status(200).json({
            message: "Diet plan updated successfully",
            plan: updatedPlan
        });

    } catch (error) {
        console.error("Error updating diet plan:", error);
        return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
};
