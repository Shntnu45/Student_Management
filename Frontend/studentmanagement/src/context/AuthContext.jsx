import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/studentService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback(async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
  }, []);

  const register = useCallback(async (userData) => {
    await authService.register(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
