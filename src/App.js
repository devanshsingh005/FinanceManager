import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FinancialForm from './components/FinancialForm';
import FinanceManagerHomePage from './components/FinanceManagerHomePage';
// import './App.css';  // Keep this commented out if you're still troubleshooting style issues

// Placeholder component for feature pages
const FeaturePage = ({ feature }) => <div>Feature: {feature}</div>;

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FinanceManagerHomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/financial-form" element={<FinancialForm />} />
                <Route path="/features/expense-tracking" element={<FeaturePage feature="Expense Tracking" />} />
                <Route path="/features/budget-planning" element={<FeaturePage feature="Budget Planning" />} />
                <Route path="/features/reports" element={<FeaturePage feature="Financial Reports" />} />
                <Route path="/features/security" element={<FeaturePage feature="Security" />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
