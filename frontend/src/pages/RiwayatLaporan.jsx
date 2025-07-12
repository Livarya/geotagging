import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const RiwayatLaporan = () => {
  const { token } = useAuth();
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, [token]);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get('/api/laporan/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLaporan(res.data);
    } catch (err) {
      console.error('Error fetching laporan:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Riwayat Laporan">
        <div style={{ color: '#fff', textAlign: 'center' }}>Memuat data...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Riwayat Laporan">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {laporan.length === 0 ? (
          <div style={{ 
            color: 'rgba(255,255,255,0.7)', 
            textAlign: 'center', 
            padding: '32px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            Belum ada laporan
          </div>
        ) : (
          laporan.map(l => (
            <div key={l._id} style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
              }
            }}>
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
          ))
        )}
      </div>
    </Layout>
  );
};

export default RiwayatLaporan;