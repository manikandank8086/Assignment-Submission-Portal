import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "../Backend/Src/router/userRouter.js";
import adminRouter from "../Backend/Src/router/adminRouter.js";
import connectDB from "./Src/model/dbConnection.js";

dotenv.config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
const app = express();

connectDB();
app.use(express.json());

app.use(
  cors({
    origin: " http://localhost:5173",
    methods: ["GEt", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(userRouter);
app.use(adminRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
