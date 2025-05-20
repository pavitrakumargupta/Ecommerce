import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/connectDb/index.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();


const allowedOrigins = [
  "http://localhost:5173",                     // your local dev
  "https://ecommer-warehouse.netlify.app",     // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or cron jobs)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// app.use(cookieParser());
app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoutes);
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
