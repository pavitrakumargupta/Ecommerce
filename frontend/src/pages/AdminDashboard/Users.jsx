import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserList.module.scss"; // import CSS module

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `https://ecommerce-backend-89ed.onrender.com/api/admin/users?search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data?.users || []);
    } catch (err) {
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const updateStatus = async (userId, action) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `https://ecommerce-backend-89ed.onrender.com/api/admin/users/${userId}`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  return (
    <div className={styles.container}>
      <h2>User List</h2>
      <input
        className={styles.searchInput}
        placeholder="Search by name/email/phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={`${styles.status} ${styles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className={styles.actions}>
                  {/* Block / Unblock */}
                  {!user.isBlocked ? (
                    <button
                      onClick={() => updateStatus(user._id, "block")}
                      className={styles.block}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(user._id, "activate")}
                      className={styles.activate}
                    >
                      Unblock
                    </button>
                  )}

                  {/* Approve only if not already approved */}
                  {!user.isApproved && (
                    <button
                      onClick={() => updateStatus(user._id, "approve")}
                      className={styles.approve}
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(user._id, "delete")}
                    className={styles.delete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noData}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
