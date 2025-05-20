
import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5000/api", // Or use your deployed URL
  baseURL: "https://ecommerce-backend-89ed.onrender.com/api",
});


instance.interceptors.response.use(
  (response) => response, // Pass through if successful
  (error) => {
    if (error.response?.status === 401) {
      const isAdmin = window.location.pathname.includes("/admin");
      localStorage.removeItem(isAdmin ? "adminToken" : "userToken");
      window.location.href = isAdmin ? "/admin-login" : "/user-login";
    }
    return Promise.reject(error);
  }
);

export default instance;
