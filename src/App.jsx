import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/home/HomePage.jsx';
import Login from './components/home/Login.jsx';
import Register from './components/home/Register.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dangnhap" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;