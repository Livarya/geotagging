import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LaporanDitolak = () => {
  const { token } = useAuth();
  const [laporan, setLaporan] = useState([]);
  const [search, setSearch] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLaporan();
    // eslint-disable-next-line
  }, [tanggal]);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/laporan', { headers: { Authorization: `Bearer ${token}` } });
      setLaporan(res.data.filter(l => l.status === 'Ditolak'));
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
      await axios.delete(`/api/laporan/${modal.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Laporan dihapus');
      setModal({ open: false, id: null });
      fetchLaporan();
    } catch {
      toast.error('Gagal hapus laporan');
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Laporan Ditolak</h2>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
        <input className="filter-input" placeholder="Cari nama merk / petugas / NPWPD" value={search} onChange={e=>setSearch(e.target.value)} />
        <input className="filter-input" type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} style={{maxWidth:160}} />
      </div>
      <div className="table-wrapper">
        {loading ? <div style={{textAlign:'center',padding:40}}><span className="spinner"></span></div> : (
        <table>
          <thead>
            <tr>
              <th>Nama Petugas</th>
              <th>Nama Merk</th>
              <th>NPWPD</th>
              <th>Alamat</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l._id}>
                <td>{l.user?.nama}</td>
                <td>{l.nama_merk}</td>
                <td>{l.npwpd}</td>
                <td>{l.alamat}</td>
                <td>{new Date(l.tanggal).toLocaleString()}</td>
                <td><span style={{color:'#e53e3e'}}>{l.status}</span></td>
                <td style={{display:'flex',gap:4}}>
                  <button title="Lihat" onClick={()=>navigate(`/admin/laporan/${l._id}`)}>👁️</button>
                  <button title="Hapus" onClick={()=>setModal({open:true,id:l._id})}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      {modal.open && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.2)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:32,borderRadius:10,minWidth:300,textAlign:'center',boxShadow:'0 2px 12px #bbb'}}>
            <div style={{fontSize:18,marginBottom:18}}>Yakin hapus laporan ini?</div>
            <button style={{background:'#e53e3e',marginRight:10}} onClick={handleDelete}>Ya, Hapus</button>
            <button style={{background:'#64748b'}} onClick={()=>setModal({open:false,id:null})}>Batal</button>
          </div>
        </div>
      )}
      <style>{`.spinner{display:inline-block;width:32px;height:32px;border:4px solid #d1d5db;border-top:4px solid #2563eb;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default LaporanDitolak; 