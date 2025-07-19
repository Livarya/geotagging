import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import SuperAdminLayout from '../components/SuperAdminLayout';
import { FaEye, FaPrint } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerImg from '../assets/marker.png';

const customMarker = new L.Icon({
  iconUrl: markerImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});
// Hapus/fix kode icon leaflet jika error, karena react-leaflet v4 sudah handle default icon

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

  // Tambahkan log untuk debug marker
  useEffect(() => {
    if (laporan && laporan.length > 0) {
      console.log('Laporan dengan koordinat:', laporan.filter(l => l.latitude && l.longitude));
    }
  }, [laporan]);

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
        {/* Peta Lokasi Laporan */}
        <div style={{ height: '350px', width: '100%', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <MapContainer center={[-6.9147, 107.6098]} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {laporan.filter(l => l.latitude && l.longitude).map(l => (
              <Marker key={l._id} position={[l.latitude, l.longitude]} icon={customMarker}>
                <Popup>
                  <div>
                    <strong>{l.nama_merk}</strong><br/>
                    {l.alamat}<br/>
                    Status: {l.status}<br/>
                    {l.tanggal ? new Date(l.tanggal).toLocaleString() : ''}
                    {Array.isArray(l.foto) && l.foto.length > 0 && (
                      <div style={{marginTop: 8}}>
                        <img src={`http://localhost:5000/uploads/${l.foto[0]}`} alt="foto" style={{width: 80, height: 80, objectFit: 'cover', borderRadius: 4}} />
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
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
            .map(l => {
              const fotoArr = Array.isArray(l.foto) ? l.foto : l.foto ? [l.foto] : [];
              return (
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
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>
                      {typeof l.nama_merk === 'string' ? l.nama_merk : 'Nama tidak tersedia'}
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginLeft: '8px' }}>
                        ({typeof l.npwpd === 'string' ? l.npwpd : 'NPWPD tidak tersedia'})
                      </span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '4px 0' }}>
                      {typeof l.alamat === 'string' ? l.alamat : 'Alamat tidak tersedia'}
                    </div>
                    <div style={{ fontSize: '13px' }}>
                      <span style={{
                        color: l.status === 'Disetujui' ? '#4ade80' : 
                               l.status === 'Ditolak' ? '#f87171' : '#fbbf24',
                        fontWeight: 600,
                        marginRight: '12px'
                      }}>
                        {typeof l.status === 'string' ? l.status : 'Status tidak tersedia'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {l.tanggal ? new Date(l.tanggal).toLocaleString() : 'Tanggal tidak tersedia'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Thumbnail Foto */}
                  {fotoArr.length > 0 ? (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {fotoArr.map((foto, idx) => (
                        <img
                          key={idx}
                          src={typeof foto === 'string' ? `http://localhost:5000/uploads/${foto}` : ''}
                          alt={`Foto ${idx + 1}`}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      )).slice(0, 3)}
                      {fotoArr.length > 3 && (
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          background: 'rgba(0,0,0,0.5)', 
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          +{fotoArr.length - 3}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Tidak ada foto</span>
                  )}
                  
                  {/* Tombol aksi lihat detail */}
                  <button
                    onClick={() => {
                      const prefix = user?.role === 'superadmin' ? '/superadmin' : '/admin';
                      navigate(`${prefix}/laporan/${l._id}`);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.5)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                    title="Lihat Detail"
                  >
                    <FaEye size={16} />
                  </button>

                  {/* Tombol cetak BERITA ACARA */}
                  <button
                    onClick={() => {
                      const prefix = user?.role === 'superadmin' ? '/superadmin' : '/admin';
                      navigate(`${prefix}/laporan/${l._id}/cetak`);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(168, 85, 247, 0.5)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      color: '#fff',
                      cursor: 'pointer',
                      marginRight: '8px'
                    }}
                    title="Cetak BERITA ACARA"
                  >
                    <FaPrint size={16} />
                  </button>
                  
                  {/* Tombol aksi jika status Belum Dicek */}
                  {l.status === 'Belum Dicek' && (
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleStatus(l._id, 'Disetujui')}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#22c55e',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >Setujui</button>
                      <button
                        onClick={() => handleStatus(l._id, 'Ditolak')}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >Tolak</button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default SemuaLaporan;