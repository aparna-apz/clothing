import React from "react";
import { Card, Col, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Dresses", image: "/images/shopdresses.jpg", path: "/dresses" },
  { name: "Tops", image: "/images/shoptops.jpg", path: "/tops" },
  { name: "Sets", image: "/images/shopsets.jpg", path: "/sets" },
  { name: "Bottoms", image: "/images/shopbottoms.jpg", path: "/bottoms" },
];

function CategoryCards() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCategoryClick = (path) => {
    navigate(path); // Navigate to the selected category page
  };

  return (
    <Container className="py-4 mt-4">
      <h2 className="text-center mb-4">Shop by Category</h2>
      
      <Row className="justify-content-center">
        <hr className="bg-light m-3" />
        {categories.map((category, index) => (
          <Col key={index} md={3} sm={6} className="mb-2 mt-2">
            <Card 
              className="category-card" 
              onClick={() => handleCategoryClick(category.path)} 
              style={{ cursor: "pointer" }}>
              <Card.Img variant="top" src={category.image} alt={category.name} className="category-image"/>
              <Card.Body className="text-center">
                <Card.Title className="category-name">{category.name}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <hr className="bg-light m-3" />
      </Row>
    </Container>
  );
}

export default CategoryCards;
