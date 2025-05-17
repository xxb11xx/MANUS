import React from 'react';
import './index.css'; // Ensure Tailwind styles are imported
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Will add routing later
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="text-blue-500">
      Hello from XB Dashboard App! Tailwind CSS is working.
      {/* Basic Routing will be added here */}
      {/* <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </Router> */}
    </div>
  );
}

export default App;

