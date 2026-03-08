import React, { useState } from "react";
import "./Navbar.css"; // External CSS file

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    const user = prompt("Enter your name:");
    if (user) {
      setUsername(user);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setUsername("");
    setIsLoggedIn(false);
  };

  return (
    <div className="light-mode">
      <nav className="navbar">
        <div className="navbar-actions">
          {isLoggedIn ? (
            <div className="user-info">
              <div className="avatar">{username.charAt(0)}</div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;



