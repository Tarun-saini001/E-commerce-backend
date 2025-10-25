import "dotenv/config";
import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 1146;
const app: Express = express();
app.use(express.json());

let io: Server | undefined;

const server = http.createServer(app);

export function initializeSocket(serverInstance: http.Server) {
  io = new Server(serverInstance, {
    cors: {
      origin: process.env.ALLOW_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  console.log("Socket.IO initialized and listening for connections...");

  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("register", (userId: string) => {
      if (!userId) return;
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

export function sendNotificationToUser(userId: string, data: any) {
  if (!io) {
    console.error("Socket.IO not initialized");
    return;
  }
  const room = userId.startsWith("user_") ? userId : `user_${userId}`;
  io.to(room).emit("notification", data);
}

export function broadcastNotification(data: any) {
  if (!io) {
    console.error("Socket.IO not initialized");
    return;
  }
  io.emit("notification", data);
}

app.post("/send-to-user", (req: Request, res: Response) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message are required" });
  }
  sendNotificationToUser(userId, { message });
  res.json({ status: "Notification sent to user", userId, message });
});

app.post("/broadcast", (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }
  broadcastNotification({ message });
  res.json({ status: "Broadcast sent", message });
});

server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
  initializeSocket(server);
});
