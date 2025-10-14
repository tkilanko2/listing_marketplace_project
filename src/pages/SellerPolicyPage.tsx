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
  AlertTriangle,
  Save,
  X,
  Clock,
  Check,
  ChevronDown
} from 'lucide-react';

interface SellerPolicyPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface CancellationPolicy {
  freeCancellation: number; // hours before appointment
  partialRefund: number; // hours before appointment
  noRefund: number; // hours before appointment
}

const SellerPolicyPage: React.FC<SellerPolicyPageProps> = ({ onBack, onNavigate }) => {
  const [selectedPolicyView, setSelectedPolicyView] = useState<'platform' | 'custom'>('platform');
  const [hasCustomPolicy, setHasCustomPolicy] = useState(false);
  const [activePolicyType, setActivePolicyType] = useState<'platform' | 'custom'>('platform');
  const [isEditingCancellation, setIsEditingCancellation] = useState(false);
  const [hasEverCreatedCustom, setHasEverCreatedCustom] = useState(false); // Track if user has ever created a custom policy
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({}); // Track expanded sections for longer content

  // Platform default policy
  const platformPolicy: CancellationPolicy = {
    freeCancellation: 24, // 24 hours
    partialRefund: 4, // 4 hours
    noRefund: 4 // less than 4 hours
  };

  // Custom policy state
  const [customPolicy, setCustomPolicy] = useState<CancellationPolicy>({
    freeCancellation: 24,
    partialRefund: 4,
    noRefund: 4
  });

  // Dropdown options
  const freeCancellationOptions = [
    { value: 0, label: 'No free cancellation' },
    { value: 1, label: '1 hour before' },
    { value: 2, label: '2 hours before' },
    { value: 4, label: '4 hours before' },
    { value: 6, label: '6 hours before' },
    { value: 12, label: '12 hours before' },
    { value: 24, label: '24 hours before' },
    { value: 48, label: '48 hours before (2 days)' }
  ];

  const partialRefundOptions = [
    { value: 1, label: '1 hour before' },
    { value: 2, label: '2 hours before' },
    { value: 3, label: '3 hours before' },
    { value: 4, label: '4 hours before' }
  ];

  const noRefundOptions = [
    { value: 1, label: '1 hour before' },
    { value: 2, label: '2 hours before' },
    { value: 4, label: '4 hours before' },
    { value: 6, label: '6 hours before' },
    { value: 12, label: '12 hours before' },
    { value: 24, label: '24 hours before' }
  ];

  const getCurrentPolicy = (): CancellationPolicy => {
    return selectedPolicyView === 'platform' ? platformPolicy : customPolicy;
  };

  const handleCreateCustomPolicy = () => {
    // Enforce maximum 2 policies rule
    if (hasEverCreatedCustom) {
      alert('You can only have a maximum of 2 policies (Platform + 1 Custom). You can modify your existing custom policy.');
      return;
    }
    
    setHasCustomPolicy(true);
    setHasEverCreatedCustom(true);
    setSelectedPolicyView('custom');
    setIsEditingCancellation(true);
  };

  const handleEditCancellation = () => {
    // Only allow editing if viewing custom policy or if no custom policy exists yet
    if (selectedPolicyView === 'platform' && hasEverCreatedCustom) {
      alert('Platform policy cannot be modified. Please switch to your custom policy to make changes.');
      return;
    }
    setIsEditingCancellation(true);
  };

  const handleSaveCancellation = () => {
    setIsEditingCancellation(false);
    alert('Cancellation policy saved successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditingCancellation(false);
    // Reset to previous values if needed
  };

  const handleApplyToAllListings = () => {
    setActivePolicyType('custom');
    alert('Custom policy applied to all listings successfully!');
  };

  const formatTimeLabel = (hours: number, type: 'free' | 'partial' | 'none') => {
    if (hours === 0 && type === 'free') return 'No free cancellation';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} before`;
    const days = hours / 24;
    return `${days} day${days !== 1 ? 's' : ''} before`;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
            
            {/* Simplified header without CTAs */}
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
          {/* Policy Sidebar - Fixed width on larger screens */}
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
                      {activePolicyType === 'platform' && (
                      <Check className="h-3 w-3 text-[#4CAF50] mx-auto mt-1" />
                      )}
                    </button>
                  
                                     {/* Hover tooltip */}
                   <div className="absolute left-full ml-2 top-0 bg-[#1B1C20] text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                     <div className="text-[#CDCED8]">Default marketplace policy</div>
                     <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#1B1C20] rotate-45"></div>
                   </div>
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
                      {activePolicyType === 'custom' && (
                        <Check className="h-3 w-3 text-[#4CAF50] mx-auto mt-1" />
                      )}
                    </button>
                    
                                         {/* Hover tooltip */}
                     <div className="absolute left-full ml-2 top-0 bg-[#1B1C20] text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                       <div className="text-[#CDCED8]">Your personalized policy</div>
                       <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#1B1C20] rotate-45"></div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Takes up most of the width */}
          <div className="xl:col-span-7 space-y-6">
            {/* Policy Summary - Quick Overview */}
            <div className="bg-gradient-to-r from-[#EDD9FF] to-[#F3E8FF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-[#3D1560]" />
                <h2 className="text-2xl font-bold text-[#1B1C20]">Policy Summary</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Policy Type */}
                <div className="bg-white/60 rounded-lg p-4 border border-white/40">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-[#3D1560] rounded-full"></div>
                    <span className="text-sm font-medium text-[#70727F]">Policy Type</span>
                  </div>
                  <p className="text-lg font-semibold text-[#1B1C20]">
                    {selectedPolicyView === 'platform' ? 'Platform Default' : 'Custom Policy'}
                  </p>
                </div>
                
                {/* Cancellation Settings */}
                <div className="bg-white/60 rounded-lg p-4 border border-white/40">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#3D1560]" />
                    <span className="text-sm font-medium text-[#70727F]">Cancellation</span>
                  </div>
                  <p className="text-sm text-[#1B1C20]">
                    {getCurrentPolicy().freeCancellation === 0 
                      ? 'No free cancellation'
                      : `Free up to ${formatTimeLabel(getCurrentPolicy().freeCancellation, 'free')}`
                    }
                  </p>
                  <p className="text-xs text-[#70727F]">
                    50% refund {formatTimeLabel(getCurrentPolicy().partialRefund, 'partial')}
                  </p>
                </div>
                
                {/* Status */}
                <div className="bg-white/60 rounded-lg p-4 border border-white/40">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                    <span className="text-sm font-medium text-[#70727F]">Status</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1B1C20]">
                    {activePolicyType === 'platform' ? 'Platform Active' : 'Custom Active'}
                  </p>
                  <p className="text-xs text-[#70727F]">Last updated: Today</p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {selectedPolicyView === 'platform' && !hasCustomPolicy && (
                  <button
                    onClick={handleCreateCustomPolicy}
                    className="bg-[#3D1560] text-white hover:bg-[#6D26AB] px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Create Custom Policy
                  </button>
                )}
                {selectedPolicyView === 'custom' && hasCustomPolicy && (
                  <button
                    onClick={handleEditCancellation}
                    className="bg-[#3D1560] text-white hover:bg-[#6D26AB] px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    Edit Policy
                  </button>
                )}
                <button className="bg-white/80 text-[#383A47] hover:bg-white border border-white/60 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                  Download PDF
                </button>
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
                <p className="mb-3">
                  {selectedPolicyView === 'platform' 
                    ? hasCustomPolicy 
                      ? 'This is the standard seller policy for all listings on our platform. This policy is read-only once you have created a custom policy.'
                      : 'This is the standard seller policy for all listings on our platform. You can create a custom version to better suit your business needs.'
                    : 'This is your customized seller policy. You can modify these settings and apply them to all your listings.'
                  }
                </p>
                {/* Space for additional policy description if needed */}
                <div className="text-sm text-[#70727F] leading-relaxed">
                  {selectedPolicyView === 'platform' 
                    ? 'These policies ensure fair and transparent transactions between sellers and buyers while maintaining marketplace standards.'
                    : 'Your custom policy allows you to set terms that better match your business model while staying within platform guidelines.'
                  }
                </div>
              </div>
              <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-4">
                <p className="text-[#3D1560] text-sm font-medium leading-relaxed">
                  💡 <strong>Tip:</strong> {selectedPolicyView === 'platform' 
                    ? hasCustomPolicy
                      ? 'You have reached the maximum of 2 policies. You can only modify your custom policy.'
                      : 'Custom policies help you stay competitive while maintaining customer trust.'
                    : 'Your custom policy is more flexible than the platform defaults.'
                  }
                </p>
              </div>
            </div>

            {/* Service Terms */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center space-x-3 mb-5">
                <FileText className="h-5 w-5 text-[#3D1560]" />
                <h3 className="text-xl font-bold text-[#1B1C20]">Service Terms & Conditions for ExpatTray Services</h3>
              </div>
              
              <div className="space-y-6">
                {/* Service Delivery */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Service Delivery</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>Your satisfaction is our priority. When you book this service, we commit to delivering exactly as described in the listing details and within the agreed timeframe. We understand that your time is valuable, and we take our commitment to you seriously.</p>
                    <p>Service delivery begins at the confirmed appointment time, whether for in-person or online services. For in-person services, we will arrive within the scheduled time window and come prepared with all necessary equipment and materials. For online services, we will be ready at the scheduled time with a stable internet connection and all required tools or software.</p>
                    <p>Should any circumstances arise that might affect service delivery, we will notify you immediately through the platform. We maintain flexibility for minor adjustments that may be needed during service delivery, but any significant changes to the service scope will be discussed and agreed upon with you before proceeding.</p>
                  </div>
                </div>
                
                {/* Quality Standards */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Quality Standards</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>We maintain professional standards in every aspect of our service delivery. This means adhering to industry best practices, using appropriate safety measures where applicable, and ensuring that all work meets or exceeds the specifications outlined in our service description.</p>
                    <p>Our commitment to quality extends beyond just the service itself. We use professional-grade equipment and materials, stay current with industry standards and regulations, and continuously improve our skills through ongoing professional development. We carry appropriate insurance and certifications as required for our service category.</p>
                    <p>Every service we provide comes with our quality assurance. If the delivered service does not meet the standards described in our listing or falls short of professional expectations, we will work with you to make it right. This might include revising the work, providing additional service time, or in cases where we cannot meet your requirements, arranging for an appropriate refund.</p>
                  </div>
                </div>
                
                {/* Communication */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Communication</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>Clear and timely communication is essential for successful service delivery. We commit to responding to your inquiries within 24 hours, and often much sooner during business hours. Once your booking is confirmed, we will send you a detailed confirmation with all relevant information about your upcoming service.</p>
                    <p>Throughout our engagement, we maintain professional and courteous communication. We provide clear updates on service progress, especially for longer-term projects, and immediately notify you of any issues or delays that may arise. We respect your privacy and confidentiality, keeping all communications within the ExpatTray platform until the service is booked and only sharing contact information as necessary for service delivery.</p>
                    <p>For services requiring preparation or information from you, we will clearly communicate these requirements in advance. We appreciate prompt responses to our queries as this helps us deliver the best possible service to you.</p>
                  </div>
                </div>
                
                {/* Service Guarantees */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Service Guarantees</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>We stand behind the quality of our work. While specific guarantees may vary by service type, we generally ensure that all services will be performed competently and professionally, delivered within the agreed timeframe unless circumstances beyond our control intervene, and meet the specifications described in our service listing.</p>
                    <p>For services involving tangible deliverables, we guarantee that the output will be fit for its intended purpose as described. For consultation or advisory services, while we cannot guarantee specific outcomes, we guarantee that our advice will be based on professional expertise and industry best practices.</p>
                  </div>
                  </div>
                  
                {/* Dispute Resolution */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Dispute Resolution</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>Despite our best efforts, we recognize that disputes may occasionally arise. Our approach to dispute resolution prioritizes quick, fair, and amicable solutions.</p>
                    <p>If you're not satisfied with any aspect of our service, we encourage you to contact us directly through the platform first. Most issues can be resolved through direct communication. We commit to responding to concerns within 24 hours and working actively toward a resolution.</p>
                    <p>If we cannot resolve the matter directly, ExpatTray's dispute resolution process provides a fair and impartial framework for resolution. We will cooperate fully with this process, providing all necessary documentation and evidence. We maintain detailed records of all service delivery to support fair dispute resolution.</p>
                          </div>
                        </div>
                        
                {/* Changes to Service Scope */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Changes to Service Scope</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>Sometimes, during service delivery, it becomes apparent that additional work is needed or requested. We handle scope changes transparently and professionally.</p>
                    <p>Any changes to the service scope that would affect pricing or delivery time will be discussed and agreed upon before proceeding. We will provide clear documentation of what changes are needed and why, along with any impact on cost or timeline. You are never obligated to accept scope changes, and we will complete the originally agreed service if you prefer not to expand the scope.</p>
                    <p>For minor adjustments that don't materially affect the service value or delivery time, we generally accommodate these as part of good customer service.</p>
                          </div>
                        </div>
                        
                {/* Privacy and Confidentiality */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Privacy and Confidentiality</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>We respect your privacy and handle any information you share with us with the utmost confidentiality. Information obtained during service delivery is used solely for the purpose of providing the service and is not shared with third parties unless required by law or with your explicit consent.</p>
                    <p>For services that involve handling sensitive information, we employ appropriate security measures and follow industry standards for data protection. Any materials or information you provide for the service will be returned or securely destroyed after service completion, according to your preference.</p>
                          </div>
                        </div>
                        
                {/* Platform Policies */}
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Platform Policies</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>This seller policy operates within ExpatTray's Terms of Service framework. In any case where this policy conflicts with ExpatTray's platform-wide policies, the platform policies take precedence. However, where we offer more favorable terms to buyers than the platform minimum requirements, our more favorable terms apply.</p>
                    <p>We encourage you to review ExpatTray's Terms of Service, Privacy Policy, and other platform policies to understand your full rights and protections as a buyer on the platform.</p>
                        </div>
                      </div>
                
                {/* Policy Customization Notice */}
                <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-5">
                  <h4 className="font-bold text-[#3D1560] mb-4 text-lg">Policy Customization Notice</h4>
                  <div className="text-sm text-[#3D1560] leading-relaxed space-y-3">
                    <p>This is our standard service policy that applies to all our listings unless otherwise specified. Some services may have additional specific terms that will be clearly communicated in the individual service listing. We may update this policy periodically to better serve our customers, with changes taking effect for new bookings made after the update date.</p>
                    <p>If you have any questions about these policies or need clarification on any point, please don't hesitate to contact us through the platform before booking. We're here to ensure you have complete confidence in choosing our services.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy - Main Section with Inline Editing */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#3D1560]" />
                  <h3 className="text-xl font-bold text-[#1B1C20]">Cancellation Policy</h3>
                </div>
                {!isEditingCancellation && (
                  <button
                    onClick={selectedPolicyView === 'platform' && !hasCustomPolicy ? handleCreateCustomPolicy : handleEditCancellation}
                    className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Modify</span>
                  </button>
                )}
              </div>
              
              {!isEditingCancellation ? (
                                 // Display Mode
                <div className="space-y-6">
                  <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                    <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Cancellation Policy</h4>
                    <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                      <p>We understand that plans can change, and we strive to be as flexible as possible while protecting both your interests and ours. Our cancellation policy is designed to be fair and transparent.</p>
                     </div>
                   </div>
                  
                  <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                    <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">For Buyers</h4>
                    <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                      <p>You may cancel your booking free of charge up to 48 hours before the scheduled service time. Cancellations made between 24 and 48 hours before the service will receive a 50% refund. Unfortunately, cancellations made less than 24 hours before the scheduled service time are non-refundable, except in cases of documented emergencies or if we fail to deliver the service as promised.</p>
                      <p>For services that span multiple days or sessions, the cancellation policy applies to each session individually. If you need to reschedule rather than cancel, we will do our best to accommodate your request without penalty, subject to our availability.</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                    <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">For Service Providers</h4>
                    <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                      <p>We take our commitments seriously and will only cancel a confirmed booking in truly exceptional circumstances. If we must cancel, you will receive a full refund regardless of timing. We understand the inconvenience this causes and will assist in finding an alternative solution where possible.</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode - Inline Form
                <div className="space-y-6">
                  <div className="bg-[#F8F8FA] rounded-lg p-4 border-2 border-[#3D1560]">
                    <h4 className="font-medium text-[#1B1C20] mb-4">Customize Cancellation Policy</h4>
                    
                    <div className="space-y-4">
                      {/* Free Cancellation */}
                      <div>
                        <label className="block text-sm font-medium text-[#383A47] mb-2">
                          Free Cancellation Period
                        </label>
                        <select
                          value={customPolicy.freeCancellation}
                          onChange={(e) => setCustomPolicy({...customPolicy, freeCancellation: Number(e.target.value)})}
                          className="w-full p-3 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                        >
                          {freeCancellationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Partial Refund */}
                      <div>
                        <label className="block text-sm font-medium text-[#383A47] mb-2">
                          Partial Refund Period (50% refund)
                        </label>
                        <select
                          value={customPolicy.partialRefund}
                          onChange={(e) => setCustomPolicy({...customPolicy, partialRefund: Number(e.target.value)})}
                          className="w-full p-3 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                        >
                          {partialRefundOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* No Refund */}
                      <div>
                        <label className="block text-sm font-medium text-[#383A47] mb-2">
                          No Refund Period
                        </label>
                        <select
                          value={customPolicy.noRefund}
                          onChange={(e) => setCustomPolicy({...customPolicy, noRefund: Number(e.target.value)})}
                          className="w-full p-3 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                        >
                          {noRefundOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-[#E8E9ED]">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-[#70727F] border border-[#CDCED8] rounded-lg hover:bg-[#E8E9ED] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCancellation}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Policy</span>
                      </button>
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
              
              <div className="space-y-6">
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Refund Policy</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>Your satisfaction with our service is paramount. We offer refunds in several circumstances to ensure you feel confident booking with us.</p>
                  </div>
                </div>
                
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Full Refunds</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p><strong>Full refunds are provided when:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>The service is not delivered at all due to our failure to appear or perform</li>
                      <li>You cancel within the timeframe specified in our cancellation policy</li>
                      <li>The service delivered is fundamentally different from what was described in the listing</li>
                      <li>Technical issues on our end prevent the delivery of online services</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Partial Refunds</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p><strong>Partial refunds may be appropriate when:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>The service is partially completed but cannot be finished due to circumstances on our end</li>
                      <li>Minor aspects of the service do not meet expectations but the core service was delivered</li>
                      <li>We mutually agree that a partial refund is fair resolution to a service issue</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Refund Processing</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>Once a refund is approved, ExpatTray will process it according to their payment policies. Refunds typically appear in your account within 5-10 business days, though exact timing depends on your payment method and financial institution. We will provide confirmation once the refund has been initiated from our end.</p>
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
              
              <div className="space-y-6">
                <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
                  <h4 className="font-bold text-[#1B1C20] mb-4 text-lg">Our Commitment to You</h4>
                  <div className="text-sm text-[#383A47] leading-relaxed space-y-3">
                    <p>As service providers on the ExpatTray platform, we are committed to delivering exceptional service and maintaining the highest standards of professionalism. Our responsibilities include:</p>
                  </div>
                </div>
                
                <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-5">
                  <p className="text-[#3D1560] text-sm leading-relaxed font-medium mb-4">
                    <strong>Service Delivery Standards:</strong>
                  </p>
                  <ul className="text-[#3D1560] text-sm leading-relaxed space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Deliver services exactly as described in our listing details</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Arrive on time and come prepared with all necessary equipment and materials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Maintain professional standards and industry best practices</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Use professional-grade equipment and materials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Maintain appropriate insurance and certifications</span>
                    </li>
                  </ul>
              </div>
              
              <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-5">
                  <p className="text-[#3D1560] text-sm leading-relaxed font-medium mb-4">
                    <strong>Communication & Customer Service:</strong>
                  </p>
                  <ul className="text-[#3D1560] text-sm leading-relaxed space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Respond to inquiries within 24 hours</span>
                    </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Provide clear updates on service progress</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Maintain professional and courteous communication</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Respect your privacy and confidentiality</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Address concerns promptly and professionally</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-5">
                  <p className="text-[#3D1560] text-sm leading-relaxed font-medium mb-4">
                    <strong>Quality Assurance:</strong>
                  </p>
                  <ul className="text-[#3D1560] text-sm leading-relaxed space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#3D1560] mt-1">•</span>
                      <span>Stand behind the quality of our work with service guarantees</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Work to make things right if service doesn't meet expectations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Cooperate fully with dispute resolution processes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#3D1560] mt-1">•</span>
                      <span>Maintain detailed records of all service delivery</span>
                  </li>
                </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Takes remaining space */}
          <div className="xl:col-span-3 space-y-5">
            {/* Quick Actions - Compact design */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
              <h3 className="text-base font-semibold text-[#1B1C20] mb-3">Quick Actions</h3>
              <div className="space-y-2 mb-3">
                {/* Primary Actions - Compact buttons */}
                {selectedPolicyView === 'platform' && !hasCustomPolicy && (
                  <button
                    onClick={handleCreateCustomPolicy}
                    className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-3 py-2 rounded-md font-medium text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Create Custom Policy
                  </button>
                )}
                
                {selectedPolicyView === 'custom' && hasCustomPolicy && (
                  <>
                    <button
                      onClick={handleEditCancellation}
                      className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-3 py-2 rounded-md font-medium text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Policy
                    </button>
                    
                    <button
                      onClick={handleApplyToAllListings}
                      className="w-full flex items-center justify-center gap-2 border border-[#3D1560] text-[#3D1560] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md font-medium text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Apply to All Listings
                    </button>
                  </>
                )}
                
                <button className="w-full flex items-center justify-center gap-2 bg-[#F8F8FA] text-[#383A47] hover:bg-[#E8E9ED] hover:text-[#1B1C20] transition-colors duration-200 px-3 py-2 rounded-md font-medium text-sm border border-[#CDCED8]">
                  <FileText className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
              
              {/* Secondary Actions - More compact */}
              <div className="border-t border-[#E8E9ED] pt-3">
                <h4 className="text-xs font-medium text-[#70727F] mb-2">Additional Actions</h4>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-2 py-1.5 rounded text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    View History
                  </button>
                  <button className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-2 py-1.5 rounded text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Export Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Status - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
              <h3 className="text-base font-semibold text-[#1B1C20] mb-3">Policy Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#383A47]">Active Policy</span>
                  <span className="px-2 py-1 text-xs font-semibold bg-[#E8F5E9] text-[#4CAF50] rounded-full">
                    {activePolicyType === 'platform' ? 'Platform' : 'Custom'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#383A47]">Last Updated</span>
                  <span className="text-sm font-semibold text-[#1B1C20]">Today</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#383A47]">Version</span>
                  <span className="text-sm font-semibold text-[#1B1C20]">
                    {selectedPolicyView === 'platform' ? 'v1.0' : 'v2.1'}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Policies - Compact */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
              <h3 className="text-base font-semibold text-[#1B1C20] mb-3">Platform Policies</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => onNavigate?.('termsOfService')}
                  className="block w-full text-left text-sm font-medium text-[#3D1560] hover:text-[#6D26AB] hover:underline transition-colors py-1"
                >
                  Terms of Service
                </button>
                <a 
                  href="/privacy-policy" 
                  className="block text-sm font-medium text-[#3D1560] hover:text-[#6D26AB] hover:underline transition-colors py-1"
                >
                  Privacy Policy
                </a>
                <button 
                  onClick={() => onNavigate?.('termsOfService')}
                  className="block w-full text-left text-sm font-medium text-[#3D1560] hover:text-[#6D26AB] hover:underline transition-colors py-1"
                >
                  Dispute Resolution
                </button>
                <a 
                  href="/community-guidelines" 
                  className="block text-sm font-medium text-[#3D1560] hover:text-[#6D26AB] hover:underline transition-colors py-1"
                >
                  Community Guidelines
                </a>
              </div>
            </div>

            {/* Policy Limitations Info - Compact */}
            {hasCustomPolicy && (
              <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-4">
                <h3 className="text-base font-semibold text-[#1B1C20] mb-3">Policy Limits</h3>
                <div className="space-y-3">
                  <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-3">
                    <p className="text-[#3D1560] text-sm font-semibold">
                      <strong>Maximum 2 policies:</strong> Platform + 1 Custom
                    </p>
                  </div>
                  <div className="text-xs text-[#70727F] leading-relaxed">
                    You can modify your custom policy anytime, but platform policy remains read-only.
                  </div>
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