import express from "express";
import { createdietplan } from "../controller/createdietplan/createdietplan.js";
import { addMealItem } from "../controller/createdietplan/addMealItem.js";
import { getDietPlan } from "../controller/createdietplan/getDietPlan.js";
import { updateDietPlan } from "../controller/createdietplan/updateDietPlan.js";
import { updateMealItem } from "../controller/createdietplan/updateMealItem.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/createplan", auth, createdietplan);
router.post("/:diet_plan_id/add-meal", auth, addMealItem);
router.get("/:diet_plan_id", auth, getDietPlan);
router.put("/:diet_plan_id", auth, updateDietPlan);
router.put("/:diet_plan_id/items/:item_id", auth, updateMealItem);

export default router;