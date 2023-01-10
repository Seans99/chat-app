import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import connectDB from "./config/db.js";
import color from "colors"

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
})

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on PORT ${PORT}`.yellow.bold ));

