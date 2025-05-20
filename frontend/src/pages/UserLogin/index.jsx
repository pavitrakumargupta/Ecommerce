import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
// import axios from "axios";
import axios from "../../axios"

const Index = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!identifier.trim()) {
      newErrors.identifier = "Email or phone is required.";
    } else {
      if (identifier.includes("@")) {
        const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
        if (!emailRegex.test(identifier)) {
          newErrors.identifier = "Invalid email format.";
        }
      } else {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(identifier)) {
          newErrors.identifier = "Invalid phone number format.";
        }
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    useEffect(() => {
      const token = localStorage.getItem("userToken");
      
      if (token) {
        navigate("/user-dashboard");
      }
    }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      let payload = { password };
      if (identifier.includes("@")) {
        payload.email = identifier.trim().toLowerCase();
      } else {
        payload.phone = identifier.trim();
      }

      const res = await axios.post(
        "/user/userLogin",
        payload
      );

      const token = res.data?.token;
      if (token) {
        localStorage.setItem("userToken", token);
        alert("Login successful");
        navigate("/user-dashboard"); // Update route if needed
      } else {
        alert("Login failed. Invalid credentials.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logincontainer}>
        <form className={styles.form} onSubmit={handleLogin}>
          <h2 className={styles.title}>User Login</h2>

          <div className={styles.inputGroup}>
            <label>Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={styles.input}
            />
            {errors.identifier && (
              <p className={styles.error}>{errors.identifier}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className={styles.switch}>
            Don't have an account?{" "}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate("/user-signup")}
            >
              Register
            </button>
          </p>
          <p className={styles.switch}>
            Want to login as admin?{" "}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate("/admin-login")}
            >
              Switch to Admin
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Index;
