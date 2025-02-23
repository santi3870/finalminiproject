import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // ใช้ useNavigate สำหรับเปลี่ยนเส้นทาง
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { motion } from "framer-motion"; // เพิ่มบรรทัดนี้


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);  // รายการสินค้าที่อยู่ในตะกร้า
    const [totalPrice, setTotalPrice] = useState(0); // ราคาทั้งหมด
    const [error, setError] = useState("");          // ข้อความ error
    const token = localStorage.getItem("token");    // token สำหรับการตรวจสอบสิทธิ์
    const navigate = useNavigate(); // สำหรับการเปลี่ยนเส้นทางไปหน้าชำระเงิน

    useEffect(() => {
        fetchCartItems(); // โหลดสินค้าจากตะกร้าเมื่อหน้าโหลด
    }, []);

    // ✅ ฟังก์ชันดึงข้อมูลสินค้าจากตะกร้า
    const fetchCartItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.cart && response.data.cart.length > 0) {
                setCartItems(response.data.cart);
                calculateTotalPrice(response.data.cart);
            } else {
                setError("❌ No items in cart.");
            }
        } catch (err) {
            console.error("❌ Fetch Cart Error:", err);
            setError("❌ Failed to fetch cart items.");
        }
    };

    // ✅ ฟังก์ชันคำนวณราคาทั้งหมดในตะกร้า
    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
        setTotalPrice(total);
    };

    // ✅ ฟังก์ชันลบสินค้าจากตะกร้า
    const removeItemFromCart = async (productID) => {
        try {
            // ลบสินค้าจากตะกร้า
            const response = await axios.delete(`http://localhost:5000/api/cart/${productID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                console.log("✅ Item removed:", response.data);
                fetchCartItems(); // รีเฟรชตะกร้า
            } else {
                setError("❌ Failed to remove item.");
            }
        } catch (err) {
            console.error("❌ Remove Item Error:", err);
            setError("❌ Failed to remove item.");
        }
    };

    // ✅ ไปยังหน้าชำระเงิน
    const goToPayment = () => {
        if (cartItems.length === 0) {
            alert("❌ Your cart is empty!");
            return;
        }
        // ใช้ navigate เพื่อเปลี่ยนเส้นทางไปยังหน้า Payment
        navigate("/payment"); // เส้นทางไปยังหน้า Payment
    };

    return (
        <div className="container my-5 p-4 rounded shadow-lg bg-white">
            <h2 className="text-center text-primary fw-bold mb-4">🛒 Your Cart</h2>

            {error && <p className="alert alert-danger text-center">{error}</p>}

            {/* ✅ แสดงรายการสินค้าที่อยู่ในตะกร้า */}
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.ProductID}>
                                <td>{item.ProductName}</td>
                                <td>{parseFloat(item.Price).toLocaleString()} บาท</td>
                                <td>{item.Quantity}</td>
                                <td>{(item.Price * item.Quantity).toLocaleString()} บาท</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeItemFromCart(item.ProductID)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ แสดงราคาทั้งหมด */}
            <div className="d-flex justify-content-between align-items-center my-4">
                <h4>Total Price: {totalPrice.toLocaleString()} บาท</h4>
                <motion.button 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPayment} // คลิกแล้วไปหน้าชำระเงิน
                >
                    Proceed to Payment
                </motion.button>
            </div>
        </div>
    );
};

export default Cart;
