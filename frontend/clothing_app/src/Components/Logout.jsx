import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the access and refresh tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
   console.log( localStorage.getItem("access"))
    // Redirect to the login page
    navigate("/");
  };

  return (
<div className="d-flex justify-content-center align-items-center vh-100">
  <div className="card p-4 shadow-lg" style={{ width: "300px" }}>
    <h3 className="text-center mb-3">Are you sure?</h3>
    <p className="text-center mb-4">You want to log out?</p>
    <div className="d-flex justify-content-center">
      <button 
        onClick={handleLogout} 
        className="btn btn-danger w-50"
      >
        Log Out
      </button>
    </div>
    <div className="d-flex justify-content-center mt-3">
      <button 
        onClick={() => navigate('/home')} 
        className="btn btn-secondary w-50"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
  );
};

export default Logout;
