import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const [form, setForm] = useState({ nik: '', nama: '', jabatan: '', email: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    if (user) setForm({ nik: user.nik, nama: user.nama, jabatan: user.jabatan, email: user.email });
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = e => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.put('/api/users/update', form, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setMsg('Data berhasil diupdate');
    } catch {
      setMsg('Gagal update data');
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    setPwMsg('');
    try {
      await axios.put('/api/users/change-password', pwForm, { headers: { Authorization: `Bearer ${token}` } });
      setPwMsg('Password berhasil diubah');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg(err.response?.data?.msg || 'Gagal ganti password');
    }
  };

  return (
    <div className="container">
      <h2>Profil Saya</h2>
      <form onSubmit={handleUpdate}>
        <input name="nik" placeholder="NIK" value={form.nik} onChange={handleChange} required />
        <input name="nama" placeholder="Nama Lengkap" value={form.nama} onChange={handleChange} required />
        <input name="jabatan" placeholder="Jabatan" value={form.jabatan} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">Update</button>
        {msg && <div>{msg}</div>}
      </form>
      <h3>Ganti Password</h3>
      <form onSubmit={handleChangePassword}>
        <input name="oldPassword" type="password" placeholder="Password Lama" value={pwForm.oldPassword} onChange={handlePwChange} required />
        <input name="newPassword" type="password" placeholder="Password Baru" value={pwForm.newPassword} onChange={handlePwChange} required />
        <input name="confirmPassword" type="password" placeholder="Konfirmasi Password Baru" value={pwForm.confirmPassword} onChange={handlePwChange} required />
        <button type="submit">Ganti Password</button>
        {pwMsg && <div>{pwMsg}</div>}
      </form>
    </div>
  );
};

export default ProfilePage; 