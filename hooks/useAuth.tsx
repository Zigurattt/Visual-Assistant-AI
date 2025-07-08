import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Language } from '../translations';
import { verifyEmailAddress, VerificationResult } from '../services/emailService';

interface User {
  name: string;
  email: string;
  langPref: Language;
  isVerified: boolean; // Add verification status
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, lang: Language) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserLanguage: (lang: Language) => void;
  verifyUser: (email: string) => Promise<VerificationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER_DB_KEY = 'visual_assistant_user_db';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      // For this mock, we only restore the session if the user is verified.
      const savedUserJSON = localStorage.getItem(FAKE_USER_DB_KEY);
      if (savedUserJSON) {
        const savedUser: User = JSON.parse(savedUserJSON);
        if (savedUser.isVerified) {
             setUser(savedUser);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // Don't clear DB, just the session
      setUser(null);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const savedUserJSON = localStorage.getItem(FAKE_USER_DB_KEY);
    if (!savedUserJSON) {
      return { success: false, error: 'invalid' }; // No user registered
    }
    const registeredUser: User = JSON.parse(savedUserJSON);

    if (registeredUser.email !== email) {
      return { success: false, error: 'invalid' }; // Wrong email
    }

    if (!registeredUser.isVerified) {
      return { success: false, error: 'not_verified' }; // User exists but not verified
    }

    // Correct user, verified. Log them in.
    setUser(registeredUser);
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, pass: string, lang: Language): Promise<{ success: boolean; error?: string }> => {
    try {
        const newUser: User = { name, email, langPref: lang, isVerified: false };
        // In this single-user mock, registering overwrites any previous user.
        localStorage.setItem(FAKE_USER_DB_KEY, JSON.stringify(newUser));
        // DO NOT log the user in.
        setUser(null); 
        return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'general' };
    }
  }, []);

  const verifyUser = useCallback(async (email: string): Promise<VerificationResult> => {
    const verificationResult = await verifyEmailAddress(email);

    if (verificationResult.success) {
      const savedUserJSON = localStorage.getItem(FAKE_USER_DB_KEY);
      if (savedUserJSON) {
        const registeredUser: User = JSON.parse(savedUserJSON);
        // Ensure we're verifying the correct user
        if (registeredUser.email === email) {
            const verifiedUser = { ...registeredUser, isVerified: true };
            localStorage.setItem(FAKE_USER_DB_KEY, JSON.stringify(verifiedUser));
            setUser(verifiedUser); // Log the user in upon successful verification
        }
      }
    }
    
    return verificationResult;
  }, []);
  
  const updateUserLanguage = useCallback((lang: Language) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, langPref: lang };
        localStorage.setItem(FAKE_USER_DB_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    });
  }, []);

  const logout = useCallback(() => {
    // We clear the session but leave the user in the "DB" (localStorage)
    setUser(null);
  }, []);
  
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserLanguage,
    verifyUser,
  }), [user, login, register, logout, updateUserLanguage, verifyUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
