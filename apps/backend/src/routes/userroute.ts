import { Router } from "express";
import { userregistration, userlogin } from "../controller/users/user.js";

const router = Router();

router.post("/user", userregistration);

router.post("/login", userlogin);

export default router;