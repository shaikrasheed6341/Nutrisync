import express from "express";
import { trackFood } from "../controller/tracking/trackFood.js";
import { getDailyLog } from "../controller/tracking/getDailyLog.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/log", auth, trackFood);
router.get("/log", auth, getDailyLog);

export default router;
