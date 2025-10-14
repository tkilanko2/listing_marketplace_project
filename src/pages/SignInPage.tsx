import React, { useState } from 'react';
import ConsentModal from '../components/ConsentModal';

interface SignInPageProps {
  onNavigateTo: (page: string) => void;
}

export function SignInPage({ onNavigateTo }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'google' | 'facebook' | null>(null);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-stretch bg-[#F8F8FA]">
      <div className="w-full lg:w-1/2 px-6 sm:px-10 lg:px-20 py-10 flex flex-col">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-semibold text-[#1B1C20] mb-2">Sign in</h1>
          <p className="text-[#70727F] mb-8">Welcome back! Please enter your details.</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              <label className="block text-sm text-[#383A47] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-md border border-[#CDCED8] bg-white focus:outline-none focus:ring-2 focus:ring-[#6D26AB]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center text-[#383A47]">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-[#CDCED8]"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember for 30 days
              </label>
              <button
                type="button"
                className="text-[#6D26AB] hover:text-[#3D1560]"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D1560] hover:bg-[#6D26AB] text-white py-2.5 rounded-md font-medium"
            >
              Sign in
            </button>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-white border border-[#CDCED8] text-[#383A47] py-2.5 rounded-md"
                onClick={() => { setPendingProvider('google'); setShowConsent(true); }}
              >
                Sign in with Google
              </button>
              <button
                type="button"
                className="w-full bg-white border border-[#CDCED8] text-[#383A47] py-2.5 rounded-md"
                onClick={() => { setPendingProvider('facebook'); setShowConsent(true); }}
              >
                Sign in with Facebook
              </button>
            </div>

            <p className="text-sm text-center text-[#70727F]">
              Don’t have an account?{' '}
              <button type="button" className="text-[#3D1560] hover:text-[#6D26AB] font-medium" onClick={() => onNavigateTo('signup')}>
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center bg-[#FFF5FA]">
        {/* Placeholder for brand artwork */}
        <div className="text-[#3D1560] text-6xl font-black tracking-tight">ET</div>
      </div>
      <ConsentModal
        isOpen={showConsent}
        onClose={() => { setShowConsent(false); setPendingProvider(null); }}
        onAccept={() => {
          setShowConsent(false);
          alert(`Proceeding with ${pendingProvider === 'google' ? 'Google' : 'Facebook'} sign in (mock)`);
          setPendingProvider(null);
        }}
        onNavigate={onNavigateTo}
      />
    </div>
  );
}

export default SignInPage;


