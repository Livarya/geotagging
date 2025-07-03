import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}>
        <span className="topbar-logo">📝</span>
        <span className="topbar-title">Sistem Laporan Pemeriksaan</span>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" onClick={() => navigate('/profile')}>{user?.nama || 'Profil'}</button>
        <button className="topbar-btn logout" onClick={() => { logout(); navigate('/'); }}>Logout</button>
      </div>
    </header>
  );
};

export default Topbar; 