import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Import for __dirname workaround
import userRouter from "../Backend/Src/router/userRouter.js";
import adminRouter from "../Backend/Src/router/adminRouter.js";
import connectDB from "./Src/model/dbConnection.js";

dotenv.config();
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

// Workaround to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();
app.use(express.json());

// Serve static files from "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(userRouter);
app.use(adminRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
