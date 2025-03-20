import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token on mount and whenever localStorage changes
    const token = localStorage.getItem('token');
    setUserLoggedIn(!!token);
    console.log('userLoggedIn:', userLoggedIn); // Add console log
  }, [localStorage.getItem('token')]); // Add localStorage.getItem('token') as dependency

  const isTokenExpired = (token) => {
    const decoded = jwt.decode(token);
    return decoded.exp * 1000 < Date.now();
  };

  const login = (token) => {
    if (isTokenExpired(token)) {
      alert('Session expired. Please log in again.');
      logout(); // Call logout to clear the expired token
      return;
    }
    try {
      localStorage.setItem('token', token);
      setUserLoggedIn(true);
    } catch (error) {
      alert('Error logging in: Invalid or expired token.');
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
