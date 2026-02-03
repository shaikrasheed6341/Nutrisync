import { Router } from "express";
import { createUser } from "../controller/users/user.js";

const router = Router();

router.post("/user", createUser);

export default router;