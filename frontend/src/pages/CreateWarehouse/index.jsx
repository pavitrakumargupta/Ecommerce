import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import styles from "./index.module.scss";

const LocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

const CreateWarehouse = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "http://localhost:5000/api/admin/warehouses",
        {
          name,
          address,
          location: {
            coordinates: [location.lng, location.lat],
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Warehouse created!");
      navigate(-1); // go back
    } catch (err) {
      alert("Failed to create warehouse");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
      <h2>Create Warehouse</h2>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formGroup}>
          <label>Warehouse Name</label>
          <input
            type="text"
            placeholder="e.g. Delhi Central"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* <div className={styles.formGroup}>
          <label>Address (optional)</label>
          <input
            type="text"
            placeholder="e.g. Near Airport"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div> */}

        <div className={styles.formGroup}>
          <label>Choose Location</label>
          <MapContainer center={[28.6139, 77.2090]} zoom={5} className={styles.map}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onSelect={setLocation} />
            {location && <Marker position={[location.lat, location.lng]} />}
          </MapContainer>
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!location}>
          Create Warehouse
        </button>
      </form>
    </div>
  );
};

export default CreateWarehouse;
