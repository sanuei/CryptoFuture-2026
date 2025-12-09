import React, { useState } from 'react';
import { CyberButton } from './CyberButton';
import { ShieldAlert } from './Icons';
import { translations } from '../utils/translations';
import { Language } from '../types';

interface AdminLoginProps {
  lang: Language;
  onLogin: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ lang, onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CryptoFuture2026') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn">
      <div className="bg-cyber-panel border border-cyber-pink p-8 max-w-md w-full relative overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.2)]">
        {/* Scanline overlay for this specific panel */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,19,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>
        
        <div className="relative z-10 text-center">
          <ShieldAlert className="w-12 h-12 text-cyber-pink mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-6 font-mono tracking-widest">{t.adminLogin}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder={t.passwordPlaceholder}
              className="w-full bg-cyber-black border border-gray-700 focus:border-cyber-pink text-center text-white p-3 font-mono outline-none transition-all placeholder-gray-600 focus:shadow-[0_0_10px_rgba(255,0,255,0.4)]"
              autoFocus
            />
            
            {error && (
              <div className="text-red-500 font-mono text-sm animate-glitch bg-red-900/20 p-2 border border-red-500/50">
                {t.accessDenied}
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-4 py-2 font-mono text-gray-500 hover:text-white transition-colors text-sm"
              >
                {t.cancel}
              </button>
              <CyberButton variant="secondary" type="submit">
                {t.login}
              </CyberButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
