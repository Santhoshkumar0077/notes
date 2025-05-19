import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import noteRoute from "./routes/noteRoute.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const staticPath = path.join(__dirname, "../client/dist");
app.use(express.static(staticPath));

// Middleware
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/auth", userRoute);
app.use("/api/note", noteRoute);

app.use((req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`MongoDB connected`))
  .catch((error) => console.log(" Connection error:", error.message));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
