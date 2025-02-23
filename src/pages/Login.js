import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.token);
                navigate("/");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("❌ Login failed. Try again.");
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                `}
            </style>
            <div style={styles.overlay}></div> 
            <motion.div 
                style={styles.loginBox}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={styles.title}>Sign In</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <div style={styles.inputContainer}>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputContainer}>
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            style={styles.input}
                        />
                    </div>
                    <motion.button 
                        type="submit"
                        style={styles.button}
                        whileHover={{ scale: 1.05, backgroundColor: "#4a4a4a" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign In
                    </motion.button>
                </form>
                <p style={styles.signupText}>
                    New here? <a href="/register" style={styles.link}>Sign up now</a>
                </p>
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "linear-gradient(-45deg, #0B3D91, #5D3FD3, #9370DB, #D8BFD8 )",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 10s ease infinite", // ✅ ทำให้พื้นหลังขยับได้
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(10px)", // ✅ เพิ่ม Blur Effect
        background: "rgba(0, 0, 0, 0.4)",
    },
    loginBox: {
        position: "relative",
        background: "rgba(25, 25, 25, 0.7)",
        padding: "3rem",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        maxWidth: "400px",
        width: "90%",
        textAlign: "center",
        backdropFilter: "blur(8px)",
    },
    title: {
        color: "#f0f0f0",
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
    },
    error: {
        color: "#ff4d4d",
        marginBottom: "1rem",
        fontSize: "0.9rem",
    },
    inputContainer: {
        marginBottom: "1rem",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #3a3a3a",
        backgroundColor: "#2a2a2a",
        color: "#fff",
        fontSize: "1rem",
        outline: "none",
    },
    button: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#3a3a3a",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.3s ease",
    },
    signupText: {
        color: "#aaa",
        marginTop: "1rem",
        fontSize: "0.9rem",
    },
    link: {
        color: "#b3b3b3",
        textDecoration: "none",
        fontWeight: "bold",
    },
};

export default Login;
