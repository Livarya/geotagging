import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RiwayatLaporan = () => {
  const { token } = useAuth();
  const [laporan, setLaporan] = useState([]);

  useEffect(() => {
    fetchLaporan();
    // eslint-disable-next-line
  }, []);

  const fetchLaporan = async () => {
    try {
      const res = await axios.get('/api/laporan/user', { headers: { Authorization: `Bearer ${token}` } });
      setLaporan(res.data);
    } catch (err) {
      setLaporan([]);
    }
  };

  return (
    <div className="container">
      <h2>Riwayat Laporan Saya</h2>
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
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map(l => (
              <tr key={l._id}>
                <td>{l.nama_merk}</td>
                <td>{l.npwpd}</td>
                <td>{l.alamat}</td>
                <td>{l.hasil_pemeriksaan}</td>
                <td>{l.foto && <img src={`http://localhost:5000/uploads/${l.foto}`} alt="foto" style={{maxWidth:60, maxHeight:60, borderRadius:4, boxShadow:'0 1px 4px #ddd'}} />}</td>
                <td>{l.status}</td>
                <td>{new Date(l.tanggal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatLaporan; 