import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      {/* 
        This is a temporary navigation bar just for you (the owner) 
        to switch between the Template Dashboard and the Live Web Invitation!
        In production, the dashboard is hidden behind an admin login.
      */}
      {/* 
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        padding: '10px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        gap: '10px'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#8b5cf6', alignSelf: 'center', paddingRight: '10px' }}>Dev Menu:</div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '6px 12px', background: '#3b82f6', borderRadius: '6px', fontSize: '0.9rem' }}>
          Landing Page
        </Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', padding: '6px 12px', background: '#10b981', borderRadius: '6px', fontSize: '0.9rem' }}>
          Dashboard
        </Link>
      </div>
      */}

      <Routes>
        {/* The Digital Invitation accessible by guests */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The CMS/Dashboard accessible by the couple */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
