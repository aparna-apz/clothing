import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const userData = { username, email, password };

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        setUsername("");
        setEmail("");
        setPassword("");

        // Redirect to login page
        navigate("/");
      } else {
        setError(data.detail || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row shadow-lg rounded-4 overflow-hidden w-75">
        
        {/* Left Side - Image */}
        <div className="col-md-6 d-none d-md-block image-container">
          <img
            src={`${process.env.PUBLIC_URL}/images/reg1.jpg`}
            alt="Stylish fashion model showcasing trendy clothing"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right Side - Form */}
        <div className="col-md-6 bg-white p-5">
          <h2 className="text-center fw-bold mb-4">Create an Account</h2>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 fw-bold"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-center text-muted mt-3">
            Already have an account?{" "}
            <a href="/" className="text-primary text-decoration-none">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
