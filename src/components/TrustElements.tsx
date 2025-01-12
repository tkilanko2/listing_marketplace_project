import React, { useState } from 'react';
import {
  Shield,
  Clock,
  MessageSquare,
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
  responseRate: number;
  responseTime: string;
  verifiedBusiness: boolean;
  onReport?: () => void;
}

export function TrustElements({
  monthlyPurchases,
  responseRate,
  responseTime,
  verifiedBusiness,
  onReport
}: TrustElementsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center text-blue-700">
              <Shield className="w-5 h-5 mr-2" />
              <span className="font-medium">Buyer Protection</span>
            </div>
            <p className="mt-1 text-sm text-blue-600">
              Get full refund if item is not as described
            </p>
          </div>
          {verifiedBusiness && (
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Check className="w-4 h-4 mr-1" />
              Verified Business
            </div>
          )}
        </div>
      </div>

      {/* Social Proof */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-sm">Response Time</span>
          </div>
          <p className="mt-1 font-medium text-gray-900">{responseTime}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center text-gray-600">
            <MessageSquare className="w-5 h-5 mr-2" />
            <span className="text-sm">Response Rate</span>
          </div>
          <p className="mt-1 font-medium text-gray-900">{responseRate}%</p>
        </div>
      </div>

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

      {/* Share and Report */}
      <div className="flex items-center justify-between">
        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </button>
          
          {showShareMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
              <button
                onClick={() => handleShare('facebook')}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-50"
              >
                <Facebook className="w-4 h-4 mr-3" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-50"
              >
                <Twitter className="w-4 h-4 mr-3" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-50"
              >
                <Linkedin className="w-4 h-4 mr-3" />
                LinkedIn
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-50"
              >
                {linkCopied ? (
                  <Check className="w-4 h-4 mr-3 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 mr-3" />
                )}
                {linkCopied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}
        </div>

        {/* Report Button */}
        <div className="relative">
          <button
            onClick={() => setShowReportMenu(!showReportMenu)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <Flag className="w-5 h-5 mr-2" />
            Report
          </button>

          {showReportMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-4">
              <div className="flex items-center mb-3 text-gray-900">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                <span className="font-medium">Report this listing</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                If you believe this listing violates our policies, please let us know.
              </p>
              <button
                onClick={() => {
                  onReport?.();
                  setShowReportMenu(false);
                }}
                className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                Report Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 