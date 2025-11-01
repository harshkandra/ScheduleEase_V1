import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const app = express();

// ✅ Enable CORS (frontend on Vite runs on port 5173)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ Connect to MongoDB (local)
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

