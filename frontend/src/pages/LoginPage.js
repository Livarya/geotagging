import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedIn = await login(identifier, password);
    if (loggedIn) {
      if (loggedIn.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (loggedIn.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--light-blue)'}}>
      <div className="card" style={{maxWidth:380,width:'100%',padding:'36px 32px',margin:'32px 0'}}>
        <h2 style={{textAlign:'center',fontWeight:700,color:'var(--primary-blue)',marginBottom:24}}>Login</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="text" placeholder="Email atau Username" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>Login</button>
          {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
        </form>
        <p style={{marginTop:8,textAlign:'center'}}>
          <a href="/forgot-password" style={{color:'var(--accent-blue)',fontWeight:600}}>Lupa password?</a>
        </p>
        <p style={{marginTop:18,textAlign:'center',color:'#64748b'}}>Belum punya akun? <a href="/register" style={{color:'var(--accent-blue)',fontWeight:600}}>Daftar</a></p>
      </div>
    </div>
  );
};

export default LoginPage;