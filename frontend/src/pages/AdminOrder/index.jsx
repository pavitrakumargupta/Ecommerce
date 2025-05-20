import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import axios from "../../axios"
import styles from './index.module.scss';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusOptions] = useState(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("/order/getAllOrders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `/order/updateOrder/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className={styles.adminOrders}>
      <h2>All Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId?.firstname || "N/A"}</td>
                <td>{order.productId?.name || "N/A"}</td>
                <td>{order.quantity}</td>
                <td>₹{order.price}</td>
                <td>{order.status}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
