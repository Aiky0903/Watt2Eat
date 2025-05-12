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
const userSocketMap = {}; // Stored in {key : value} pairs of {email : socketID}

io.on("connection", (socket) => {
  console.log("User connected:", socket.handshake.query.email);

  const email = socket.handshake.query.email;
  if (email) userSocketMap[email] = socket.id;

  // Emit sends events to all connected users on the client side.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.handshake.query.email);
    delete userSocketMap[email];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
