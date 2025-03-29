import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.text());

app.get("/", (_req, res) => {
  res.send("Welcome to my Crypto Copilot Extension!");
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
