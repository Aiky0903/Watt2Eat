import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { userRoutes, restaurantRoutes, advertRoutes } from "./routes/index.js";

// Load env variable
dotenv.config();

// Initialize Express apps
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/server/users", userRoutes);
app.use("/server/restaurant", restaurantRoutes);
app.use("/server/advert", advertRoutes)

app.listen(process.env.PORT, () => {
  console.log("Watt2Eat Server Started at http://localhost:5000");
  connectDB();
});
