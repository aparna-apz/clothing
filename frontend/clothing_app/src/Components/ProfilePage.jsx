import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  // Fetch Profile and Orders
  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchOrders();
    } else {
      alert("⚠ Please log in to view your profile.");
      navigate("/login");  // Navigate to login if not logged in
    }
  }, [token]);

  // Fetch user profile details
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to load profile.");
    }
  };
console.log(orders)
  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
      console.log(setOrders)
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://127.0.0.1:8000/api/profile/", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // Loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div
  className="profile-header-center"
  style={{
    background: "linear-gradient(to right,rgb(84, 84, 95),rgb(126, 128, 184))",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "0 0 10px 10px",
  }}
>
  <a
    href="/home"
    className="home-link"
    style={{
      color: "#fff",
      fontSize: "1rem",
      textDecoration: "none",
      
    }}
  >
    🏠 Home
  </a>

  <div className="profile-info" style={{ margin:'0',color: "#fff"}}>
    <h2 className="profile-name" style={{ margin:'0',  fontSize: "1.75rem" }}>
      Hello, {profile.name}!
    </h2>
    <p className="profile-email" style={{ margin:'0', fontSize: "1rem" }}>
      {profile.email}
    </p>
  </div>
</div>


      <div className="profile-details">
        {!isEditing ? (
          <>
            <p><strong>Phone:</strong> {profile.phone_number}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <label>Name:</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} required />

            <label>Phone:</label>
            <input type="text" name="phone_number" value={profile.phone_number} onChange={handleChange} required />

            <label>Address:</label>
            <textarea name="address" value={profile.address} onChange={handleChange} required />

            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </form>
        )}
      </div>

      <div className="order-section">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <div>
              {orders.map((order) => (
  <div key={order.id} className="order-card">
    <h3>Order #{order.id}</h3>
    <p><strong>Status:</strong> {order.status}</p>
    <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
    <p><strong>Total Price:</strong> ₹{order.total_price}</p>
    <div className="order-items">
      <h4>Items:</h4>
      <div className="order-items-list">
        {order.order_items.map((item) => (
          <div key={item.id} className="order-item-card">
            {item.product ? (
              <div className="order-item-details">
                
                
                <div className="order-item-info">
                  <h3>{item.product.name}</h3>
                  <span>Quantity: {item.quantity}</span> - ₹{item.total_price}
                </div>
              </div>
            ) : (
              <p>Product details unavailable</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
