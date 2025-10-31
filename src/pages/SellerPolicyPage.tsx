import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  Edit3,
  CheckCircle,
  Save,
  X,
  Check
} from 'lucide-react';
import { useSellerPolicy } from '../contexts/SellerPolicyContext';
import { PolicySummaryCard } from '../components/policy/PolicySummaryCard';
import { PolicyConfigEditor } from '../components/policy/PolicyConfigEditor';
import { CancellationPolicy, PolicyType } from '../components/policy/PolicyTypes';

interface SellerPolicyPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const SellerPolicyPage: React.FC<SellerPolicyPageProps> = ({ onBack, onNavigate }) => {
  const {
    platformPolicy,
    customPolicy,
    activePolicy,
    hasCustomPolicy,
    createCustomPolicy,
    updateCustomPolicy,
    activatePolicy,
    isLoading
  } = useSellerPolicy();

  const [selectedPolicyView, setSelectedPolicyView] = useState<PolicyType>(
    hasCustomPolicy ? 'custom' : 'platform'
  );
  const [isEditingCancellation, setIsEditingCancellation] = useState(false);
  const [editablePolicy, setEditablePolicy] = useState<CancellationPolicy>(
    customPolicy || platformPolicy
  );

  // Get current policy for viewing
  const getCurrentPolicy = (): CancellationPolicy => {
    return selectedPolicyView === 'platform' ? platformPolicy : (customPolicy || platformPolicy);
  };

  const handleCreateCustomPolicy = () => {
    if (hasCustomPolicy) {
      alert('You already have a custom policy. Switch to it to make edits.');
      return;
    }
    
    setSelectedPolicyView('custom');
    setIsEditingCancellation(true);
    setEditablePolicy(platformPolicy); // Start with platform policy as base
  };

  const handleEditCancellation = () => {
    if (selectedPolicyView === 'platform') {
      alert('Platform policy cannot be modified. Create or switch to your custom policy to make changes.');
      return;
    }
    setIsEditingCancellation(true);
    setEditablePolicy(customPolicy || platformPolicy);
  };

  const handleSaveCancellation = async () => {
    try {
      if (hasCustomPolicy) {
        await updateCustomPolicy(editablePolicy);
        alert('Custom policy updated successfully!');
      } else {
        await createCustomPolicy(editablePolicy);
        alert('Custom policy created successfully!');
      }
      setIsEditingCancellation(false);
    } catch (error) {
      console.error('Failed to save policy:', error);
      alert('Failed to save policy. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingCancellation(false);
    setEditablePolicy(customPolicy || platformPolicy);
  };

  const handleApplyToAllListings = async () => {
    if (selectedPolicyView === 'platform') {
      try {
        await activatePolicy('platform');
        alert('Platform policy applied to all listings successfully!');
      } catch (error) {
        alert('Failed to apply policy. Please try again.');
      }
    } else {
      try {
        await activatePolicy('custom');
        alert('Custom policy applied to all listings successfully!');
      } catch (error) {
        alert('Failed to apply policy. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E9ED] shadow-sm">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED] rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-[#3D1560]" />
                <h1 className="text-2xl font-bold text-[#1B1C20]">Seller Policy</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedPolicyView === 'platform' && hasCustomPolicy && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-[#E8E9ED] text-[#70727F] rounded-lg">
                  <Shield className="h-4 w-4" />
                  <span>Platform Policy (Read-only)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Policy Sidebar */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
              <h3 className="text-sm font-semibold text-[#1B1C20] mb-4 text-center">Policies</h3>
              
              <div className="space-y-2">
                {/* Platform Policy */}
                <div className="relative group">
                  <button
                    onClick={() => setSelectedPolicyView('platform')}
                    className={`w-full text-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      selectedPolicyView === 'platform'
                        ? 'bg-[#EDD9FF] border border-[#3D1560] text-[#3D1560]'
                        : 'bg-[#F8F8FA] hover:bg-[#E8E9ED] text-[#383A47]'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <div className="text-sm font-medium">Platform Policy</div>
                    </div>
                    {activePolicy === 'platform' && (
                      <Check className="h-3 w-3 text-[#4CAF50] mx-auto mt-1" />
                    )}
                  </button>
                </div>

                {/* Custom Policy */}
                {hasCustomPolicy && (
                  <div className="relative group">
                    <button
                      onClick={() => setSelectedPolicyView('custom')}
                      className={`w-full text-center px-3 py-2 rounded-lg transition-all duration-200 ${
                        selectedPolicyView === 'custom'
                          ? 'bg-[#EDD9FF] border border-[#3D1560] text-[#3D1560]'
                          : 'bg-[#F8F8FA] hover:bg-[#E8E9ED] text-[#383A47]'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Edit3 className="h-4 w-4" />
                        <div className="text-sm font-medium">Custom Policy</div>
                      </div>
                      {activePolicy === 'custom' && (
                        <Check className="h-3 w-3 text-[#4CAF50] mx-auto mt-1" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-7 space-y-6">
            {/* Policy Summary Card - Use shared component */}
            <PolicySummaryCard
              policy={getCurrentPolicy()}
              policyType={selectedPolicyView}
              isActive={activePolicy === selectedPolicyView}
              compact={false}
            />

            {/* Quick Actions in Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-5">
              <h3 className="text-lg font-bold text-[#1B1C20] mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPolicyView === 'platform' && !hasCustomPolicy && (
                  <button
                    onClick={handleCreateCustomPolicy}
                    disabled={isLoading}
                    className="bg-[#3D1560] text-white hover:bg-[#6D26AB] px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:bg-[#EDD9FF] disabled:text-[#CDCED8]"
                  >
                    Create Custom Policy
                  </button>
                )}
                {selectedPolicyView === 'custom' && (
                  <button
                    onClick={handleEditCancellation}
                    disabled={isLoading || isEditingCancellation}
                    className="bg-[#3D1560] text-white hover:bg-[#6D26AB] px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:bg-[#EDD9FF] disabled:text-[#CDCED8]"
                  >
                    Edit Policy
                  </button>
                )}
                {selectedPolicyView === activePolicy ? null : (
                  <button
                    onClick={handleApplyToAllListings}
                    disabled={isLoading}
                    className="border border-[#3D1560] text-[#3D1560] hover:bg-[#EDD9FF] px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Apply to All Listings
                  </button>
                )}
              </div>
            </div>

            {/* Policy Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-[#3D1560]" />
                <h2 className="text-2xl font-bold text-[#1B1C20]">
                  {selectedPolicyView === 'platform' ? 'Platform Seller Policy' : 'Custom Seller Policy'}
                </h2>
              </div>
              <div className="text-[#383A47] mb-4 leading-relaxed max-w-none">
                <p className="text-sm">
                  {selectedPolicyView === 'platform' 
                    ? hasCustomPolicy 
                      ? 'Standard seller policy for all platform listings. Read-only once custom policy is created.'
                      : 'Standard seller policy. Create a custom version to suit your business needs.'
                    : 'Your customized policy. Modify settings and apply to all your listings.'
                  }
                </p>
              </div>
              <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-4">
                <p className="text-[#3D1560] text-sm font-medium leading-relaxed">
                  💡 <strong>Tip:</strong> {selectedPolicyView === 'platform' 
                    ? hasCustomPolicy
                      ? 'Switch to your custom policy to make modifications.'
                      : 'Custom policies help balance competitiveness with customer trust.'
                    : 'Custom policy offers more flexibility than platform defaults.'
                  }
                </p>
              </div>
            </div>

            {/* Service Terms */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center space-x-3 mb-5">
                <FileText className="h-5 w-5 text-[#3D1560]" />
                <h3 className="text-xl font-bold text-[#1B1C20]">Service Terms & Conditions</h3>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Service Delivery & Quality</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>We commit to delivering services exactly as described in the listing details and within the agreed timeframe. Service delivery begins at the confirmed appointment time, with all necessary equipment and materials ready.</p>
                    <p>We use professional-grade tools, maintain appropriate insurance and certifications, and adhere to industry best practices.</p>
                  </div>
                </div>
                
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Communication & Disputes</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>We respond to inquiries within 24 hours and provide clear updates throughout service delivery.</p>
                    <p>For issues, contact us directly first. Most matters resolve within 24 hours. Unresolved cases proceed through ExpatTray's dispute resolution.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy - Use shared component */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#3D1560]" />
                  <h3 className="text-xl font-bold text-[#1B1C20]">Cancellation Policy</h3>
                </div>
                {!isEditingCancellation && selectedPolicyView === 'custom' && (
                  <button
                    onClick={handleEditCancellation}
                    className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Modify</span>
                  </button>
                )}
              </div>
              
              {isEditingCancellation ? (
                <PolicyConfigEditor
                  mode="full"
                  policy={editablePolicy}
                  onPolicyChange={setEditablePolicy}
                  onSave={handleSaveCancellation}
                  onCancel={handleCancelEdit}
                  isEditing={true}
                  policyType={selectedPolicyView}
                  showActions={true}
                  disabled={isLoading}
                />
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                    <h4 className="font-bold text-[#1B1C20] mb-3 text-lg">Cancellation Terms</h4>
                    <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                      <p><strong>For Buyers:</strong> Free cancellation up to {getCurrentPolicy().freeCancellation} hours before service time. 50% refund for cancellations between {getCurrentPolicy().partialRefund}-{getCurrentPolicy().freeCancellation} hours. Cancellations under {getCurrentPolicy().noRefund} hours are non-refundable, except for documented emergencies.</p>
                      <p><strong>For Service Providers:</strong> We only cancel in exceptional circumstances. If we must cancel, you receive a full refund regardless of timing.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Refund Policy */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center space-x-3 mb-5">
                <DollarSign className="h-5 w-5 text-[#3D1560]" />
                <h3 className="text-xl font-bold text-[#1B1C20]">Refund Policy</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p><strong>Full Refunds:</strong> Service not delivered, cancellation within policy timeframe, service fundamentally different from listing, or technical issues preventing delivery.</p>
                    <p><strong>Partial Refunds:</strong> Service partially completed, minor aspects don't meet expectations, or mutually agreed resolution.</p>
                    <p><strong>Processing:</strong> Refunds appear within 5-10 business days after approval.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Responsibilities */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center space-x-3 mb-5">
                <MessageCircle className="h-5 w-5 text-[#3D1560]" />
                <h3 className="text-xl font-bold text-[#1B1C20]">Seller Responsibilities</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-5">
                  <div className="text-sm text-[#3D1560] leading-relaxed space-y-3">
                    <p>As service providers, we commit to: deliver services as described, arrive on time with necessary equipment, maintain professional standards and certifications, respond to inquiries within 24 hours, respect privacy, and cooperate fully with dispute resolution processes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-3 space-y-5">
            {/* Policy Info */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
              <h3 className="text-base font-semibold text-[#1B1C20] mb-3">Policy Info</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-[#383A47]">Active</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-[#E8F5E9] text-[#4CAF50] rounded-full">
                    {activePolicy === 'platform' ? 'Platform' : 'Custom'}
                  </span>
                </div>
                <div className="border-t border-[#E8E9ED] pt-2">
                  <button 
                    onClick={() => onNavigate?.('termsOfService')}
                    className="block w-full text-left text-sm text-[#3D1560] hover:text-[#6D26AB] hover:underline py-1"
                  >
                    Terms of Service
                  </button>
                  <button 
                    onClick={() => onNavigate?.('privacyPolicy')}
                    className="block w-full text-left text-sm text-[#3D1560] hover:text-[#6D26AB] hover:underline py-1"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Limitations Info */}
            {hasCustomPolicy && (
              <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
                <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-3">
                  <p className="text-[#3D1560] text-xs font-semibold">
                    Max 2 policies: Platform + 1 Custom. Modify custom anytime; platform is read-only.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPolicyPage;
