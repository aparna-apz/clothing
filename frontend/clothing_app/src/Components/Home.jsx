import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";
import NavbarComponent from "./NavbarComponent";
import FooterComponent from "./FooterComponent";
import CategoryCards from "./CategoryCards";
function Home() {

  return (
 
    <Container fluid className="px-5 py-2">
      <NavbarComponent/>
      {/* Hero Section */}
      <Row className="text-center">
        <Col
          style={{
            backgroundImage: `url("/images/bg4.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",  // Ensures full viewport coverage
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",  // Vertically center content
            justifyContent: "center", // Horizontally center content
            textAlign: "center", // Ensures text is centered
            padding: "20px",
            position: "relative",
            marginBottom:'50px'
          }}
        >
        </Col>
      </Row>
      <CategoryCards/>
      <ProductList/>
      <FooterComponent/>
    </Container>
    
  );
}

export default Home;
