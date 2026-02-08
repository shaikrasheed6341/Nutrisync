
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set in environment variables! AI features will not work.");
            // Initialize with empty key but warn loudly
            this.genAI = new GoogleGenerativeAI("");
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey.trim());
        }
        // Using gemini-pro as a more stable fallback
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateDietPlan(userDetails: any, availableFoods: any[]) {
        if (!this.genAI.apiKey) {
            throw new Error("GEMINI_API_KEY is missing. Please add it to your .env file.");
        }

        const payload = {
            userDetails,
            format: "Perform strictly as a JSON generator.",
            availableFoods: availableFoods.map(f => ({
                name: f.food_name,
                code: f.food_code,
                kcal: f.energy_kcal,
                protein: f.protein_g,
                carb: f.carb_g,
                fat: f.fat_g
            }))
        };

        const prompt = `
      You are an expert nutritionist AI. 
      Input Data: ${JSON.stringify(payload)}

      Task: Create a 1-day diet plan using ONLY the provided availableFoods.
      Calculate total calories and macros tailored to the userDetails.
      
      Requirements:
      - Output strictly valid JSON. No markdown. No explanations.
      - Structure:
      {
        "summary": "Brief explanation",
        "total_stats": { "calories": number, "protein": number, "carbs": number, "fat": number },
        "meals": [
          {
            "meal_type": "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Pre-Workout" | "Post-Workout",
            "items": [
              { "food_name": "Exact Name", "food_code": "Code", "quantity": number, "reason": "Why" }
            ]
          }
        ]
      }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up potential markdown blocks
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedResponse;
            try {
                parsedResponse = JSON.parse(text);
            } catch (parseError) {
                console.error("Failed to parse Gemini JSON:", text);
                throw new Error("AI response was not valid JSON");
            }
            return parsedResponse;
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw error;
        }
    }
}

export const aiService = new GeminiService();
