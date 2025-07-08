import React, { useState, useMemo } from 'react';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import { SparklesIcon } from './icons';
import { useLanguage } from '../hooks/useLanguage';
import { translations, Language } from '../translations';


type AuthView = 'login' | 'register' | 'verify';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [emailForVerification, setEmailForVerification] = useState<string>('');
  const { language, setLanguage, t } = useLanguage();

  const handleRegistrationSuccess = (email: string) => {
    setEmailForVerification(email);
    setView('verify');
  };

  const getTitle = () => {
    switch (view) {
      case 'login':
        return t.welcomeBack;
      case 'register':
        return t.createAccountTitle;
      case 'verify':
        return t.verifyEmailTitle;
      default:
        return '';
    }
  };

  const getSubtitle = () => {
    switch (view) {
        case 'login':
            return t.signInToContinue;
        case 'register':
            return t.getStarted;
        case 'verify':
            return t.verifyEmailInstructions(emailForVerification);
        default:
            return '';
    }
  };
  
  const languages = useMemo(() => Object.keys(translations) as Language[], []);
  const handleLanguageChange = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };


  return (
    <div className="w-full h-screen flex flex-col items-center justify-center font-sans p-4 relative">
       <div className="absolute top-4 right-4 z-10">
            <button
                onClick={handleLanguageChange}
                className="px-3 h-10 w-12 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-medium"
                aria-label={t.changeLanguageLabel}
            >
                {language.split('-')[0].toUpperCase()}
            </button>
       </div>

      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
            <SparklesIcon className="w-12 h-12 text-cyan-400 mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight text-center">
                {getTitle()}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-center min-h-[2rem]">
                {getSubtitle()}
            </p>
        </div>
        
        {view === 'login' && <Login onSwitchToRegister={() => setView('register')} t={t} />}
        {view === 'register' && <Register onSwitchToLogin={() => setView('login')} onRegistrationSuccess={handleRegistrationSuccess} t={t} />}
        {view === 'verify' && <VerifyEmail email={emailForVerification} onSwitchToLogin={() => setView('login')} t={t} />}
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Copyright &copy; {new Date().getFullYear()} Mert Hamza Yılmaz
      </footer>
    </div>
  );
};

export default Auth;