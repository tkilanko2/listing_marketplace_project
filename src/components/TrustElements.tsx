import React, { useState } from 'react';
import {
  Shield,
  Flag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';

interface TrustElementsProps {
  monthlyPurchases: number;
  verifiedBusiness: boolean;
  onReport?: () => void;
}

export function TrustElements({
  monthlyPurchases,
  verifiedBusiness,
  onReport
}: TrustElementsProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this amazing listing!');
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  return (
    <div className="space-y-4 border-t pt-6">
      {/* Verified Business */}
      {verifiedBusiness && (
        <div className="flex items-center text-green-600 bg-green-50 p-4 rounded-lg">
          <Shield className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Verified Business</span>
        </div>
      )}

      {/* Monthly Purchases */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{monthlyPurchases}</span> purchases in the last month
        </p>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${Math.min((monthlyPurchases / 100) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Report Button */}
      <button
        onClick={() => setShowReportModal(true)}
        className="flex items-center text-gray-600 hover:text-red-600 text-sm"
      >
        <Flag className="w-4 h-4 mr-1" />
        <span>Report this listing</span>
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Share this listing</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50"
              >
                <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                <span>Share on Facebook</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50"
              >
                <Twitter className="w-5 h-5 text-blue-400 mr-3" />
                <span>Share on Twitter</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50"
              >
                <Linkedin className="w-5 h-5 text-blue-700 mr-3" />
                <span>Share on LinkedIn</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50"
              >
                {linkCopied ? (
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-500 mr-3" />
                )}
                <span>{linkCopied ? 'Link copied!' : 'Copy link'}</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Report this listing</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please select a reason for reporting this listing. This will help us maintain a safe and trustworthy marketplace.
            </p>
            <div className="space-y-2">
              {[
                'Fraudulent listing',
                'Inappropriate content',
                'Misleading information',
                'Duplicate listing',
                'Other'
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    onReport?.();
                    setShowReportModal(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="mt-4 w-full p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 