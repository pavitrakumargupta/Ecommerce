import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/connectDb/index.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "https://ecommer-warehouse.netlify.app",
    credentials: true,
  })
);
// app.use(cookieParser());
app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
