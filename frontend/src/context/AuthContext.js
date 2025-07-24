import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import BASE_URL from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (nip, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { nip, password });
      setUser(res.data.user);
      setToken(res.data.token);
      setLoading(false);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login gagal');
      setLoading(false);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = { user, token, loading, error, login, logout, setUser, setToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 