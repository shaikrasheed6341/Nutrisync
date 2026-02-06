import express from "express";
import { createdietplan } from "../controller/createdietplan/createdietplan.js";
import { addMealItem } from "../controller/createdietplan/addMealItem.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/createplan", auth, createdietplan);
router.post("/:diet_plan_id/add-meal", auth, addMealItem);

export default router;