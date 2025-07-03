import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const LaporanDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [laporan, setLaporan] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/laporan/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLaporan(res.data))
      .catch(() => setLaporan(null));
  }, [id, token]);

  if (!laporan) return <div>Loading...</div>;

  const fotoUrl = laporan.foto ? `http://localhost:5000/uploads/${laporan.foto}` : null;

  return (
    <div className="container">
      <h2>Detail Laporan</h2>
      <button onClick={() => navigate(-1)}>Kembali</button>
      <table>
        <tbody>
          <tr><td>Nama Merk</td><td>{laporan.nama_merk}</td></tr>
          <tr><td>NPWPD</td><td>{laporan.npwpd}</td></tr>
          <tr><td>Alamat</td><td>{laporan.alamat}</td></tr>
          <tr><td>Hasil Pemeriksaan</td><td>{laporan.hasil_pemeriksaan}</td></tr>
          {fotoUrl && (
            <tr>
              <td>Foto Dokumentasi</td>
              <td>
                <img src={fotoUrl} alt="foto dokumentasi" style={{maxWidth:120, maxHeight:90, borderRadius:6, boxShadow:'0 1px 4px #bbb',cursor:'pointer'}} onClick={()=>setShowLightbox(true)} />
                {showLightbox && (
                  <Lightbox
                    mainSrc={fotoUrl}
                    onCloseRequest={() => setShowLightbox(false)}
                  />
                )}
              </td>
            </tr>
          )}
          <tr><td>Status</td><td>{laporan.status}</td></tr>
          <tr><td>Tanggal</td><td>{new Date(laporan.tanggal).toLocaleString()}</td></tr>
          <tr><td>Petugas</td><td>{laporan.user?.nama} ({laporan.user?.jabatan})</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default LaporanDetail; 