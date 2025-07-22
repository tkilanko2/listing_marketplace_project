import React, { useState } from 'react';
import { X, User, UserPlus, ArrowRight } from 'lucide-react';

interface OptionalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onProceedAsGuest: () => void;
  serviceName?: string;
}

export function OptionalAuthModal({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  onProceedAsGuest,
  serviceName = 'service'
}: OptionalAuthModalProps) {
  const [authMode, setAuthMode] = useState<'select' | 'login' | 'signup'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (authMode === 'login') {
        await onLogin(email, password);
      } else if (authMode === 'signup') {
        await onSignup(email, password);
      }
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setAuthMode('select');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleProceedAsGuest = () => {
    resetForm();
    onProceedAsGuest();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#F8F8FA] px-6 py-4 border-b border-[#CDCED8] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1B1C20]">
              {authMode === 'select' ? 'Sign in for a better experience' : 
               authMode === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-sm text-[#70727F] mt-1">
              {authMode === 'select' ? `Book "${serviceName}" with saved preferences` : 
               authMode === 'login' ? 'Sign in to your account' : 'Join our marketplace'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#70727F] hover:text-[#383A47] transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {authMode === 'select' ? (
            <div className="space-y-4">
              {/* Sign In Button */}
              <button
                onClick={() => setAuthMode('login')}
                className="w-full flex items-center justify-between p-4 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Sign In</div>
                    <div className="text-sm text-[#CDCED8]">Access your saved preferences</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => setAuthMode('signup')}
                className="w-full flex items-center justify-between p-4 bg-[#9B53D9] text-white rounded-lg hover:bg-[#6D26AB] transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Create Account</div>
                    <div className="text-sm text-[#CDCED8]">Join our marketplace</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#CDCED8]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-[#70727F]">or</span>
                </div>
              </div>

              {/* Continue as Guest Button */}
              <button
                onClick={handleProceedAsGuest}
                className="w-full p-4 bg-[#F8F8FA] text-[#383A47] rounded-lg border border-[#CDCED8] hover:bg-[#E8E9ED] transition-colors duration-200 font-medium"
              >
                Continue as Guest
              </button>

              <p className="text-xs text-[#70727F] text-center mt-4">
                You can always sign up later to save your preferences and track your bookings.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAuthMode('select')}
                  className="flex-1 py-3 px-4 bg-[#F8F8FA] text-[#383A47] rounded-lg border border-[#CDCED8] hover:bg-[#E8E9ED] transition-colors duration-200 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Please wait...' : 
                   authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleProceedAsGuest}
                  className="text-sm text-[#70727F] hover:text-[#383A47] transition-colors duration-200"
                >
                  or continue as guest
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 