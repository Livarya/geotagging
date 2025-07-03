import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DataPengguna = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const filtered = users.filter(u =>
    u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Data Pengguna</h2>
      <input className="filter-input" placeholder="Cari nama / username / email / jabatan" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:16}} />
      <div className="table-wrapper">
        {loading ? <div style={{textAlign:'center',padding:40}}><span className="spinner"></span></div> : (
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Username</th>
              <th>Email</th>
              <th>Jabatan</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td>{u.nama}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.jabatan}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      <style>{`.spinner{display:inline-block;width:32px;height:32px;border:4px solid #d1d5db;border-top:4px solid #2563eb;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default DataPengguna; 