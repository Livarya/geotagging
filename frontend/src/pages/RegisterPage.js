import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ nik: '', nama: '', jabatan: '', username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/register', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registrasi gagal');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="nik" placeholder="NIK" value={form.nik} onChange={handleChange} required />
        <input name="nama" placeholder="Nama Lengkap" value={form.nama} onChange={handleChange} required />
        <input name="jabatan" placeholder="Jabatan" value={form.jabatan} onChange={handleChange} required />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>Register</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
      <p>Sudah punya akun? <a href="/">Login</a></p>
    </div>
  );
};

export default RegisterPage; 