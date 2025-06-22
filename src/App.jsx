import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/home/HomePage.jsx";
import SignUp from "./components/login/SignUp.jsx";
import SignIn from "./components/login/SignIn.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import ResourcesPage from "./components/resource/ResourcesPage.jsx";
import CommunityProgramsPage from "./components/dichvu/community/CommunityProgramPage.jsx";
import ConsultationPage from "./components/dichvu/consultant/ui/ConsultantPage.jsx";
import EducationCoursesPage from "./components/dichvu/education/EducationCoursePage.jsx";
import RiskAssessmentPage from "./components/dichvu/risk/RiskAssessmentPage.jsx";
import UserDashboard from "./components/user/UserDashboard.jsx";
import ConsultantDashboard from "./components/dichvu/consultant/ux/ConsultantDashboard.jsx";
import "react-toastify/dist/ReactToastify.css";
import StaffDashboard from "./components/staff/StaffDashboard.jsx";
import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";

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
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/consultant-dashboard" element={<ConsultantDashboard />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/education-courses" element={<EducationCoursesPage />} />
          <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/community-programs" element={<CommunityProgramsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;