import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { translations, Language } from '../translations';
import { useAuth } from './useAuth'; // Import useAuth

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)['en-US'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserLanguage, isAuthenticated } = useAuth();
  
  const [language, setInternalLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'en-US';
  });

  // Sync language FROM user profile TO app state
  useEffect(() => {
    if (isAuthenticated && user?.langPref && user.langPref !== language) {
      setInternalLanguage(user.langPref);
    }
  }, [user, isAuthenticated, language]);

  const setLanguage = useCallback((lang: Language) => {
    setInternalLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    // Sync language FROM app state TO user profile
    if (isAuthenticated) {
      updateUserLanguage(lang);
    }
  }, [isAuthenticated, updateUserLanguage]);


  const t = useMemo(() => translations[language], [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
