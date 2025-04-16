import { Server } from "socket.io";
import http from "http";
import express from "express";

// Initialize Express Server
const app = express();

const server = http.createServer(app);

// Initialize socket io Server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Map to store all active users.
const userSocketMap = {}; // {studentID : socketID}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const studentID = socket.handshake.query.studentID;
  if (studentID) userSocketMap[studentID] = socket.id;

  // Emit sends events to all connected users on the client side.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[studentID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
