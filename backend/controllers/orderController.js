import Order from "../models/Order.js";

// 1. Create Order
export const createOrder = async (req, res) => {
  try {
    const { productId,  quantity, price } = req.body;
    const userId = req.user.id; 

    if (!productId || !userId || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Order.create({
      productId,
      userId,
      quantity,
      price,
      status: "initiated",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Update Order (status or quantity, price)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, quantity, price } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, quantity, price },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Get Orders by User ID
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

// 4. Get All Orders Sorted by Updated Timestamp
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
