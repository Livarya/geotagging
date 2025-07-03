import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BuatLaporan = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({ nama_merk: '', npwpd: '', alamat: '', hasil_pemeriksaan: '' });
  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => {
    const file = e.target.files[0];
    setFotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let fotoFilename = '';
    try {
      if (fotoFile) {
        const data = new FormData();
        data.append('foto', fotoFile);
        const res = await axios.post('/api/laporan/upload', data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fotoFilename = res.data.filename;
      }
      await axios.post('/api/laporan', { ...form, foto: fotoFilename }, { headers: { Authorization: `Bearer ${token}` } });
      navigate('/riwayat-laporan');
    } catch (err) {
      setError('Gagal mengirim laporan');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Buat Laporan Baru</h2>
      <form onSubmit={handleSubmit}>
        <input name="nama_merk" placeholder="Nama Merk" value={form.nama_merk} onChange={handleChange} required />
        <input name="npwpd" placeholder="NPWPD" value={form.npwpd} onChange={handleChange} required />
        <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} required />
        <textarea name="hasil_pemeriksaan" placeholder="Hasil Pemeriksaan" value={form.hasil_pemeriksaan} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div style={{marginBottom:10, textAlign:'center'}}>
            <img src={preview} alt="preview" style={{maxWidth:120, maxHeight:120, borderRadius:6, border:'1px solid #eee', boxShadow:'0 1px 4px #ddd'}} />
          </div>
        )}
        <button type="submit" disabled={loading}>Kirim</button>
        {error && <div style={{color:'red',textAlign:'center'}}>{error}</div>}
      </form>
    </div>
  );
};

export default BuatLaporan; 