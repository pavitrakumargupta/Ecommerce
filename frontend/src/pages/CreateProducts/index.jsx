import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

const CreateProduct = () => {
  const { warehouseId, productID } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = productID !== "new";

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("adminToken");
          const res = await axios.get(
            `https://ecommerce-backend-89ed.onrender.com/api/admin/product/${productID}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setForm({
            name: res.data.name,
            quantity: res.data.quantity,
            price: res.data.price,
          });
        } catch (err) {
          console.error("Failed to fetch product", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productID]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");

      if (isEditMode) {
        await axios.put(
          `https://ecommerce-backend-89ed.onrender.com/api/admin/product/${productID}`,
          { ...form },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "https://ecommerce-backend-89ed.onrender.com/api/admin/products",
          { ...form, warehouseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      navigate(`/admin-dashboard/warehouses/${warehouseId}/products`);
    } catch (err) {
      console.error("Failed to submit product", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className={styles.loader}>Loading product details...</div>;

  return (
    <div className={styles.formContainer}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back
      </button>
      <h2>{isEditMode ? "Edit Product" : "Create Product"}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Name:
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Product"
            : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
