import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import useAuth from "../../custom-hooks/useAuth";
import "./SidebarLayout.css";

import {
  FaHome,
  FaUser,
  FaCompass,
  FaTasks,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const SidebarLayout = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { currentUser } = useAuth();

  const handleNavigation = (page) => {
    setActiveTab(page);
    const routes = {
      "Dashboard": "/",
      "My Profile": "/myProfile",
      "Explore": "/explore",
      "Task Manager": "/taskmanager",
      "Study Planner": "/study",
      "Study Tracker": "/studytracker",
      "Settings": "/settings",
    };
    navigate(routes[page] || "/");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "My Profile", icon: <FaUser /> },
    { name: "Explore", icon: <FaCompass /> },
    { name: "Task Manager", icon: <FaTasks /> },
    { name: "Study Planner", icon: <FaCalendarAlt /> },
    { name: "Study Tracker", icon: <FaChartLine /> },
    { name: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="layout-wrapper">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">📚 BrainStorm</h2>
          <p className="tagline">Your Daily Study Buddy</p>
        </div>

        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`menu-item ${activeTab === item.name ? "active" : ""}`}
              onClick={() => handleNavigation(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.name}
            </li>
          ))}
        </ul>

        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
        </button>

        <div className="sidebar-footer">v1.0 • © 2025 BSB</div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;