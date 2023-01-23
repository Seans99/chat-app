import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { Server } from "socket.io";

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Listening on PORT ${PORT}`.yellow.bold));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io")

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected")
  })

  socket.on("join chat", (room) => {
    socket.join(room)
    console.log("User joined room: " + room);
  })

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined")
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived)
    })
  })

})
