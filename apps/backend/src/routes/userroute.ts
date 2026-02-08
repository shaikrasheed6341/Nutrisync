import { Router } from "express";
import { userregistration, userlogin, insertpersonaldetails, getpersonaldetails, updatepersonaldetails } from "../controller/users/user.js";
import { getallfoods, getfoodbyname } from "../controller/food/food.js"
// import { userpersonaldata } from "../controller/users/user.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/user", userregistration);
// router.post("/userpersonaldata", userpersonaldata);
router.post("/login", userlogin);
router.post("/details", auth, insertpersonaldetails);
router.get("/details", auth, getpersonaldetails);
router.put("/details", auth, updatepersonaldetails);
export default router;