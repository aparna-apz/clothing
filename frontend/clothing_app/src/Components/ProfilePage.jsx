import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      
      <div className="profile-header">
          <div className="header-top">
            <a href="/home" className="home-link">🏠 Home</a>
          </div>

          <div className="profile-info text-center">
            <h2 className="profile-name">Hello, {profile.name}!</h2><br></br>
            <p className="profile-email">{profile.email}</p>
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
    </div>
  );
};

export default ProfilePage;
