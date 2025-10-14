import React, { useState } from 'react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onNavigate: (page: string) => void;
}

export function ConsentModal({ isOpen, onClose, onAccept, onNavigate }: ConsentModalProps) {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  const openInNewTab = (page: 'termsOfService' | 'privacyPolicy') => {
    const url = `${window.location.origin}${window.location.pathname}?open=${page}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold text-[#1B1C20] mb-2">Agree to continue</h2>
        <p className="text-sm text-[#70727F] mb-4">
          Before continuing with Google or Facebook, please review and accept our Terms of Service and Privacy Policy.
        </p>

        <div className="space-y-1 mb-4 text-sm">
          <button type="button" onClick={() => openInNewTab('termsOfService')} className="text-[#3D1560] hover:text-[#6D26AB] underline">
            Terms and conditions
          </button>
          <span className="mx-2 text-[#CDCED8]">•</span>
          <button type="button" onClick={() => openInNewTab('privacyPolicy')} className="text-[#3D1560] hover:text-[#6D26AB] underline">
            Privacy Policy
          </button>
        </div>

        <label className="flex items-start space-x-2 text-sm text-[#383A47] mb-4">
          <input type="checkbox" className="mt-1 rounded border-[#CDCED8]" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span>
            I agree to the Terms and conditions and acknowledge the Privacy Policy.
          </span>
        </label>

        <div className="flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 text-[#383A47] hover:text-[#1B1C20]" onClick={onClose}>Cancel</button>
          <button
            type="button"
            disabled={!checked}
            className={`px-4 py-2 rounded-md text-white ${checked ? 'bg-[#3D1560] hover:bg-[#6D26AB]' : 'bg-[#EDD9FF] cursor-not-allowed'}`}
            onClick={() => { if (checked) onAccept(); }}
          >
            Accept and continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConsentModal;


