import { db, users } from "@repo/database";
import { type Request, type Response } from "express";
import { eq } from "drizzle-orm"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const userregistration = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(404).json({ message: "Plz entre your all required feilds" })
    }

    const existingemail = await db.select().from(users).where(eq(users.email, email))
    if (existingemail.length > 0) {
        return res.status(404).json({ message: "you already present in db" })
    }
    const hashedpassword = await bcrypt.hash(password, 10)
    const user = await db.insert(users).values({ username, email, password: hashedpassword })
    return res.status(200).json({ message: "user registered successfully" })
}

export const userlogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({ message: "Plz entre your all required feilds" })
    }
    const user = await db.select().from(users).where(eq(users.email, email))
    const foundUser = user[0];
    if (!foundUser) {
        return res.status(404).json({ message: "user not found" })
    }
    const ispasswordvalid = await bcrypt.compare(password, foundUser.password)
    if (!ispasswordvalid) {
        return res.status(404).json({ message: "invalid password" })
    }
    const token = jwt.sign({ id: foundUser.id, email: foundUser.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
    return res.status(200).json({ message: "user logged in successfully", token })
}