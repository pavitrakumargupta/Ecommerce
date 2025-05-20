import Order from "../models/Order.js";
import Product from "../models/Product.js";


export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const userId = req.user.id;

    if (!productId || !userId || quantity == null || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Check if enough quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient product quantity available" });
    }

    // 3. Create the order
    const order = await Order.create({
      productId,
      userId,
      quantity,
      price,
      status: "Pending",
    });

    // 4. Reduce the product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (status === "cancelled" && existingOrder.status !== "cancelled") {
      const product = await Product.findById(existingOrder.productId);
      if (product) {
        product.quantity += existingOrder.quantity;
        await product.save();
      }
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getOrdersByUserId = async (req, res) => {
  try {

    const userId = req.user.id; 

    const orders = await Order.find({ userId })
      .populate("productId")
      .sort({ updatedAt: -1 }); // Most recent first

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user's orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("productId userId")
      .sort({ updatedAt: -1 }); // Most recent first

    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};
