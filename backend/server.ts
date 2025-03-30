import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./src/app";
import connectDB from "./src/config/db";

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Import socket handlers
import { setupSocketHandlers } from "./src/socket/socketManager";
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
