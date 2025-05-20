import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './index.module.scss';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      const res = await axios.get("https://ecommerce-backend-89ed.onrender.com/api/order/getUserOrders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch user orders:", err);
      setError("Failed to fetch your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading) return <div className={styles.loader}>Loading orders...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className={styles.ordersContainer}>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className={styles.orderCard}>
          <h3>{order.productId?.name || "Product Not Found"}</h3>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Total:</strong> ₹{order.quantity * order.price}</p>
          <p><strong>Status:</strong> {order.status || "Pending"}</p>
          <p><strong>Ordered on:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
