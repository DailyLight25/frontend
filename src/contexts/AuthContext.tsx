import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/apiService';

interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  is_verified: boolean;
  date_joined: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Verify token is still valid
          await apiService.post('users/token/verify/', { token });
          // Get user profile
          const userData = await apiService.get('users/me/');
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, try to refresh
          const refreshTokenValue = localStorage.getItem('refresh_token');
          if (refreshTokenValue) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              // Refresh failed, clear tokens
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
            }
          } else {
            // No refresh token, clear access token
            localStorage.removeItem('access_token');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.post('users/token/', {
        username,
        password,
      });

      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);

      // Get user profile
      const userData = await apiService.get('users/me/');
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      await apiService.post('users/register/', {
        username,
        email,
        password,
        confirmPassword,
      });
      // Auto-verified in development, automatically log in the user
      await login(username, password);
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) return false;

      const response = await apiService.post('users/token/refresh/', {
        refresh: refreshTokenValue,
      });

      localStorage.setItem('access_token', response.access);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
