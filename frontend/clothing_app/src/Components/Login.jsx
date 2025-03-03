import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { username, password };

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.access) {
        console.log("Login successful:", data);
        console.log("data access",data.access)
        
        // ✅ Store access & refresh tokens
        localStorage.setItem("access", data.access);
        console.log(localStorage.getItem("access"));

        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", username);
        
        navigate("/home"); // Redirect to the Shop page after login
      } else {
        setError("Invalid credentials.");
        console.log("Login failed:", data);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-75 shadow-lg bg-white rounded overflow-hidden">
        {/* Left Column - Login Form */}
        <Col md={6} className="p-5 d-flex flex-column justify-content-center">
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>
          </Form>
          <p className="text-center">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </Col>
        {/* Right Column - Image */}
        <Col md={6} className="d-none d-md-block p-0">
          <img
            src={`${process.env.PUBLIC_URL}/images/reg2.jpg`}
            alt="Login visual"
            className="img-fluid w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
