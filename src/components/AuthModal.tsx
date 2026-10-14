import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      onLoginSuccess(email.split('@')[0]);
      onClose();
      setSubmitted(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E0E3EB] shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded bg-[#131722] flex items-center justify-center">
            <span className="text-white text-base font-bold">TV</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#6A707C] hover:text-[#131722] hover:bg-[#F0F3FA]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <h3 className="text-xl font-bold text-[#131722] mb-1">
          {mode === 'signup' ? 'Start your financial journey' : 'Welcome back to TradingView'}
        </h3>
        <p className="text-xs text-[#6A707C] mb-5">
          Join 60+ million traders & investors looking first and leaping into world markets.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-[#131722] block mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2 bg-[#F0F3FA] rounded-xl border border-[#E0E3EB] text-[#131722] text-sm focus:outline-none focus:ring-2 focus:ring-[#2962ff]/40"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full py-2.5 rounded-full bg-[#2962ff] hover:bg-[#0049db] text-white font-semibold text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60"
          >
            {submitted ? 'Connecting...' : mode === 'signup' ? 'Create free account' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#ebeef5] text-center text-xs text-[#6A707C]">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#2962ff] font-bold hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#2962ff] font-bold hover:underline"
              >
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
