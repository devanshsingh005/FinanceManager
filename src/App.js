import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Hello from './components/hello'; // Corrected the import statement for Hello component
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/hello" element={<Hello />} /> {/* Add this route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
