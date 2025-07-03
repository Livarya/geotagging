import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!user || user.role !== 'admin') return null;

  const menu = [
    { label: 'Semua Laporan', path: '/admin/laporan', icon: '📄' },
    { label: 'Laporan Disetujui', path: '/admin/laporan-disetujui', icon: '✔️' },
    { label: 'Laporan Ditolak', path: '/admin/laporan-ditolak', icon: '❌' },
    { label: 'Data Pengguna', path: '/admin/users', icon: '👥' },
  ];

  return (
    <nav className={`sidebar${open ? ' open' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        ☰
      </button>
      <ul>
        {menu.map(m => (
          <li key={m.path} className={location.pathname === m.path ? 'active' : ''}>
            <button onClick={() => navigate(m.path)}>{m.icon} {m.label}</button>
          </li>
        ))}
        <li>
          <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>🚪 Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar; 