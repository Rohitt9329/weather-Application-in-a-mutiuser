import React from 'react';
import { LayoutDashboard, Star, Settings, Brain } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-section-label">Navigation</div>
        {links.map((link) => (
          <button
            key={link.id}
            className={`sidebar-link ${activeTab === link.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(link.id); onClose(); }}
          >
            <span className="sidebar-icon"><link.icon size={18} /></span>
            {link.label}
          </button>
        ))}
      </aside>
    </>
  );
};

export default Sidebar;
