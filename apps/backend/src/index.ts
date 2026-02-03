import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import userRoute from "./routes/userroute.js";
dotenv.config({ path: path.resolve("../../.env") });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/api",userRoute)
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
