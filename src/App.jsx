import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './components/home/HomePage.jsx';
import DangNhap from "./components/home/DangNhap.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dangnhap" element={<DangNhap />} />
      </Routes>
    </Router>
  );
}

export default App;