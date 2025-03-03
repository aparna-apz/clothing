import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";  // Import PrivateRoute

import Home from "./Components/Home";
import Shop from "./Components/Shop";  
import ProductList from "./Components/ProductList"; 
import ProductDetail from "./Components/ProductDetail"; 
import Login from "./Components/Login";
import Dresses from "./Components/Dresses";
import CategoryCards from "./Components/CategoryCards";
import Tops from "./Components/Tops";
import Sets from "./Components/Sets";
import Register from "./Components/Register";
import CartPage from "./Components/CartPage";
import Logout from "./Components/Logout";
import ProfilePage from "./Components/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Accessible without login */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes - Only accessible after login */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/categories" element={<CategoryCards />} />
          <Route path="/dresses" element={<Dresses />} />
          <Route path="/tops" element={<Tops />} />
          <Route path="/sets" element={<Sets />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
