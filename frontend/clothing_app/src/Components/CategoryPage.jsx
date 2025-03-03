import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Col, Row, Container } from "react-bootstrap";

function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/products/category/${category}/`)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, [category]);

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Products for: {category}</h2>
      <Row className="justify-content-center">
        {products.length > 0 ? (
          products.map(product => (
            <Col key={product.id} md={4} sm={6} className="mb-3">
              <Card>
                <Card.Img variant="top" src={product.image} alt={product.name} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ₹{product.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No products available in this category.</p>
        )}
      </Row>
    </Container>
  );
}

export default CategoryPage;
