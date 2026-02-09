import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken"


export const auth = (req: Request, res: Response, next: NextFunction) => {

    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = decoded
        next()
    })

}
