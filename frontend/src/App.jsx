import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import AdminLayout from "./pages/AdminDashboard/Layout";
import DashboardHome from "./pages/AdminDashboard/DashboardHome";
import Users from "./pages/AdminDashboard/Users";
import Orders from "./pages/AdminDashboard/Orders";
import UserLayout from "./Component/UserLayout";
import CreateWarehouse from "./pages/CreateWarehouse/index.jsx";
import Warehouses from "./pages/Warehouse/index.jsx";
import WarehouseProduct from "./pages/WarehouseProduct/index.jsx";
import CreateProduct from "./pages/CreateProducts/index.jsx";
import ExploreProducts from "./pages/ExploreProducts/index.jsx";
import UserOrders from "./pages/UserOrders/index.jsx";
import AdminOrders from "./pages/AdminOrder/index.jsx";
import LowStock from "./pages/LowStock/index.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route index element={<Users />} />
          {/* <Route path="users" element={<Users />} /> */}
          <Route path="orders" element={<AdminOrders />} />
          <Route path="low-stock" element={<LowStock />} />
          <Route path="warehouses" element={<Warehouses />} />
          <Route path="createWarehouse" element={<CreateWarehouse />} />
          <Route
            path="warehouses/:warehouseId/products"
            element={<WarehouseProduct />}
          />
          <Route
            path="warehouses/:warehouseId/add-product/:productID?"
            element={<CreateProduct />}
          />
          {/* <Route
            path="warehouses/:warehouseId/add-product/new"
            element={<CreateProduct />}
          /> */}
        </Route>

        <Route path="/user-dashboard" element={<UserLayout />}>
          <Route index element={<ExploreProducts/>} />
          <Route path="orders" element={<UserOrders />} />
          {/* <Route path="orders" element={<UserOrders />} />
          <Route path="profile" element={<UserProfile />} /> */}
        </Route>
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
