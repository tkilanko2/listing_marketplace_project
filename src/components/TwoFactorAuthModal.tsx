import React, { useState } from 'react';
import { X, Shield, Smartphone, Key, Copy, Check, AlertCircle } from 'lucide-react';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

type Step = 'overview' | 'choose-method' | 'setup-authenticator' | 'setup-sms' | 'verify' | 'backup-codes';

export function TwoFactorAuthModal({ isOpen, onClose, isEnabled, onToggle }: TwoFactorAuthModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('overview');
  const [selectedMethod, setSelectedMethod] = useState<'authenticator' | 'sms' | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Mock QR code and secret key
  const mockSecretKey = 'JBSWY3DPEHPK3PXP';
  const mockBackupCodes = [
    '1234-5678-9012',
    '2345-6789-0123',
    '3456-7890-1234',
    '4567-8901-2345',
    '5678-9012-3456',
    '6789-0123-4567',
  ];

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep('overview');
    setSelectedMethod(null);
    setVerificationCode('');
    setPhoneNumber('');
    setCopiedCode(null);
    onClose();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleEnable2FA = () => {
    setCurrentStep('choose-method');
  };

  const handleDisable2FA = () => {
    onToggle(false);
    handleClose();
  };

  const handleMethodSelect = (method: 'authenticator' | 'sms') => {
    setSelectedMethod(method);
    if (method === 'authenticator') {
      setCurrentStep('setup-authenticator');
    } else {
      setCurrentStep('setup-sms');
    }
  };

  const handleVerify = () => {
    // Mock verification
    if (verificationCode.length === 6) {
      setCurrentStep('backup-codes');
    }
  };

  const handleComplete = () => {
    onToggle(true);
    handleClose();
  };

  // Overview when 2FA is disabled
  const OverviewDisabled = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-[#3D1560]" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Two-Factor Authentication</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Protect your account with 2FA
              </p>
              <p className="text-sm text-blue-800">
                Add an extra layer of security to your account. Even if someone gets your password, they won't be able to access your account without the second verification step.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#383A47]">How it works:</h3>
          <ol className="text-sm text-[#70727F] space-y-2 ml-4 list-decimal">
            <li>Choose your preferred 2FA method</li>
            <li>Complete the setup process</li>
            <li>Save your backup codes in a safe place</li>
            <li>Enter a verification code each time you sign in</li>
          </ol>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleEnable2FA}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3D1560] to-[#6D26AB] rounded-md hover:shadow-lg transition-all"
        >
          Enable 2FA
        </button>
      </div>
    </>
  );

  // Overview when 2FA is enabled
  const OverviewEnabled = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Two-Factor Authentication</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">2FA is enabled</p>
              <p className="text-sm text-green-800">
                Your account is protected with two-factor authentication
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#E8E9ED]">
          <h3 className="text-sm font-medium text-[#383A47] mb-2">Current method</h3>
          <div className="flex items-center space-x-2 text-sm text-[#70727F]">
            <Smartphone className="w-4 h-4" />
            <span>Authenticator App</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Make sure you have your backup codes saved in a safe place. You'll need them if you lose access to your authentication device.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button
          onClick={handleDisable2FA}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Disable 2FA
        </button>
      </div>
    </>
  );

  // Choose method step
  const ChooseMethodStep = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-[#3D1560]" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Choose 2FA Method</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm text-[#70727F]">Select your preferred authentication method:</p>

        <button
          onClick={() => handleMethodSelect('authenticator')}
          className="w-full text-left p-4 bg-white border-2 border-[#E8E9ED] rounded-lg hover:border-[#3D1560] hover:bg-[#F5EDFF] transition-all group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#F5EDFF] rounded-lg flex items-center justify-center group-hover:bg-[#3D1560] transition-colors">
              <Smartphone className="w-5 h-5 text-[#3D1560] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#1B1C20] mb-1">Authenticator App</h3>
              <p className="text-xs text-[#70727F]">
                Use apps like Google Authenticator, Authy, or 1Password (Recommended)
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleMethodSelect('sms')}
          className="w-full text-left p-4 bg-white border-2 border-[#E8E9ED] rounded-lg hover:border-[#3D1560] hover:bg-[#F5EDFF] transition-all group"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#F5EDFF] rounded-lg flex items-center justify-center group-hover:bg-[#3D1560] transition-colors">
              <Key className="w-5 h-5 text-[#3D1560] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#1B1C20] mb-1">SMS / Text Message</h3>
              <p className="text-xs text-[#70727F]">
                Receive verification codes via text message to your phone
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={() => setCurrentStep('overview')}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </>
  );

  // Setup authenticator step
  const SetupAuthenticatorStep = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-[#3D1560]" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Setup Authenticator App</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#383A47]">Step 1: Install an authenticator app</h3>
          <p className="text-xs text-[#70727F]">
            Download one of these apps on your phone if you haven't already:
          </p>
          <ul className="text-xs text-[#70727F] ml-4 list-disc space-y-1">
            <li>Google Authenticator</li>
            <li>Microsoft Authenticator</li>
            <li>Authy</li>
            <li>1Password</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#383A47]">Step 2: Scan the QR code</h3>
          <div className="bg-white border-2 border-[#E8E9ED] rounded-lg p-4 flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <p className="text-xs text-gray-500">[QR Code Placeholder]</p>
            </div>
            <p className="text-xs text-[#70727F] text-center">
              Scan this QR code with your authenticator app
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#383A47]">Or enter this key manually:</h3>
          <div className="flex items-center space-x-2">
            <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-sm font-mono text-[#383A47] border border-gray-200">
              {mockSecretKey}
            </code>
            <button
              onClick={() => handleCopyCode(mockSecretKey)}
              className="px-3 py-2 bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
            >
              {copiedCode === mockSecretKey ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-[#70727F]" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[#383A47]">Step 3: Enter verification code</h3>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent text-center text-lg font-mono tracking-widest"
            maxLength={6}
          />
          <p className="text-xs text-[#70727F]">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={() => setCurrentStep('choose-method')}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleVerify}
          disabled={verificationCode.length !== 6}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
            verificationCode.length === 6
              ? 'bg-gradient-to-r from-[#3D1560] to-[#6D26AB] hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Verify & Continue
        </button>
      </div>
    </>
  );

  // Setup SMS step
  const SetupSMSStep = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-[#3D1560]" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Setup SMS Authentication</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-sm text-[#70727F]">
          Enter your phone number to receive verification codes via text message
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#383A47]">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-transparent"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Standard messaging rates may apply. SMS 2FA is less secure than using an authenticator app.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={() => setCurrentStep('choose-method')}
          className="px-4 py-2 text-sm font-medium text-[#383A47] bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep('verify')}
          disabled={!phoneNumber}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-all ${
            phoneNumber
              ? 'bg-gradient-to-r from-[#3D1560] to-[#6D26AB] hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Send Code
        </button>
      </div>
    </>
  );

  // Backup codes step
  const BackupCodesStep = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-[#1B1C20]">Save Your Backup Codes</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900 mb-1">2FA setup complete!</p>
              <p className="text-sm text-green-800">
                Save these backup codes in a safe place. You'll need them if you lose access to your authentication device.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E8E9ED] rounded-lg p-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {mockBackupCodes.map((code) => (
              <div
                key={code}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md border border-gray-200"
              >
                <code className="text-sm font-mono text-[#383A47]">{code}</code>
                <button
                  onClick={() => handleCopyCode(code)}
                  className="ml-2 text-[#70727F] hover:text-[#3D1560] transition-colors"
                >
                  {copiedCode === code ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleCopyCode(mockBackupCodes.join('\n'))}
            className="w-full px-3 py-2 text-xs bg-white border border-[#CDCED8] rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Copy className="w-3 h-3" />
            <span>Copy All Codes</span>
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">
              Each backup code can only be used once. Keep them secure and don't share them with anyone.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={handleComplete}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3D1560] to-[#6D26AB] rounded-md hover:shadow-lg transition-all"
        >
          Done
        </button>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {!isEnabled && currentStep === 'overview' && <OverviewDisabled />}
        {isEnabled && currentStep === 'overview' && <OverviewEnabled />}
        {currentStep === 'choose-method' && <ChooseMethodStep />}
        {currentStep === 'setup-authenticator' && <SetupAuthenticatorStep />}
        {currentStep === 'setup-sms' && <SetupSMSStep />}
        {currentStep === 'backup-codes' && <BackupCodesStep />}
      </div>
    </div>
  );
}

export default TwoFactorAuthModal;
