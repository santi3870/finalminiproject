import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import axios from "axios";

const OrderTracking = () => {
    const [orderId, setOrderId] = useState("");
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    // ✅ ฟังก์ชันดึงข้อมูล Tracking ตาม OrderID ที่เลือก
    const fetchTrackingDetails = async (selectedId) => {
        if (!selectedId) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/order-tracking/${selectedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setTrackingData(response.data);
                setError("");
            } else {
                setError("❌ Tracking data not found.");
                setTrackingData(null);
            }
        } catch (err) {
            console.error("❌ Fetch Tracking Error:", err);
            setError("❌ Failed to fetch tracking details.");
        }
    };

    return (
        <motion.div 
            className="container my-5 p-4 rounded shadow-lg bg-white"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            style={styles.card}
        >
            <h2 className="text-center text-primary fw-bold mb-4">
                🚚 <span style={{ color: "#1d3557" }}>Order Tracking</span>
            </h2>

            {error && <p className="alert alert-danger text-center">{error}</p>}

            {/* ✅ Dropdown เลือก Order */}
            <div className="mb-4">
                <label className="fw-bold">Select Order ID:</label>
                <select 
                    className="form-select"
                    value={orderId}
                    onChange={(e) => {
                        setOrderId(e.target.value);
                        fetchTrackingDetails(e.target.value);
                    }}
                >
                    <option value="">-- Select Order --</option>
                    <option value="1">Order 1</option>
                    <option value="2">Order 2</option>
                </select>
            </div>

            {/* ✅ แสดงรายละเอียด Tracking */}
            {trackingData && (
                <div className="p-3 mb-4 rounded shadow-sm" style={styles.trackingDetails}>
                    <h4 className="text-center text-dark fw-bold">Tracking Information</h4>
                    <p className="mb-1"><strong>Tracking ID:</strong> {trackingData.TrackingID}</p>
                    <p className="mb-1"><strong>Order ID:</strong> {trackingData.OrderID}</p>
                    <p className="mb-1">
                        <strong>Status:</strong> 
                        <span className="badge ms-2" style={getStatusStyle(trackingData.Status)}>
                            {trackingData.Status}
                        </span>
                    </p>
                    <p className="mb-1"><strong>Updated At:</strong> {new Date(trackingData.UpdatedAt).toLocaleString()}</p>
                </div>
            )}
        </motion.div>
    );
};

// ✅ ฟังก์ชันกำหนดสีของสถานะ Tracking
const getStatusStyle = (status) => ({
    backgroundColor: status === "Shipped" ? "#2a9d8f" : "#f4a261",
    color: "white", padding: "8px 12px", borderRadius: "5px"
});

// ✅ สไตล์ UI
const styles = {
    card: {
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    trackingDetails: {
        backgroundColor: "#f1faee",
        borderRadius: "10px",
        padding: "15px",
    }
};

export default OrderTracking;
