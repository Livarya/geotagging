import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLaporan();
    // eslint-disable-next-line
  }, []);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/laporan/user', { headers: { Authorization: `Bearer ${token}` } });
      setLaporan(res.data);
    } catch (err) {
      setLaporan([]);
    }
    setLoading(false);
  };

  const laporanTerakhir = laporan.length > 0 ? laporan[0] : null;

  return (
    <div className="container">
      <div className="header">
        <h2>Selamat datang, {user?.nama}</h2>
      </div>
      <div style={{display:'flex',gap:24,flexWrap:'wrap',justifyContent:'center',marginBottom:24}}>
        <div style={{background:'#f1f5fb',borderRadius:10,padding:'18px 32px',minWidth:180,textAlign:'center',boxShadow:'0 1px 4px #eee'}}>
          <div style={{fontSize:18,fontWeight:600}}>Jumlah Laporan</div>
          <div style={{fontSize:32,fontWeight:700,color:'#2563eb'}}>{laporan.length}</div>
        </div>
        <div style={{background:'#f1f5fb',borderRadius:10,padding:'18px 32px',minWidth:220,textAlign:'center',boxShadow:'0 1px 4px #eee'}}>
          <div style={{fontSize:18,fontWeight:600}}>Laporan Terakhir</div>
          <div style={{fontSize:15}}>
            {laporanTerakhir ? (
              <>
                <div><b>Tanggal:</b> {new Date(laporanTerakhir.tanggal).toLocaleString()}</div>
                <div><b>Status:</b> <span style={{color:laporanTerakhir.status==='Disetujui'?'#16a34a':laporanTerakhir.status==='Ditolak'?'#e53e3e':'#f59e42'}}>{laporanTerakhir.status}</span></div>
              </>
            ) : (
              <div>Belum ada laporan</div>
            )}
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center',marginBottom:18}}>
        <button style={{background:'#2563eb',minWidth:160}} onClick={()=>navigate('/buat-laporan')}>+ Buat Laporan Baru</button>
        <button style={{background:'#4f8cff',minWidth:160}} onClick={()=>navigate('/riwayat-laporan')}>Riwayat Laporan</button>
        <button style={{background:'#64748b',minWidth:140}} onClick={()=>navigate('/profile')}>Profil Saya</button>
        <button className="logout-btn" style={{minWidth:120}} onClick={()=>{logout();navigate('/');}}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard; 