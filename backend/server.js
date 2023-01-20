import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"

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

app.listen(PORT, console.log(`Listening on PORT ${PORT}`.yellow.bold));

