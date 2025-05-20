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
router.put("/updateOrder/:id",adminAuth ,updateOrder);
router.get("/getUserOrders", verifyUserStatus,getOrdersByUserId);
router.get("/getAllOrders",adminAuth, getAllOrders);

export default router;
