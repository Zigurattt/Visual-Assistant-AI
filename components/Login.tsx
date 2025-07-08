import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GoogleIcon } from './icons';
import { translations } from '../translations';

type TranslationKeys = keyof (typeof translations)['en-US'];

interface LoginProps {
  onSwitchToRegister: () => void;
  t: { [key in TranslationKeys]: any };
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        if (result.error === 'not_verified') {
          setError(t.loginErrorNotVerified);
        } else {
          setError(t.loginErrorInvalid);
        }
      }
      // On success, the AuthProvider will update the state and App will re-render
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
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.emailLabel}</label>
          <input
            id="email"
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
          <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t.passwordLabel}</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <a href="#" className="font-medium text-cyan-600 dark:text-white hover:text-cyan-500">
              {t.forgotPassword}
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
          >
            {loading ? t.signingInButton : t.signInButton}
          </button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-slate-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{t.orContinueWith}</span>
        </div>
      </div>
      
      <div>
         <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
            <GoogleIcon className="w-5 h-5 mr-2" />
            {t.googleButton}
        </button>
      </div>

       <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {t.notAMember}{' '}
        <button onClick={onSwitchToRegister} className="font-medium text-cyan-600 dark:text-white hover:text-cyan-500">
          {t.signUpNow}
        </button>
      </p>
    </div>
  );
};

export default Login;