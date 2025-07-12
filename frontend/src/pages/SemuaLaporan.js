import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import SuperAdminLayout from '../components/SuperAdminLayout';

const SemuaLaporan = () => {
  const { token, user } = useAuth();
  const [laporan, setLaporan] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const Layout = user?.role === 'superadmin' ? SuperAdminLayout : AdminLayout;

  useEffect(() => {
    fetchLaporan();
    // eslint-disable-next-line
  }, [status, tanggal]);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/laporan', { headers: { Authorization: `Bearer ${token}` } });
      setLaporan(res.data);
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
    const matchStatus = status ? l.status === status : true;
    const matchTanggal = tanggal ? l.tanggal.slice(0, 10) === tanggal : true;
    return matchSearch && matchStatus && matchTanggal;
  });

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/laporan/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Laporan ${status}`);
      fetchLaporan();
    } catch {
      toast.error('Gagal update status');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/laporan/${modal.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Laporan dihapus');
      setModal({ open: false, id: null });
      fetchLaporan();
    } catch {
      toast.error('Gagal hapus laporan');
    }
  };

  if (loading) {
    return (
      <Layout title="Semua Laporan">
        <div style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Semua Laporan">
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
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
          {laporan
            .filter(l => 
              l.nama_merk.toLowerCase().includes(search.toLowerCase()) ||
              l.npwpd.includes(search) ||
              l.alamat.toLowerCase().includes(search.toLowerCase())
            )
            .filter(l => !status || l.status === status)
            .filter(l => !tanggal || new Date(l.tanggal).toLocaleDateString() === new Date(tanggal).toLocaleDateString())
            .map(l => (
              <div 
                key={l._id} 
                onClick={() => navigate(`/laporan/${l._id}`)}
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
                      color: l.status === 'Disetujui' ? '#4ade80' : 
                             l.status === 'Ditolak' ? '#f87171' : '#fbbf24',
                      fontWeight: 600,
                      marginRight: '12px'
                    }}>{l.status}</span>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {new Date(l.tanggal).toLocaleString()}
                    </span>
                  </div>
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
      <ToastContainer />
    </Layout>
  );
};

export default SemuaLaporan;