import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

const WarehouseProduct = () => {
  const { warehouseId } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `https://ecommerce-backend-89ed.onrender.com/api/admin/products?warehouseId=${warehouseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [warehouseId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Products for Warehouse</h2>
        <button
          className={styles.createBtn}
          onClick={() => navigate(`/admin-dashboard/warehouses/${warehouseId}/add-product/new`)}
        >
          ➕ Create Product
        </button>
      </div>
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product._id} className={styles.productItem}>
            <div>
              <strong>{product.name}</strong> — Qty: {product.quantity} — Price: ${product.price.toFixed(2)}
            </div>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/admin-dashboard/warehouses/${warehouseId}/add-product/${product._id}`)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WarehouseProduct;
