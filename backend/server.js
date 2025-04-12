import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
//import socketio from 'socket.io'
import {
  userRoutes,
  restaurantRoutes,
  advertRoutes,
  orderRoutes,
} from "./routes/index.js";
import { app, server } from "./config/socket.js";

// Load env variable
dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/server/users", userRoutes);
app.use("/server/restaurant", restaurantRoutes);
app.use("/server/advert", advertRoutes);
app.use("/server/order", orderRoutes);

server.listen(process.env.PORT, () => {
  console.log(
    "Watt2Eat Server Started at http://localhost:" + process.env.PORT
  );
  connectDB();
});
