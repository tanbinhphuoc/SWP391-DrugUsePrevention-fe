import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./components/home/HomePage.jsx";
import SignUp from "./components/login/SignUp.jsx";
import SignIn from "./components/login/SignIn.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import ResourcesPage from "./components/resource/ResourcesPage.jsx";
import CommunityProgramsPage from "./components/dichvu/community/CommunityProgramPage.jsx";
import UserDashboard from "./components/user/UserDashboard.jsx";
// import ConsultantDashboard from "./components/dichvu/consultant/ux/ConsultantDashboard.jsx";
import "react-toastify/dist/ReactToastify.css";
import StaffDashboard from "./components/staff/StaffDashboard.jsx";
import ManagerDashboard from "./components/manager/ManagerDashboard.jsx";
import ArticlesPage from "./components/article/ArticlesPage.jsx";
import CourseLearning from "./components/user/CourseLearning.jsx";
import OutputAssessment from "./components/user/OutputAssessment.jsx";
import ConsultantDashboard from "./components/consultant/ConsultantDashboard.jsx";
import UserCourses from "./components/serviceuser/UserCourses.jsx";
import UserAppointments from "./components/serviceuser/UserAppointments.jsx"
import UserSurveys from "./components/serviceuser/UserSurveys.jsx";
import StaffBlogManagement from "./components/staff/StaffBlogManagement.jsx";
function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member-dashboard" element={<UserDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/courses/:courseId/learn" element={<CourseLearning />} />
          {/* <Route path="/consultant-dashboard" element={<ConsultantDashboard />} /> */}
          <Route path="/consultant-dashboard" element={<ConsultantDashboard />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/education-courses" element={<UserCourses />} />
          <Route path="/risk-assessment" element={<UserSurveys />} />
          <Route path="/consultation" element={<UserAppointments />} />
          <Route path="/community-programs" element={<CommunityProgramsPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/output-assessment/:assessmentId" element={<OutputAssessment />} />
          <Route path="/UserCourses" element={<UserCourses />} />
          <Route path="/UserAppointments" element={<UserAppointments />} />
          <Route path="/UserSurveys" element={<UserSurveys />} />
          <Route path="/staff-blogs" element={<StaffBlogManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
