import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { token, logout } = useAuth();
  const [laporan, setLaporan] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLaporan();
    // eslint-disable-next-line
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/laporan', { headers: { Authorization: `Bearer ${token}` } });
      setLaporan(res.data);
    } catch (err) {
      setLaporan([]);
    }
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    await axios.put(`/api/laporan/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchLaporan();
  };

  const filtered = laporan.filter(l =>
    l.nama_merk.toLowerCase().includes(filter.toLowerCase()) ||
    l.user?.nama?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Panel</h2>
        <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
      </div>
      <input className="filter-input" placeholder="Cari nama merk / petugas" value={filter} onChange={e => setFilter(e.target.value)} />
      <div style={{background:'#f9fafb',borderRadius:10,padding:18,boxShadow:'0 1px 4px rgba(0,0,0,0.03)'}}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama Merk</th>
                <th>NPWPD</th>
                <th>Alamat</th>
                <th>Hasil Pemeriksaan</th>
                <th>Foto</th>
                <th>Status</th>
                <th>Petugas</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l._id}>
                  <td>{l.nama_merk}</td>
                  <td>{l.npwpd}</td>
                  <td>{l.alamat}</td>
                  <td>{l.hasil_pemeriksaan}</td>
                  <td>{l.foto && <img src={`http://localhost:5000/uploads/${l.foto}`} alt="foto" style={{maxWidth:60, maxHeight:60, borderRadius:4, boxShadow:'0 1px 4px #ddd'}} />}</td>
                  <td>{l.status}</td>
                  <td>{l.user?.nama}</td>
                  <td>{new Date(l.tanggal).toLocaleString()}</td>
                  <td style={{display:'flex',flexDirection:'column',gap:4}}>
                    <button onClick={() => navigate(`/admin/laporan/${l._id}`)}>Lihat Detail</button>
                    <button onClick={() => navigate(`/admin/print/${l._id}`)}>Cetak</button>
                    {l.status !== 'Disetujui' && <button onClick={() => handleStatus(l._id, 'Disetujui')}>Setujui</button>}
                    {l.status !== 'Ditolak' && <button onClick={() => handleStatus(l._id, 'Ditolak')}>Tolak</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 