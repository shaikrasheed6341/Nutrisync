import { Router } from "express";
const router = Router();import { getallfoods, getfoodbyname } from "../controller/food/food.js";

router.get("/getallfoods", getallfoods);
router.post("/getfoodbyname/:food_name", getfoodbyname);

export default router;
