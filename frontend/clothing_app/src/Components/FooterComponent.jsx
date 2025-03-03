import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaShoppingBag, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function FooterComponent() {
  return (
    <footer className="footer bg-dark text-light py-5">
      <Container>
        <Row className="text-center">
          {/* Brand & About Us */}
          <Col md={3} className="mb-3">
            <h4 className="footer-brand">
              <FaShoppingBag className="me-2" /> FashionHub
            </h4>
            <p>Your ultimate destination for trendy fashion. Explore our collection and style your look effortlessly.</p>
          </Col>

          {/* Quick Links */}
          <Col md={3} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/home" className="footer-link">Home</Link></li>
              <li><Link to="/products" className="footer-link">Shop</Link></li>
        
            </ul>
          </Col>

          {/* Contact Details */}
          <Col md={3} className="mb-3">
            <h5>Contact Us</h5>
            <p><FaPhone className="me-2" /> +91 98765 43210</p>
            <p><FaEnvelope className="me-2" /> support@fashionhub.com</p>
            <p><FaMapMarkerAlt className="me-2" /> 123 Fashion Street, Mumbai, India</p>
          </Col>

          {/* Social Media */}
          <Col md={3} className="mb-3">
            <h5>Follow Us</h5>
            <div>
              <a href="https://www.instagram.com/" className="footer-icon" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.facebook.com/login/" className="footer-icon" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com/" className="footer-icon" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            </div>
          </Col>
        </Row>

        <hr className="bg-light" />

        <Row>
          <Col className="text-center">
            <p className="mb-0">© {new Date().getFullYear()} FashionHub. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>

      {/* Custom Styles */}
      <style>{`
        .footer {
          text-align: center;
        }
        .footer-brand {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .footer-link {
          color: white;
          text-decoration: none;
        }
        .footer-link:hover {
          color: #f8c102;
        }
        .footer-icon {
          color: white;
          font-size: 1.5rem;
          margin: 0 10px;
        }
        .footer-icon:hover {
          color: #f8c102;
        }
      `}</style>
    </footer>
  );
}

export default FooterComponent;
