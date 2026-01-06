import React, { useState } from 'react';
import { CountrySelector } from '../components/CountrySelector';
import ConsentModal from '../components/ConsentModal';

interface SignUpPageProps {
  onNavigateTo: (page: string) => void;
  onSignup?: (email: string, password: string) => void;
}

export function SignUpPage({ onNavigateTo, onSignup }: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'google' | 'facebook' | null>(null);

  const emailValid = /.+@.+\..+/.test(email);
  const isFormValid = name.trim().length > 0 && emailValid && country && password.length >= 8 && agree;

  const openInNewTab = (page: 'termsOfService' | 'privacyPolicy') => {
    const url = `${window.location.origin}${window.location.pathname}?open=${page}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSignup && isFormValid) {
      onSignup(email, password);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch bg-[#F8F8FA]">
      <div className="w-full lg:w-1/2 px-6 sm:px-10 lg:px-20 py-10 flex flex-col">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-semibold text-[#1B1C20] mb-2">Sign up</h1>
          <p className="text-[#70727F] mb-8">Welcome! Please enter your details to get started.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-[#383A47] mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                className="w-full px-3 py-2 rounded-md border border-[#CDCED8] bg-white focus:outline-none focus:ring-2 focus:ring-[#6D26AB]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#383A47] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md border border-[#CDCED8] bg-white focus:outline-none focus:ring-2 focus:ring-[#6D26AB]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#383A47] mb-2">Country</label>
              <CountrySelector variant="input" onCountryChange={(code) => setCountry(code)} />
            </div>
            <div>
              <label className="block text-sm text-[#383A47] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded-md border border-[#CDCED8] bg-white focus:outline-none focus:ring-2 focus:ring-[#6D26AB]"
              />
              <p className="text-xs text-[#2da44e] mt-1">Must be at least 8 characters.</p>
            </div>

            <label className="flex items-start text-sm text-[#383A47] space-x-2">
              <input type="checkbox" className="mt-1 rounded border-[#CDCED8]" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                I agree to the{' '}
                <button type="button" className="text-[#3D1560] hover:text-[#6D26AB] underline" onClick={() => openInNewTab('termsOfService')}>Terms and conditions</button>
                {' '}and acknowledge the{' '}
                <button type="button" className="text-[#3D1560] hover:text-[#6D26AB] underline" onClick={() => openInNewTab('privacyPolicy')}>Privacy Policy</button>
              </span>
            </label>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-md font-medium ${isFormValid ? 'bg-[#3D1560] text-white hover:bg-[#6D26AB]' : 'bg-[#EDD9FF] text-[#CDCED8] cursor-not-allowed'}`}
              disabled={!isFormValid}
            >
              Sign up
            </button>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-white border border-[#CDCED8] text-[#383A47] py-2.5 rounded-md"
                onClick={() => { setPendingProvider('google'); setShowConsent(true); }}
              >
                Sign up with Google
              </button>
              <button
                type="button"
                className="w-full bg-white border border-[#CDCED8] text-[#383A47] py-2.5 rounded-md"
                onClick={() => { setPendingProvider('facebook'); setShowConsent(true); }}
              >
                Sign up with Facebook
              </button>
            </div>

            <p className="text-sm text-center text-[#70727F]">
              Already have an account?{' '}
              <button type="button" className="text-[#3D1560] hover:text-[#6D26AB] font-medium" onClick={() => onNavigateTo('signin')}>
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#FFF5FA]">
        <div className="text-[#3D1560] text-6xl font-black tracking-tight">ET</div>
      </div>

      <ConsentModal
        isOpen={showConsent}
        onClose={() => { setShowConsent(false); setPendingProvider(null); }}
        onAccept={() => {
          setShowConsent(false);
          // Mock provider flow after consent
          alert(`Proceeding with ${pendingProvider === 'google' ? 'Google' : 'Facebook'} sign up (mock)`);
          setPendingProvider(null);
        }}
        onNavigate={onNavigateTo}
      />
    </div>
  );
}

export default SignUpPage;


