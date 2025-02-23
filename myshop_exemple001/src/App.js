import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import OrderTracking from "./pages/OrderTracking";
import { AuthContext } from "./AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
    }, []);

    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const addToCart = (product) => {
        let updatedCart;
        const existingItem = cart.find(item => item.ProductID === product.ProductID);

        if (existingItem) {
            updatedCart = cart.map(item =>
                item.ProductID === product.ProductID
                    ? { ...item, Quantity: item.Quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cart, { ...product, Quantity: 1 }];
        }

        updateCart(updatedCart);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="App">
            {/* ✅ Navbar Bootstrap */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/">🛒 MyShop</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item"><Link className="nav-link" to="/">🏠 Home</Link></li>
                            {user ? (
                                <>
                                    <li className="nav-item"><Link className="nav-link" to="/products">🛍 Products</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/orders">📦 Orders</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/Payment">💳 Payment</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/cart">🛒 Cart ({cart.reduce((acc, item) => acc + item.Quantity, 0)})</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/order-tracking">🚚 Order Tracking</Link></li>
                                    <li className="nav-item">
                                        <button onClick={handleLogout} className="btn btn-danger btn-sm ms-2">🚪 Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item"><Link className="nav-link" to="/login">🔑 Login</Link></li>
                                    <li className="nav-item"><Link className="nav-link btn btn-primary text-white px-3 ms-2" to="/register">📝 Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* ✅ Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products addToCart={addToCart} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={updateCart} />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
