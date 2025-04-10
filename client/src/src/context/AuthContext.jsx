import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, logout as logoutService, getCurrentUser, refreshToken } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Check if token is expired or about to expire
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      // Check if token is expired or will expire in the next 5 minutes
      return decoded.exp < (Date.now() / 1000) + 300; // 300 seconds = 5 minutes
    } catch (error) {
      return true;
    }
  };

  // Setup token refresh interval
  useEffect(() => {
    let refreshInterval;

    if (isAuthenticated) {
      // Check token every 4 minutes
      refreshInterval = setInterval(async () => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
          try {
            await refreshAuthToken();
          } catch (error) {
            console.error('Failed to refresh token:', error);
            // If refresh fails, log the user out
            handleLogout();
          }
        }
      }, 4 * 60 * 1000); // 4 minutes
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isAuthenticated]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }
        
        // Check if token is expired
        if (isTokenExpired(token)) {
          try {
            // Try to refresh the token
            await refreshAuthToken();
          } catch (error) {
            // If refresh fails, clear auth state
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setCurrentUser(null);
            setUserRole(null);
            setLoading(false);
            return;
          }
        }
        
        // Get current user info
        const userData = await getCurrentUser();
        setCurrentUser(userData);
        
        // Extract role from token
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const refreshAuthToken = async () => {
    try {
      const response = await refreshToken();
      const { token } = response;
      
      localStorage.setItem('token', token);
      
      // Update role from new token
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      
      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setAuthError(null);
      const response = await login(email, password);
      const { token, user } = response;
      
      localStorage.setItem('token', token);
      
      // Extract role from token
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    currentUser,
    userRole,
    isAuthenticated,
    loading,
    authError,
    login: handleLogin,
    logout: handleLogout,
    refreshToken: refreshAuthToken,
    clearAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
