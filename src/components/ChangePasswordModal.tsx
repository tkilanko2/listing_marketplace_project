import React, { useState } from 'react';
import { X, Shield, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

export function ChangePasswordModal({ isOpen, onClose, onChangePassword }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  // Password strength calculation
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 2) return { strength: 2, label: 'Fair', color: 'bg-orange-500' };
    if (strength <= 3) return { strength: 3, label: 'Good', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength: 4, label: 'Strong', color: 'bg-green-500' };
    return { strength: 5, label: 'Very Strong', color: 'bg-green-600' };
  };

  // Password requirements
  const requirements = [
    { met: newPassword.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword), text: 'Uppercase and lowercase letters' },
    { met: /[0-9]/.test(newPassword), text: 'At least one number' },
    { met: /[^a-zA-Z0-9]/.test(newPassword), text: 'At least one special character (!@#$%^&*)' },
  ];

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = confirmPassword && newPassword !== confirmPassword;
  const allRequirementsMet = requirements.every((req) => req.met);
  const isValid = currentPassword && allRequirementsMet && passwordsMatch;

  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onChangePassword(currentPassword, newPassword);
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#3D1560]" />
            <h2 className="text-lg font-semibold text-[#1B1C20]">Change Password</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-[#70727F]">
            Create a strong password to keep your account secure
          </p>

          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47]">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full px-3 py-2 pr-10 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70727F] hover:text-[#383A47]"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47]">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-3 py-2 pr-10 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70727F] hover:text-[#383A47]"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && passwordStrength && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#70727F]">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.strength <= 2 ? 'text-red-600' :
                    passwordStrength.strength === 3 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full ${
                        level <= passwordStrength.strength
                          ? passwordStrength.color
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent ${
                  passwordsDontMatch
                    ? 'border-red-500'
                    : passwordsMatch
                    ? 'border-green-500'
                    : 'border-[#CDCED8]'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70727F] hover:text-[#383A47]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordsDontMatch && (
              <p className="text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Passwords do not match</span>
              </p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-green-600 flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Passwords match</span>
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-[#F8F8FA] border border-[#E8E9ED] rounded-lg p-3">
            <h4 className="text-xs font-medium text-[#383A47] mb-2">Password requirements:</h4>
            <ul className="space-y-1">
              {requirements.map((req, index) => (
                <li
                  key={index}
                  className={`text-xs flex items-center space-x-2 ${
                    req.met ? 'text-green-600' : 'text-[#70727F]'
                  }`}
                >
                  {req.met ? (
                    <Check className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                  )}
                  <span>{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
              isValid
                ? 'bg-gradient-to-r from-[#3D1560] to-[#6D26AB] hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
