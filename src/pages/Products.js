import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setProducts(res.data.products))
        .catch(() => setError("Unauthorized access. Please login."));
    }, [token]);

    const handleQuantityChange = (productID, value) => {
        setQuantity((prev) => ({ ...prev, [productID]: value }));
    };

    const handleAddToCart = async (product) => {
        const selectedQuantity = quantity[product.ProductID] || 1;
        try {
            const cartData = { 
                ProductID: product.ProductID, 
                Quantity: selectedQuantity, 
                CustomerID: 4 // เปลี่ยนเป็นค่าที่ดึงจาก Auth ได้ถ้าต้องการ
            };

            console.log("📦 Adding to Cart:", cartData);

            const response = await axios.post(
                "http://localhost:5000/api/cart",
                cartData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === "success") {
                setSuccess("✅ Item added to cart!");
                setTimeout(() => navigate("/cart"), 1000); // ✅ นำทางไปยัง Cart หลังจากเพิ่มสำเร็จ
            } else {
                setError("❌ Failed to add item to cart.");
            }
        } catch (err) {
            setError("❌ Error adding item to cart.");
        }

        setTimeout(() => {
            setSuccess("");
            setError("");
        }, 2000);
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg bg-light"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center text-primary fw-bold mb-4">🛍 Our Products</h2>

            {success && <p className="alert alert-success text-center">{success}</p>}
            {error && <p className="alert alert-danger text-center">{error}</p>}

            <div className="row">
                {products.map((p) => (
                    <div key={p.ProductID} className="col-lg-4 col-md-6 mb-4">
                        <motion.div 
                            className="card shadow-sm p-3 border-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <h5 className="fw-bold text-primary">{p.ProductName}</h5>
                                <p className="text-muted">{p.Description}</p>
                                <p className="fw-bold text-danger fs-5">{parseFloat(p.Price).toLocaleString()} บาท</p>
                                
                                <div className="mb-3">
                                    <label className="form-label">Quantity:</label>
                                    <input 
                                        type="number" 
                                        className="form-control text-center" 
                                        value={quantity[p.ProductID] || 1} 
                                        min="1"
                                        onChange={(e) => handleQuantityChange(p.ProductID, parseInt(e.target.value))}
                                    />
                                </div>

                                <motion.button 
                                    className="btn btn-dark w-100"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAddToCart(p)}
                                >
                                    🛒 Add to Cart
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Products;
