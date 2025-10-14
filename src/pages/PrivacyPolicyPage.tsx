import React from 'react';

interface PrivacyPolicyPageProps {
  onBack?: () => void;
}

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <div className="p-8 bg-[#F8F8FA] min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl mx-auto bg-white border border-[#E8E9ED] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-[#1B1C20]">Privacy Policy</h1>
          {onBack && (
            <button className="text-sm text-[#3D1560] hover:text-[#6D26AB]" onClick={onBack}>Back</button>
          )}
        </div>
        <p className="text-sm text-[#383A47]">
          This is a placeholder Privacy Policy for mock authentication flows. Replace with your real policy content.
        </p>
      </div>
    </div>
  );
}


