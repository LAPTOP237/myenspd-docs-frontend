import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService, profileService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialisation - vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser && authService.isAuthenticated()) {
          // Optionnel: Valider le token en récupérant le profil
          try {
            const profileData = await profileService.get();
            setUser(profileData.user || storedUser);
          } catch {
            // Token invalide, utiliser les données stockées
            setUser(storedUser);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);


  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      console.log("Login response:", data);
      setUser(data.user || data); // si ton API ne renvoie pas `user` séparé
      localStorage.setItem('user', JSON.stringify(data.user)); 
      localStorage.setItem('token', data.token); 
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);
    try {
      // 👇 Nettoyer les données avant envoi
      const payload = { ...userData };
      delete payload.confirmPassword;

     
      if (!payload.role) {
        payload.role = "STUDENT"; // ou STAFF pour le personnel
      }

      const data = await authService.register(payload);
      setUser(data.user);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setError(null);
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'envoi';
      setError(message);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (data) => {
    setError(null);
    try {
      const result = await authService.resetPassword(data);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la réinitialisation';
      setError(message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;