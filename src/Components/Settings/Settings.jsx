import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaSave } from "react-icons/fa";
import "./Settings.css";

const Settings = () => {
  const [username, setUsername] = useState("user123");
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    // Save logic
    alert("Changes Saved!");
  };

  const handleLogout = () => {
    // Logout logic
    alert("Logged Out!");
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">Account Settings</h2>

        <label><FaUser /> Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label><FaEnvelope /> Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label><FaLock /> Change Password</label>
        <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

        <button className="save-btn" onClick={handleSave}><FaSave /> Save Changes</button>
        <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </div>
    </div>
  );
};

export default Settings;