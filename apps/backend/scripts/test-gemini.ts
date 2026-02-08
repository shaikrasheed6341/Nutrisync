
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load env from root
dotenv.config({ path: path.resolve("../../.env") });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("----------------------------------------");
    console.log("API Key loaded:", apiKey ? "Yes (starts with " + apiKey.substring(0, 4) + ")" : "No");

    if (!apiKey) {
        console.error("Please set GEMINI_API_KEY in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try to list models
    /*
    try {
        // listing models requires special permissions sometimes not granted to API keys
        // but let's try just a simple generate content
    } catch (e) {
        console.log("Cannot list models:", e.message);
    }
    */

    const models = ["gemini-1.5-flash", "gemini-pro"];

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello?");
            const response = await result.response;
            console.log(`✅ SUCCESS [${modelName}]:`, response.text().substring(0, 50) + "...");
        } catch (error: any) {
            console.error(`❌ FAILED [${modelName}]:`);
            console.error("   Message:", error.message);
            if (error.status) console.error("   Status:", error.status);
            if (error.statusText) console.error("   StatusText:", error.statusText);
        }
    }
    console.log("----------------------------------------");
}

testGemini();
