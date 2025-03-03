import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    phone_number: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

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
      setError("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        await axios.delete("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Profile deleted");
        navigate("/");
      } catch (err) {
        setError("Failed to delete profile");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Sidebar with Avatar and Name */}
        <div className="profile-sidebar">
          <img src="https://via.placeholder.com/80" alt="Profile Avatar" />
          <h2>{profile.name}</h2>
          
          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          {!isEditing ? (
            <>
              <p><strong>Phone Number:</strong> {profile.phone_number}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
              <button onClick={handleDelete} className="delete-btn">Delete Profile</button>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="profile-form">
              <label>Name:</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} required />

              <label>Phone Number:</label>
              <input type="text" name="phone_number" value={profile.phone_number} onChange={handleChange} required />

              <label>Address:</label>
              <textarea name="address" value={profile.address} onChange={handleChange} required />

              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
