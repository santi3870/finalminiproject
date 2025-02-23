import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    // ✅ ฟังก์ชันดึงข้อมูลสินค้าในตะกร้า
    const fetchCartItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.cart.length > 0) {
                setCartItems(response.data.cart);
            } else {
                setError("❌ No items in cart.");
            }
        } catch (err) {
            console.error("❌ Fetch Cart Error:", err);
            setError("❌ Failed to fetch cart items.");
        }
    };

    // ✅ ฟังก์ชันลบสินค้าออกจากตะกร้า (ทีละชิ้น)
    const handleDelete = async (cartID) => {
        if (!window.confirm("⚠️ Are you sure you want to remove this item?")) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/${cartID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "success") {
                alert("✅ Item removed from cart!");
                setCartItems(cartItems.filter(item => item.CartID !== cartID));
            } else {
                setError("❌ Failed to remove item.");
            }
        } catch (err) {
            console.error("❌ Delete Cart Error:", err);
            setError("❌ Error removing item from cart.");
        }
    };

    // ✅ ฟังก์ชันลบสินค้าทั้งหมดออกจากตะกร้า
    const handleRemoveAll = async () => {
        if (!window.confirm("⚠️ Are you sure you want to remove all items from the cart?")) return;

        try {
            const response = await axios.delete("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "success") {
                alert("✅ All items removed from cart!");
                setCartItems([]); // อัปเดต UI ให้ตะกร้ากลายเป็นว่าง
            } else {
                setError("❌ Failed to remove all items.");
            }
        } catch (err) {
            console.error("❌ Remove All Error:", err);
            setError("❌ Error removing all items.");
        }
    };

    // ✅ ฟังก์ชัน Checkout สร้างออเดอร์ใหม่ใน SQL และลบตะกร้า
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("❌ Your cart is empty!");
            return;
        }

        const totalAmount = cartItems.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
        const customerID = cartItems[0]?.CustomerID || 1;

        const orderData = {
            CustomerID: customerID,
            TotalPrice: totalAmount,
            Status: "Pending",
        };

        try {
            // ✅ 1. สร้างคำสั่งซื้อ (Order)
            const orderResponse = await axios.post("http://localhost:5000/api/orders", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (orderResponse.data.status === "success") {
                console.log("✅ Order created successfully:", orderResponse.data);

                // ✅ 2. ลบสินค้าทั้งหมดจากตะกร้า (Cart)
                const deleteResponse = await axios.delete("http://localhost:5000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (deleteResponse.data.status === "success") {
                    console.log("🛒 Cart cleared successfully");
                    setCartItems([]); // เคลียร์ตะกร้า
                    alert(`✅ Order placed successfully! Order ID: ${orderResponse.data.OrderID}`);
                    navigate(`/orders?id=${orderResponse.data.OrderID}`);
                } else {
                    alert("❌ Failed to clear cart items.");
                }
            } else {
                alert("❌ Failed to create order.");
            }
        } catch (err) {
            console.error("❌ Checkout Error:", err);
            setError("❌ Error during checkout.");
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0).toLocaleString();
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg bg-light"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-center text-primary fw-bold mb-4">🛒 Your Shopping Cart</h2>

            {error && <p className="alert alert-danger text-center">{error}</p>}

            {cartItems.length === 0 ? (
                <p className="text-center text-danger fs-4">Your cart is empty.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>CartID</th>
                                <th>ProductID</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>CustomerID</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <motion.tr key={item.CartID} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                                    <td>{item.CartID}</td>
                                    <td>{item.ProductID}</td>
                                    <td>{item.ProductName}</td>
                                    <td>{parseFloat(item.Price).toLocaleString()} บาท</td>
                                    <td>{item.CustomerID}</td>
                                    <td>{item.Quantity}</td>
                                    <td>
                                        <motion.button 
                                            className="btn btn-danger btn-sm"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(item.CartID)}
                                        >
                                            ❌ Remove
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h3 className="text-end text-danger fw-bold">Total Price: {getTotalPrice()} บาท</h3>

            <div className="d-flex justify-content-between mt-4">
                {/* ปุ่ม Back to Products (ซ้าย) */}
                <motion.button 
                    className="btn btn-secondary px-4" 
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/products")}
                >
                    🔙 Back to Products
                </motion.button>

                {/* ปุ่ม Remove All (กลาง) */}
                <motion.button 
                    className="btn btn-warning px-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveAll}
                >
                    🗑 Remove All
                </motion.button>

                {/* ปุ่ม Checkout (ขวา) */}
                <motion.button 
                    className="btn btn-success px-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCheckout}
                >
                    💳 Checkout
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Cart;
