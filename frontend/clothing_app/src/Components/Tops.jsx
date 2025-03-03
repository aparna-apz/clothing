import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Tops() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // Use navigate for back button

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/products/");
                console.log("Fetched Products:", response.data);
                setProducts(response.data || []); // Ensure default is an array
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]); // Set empty array if there's an error
            }
        };
    
        fetchData();
    }, []);
    

    // Filter products that belong to the "Dresses" category
    const dresses = products.filter((item) => item.category === "2");

    return (
        <div className="container mt-5 mb-5">
            {/* Back Button */}
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
                {dresses.length > 0 ? (
                    dresses.map((product) => (
                        <div key={product.id} className="col">
                            <div className="product-card text-center">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.image} alt={product.name} className="product-img" />
                                </Link>
                                <h5 className="product-title mt-2">{product.name}</h5>
                                <p className="product-price">₹{product.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No dresses available.</p>
                )}
            </div>
        </div>
    );
}

export default Tops;
