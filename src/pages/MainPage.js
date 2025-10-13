import React, { useRef } from "react";
import Header from "../components/Header";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import dashboardImg from "../assets/img1.jpg";
import feature1Img from "../assets/img2.jpg";
import feature2Img from "../assets/img3.jpg";
import feature3Img from "../assets/img4.jpg";

const MainPage = () => {
  const navigate = useNavigate();

  // Ref for Features Section
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="main-page">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Take Control of Your Financial Future</h1>
          <p>
            Track expenses, manage budgets, and achieve your financial goals with
            our intuitive and powerful personal finance platform.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Get Started – It’s Free
            </button>
            <button className="btn btn-secondary" onClick={scrollToFeatures}>
              Features
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={dashboardImg} alt="Dashboard preview" />
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <h2>Why Choose FinTrack?</h2>
        <p>
          Our platform is designed to give you clarity and control over your finances
          with powerful yet simple tools.
        </p>
        <div className="why-grid">
          <div className="card">
            <h3>📊 Real-time Insights</h3>
            <p>
              Get instant visibility into your spending habits and financial health
              with beautiful, easy-to-understand visualizations.
            </p>
          </div>
          <div className="card">
            <h3>🔒 Bank-level Security</h3>
            <p>
              Your financial data is protected with the highest security standards,
              including encryption and secure authentication.
            </p>
          </div>
          <div className="card">
            <h3>🔗 Sync Across Devices</h3>
            <p>
              Access your financial information anytime, anywhere with our
              cloud-based platform and mobile apps.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" ref={featuresRef}>
        <h2>Powerful Features</h2>
        <p>
          Everything you need to master your personal finances in one intuitive
          platform.
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <img src={feature1Img} alt="Smart Expense Tracking" />
            <h3>Smart Expense Tracking</h3>
            <p>
              Automatically categorize and track your expenses with our intelligent
              system. Import transactions from your bank or add them manually.
            </p>
          </div>
          <div className="feature-card">
            <img src={feature2Img} alt="Flexible Budget Management" />
            <h3>Flexible Budget Management</h3>
            <p>
              Create custom budgets for different categories and track your progress.
              Get alerts when you’re approaching your limits.
            </p>
          </div>
          <div className="feature-card">
            <img src={feature3Img} alt="Financial Goal Setting" />
            <h3>Financial Goal Setting</h3>
            <p>
              Set savings goals for big purchases, retirement, or debt payoff. Track
              your progress and celebrate milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <p>
          Join thousands of people who have transformed their financial lives with
          FinTrack.
        </p>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              “FinTrack has completely changed how I manage my money. I’ve paid off
              $15,000 in debt and saved for my dream vacation in just 8 months!”
            </p>
            <h4>Sarah Johnson</h4>
            <span>Marketing Director</span>
          </div>
          <div className="testimonial-card">
            <p>
              “As someone who always struggled with budgeting, FinTrack made it simple
              and even enjoyable. The visual reports help me see exactly where my
              money goes.”
            </p>
            <h4>Michael Chen</h4>
            <span>Software Engineer</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Start Your Financial Journey Today</h2>
        <p>
          Join over 100,000 users who have taken control of their finances with
          FinTrack. Sign up for free and transform your financial future.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/signup")}>
          Create Your Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>FinTrack</h3>
            <p>
              The modern way to manage your personal finances, track expenses, and
              achieve your financial goals.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>Pricing</li>
              <li>Mobile App</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li>Blog</li>
              <li>Help Center</li>
              <li>Guides</li>
              <li>Webinars</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <p className="footer-bottom">© 2025 FinTrack. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;
