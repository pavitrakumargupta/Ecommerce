import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./index.module.scss";
import { getAddressFromCoordinates } from "../Warehouse";

const ExploreProducts = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const debounceTimeout = useRef(null);

  // Modal and ordering states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchProducts = async (lat, lng, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");

      const res = await axios.get(
        "https://ecommerce-backend-89ed.onrender.com/api/user/getProducts",
        {
          params: { lat, lng, search },
          headers: {
            Authorization: `Bearer ${token}`, // attach JWT token
          },
        }
      );

      const enrichedData = await Promise.all(
        res.data.map(async (entry) => {
          const { coordinates } = entry.warehouse.location;
          const address = await getAddressFromCoordinates(
            coordinates[1],
            coordinates[0]
          );
          return {
            ...entry,
            warehouse: { ...entry.warehouse, address },
          };
        })
      );

      setData(enrichedData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setLocationError("Could not fetch nearby products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        fetchProducts(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Location access denied or unavailable.");
        setLoading(false);
      }
    );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = e.target.value;
    setSearchTerm(term);

    // Debounce logic
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (coordinates) {
        fetchProducts(coordinates.lat, coordinates.lng, term);
      }
    }, 500);
  };

  // Open modal with selected product info
  const handleOrderNowClick = (product, warehouse) => {
    setSelectedProduct({ ...product, warehouse });
    setOrderQuantity(1);
    setModalOpen(true);
  };

  // Submit order API call
  const submitOrder = async () => {
    if (!selectedProduct) return;

    try {
      setPlacingOrder(true);
      const token = localStorage.getItem("userToken");

      await axios.post(
        "https://ecommerce-backend-89ed.onrender.com/api/order/create",
        {
          productId: selectedProduct._id,
          quantity: orderQuantity,
          price: selectedProduct.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully!");
      setModalOpen(false);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (locationError) return <div className={styles.error}>{locationError}</div>;

  return (
    <div className={styles.dashboard}>
      <h2>Products from Nearby Warehouses</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search products..."
        className={styles.searchBox}
      />

      {loading ? (
        <div className={styles.loader}>Loading nearby products...</div>
      ) : data.length > 0 ? (
        data.map(({ warehouse, products }) => (
          <div key={warehouse.id} className={styles.warehouseSection}>
            <div className={styles.warehouseInfo}>
              <strong>Warehouse:</strong> {warehouse.name} <br />
              <strong>Address:</strong> {warehouse.address || "Not available"}
            </div>
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div key={product._id} className={styles.productCard}>
                  <h3>{product.name}</h3>
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{product.price}
                  </p>
                  <button
                    onClick={() => handleOrderNowClick(product, warehouse)}
                  >
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No matching products found.</p>
      )}

      {/* Modal */}
      {modalOpen && selectedProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Order: {selectedProduct.name}</h3>
            <p>
              <strong>Available:</strong> {selectedProduct.quantity}
            </p>
            <p>
              <strong>Price per unit:</strong> ₹{selectedProduct.price}
            </p>

            <label>
              Quantity:{" "}
              <input
                type="number"
                min={1}
                max={selectedProduct.quantity}
                value={orderQuantity}
                onChange={(e) =>
                  setOrderQuantity(
                    Math.max(
                      1,
                      Math.min(selectedProduct.quantity, Number(e.target.value))
                    )
                  )
                }
              />
            </label>

            <p>
              <strong>Total amount:</strong> ₹
              {orderQuantity * selectedProduct.price}
            </p>

            <div className={styles.modalActions}>
              <button onClick={submitOrder} disabled={placingOrder}>
                {placingOrder ? "Placing..." : "Confirm Order"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreProducts;
