import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion"; // ✅ ใช้ Animation

function Home() {
  return (
    <div style={styles.home}>
      {/* ✅ Hero Section */}
      <header style={styles.hero}>
        <div className="container text-center text-white">
          <motion.h1 
            className="display-3 fw-bold"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            Welcome to MyShop
          </motion.h1>
          <p className="lead">Your one-stop shop for amazing products at unbeatable prices.</p>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/products" className="btn btn-light btn-lg mt-3">🛒 Start Shopping</Link>
          </motion.div>
        </div>
      </header>

      {/* ✅ Features Section */}
      <section className="container my-5">
        <div className="row text-center">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <motion.div 
                style={styles.featureCard}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h3>{feature.icon} {feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Footer */}
      <footer style={styles.footer}>
        <p className="mb-0">© 2025 MyShop. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ✅ Feature Data
const features = [
  { icon: "🔥", title: "Best Deals", description: "Find the best products at unbeatable prices." },
  { icon: "🚀", title: "Fast Shipping", description: "Get your orders delivered in record time." },
  { icon: "💳", title: "Secure Payment", description: "100% safe and secure checkout process." },
];

// ✅ CSS-in-JS
const styles = {
  home: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  hero: {
    height: "60vh",
    background: "linear-gradient(to right, #1d3557, #457b9d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureCard: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "12px",
    transition: "0.3s ease-in-out",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  footer: {
    backgroundColor: "#1d3557",
    color: "white",
    padding: "20px",
    marginTop: "50px",
  },
};

export default Home;
