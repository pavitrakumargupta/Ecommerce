// src/pages/AdminDashboard/Layout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./admin.module.scss";
import { useEffect } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    }
  }, []);

  const handleUserLogin = () => {
    navigate("/user-login");
  };
  const handleLogout = () => {
    localStorage.setItem("adminToken", '');
    navigate("/admin-login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav>
          {/* <NavLink to="/admin-dashboard" end activeClassName={styles.active}>
            Dashboard
          </NavLink> */}
          <NavLink to="/admin-dashboard" activeClassName={styles.active}>
            Users
          </NavLink>
          <NavLink to="/admin-dashboard/orders" activeClassName={styles.active}>
            Orders
          </NavLink>
          <NavLink to="/admin-dashboard/low-stock" activeClassName={styles.active}>
            Low Stock Products
          </NavLink>
          <NavLink
            to="/admin-dashboard/warehouses"
            activeClassName={styles.active}
          >
            Warehouse's
          </NavLink>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.navbar}>
          <button onClick={handleLogout}>Log Out</button>
          <button onClick={handleUserLogin}>Login as User</button>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
