import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { translations } from '../translations';
import { VerificationErrorCode } from '../services/emailService';

type TranslationKeys = keyof (typeof translations)['en-US'];

interface VerifyEmailProps {
  email: string;
  onSwitchToLogin: () => void;
  t: { [key in TranslationKeys]: any };
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onSwitchToLogin, t }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyUser } = useAuth();

  const getErrorMessage = (errorCode: VerificationErrorCode): string => {
    switch (errorCode) {
      case 'invalid_format':
        return t.verifyErrorInvalidFormat;
      case 'undeliverable':
        return t.verifyErrorUndeliverable;
      case 'connection_error':
        return t.verifyErrorConnection;
      default:
        return t.verifyErrorGeneral;
    }
  };

  const handleVerification = async () => {
    setLoading(true);
    setError('');
    const result = await verifyUser(email);
    if (!result.success) {
      setError(getErrorMessage(result.errorCode || 'unknown'));
    }
    // On success, the useAuth hook will set the user and the app will re-render.
    setLoading(false);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800/50 rounded-2xl shadow-xl p-8 space-y-6">
      <div className="space-y-4">
        {/* This button simulates the user clicking a link in their email, but now it triggers a real API call. */}
        <button
          onClick={handleVerification}
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {loading ? t.verifyingButton : t.verifyEmailButton}
        </button>
        
        {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
        
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {t.verifyEmailCta}{' '}
            <button disabled className="font-medium text-cyan-600/50 dark:text-white/50 cursor-not-allowed">
              {t.resendEmailButton}
            </button>
        </p>

      </div>
      
       <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        <button onClick={onSwitchToLogin} className="font-medium text-cyan-600 dark:text-white hover:text-cyan-500">
          &larr; {t.backToLogin}
        </button>
      </p>
    </div>
  );
};

export default VerifyEmail;
