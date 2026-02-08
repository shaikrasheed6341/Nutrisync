
import { Router } from "express";
import { generateDietPlan } from "../controller/ai/diet.js";
import { auth } from "../middleware/auth.js";

const router = Router();


// POST /v1/api/generate-diet
router.post("/generate-diet", auth, generateDietPlan);

export default router;
