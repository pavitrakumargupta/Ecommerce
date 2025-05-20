import express from 'express';
import { loginUser, signup } from '../controllers/authController.js';
import { getProductsByNearestWarehouse } from '../controllers/productController.js';
import verifyUserStatus from '../middleware/verifyUserStatus.js';

const router = express.Router();

router.post('/userSignup', signup);
router.post('/userLogin', loginUser);

router.get("/getProducts",verifyUserStatus, getProductsByNearestWarehouse);

export default router;
