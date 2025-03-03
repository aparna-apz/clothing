import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductDetail.css"; // ✅ Import custom CSS
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // Loading state for the product details
  const [error, setError] = useState(null);  // Error state for any issues during the fetch
  const [isAddingToCart, setIsAddingToCart] = useState(false);  // State for adding to cart loading
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((response) => {
        console.log("Fetched Products details:", response.data);
        setProduct(response.data);
        setIsLoading(false);  // Set loading to false after data is fetched
      })
      .catch((error) => {
        setError("Error fetching product details. Please try again later.");
        setIsLoading(false);  // Stop loading in case of an error
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  // Add item to cart
  const addToCart = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("⚠ Please log in to add items to your cart.");
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);  // Set loading state for adding to cart

    axios
      .post(
        "http://127.0.0.1:8000/api/shoppingcart/",
        { product_id: id, quantity: 1 }, // ✅ Ensure the field name is 'product'
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Send token in headers
      )
      .then(() => {
        alert("✅ Product added to cart!");
        setIsAddingToCart(false);  // Reset loading state after adding
      })
      .catch((error) => {
        setIsAddingToCart(false);  // Reset loading state if error occurs
        console.error("Error adding to cart:", error.response?.data);
        alert(`❌ Error adding to cart: ${JSON.stringify(error.response?.data)}`);
      });
  };

  if (isLoading) {
    return <div className="loading-text">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div className="container product-detail-container">
      <div className="row justify-content-center align-items-center">
        {/* Left: Product Image */}
        <div className="col-md-5 text-center">
          <img
            src={`http://127.0.0.1:8000${product.image}`}
            alt={product.name}
            className="product-detail-img"
          />
        </div>

        {/* Right: Product Details */}
        <div className="col-md-6">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description"><b>Description: </b>{product.description}</p>
          <p className="product-description"><b>Size & Fit: </b>{product.size}</p>
          <p className="product-description"><b>Fabric & Material: </b>{product.fabric}</p>
          <h4 className="product-price">₹{product.price}</h4>

          {/* Buttons */}
          <button
            className="btn custom-btn-primary "
            onClick={addToCart}
            disabled={isAddingToCart}  // Disable button while adding to cart
          >
            {isAddingToCart ? (
              <span>Adding...</span>  // Show a loading text while adding to cart
            ) : (
              <i className="bi bi-cart-plus">Add to Cart</i> 
            )}
          </button>
          <Link to="/cart" className="btn btn-primary mt-3 mb-3">
            🛒 View Cart
          </Link>
          <Link to="/home" className="btn custom-btn-secondary">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
