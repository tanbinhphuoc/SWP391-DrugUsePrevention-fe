import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ResourcesPage from "./pages/ResourcesPage.jsx";
import EducationCoursesPage from "./pages/EducationCoursePage.jsx";
import RiskAssessmentPage from "./pages/RiskAssessmentPage.jsx";
import ConsultationPage from "./pages/ConsultantPage.jsx";
import CommunityProgramsPage from "./pages/CommunityProgramPage.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        {/* Routes for navigation */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/education-courses" element={<EducationCoursesPage />} />
          <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/community-programs" element={<CommunityProgramsPage />} />
        </Routes>
    </Router>
  )
}

export default App
