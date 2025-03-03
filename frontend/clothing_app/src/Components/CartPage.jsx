import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const navigate = useNavigate(); // To navigate to the profile after order is placed

  useEffect(() => {
    if (!token) {
      alert("⚠ Please log in to view your cart.");
      return;
    }

    setIsLoading(true);

    axios
      .get("http://127.0.0.1:8000/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCartItems(response.data.cart_items);
        setTotalCartPrice(response.data.total_cart_price);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setError("Error fetching cart items. Please try again later.");
        console.error("Error fetching cart items:", error);
      });
  }, [token]);

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart/remove/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Item removed from cart!");
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Simulate the payment process
  const handleCheckout = async () => {
    try {
      // Fake payment simulation (in real scenarios, this would involve payment gateway integration)
      alert("Payment successful! Proceeding to place the order...");

      const orderItems = cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const response = await axios.post(
        "http://127.0.0.1:8000/api/place_order/",
        { cart_items: orderItems },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Order placed successfully! Redirecting to your profile...");
        // Navigate to profile to show the order
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an issue placing your order. Please try again.");
    }
  };

  if (isLoading) {
    return <p className="loading-text">Loading cart items...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="mb-3">Your Cart</h2>
      <p className="mb-3"><a href="/home">Back</a></p>
      {cartItems.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/home" className="btn btn-primary">
            Back
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product.image ? item.product.image : "/placeholder.jpg"}
                  alt={item.product.name}
                  className="product-detail-img"
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>Price: ₹{item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ₹{item.total_price}</p>
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <i className="fas fa-trash"></i> delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <h3 className="total-price">Total Price: ₹{totalCartPrice}</h3>
          <button className="btn btn-success mb-5" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
