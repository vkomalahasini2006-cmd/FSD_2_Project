import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rentkart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rentkart_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile on mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data.success && response.data.data?.user) {
          setUser(response.data.data.user);
          localStorage.setItem('rentkart_user', JSON.stringify(response.data.data.user));
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        // Only clear if 401
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('rentkart_token', receivedToken);
    localStorage.setItem('rentkart_user', JSON.stringify(receivedUser));
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  const verifyEmail = async (email, otp) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    const { token: receivedToken, user: receivedUser } = response.data.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('rentkart_token', receivedToken);
    localStorage.setItem('rentkart_user', JSON.stringify(receivedUser));
    return response.data;
  };

  const resendOtp = async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rentkart_token');
    localStorage.removeItem('rentkart_user');
  };

  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isOwner,
        isAdmin,
        isLoading,
        login,
        register,
        verifyEmail,
        resendOtp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
