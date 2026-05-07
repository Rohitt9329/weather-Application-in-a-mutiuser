import React from 'react';
import { CloudSun, LogOut, Sun, Moon, Menu } from 'lucide-react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode, onToggleSidebar }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('weather_user') || '{}');
  const displayName = user.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('weather_token');
    localStorage.removeItem('weather_user');
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div className="navbar-logo-icon">
          <CloudSun size={20} />
        </div>
        <span className="navbar-brand">Weather Application</span>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleDarkMode}
          id="theme-toggle"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="navbar-user">
          <div className="navbar-avatar">{initial}</div>
          <span className="navbar-username">{displayName}</span>
        </div>

        <button className="logout-btn" id="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
