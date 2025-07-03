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
      if (loggedIn.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email atau Username" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>Login</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
      <p>Belum punya akun? <a href="/register">Daftar</a></p>
    </div>
  );
};

export default LoginPage; 