import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { CloseIcon, LogoutIcon } from './icons';
import { Language } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  logout: () => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  setTheme,
  logout,
  speechRate,
  setSpeechRate,
  speechPitch,
  setSpeechPitch
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleReset = () => {
    setLanguage('en-US');
    setTheme('light');
    setSpeechRate(1);
    setSpeechPitch(1);
  };

  const handleLogout = () => {
    onClose(); // Close modal first
    logout(); // Then log out
  };

  const LanguageButton: React.FC<{ langCode: Language, langName: string }> = ({ langCode, langName }) => (
      <button
        onClick={() => handleLanguageChange(langCode)}
        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${language === langCode ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:bg-white/50 dark:text-slate-300 dark:hover:bg-slate-800/50'}`}
      >
        {langName}
      </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.settingsTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 pt-2">
            {/* Language Settings */}
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t.languageLabel}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-900/70 p-1">
                <LanguageButton langCode="en-US" langName="English" />
                <LanguageButton langCode="tr-TR" langName="Türkçe" />
                <LanguageButton langCode="es-ES" langName="Español" />
                <LanguageButton langCode="pt-BR" langName="Português" />
                <LanguageButton langCode="de-DE" langName="Deutsch" />
              </div>
            </div>
            
            {/* Speech Settings */}
            <div>
                 <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t.speechLabel}</h3>
                 <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-lg space-y-3">
                    <div>
                        <label htmlFor="rate" className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300"><span>{t.rateLabel}</span> <span>{speechRate.toFixed(1)}</span></label>
                        <input type="range" id="rate" min="0.5" max="2" step="0.1" value={speechRate} onChange={e => setSpeechRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <label htmlFor="pitch" className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300"><span>{t.pitchLabel}</span> <span>{speechPitch.toFixed(1)}</span></label>
                        <input type="range" id="pitch" min="0" max="2" step="0.1" value={speechPitch} onChange={e => setSpeechPitch(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                 </div>
            </div>

            {/* Theme Settings */}
            <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t.themeLabel}</h3>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left bg-slate-100 text-slate-800 dark:bg-slate-900/70 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  {theme === 'light' ? t.switchToDark : t.switchToLight}
                </button>
            </div>
            
            {/* About Section */}
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{t.aboutLabel}</h3>
              <div className="text-sm p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg text-slate-700 dark:text-slate-300 space-y-2">
                  <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{t.aboutTitle}</p>
                      <p className="text-xs text-slate-500">{t.aboutVersion}</p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{t.aboutDescription}</p>
                  <p className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">{t.developedBy}</p>
              </div>
            </div>
            
            <hr className="border-slate-200 dark:border-slate-700" />

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              >
                {t.resetLabel}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-rose-500/50 bg-rose-50/50 text-rose-600 dark:text-rose-400 dark:border-rose-400/50 dark:bg-rose-500/10 hover:bg-rose-50 dark:hover:bg-rose-500/20"
              >
                <LogoutIcon className="w-4 h-4" />
                <span>{t.logoutLabel}</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;