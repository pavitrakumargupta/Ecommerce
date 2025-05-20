import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss"; // assuming you have some styles

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.get("https://ecommerce-backend-89ed.onrender.com/api/admin/low-stock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching low stock products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.lowStockWrapper}>
      <h2>Low Stock Products</h2>
      {products.length === 0 ? (
        <p>No low stock products found.</p>
      ) : (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Warehouse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.warehouseId?.name || "N/A"}</td>
                <td>
                  <button
                    className={styles.updateBtn}
                    onClick={() =>
                      navigate(
                        `/admin-dashboard/warehouses/${product.warehouseId?._id}/add-product/${product._id}`
                      )
                    }
                  >
                    Update Product Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LowStock;
