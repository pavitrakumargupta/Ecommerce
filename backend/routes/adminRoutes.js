import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { getUserList, updateUserStatus } from '../controllers/adminUserController.js';
import { adminAuth } from '../middleware/authMiddleware.js';
import { createWarehouse, getAllWarehouses } from '../controllers/warehouseController.js';
import { createProduct, getProductById, getProductsByWarehouse, updateProduct } from '../controllers/productController.js';
const router = express.Router(); 

router.post('/adminLogin', adminLogin);

router.get('/users', adminAuth, getUserList);

router.patch('/users/:userId', adminAuth, updateUserStatus);
router.post("/warehouses", adminAuth, createWarehouse);
router.get("/warehouses", adminAuth, getAllWarehouses);
router.post("/products", adminAuth, createProduct);
router.get("/products", adminAuth, getProductsByWarehouse);

router.get("/product/:productId", adminAuth, getProductById);
router.put("/product/:productId", adminAuth, updateProduct);



export default router;
