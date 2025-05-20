import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./index.module.scss";

export const getAddressFromCoordinates = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    return res.data.display_name || "No address found";
  } catch (err) {
    console.error("Failed to get address from coordinates", err);
    return "No address found";
  }
};

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5000/api/admin/warehouses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enriched = await Promise.all(
          res.data.map(async (wh) => {
            const lat = wh.location?.coordinates?.[1];
            const lon = wh.location?.coordinates?.[0];
            const address = await getAddressFromCoordinates(lat, lon);
            return { ...wh, resolvedAddress: address };
          })
        );

        setWarehouses(enriched);
      } catch (err) {
        console.error("Failed to fetch warehouses", err);
      }
    };

    fetchWarehouses();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Warehouses</h2>
        <button onClick={() => navigate("/admin-dashboard/createWarehouse")}>
          ➕ Create Warehouse
        </button>
      </div>
      <ul className={styles.list}>
        {warehouses.map((wh) => (
          <li key={wh._id} className={styles.card}>
            <strong>{wh.name}</strong>
            <br />
            Coordinates: [{wh.location?.coordinates?.[1]}, {wh.location?.coordinates?.[0]}]
            <br />
            Address: {wh.resolvedAddress}
            <div className={styles.actions}>
              <button onClick={() => navigate(`/admin-dashboard/warehouses/${wh._id}/products`)}>
                📦 View Products
              </button>
              <button onClick={() => navigate(`/admin-dashboard/warehouses/${wh._id}/add-product/new`)}>
                ➕ Add Product
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Warehouses;
