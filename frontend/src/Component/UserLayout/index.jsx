import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.scss"; // Create your own SCSS for styling
import { useEffect } from "react";

const UserLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user-login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/user-login");
  };

  const handleLoginAsAdmin = () => {
    navigate("/admin-login");
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2>User Menu</h2>
        <nav>
          <ul>
            <li>
              <Link to="/user-dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/user-dashboard/orders">Orders</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        {/* Top Navigation */}
        <header className={styles.navbar}>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleLoginAsAdmin}>Login as Admin</button>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
