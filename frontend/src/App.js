import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LaporanDetail from './pages/LaporanDetail';
import PrintLaporan from './pages/PrintLaporan';
import ProfilePage from './pages/ProfilePage';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BuatLaporan from './pages/BuatLaporan';
import RiwayatLaporan from './pages/RiwayatLaporan';
import SemuaLaporan from './pages/SemuaLaporan';
import LaporanDisetujui from './pages/LaporanDisetujui';
import LaporanDitolak from './pages/LaporanDitolak';
import DataPengguna from './pages/DataPengguna';
import './App.css';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  return (
    <div>
      <Topbar />
      {isAdmin && <Sidebar />}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute role="user"><Layout><Dashboard /></Layout></PrivateRoute>
          } />
          <Route path="/buat-laporan" element={
            <PrivateRoute role="user"><Layout><BuatLaporan /></Layout></PrivateRoute>
          } />
          <Route path="/riwayat-laporan" element={
            <PrivateRoute role="user"><Layout><RiwayatLaporan /></Layout></PrivateRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/laporan" replace />} />
          <Route path="/admin/laporan" element={
            <PrivateRoute role="admin"><Layout><SemuaLaporan /></Layout></PrivateRoute>
          } />
          <Route path="/admin/laporan-disetujui" element={
            <PrivateRoute role="admin"><Layout><LaporanDisetujui /></Layout></PrivateRoute>
          } />
          <Route path="/admin/laporan-ditolak" element={
            <PrivateRoute role="admin"><Layout><LaporanDitolak /></Layout></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute role="admin"><Layout><DataPengguna /></Layout></PrivateRoute>
          } />
          <Route path="/admin/laporan/:id" element={
            <PrivateRoute role="admin"><Layout><LaporanDetail /></Layout></PrivateRoute>
          } />
          <Route path="/admin/print/:id" element={
            <PrivateRoute role="admin"><Layout><PrintLaporan /></Layout></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
