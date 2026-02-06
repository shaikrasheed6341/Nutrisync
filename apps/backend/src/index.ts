import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("../../.env") });

import express from "express";
import cors from "cors";
import userRoute from "./routes/userroute.js";
import foodRoute from "./routes/foodroutes.js";
import createplanRoute from "./routes/createplan.js";

import { swaggerSpec } from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));

app.use("/v1/api", userRoute, foodRoute, createplanRoute)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log("Swagger docs on http://localhost:3000/api/docs");
});
