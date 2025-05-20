import express from "express";
import {
  createOrder,
  updateOrder,
  getOrdersByUserId,
  getAllOrders,
} from "../controllers/orderController.js";
import verifyUserStatus from "../middleware/verifyUserStatus.js";
import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",verifyUserStatus ,createOrder);
router.put("/update/:id", updateOrder);
router.get("/getUserOrders", verifyUserStatus,getOrdersByUserId);
router.get("/all",adminAuth, getAllOrders);

export default router;
