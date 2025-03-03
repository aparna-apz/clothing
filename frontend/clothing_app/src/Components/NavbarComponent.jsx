import React from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function NavbarComponent() {
  return (
    <Container fluid className="px-5 py-2" style={{ backgroundColor: "#ffffff", borderRadius: "8px" }}>
      <Navbar>
                <Navbar.Brand 
            as={Link} 
            to="/" 
            className="fw-bold text-dark" 
            style={{ fontFamily: "inherit", fontSize: "1.8rem", letterSpacing: "1px" }}
          >
            FashionHub
          </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" style={{ color: "black" }}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" style={{ color: "black" }}>
              Shop
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" style={{ color: "black" }}>
              Cart
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" style={{ color: "black" }}>
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/logout" style={{ color: "black" }}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default NavbarComponent;
