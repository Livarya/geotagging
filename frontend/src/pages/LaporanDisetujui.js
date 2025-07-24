import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { FaEye, FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import BASE_URL from '../api';

const LaporanDisetujui = () => {
  const { token, user } = useAuth();
  const [laporan, setLaporan] = useState([]);
  const [search, setSearch] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const Layout = user?.role === 'superadmin' ? SuperAdminLayout : AdminLayout;

  useEffect(() => {
    fetchLaporan();
  }, [tanggal]);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/laporan`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setLaporan(res.data.filter(l => l.status === 'Disetujui'));
    } catch {
      setLaporan([]);
    }
    setLoading(false);
  };

  const filtered = laporan.filter(l => {
    const matchSearch =
      l.nama_merk.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.nama?.toLowerCase().includes(search.toLowerCase()) ||
      l.npwpd.toLowerCase().includes(search.toLowerCase());
    const matchTanggal = tanggal ? l.tanggal.slice(0, 10) === tanggal : true;
    return matchSearch && matchTanggal;
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/laporan/${modal.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Laporan dihapus');
      setModal({ open: false, id: null });
      fetchLaporan();
    } catch {
      toast.error('Gagal hapus laporan');
    }
  };

  const handleSetujui = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`${BASE_URL}/api/laporan/${id}/status`, { status: 'Disetujui' }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Laporan disetujui');
      fetchLaporan();
    } catch {
      toast.error('Gagal menyetujui laporan');
    }
  };

  const handleTolak = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.put(`${BASE_URL}/api/laporan/${id}/status`, { status: 'Ditolak' }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Laporan ditolak');
      fetchLaporan();
    } catch {
      toast.error('Gagal menolak laporan');
    }
  };

  const handleDetail = (id, e) => {
    e.stopPropagation();
    const prefix = user?.role === 'superadmin' ? '/superadmin' : '/admin';
    navigate(`${prefix}/laporan/${id}`);
  };

  if (loading) {
    return (
      <Layout title="Laporan Disetujui">
        <div style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Laporan Disetujui">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Search and Filter Controls */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px'
            }}
          />
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Laporan List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(l => (
            <div 
              key={l._id} 
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              <div style={{ flex: 1, color: '#fff' }}>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>{l.nama_merk}
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginLeft: '8px' }}>({l.npwpd})</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '4px 0' }}>{l.alamat}</div>
                <div style={{ fontSize: '13px' }}>
                  <span style={{
                    color: '#4ade80',
                    fontWeight: 600,
                    marginRight: '12px'
                  }}>Disetujui</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {new Date(l.tanggal).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={(e) => handleDetail(l._id, e)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <FaEye size={16} />
                </button>
                <button
                  onClick={(e) => handleSetujui(l._id, e)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.5)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <FaCheckCircle size={16} />
                </button>
                <button
                  onClick={(e) => handleTolak(l._id, e)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.5)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <FaTimesCircle size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setModal({ open: true, id: l._id }); }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.5)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  title="Hapus Laporan"
                >
                  <FaTrash size={16} />
                </button>
              </div>

              {Array.isArray(l.foto) && l.foto.length > 0 && (
                <div style={{
                  minWidth: '80px',
                  height: '80px',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img 
                    src={`http://localhost:5000/uploads/${l.foto[0]}`} 
                    alt="foto" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
      {/* Modal konfirmasi hapus */}
      {modal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            minWidth: '320px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '24px', color: '#111', fontWeight: 600, fontSize: '18px' }}>
              Yakin ingin menghapus laporan ini?
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >Hapus</button>
              <button
                onClick={() => setModal({ open: false, id: null })}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: '#e5e7eb',
                  color: '#111',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >Batal</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LaporanDisetujui;