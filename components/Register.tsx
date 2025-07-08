import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

type TranslationKeys = keyof (typeof translations)['en-US'];

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: (email: string) => void;
  t: { [key in TranslationKeys]: any };
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegistrationSuccess, t }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register(name, email, password, language);
      if (result.success) {
        onRegistrationSuccess(email);
      } else {
        setError(t.registerErrorGeneral);
      }
    } catch (err) {
      setError(t.loginErrorGeneral);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.fullNameLabel}</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.emailLabel}</label>
          <input
            id="email-register"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.passwordLabel}</label>
          <input
            id="password-register"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
          >
            {loading ? t.creatingAccountButton : t.createAccountButton}
          </button>
        </div>
      </form>
      
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {t.alreadyHaveAccount}{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-cyan-600 dark:text-white hover:text-cyan-500">
          {t.signIn}
        </button>
      </p>
    </div>
  );
};

export default Register;