import { db, dietPlans, userpersonaldata } from "@repo/database";
import { type Request, type Response } from "express";
import { eq } from "drizzle-orm"

export const createdietplan = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }

        // // Fetch user personal data to customize the plan
        // const [userData] = await db.select().from(userpersonaldata).where(eq(userpersonaldata.user_id, userId));

        // if (!userData) {
        //     return res.status(404).json({ message: "User personal data not found. Please complete your profile first." });
        // }

        const { name, description } = req.body;

        // Create the diet plan
        const [newPlan] = await db.insert(dietPlans).values({
            user_id: userId,
            name: name || `My Plan`,
            description: description || `Personalized diet plan for My Plan`,
            isActive: true
        }).returning();

        return res.status(201).json({
            message: "Diet plan created successfully",
            plan: newPlan,
            meta: {
                goal: "My Plan",
                bodyType: "My Plan"
            }
        });

    } catch (error) {
        console.error("Error creating diet plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

