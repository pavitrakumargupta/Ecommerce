import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import axios from "../../axios"

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const {data} = await axios.post(
        "/admin/adminLogin",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // const data = await response.json();
      // if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin-dashboard");
      // } else {
      //   setError(data.message || "Login failed");
      // }
    } catch (err) {
      console.log(err);
      
      setError("Something went wrong");
    }
  };

  return (
    <div className={styles.Container}>
      <div className={styles.loginContainer}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">Login</button>
          <p className={styles.switch}>
            Want to login as user?{" "}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate("/user-login")}
            >
              Switch to User
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
