import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledHomePage = styled.div`
  /* Reset and base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }
  a {
    color: #3a86ff;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  a:hover {
    color: #2667ff;
  }

  /* Layout */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .flex {
    display: flex;
  }
  .flex-col {
    flex-direction: column;
  }
  .items-center {
    align-items: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .gap-4 {
    gap: 1rem;
  }

  /* Header */
  header {
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  nav a {
    margin-left: 1.5rem;
    font-weight: 500;
    color: #3a86ff;
    position: relative;
  }
  nav a::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #3a86ff;
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
  }
  nav a:hover::after {
    visibility: visible;
    transform: scaleX(1);
  }

  /* Main content */
  main {
    min-height: calc(100vh - 60px - 60px);
  }

  /* Hero section */
  .hero {
    background: linear-gradient(135deg, #3a86ff, #8338ec);
    color: #fff;
    padding: 6rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('logo192.png') center/cover no-repeat;
    opacity: 0.1;
  }
  .hero .container {
    position: relative;
    z-index: 1;
  }
  .hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  .hero p {
    font-size: 1.4rem;
    color: rgba(255,255,255,0.9);
    max-width: 600px;
    margin: 0 auto 2rem;
  }

  /* Features section */
  .features {
    padding: 6rem 0;
    background-color: #ffffff;
  }
  .features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #3a86ff;
  }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
  }
  .feature-item {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e9ecef;
  }
  .feature-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
  .feature-item img {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
  .feature-item h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    color: #3a86ff;
  }

  /* CTA section */
  .cta {
    background: linear-gradient(135deg, #8338ec, #3a86ff);
    color: #fff;
    padding: 6rem 0;
    text-align: center;
  }
  .cta h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  .cta p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Buttons */
  .button {
    display: inline-block;
    background-color: #fff;
    color: #3a86ff;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    text-align: center;
    transition: all 0.3s ease;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0.5rem;
    border: 2px solid transparent;
  }
  .button:hover {
    background-color: #3a86ff;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .button-secondary {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
  .button-secondary:hover {
    background-color: #fff;
    color: #3a86ff;
  }

  /* Footer */
  footer {
    background-color: #333;
    color: #fff;
    padding: 2rem 0;
    text-align: center;
  }
  footer a {
    color: #fff;
    margin: 0 0.5rem;
  }
  footer a:hover {
    text-decoration: underline;
    color: #3a86ff;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    .hero p {
      font-size: 1.1rem;
    }
    .feature-grid {
      grid-template-columns: 1fr;
    }
    .cta h2 {
      font-size: 2rem;
    }
  }

  /* Dropdown styles */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: absolute;
    background-color: #ffffff;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1000;
    border-radius: 4px;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-content a {
    color: #333;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown-content a:hover {
    background-color: #f1f1f1;
  }

  .dropdown > span {
    cursor: pointer;
    color: #3a86ff;
    font-weight: 500;
  }

  /* New styles for the call button and response */
  .call-section {
    padding: 2rem 0;
    background-color: #f0f4f8;
    text-align: center;
  }

  .call-button {
    background-color: #3a86ff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .call-button:hover {
    background-color: #2667ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .call-response {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #e8f5e9;
    border-radius: 5px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FinanceManagerHomePage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [callStatus, setCallStatus] = useState(null);

  const initiateCall = () => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer c6d207ae-a5f8-4dbe-9d62-fef832098b76',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Ava",
        assistantId: "9bddac87-a165-4979-8110-7de983a2b0b2",
        phoneNumberId: "5515ce9a-c125-4f8e-853a-bbd3a25a21a2",
        customer: {
          number: "+918081602062",
          name: "Devansh"
        }
      })
    };

    fetch('https://api.vapi.ai/call', options)
      .then(response => response.json())
      .then(response => {
        console.log(response); // Keep this for debugging if needed
        if (response.status === 'queued') {
          setCallStatus('Call initiated successfully! Our AI assistant will call you shortly.');
        } else {
          setCallStatus('Unable to initiate call. Please try again later.');
        }
      })
      .catch(err => {
        console.error(err);
        setCallStatus('Error: Unable to connect to the service. Please try again later.');
      });
  };

  return (
    <StyledHomePage isOpen={isDropdownOpen}>
      <header>
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3a86ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
              <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
            </svg>
            <span style={{ marginLeft: '0.5rem', fontWeight: 'bold', color: '#3a86ff' }}>Budgetly</span>
          </Link>
          <nav className="flex items-center">
            <Link to="/" style={{ marginRight: '1.5rem' }}>Home</Link>
            <div className="dropdown" 
                 onMouseEnter={() => setIsDropdownOpen(true)}
                 onMouseLeave={() => setIsDropdownOpen(false)}>
              <span>Features</span>
              <div className="dropdown-content">
                <Link to="/features/expense-tracking">Expense Tracking</Link>
                <Link to="/features/budget-planning">Budget Planning</Link>
                <Link to="/features/reports">Financial Reports</Link>
              </div>
            </div>
            <Link to="/pricing" style={{ margin: '0 1.5rem' }}>Pricing</Link>
            <Link to="/contact" style={{ marginRight: '1.5rem' }}>Contact</Link>
            <button className="call-button" onClick={initiateCall}>AI Assistant</button>
          </nav>
        </div>
        {callStatus && (
          <div className="call-response" style={{ textAlign: 'center', padding: '0.5rem' }}>
            <p>{callStatus}</p>
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>Take Control of Your Finances</h1>
            <p>Budgetly helps you track expenses, set budgets, and achieve your financial goals with ease.</p>
            <Link to="/register" className="button">Get Started</Link>
            <Link to="/learn-more" className="button button-secondary">Learn More</Link>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>Why Choose Budgetly?</h2>
            <div className="feature-grid">
              <div className="feature-item">
                <img src="expense_tracking.png" alt="Expense Tracking Icon"  style={{borderRadius: '25%', height: '80px'}}/>
                <h3>Easy Expense Tracking</h3>
                <p>Effortlessly log and categorize your expenses to understand your spending habits.</p>
              </div>
              <div className="feature-item">
                <img src="smart_budget_planning.png" alt="Budget Planning Icon"  style={{borderRadius: '25%', height: '80px'}}/>
                <h3>Smart Budget Planning</h3>
                <p>Create custom budgets and receive alerts to stay on track with your financial goals.</p>
              </div>
              <div className="feature-item">
                <img src="insightful_reports.png" alt="Financial Insights Icon"  style={{borderRadius: '25%', height: '80px'}}/>
                <h3>Insightful Reports</h3>
                <p>Gain valuable insights with detailed financial reports and visualizations.</p>
              </div>
              <div className="feature-item">
                <img src="bank_level_security.png" alt="Secure Icon"  style={{borderRadius: '25%', height: '80px'}}/>
                <h3>Bank-Level Security</h3>
                <p>Rest easy knowing your financial data is protected with state-of-the-art security measures.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to Take Control of Your Finances?</h2>
            <p>Join thousands of users who have already transformed their financial lives with Budgetly.</p>
            <Link to="/register" className="button">Sign Up Now</Link>
            <Link to="/demo" className="button button-secondary">Watch Demo</Link>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2023 FinanceManager. All rights reserved.</p>
          <nav>
            <Link to="/terms">Terms of Service</Link> | 
            <Link to="/privacy">Privacy Policy</Link> | 
            <Link to="/contact">Contact Us</Link>
          </nav>
        </div>
      </footer>
    </StyledHomePage>
  );
};

export default FinanceManagerHomePage;