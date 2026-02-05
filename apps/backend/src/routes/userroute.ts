import { Router } from "express";
import { userregistration, userlogin } from "../controller/users/user.js";
import {getallfoods,getfoodbyname} from "../controller/food/food.js"
// import { userpersonaldata } from "../controller/users/user.js";
const router = Router();

router.post("/user", userregistration);
// router.post("/userpersonaldata", userpersonaldata);
router.post("/login", userlogin);

export default router;