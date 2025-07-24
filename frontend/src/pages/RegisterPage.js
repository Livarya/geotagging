import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api';

const RegisterPage = () => {
  const [form, setForm] = useState({ nip: '', nohp: '', nama: '', jabatan: '', username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'nip') {
      // Hanya angka, harus 18 digit
      if (!/^\d{0,18}$/.test(value)) return;
    }
    if (name === 'nohp') {
      // Hanya angka, max 13 digit
      if (!/^\d{0,13}$/.test(value)) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registrasi gagal');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--light-blue)'}}>
      <div className="card" style={{maxWidth:420,width:'100%',padding:'36px 32px',margin:'32px 0'}}>
        <h2 style={{textAlign:'center',fontWeight:700,color:'var(--primary-blue)',marginBottom:24}}>Register</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input name="nip" placeholder="NIP" value={form.nip} onChange={handleChange} required minLength={18} maxLength={18} pattern="\d{18}" title="NIP harus 18 digit angka" />
          <input name="nohp" placeholder="No HP" value={form.nohp} onChange={handleChange} required maxLength={13} pattern="\d{10,13}" title="No HP harus 10-13 digit angka" />
          <input name="nama" placeholder="Nama Lengkap" value={form.nama} onChange={handleChange} required />
          <input name="jabatan" placeholder="Jabatan" value={form.jabatan} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <button type="submit" disabled={loading}>Register</button>
          {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
        </form>
        <p style={{marginTop:18,textAlign:'center',color:'#64748b'}}>Sudah punya akun? <a href="/" style={{color:'var(--accent-blue)',fontWeight:600}}>Login</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;