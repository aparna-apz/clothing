import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductList.css"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        console.log("Fetched Products:", response.data);
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      {/* Full-width gradient background */}
      <div className="collection-header m-5">
        <h1>Our Collection</h1>
      </div>

      <div className="container mt-5 mb-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <div className="product-card text-center">
                {/* 🔗 Clickable Image Redirecting to Product Details */}
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                  />
                </Link>
                <h5 className="product-title mt-2">{product.name}</h5>
                <p className="product-price">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
