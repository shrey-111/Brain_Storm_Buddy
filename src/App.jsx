// ✅ App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import MyProfile from "./Components/MyProfile/MyProfile";
import Explore from "./Components/Explore/Explore";
import Settings from "./Components/Settings/Settings";
import Community from "./Components/Community/Community";
import LoginSignup from "./Components/Dashboard/Login";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import useAuth from "./custom-hooks/useAuth";
import { ToastContainer } from 'react-toastify';
import TaskManager from "./Components/TaskManager/Taskmanager";
import Study from "./Components/StudyPlanner/Study";
import StudyTracker from "./Components/StudyTracker/StudyTracker";
import SidebarLayout from "./Components/Sidebar/SidebarLayout"; // ✅ Make sure path is correct

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} theme="light" />

      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginSignup />} />

        {/* Protected Routes inside Sidebar */}
        <Route
          element={
            <ProtectedRoute currentUser={currentUser}>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/study" element={<Study />} />
          <Route path="/taskmanager" element={<TaskManager />} />
          <Route path="/studytracker" element={<StudyTracker />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;