
import { type Request, type Response } from "express";
import { db, foods, userpersonaldata } from "@repo/database"; // Adjusted import path based on monorepo structure
import { eq } from "drizzle-orm";
import { aiService } from "../../services/ai.js";

// Define a type for the authenticated request if not already globally available
interface AuthenticatedRequest extends Request {
    user?: any; // Using any to match existing middleware pattern, though strict typing is better
}

export const generateDietPlan = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // req.user is populated by auth middleware
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        // Fetch user personal data
        // We use array destructuring because select returns an array
        const [userData] = await db
            .select()
            .from(userpersonaldata)
            .where(eq(userpersonaldata.user_id, userId));

        if (!userData) {
            return res.status(404).json({ error: "User profile not found. Please complete your profile details first." });
        }

        // Fetch available foods
        // Limiting to 50 items to respect LLM context window limits
        // In production, you might want to filter this based on user preferences (veg/non-veg)
        // or use a vector database for semantic search.
        const availableFoods = await db
            .select({
                food_code: foods.food_code,
                food_name: foods.food_name,
                energy_kcal: foods.energy_kcal,
                protein_g: foods.protein_g,
                carb_g: foods.carb_g,
                fat_g: foods.fat_g
            })
            .from(foods)
            .limit(200);

        if (!availableFoods || availableFoods.length === 0) {
            return res.status(500).json({ error: "No food data available in the system to generate a plan." });
        }

        // Call AI Service
        console.log(`Generating diet plan for user ${userId} with ${availableFoods.length} food items context...`);
        const dietPlan = await aiService.generateDietPlan(userData, availableFoods);

        if (!dietPlan) {
            return res.status(500).json({ error: "AI failed to generate a valid plan." });
        }

        // Return the generated plan
        res.status(200).json({
            message: "Diet plan generated successfully",
            dietPlan
        });

    } catch (error) {
        console.error("Error in generateDietPlan controller:", error);
        res.status(500).json({ error: "Internal server error while generating diet plan" });
    }
};
