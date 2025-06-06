import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage.jsx";
import SignUp from "./components/login/SignUp.jsx";
import SignIn from "./components/login/SignIn.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import UserDashboard from "./components/user/UserDashboard.jsx";
import ConsultantDashboard from "./components/consultant/ConsultantDashboard.jsx";



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member-dashboard" element={<UserDashboard />} /> 
          <Route path="/consultant-dashboard" element={<ConsultantDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
