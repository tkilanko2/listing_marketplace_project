import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Users,
  Building,
  Scale,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const tableOfContents = [
    { id: 'definitions', title: 'Definitions and Interpretation', users: 'ALL USERS' },
    { id: 'agreement', title: 'Agreement Formation and Acceptance', users: 'ALL USERS' },
    { id: 'platform', title: 'Platform Description and Service Scope', users: 'ALL USERS' },
    { id: 'user-categories', title: 'User Categories and Account Requirements', users: 'ALL USERS' },
    { id: 'verification', title: 'Verification and Compliance Obligations', users: 'SERVICE PROVIDERS' },
    { id: 'marketplace', title: 'Marketplace Transaction Framework', users: 'BUYERS & SERVICE PROVIDERS' },
    { id: 'commission', title: 'Commission Structure and Payment Processing', users: 'SERVICE PROVIDERS' },
    { id: 'prohibited', title: 'Prohibited Items and Activities', users: 'ALL USERS' },
    { id: 'content', title: 'Content Rights and Intellectual Property', users: 'ALL USERS' },
    { id: 'obligations', title: 'User Obligations and Representations', users: 'BUYERS & SERVICE PROVIDERS' },
    { id: 'platform-rights', title: 'Platform Rights and Enforcement', users: 'ALL USERS' },
    { id: 'buyer-protection', title: 'Buyer Protection and Provider Obligations', users: 'BUYERS & SERVICE PROVIDERS' },
    { id: 'dispute-resolution', title: 'Dispute Resolution and Payment Hold Services', users: 'BUYERS & SERVICE PROVIDERS' },
    { id: 'privacy', title: 'Privacy and Data Processing', users: 'ALL USERS' },
    { id: 'disclaimers', title: 'Disclaimers and Limitations of Liability', users: 'ALL USERS' },
    { id: 'indemnification', title: 'Indemnification Obligations', users: 'ALL USERS' },
    { id: 'termination', title: 'Termination and Account Suspension', users: 'ALL USERS' },
    { id: 'governing-law', title: 'Governing Law and Jurisdiction', users: 'ALL USERS' },
    { id: 'general', title: 'General Legal Provisions', users: 'ALL USERS' }
  ];

  const getUserBadgeColor = (users: string) => {
    switch (users) {
      case 'ALL USERS':
        return 'bg-[#3D1560] text-white';
      case 'BUYERS':
        return 'bg-[#4CAF50] text-white';
      case 'SERVICE PROVIDERS':
        return 'bg-[#DF678C] text-white';
      case 'BUYERS & SERVICE PROVIDERS':
        return 'bg-[#6D26AB] text-white';
      default:
        return 'bg-[#70727F] text-white';
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
                <h1 className="text-2xl font-bold text-[#1B1C20]">Terms of Service</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Document Header */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-8 mb-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#1B1C20] mb-2">TERMS OF SERVICE (Services)</h1>
              <p className="text-lg text-[#70727F]">ExpatTray Marketplace Platform – Services Only</p>
            </div>
            
            <div className="border-t border-b border-[#E8E9ED] py-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong className="text-[#1B1C20]">Effective Date:</strong> September 1, 2025</p>
                  <p><strong className="text-[#1B1C20]">Last Updated:</strong> September 22, 2025</p>
                </div>
                <div>
                  <p><strong className="text-[#1B1C20]">Legal Entity:</strong> ConnecTech OÜ (Registration Code: 16425836)</p>
                  <p><strong className="text-[#1B1C20]">Contact:</strong> legal@expatray.com</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F8FA] rounded-lg p-4">
              <h3 className="font-semibold text-[#1B1C20] mb-2">Section Guide:</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-2 py-1 bg-[#3D1560] text-white rounded text-xs">[ALL USERS]</span>
                <span className="px-2 py-1 bg-[#4CAF50] text-white rounded text-xs">[BUYERS]</span>
                <span className="px-2 py-1 bg-[#DF678C] text-white rounded text-xs">[SERVICE PROVIDERS]</span>
                <span className="px-2 py-1 bg-[#6D26AB] text-white rounded text-xs">[BUYERS & SERVICE PROVIDERS]</span>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6 mb-6">
            <h2 className="text-xl font-bold text-[#1B1C20] mb-4">Table of Contents</h2>
            <div className="space-y-2">
              {tableOfContents.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 hover:bg-[#F8F8FA] rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-[#70727F] w-8">{index + 1}.</span>
                    <a 
                      href={`#${item.id}`}
                      className="text-sm text-[#3D1560] hover:text-[#6D26AB] hover:underline"
                    >
                      {item.title}
                    </a>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor(item.users)}`}>
                    {item.users}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-6">
            {/* Section 1: Definitions */}
            <div id="definitions" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">1. Definitions and Interpretation</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">1.1 Definitions</h3>
                  <p className="text-sm text-[#383A47] mb-3">For the purposes of these Terms of Service, the following definitions shall apply:</p>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-[#1B1C20]">"Account"</strong> means a registered user profile on the Platform, including all associated data, preferences, transaction history, and verification status;
                    </div>
                    <div>
                      <strong className="text-[#1B1C20]">"Buyer"</strong> means any User who purchases services through the Platform, including both Guest Users and Registered Users;
                    </div>
                    <div>
                      <strong className="text-[#1B1C20]">"Commission"</strong> means the percentage-based fee charged by ExpatTray on successful service transactions as specified in Section 7;
                    </div>
                    <div>
                      <strong className="text-[#1B1C20]">"Content"</strong> means all information, data, text, software, music, sound, photographs, graphics, video, messages, posts, listings, or other materials submitted, posted, or displayed on the Platform;
                    </div>
                    <div>
                      <strong className="text-[#1B1C20]">"Service Provider"</strong> (or <strong>"Provider"</strong>) means any User who offers professional services, consultations, or appointment-based offerings through the Platform, operating either as an individual (requiring KYC) or as a business entity (requiring KYB);
                    </div>
                    <div>
                      <strong className="text-[#1B1C20]">"Services"</strong> means professional services, consultations, or appointment-based offerings delivered online or in person (excluding sale of physical goods);
                    </div>
                    <div>
                      <strong className="text-[#1B1C20]">"User"</strong> means any person or entity that accesses or uses the Platform in any capacity;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Agreement Formation */}
            <div id="agreement" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">2. Agreement Formation and Acceptance</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">2.1 Agreement Formation</h3>
                  <p>These Terms of Service constitute a legally binding agreement between you ("User") and ConnecTech OÜ and/or ConnecTech Digital UK Ltd (collectively "ExpatTray," "we," "us," or "our"). The applicable entity depends on your service location and transaction jurisdiction as determined by ExpatTray. By accessing, browsing, or using the Platform in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">2.2 Capacity and Authority</h3>
                  <p>You represent and warrant that: (a) you are at least eighteen (18) years of age and have the legal capacity to enter into contracts; (b) if acting on behalf of a business entity, you have the authority to bind such entity to these Terms; (c) your use of the Platform will not violate any applicable law, regulation, or contractual obligation; and (d) all information provided to ExpatTray is accurate, current, and complete.</p>
                </div>
              </div>
            </div>

            {/* Section 3: Platform Description */}
            <div id="platform" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">3. Platform Description and Service Scope</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">3.1 Service Marketplace</h3>
                  <p>ExpatTray operates a digital service marketplace platform designed specifically for expatriate communities, providing: (a) service marketplace for professional services and appointment booking; (b) secure payment processing through trusted payment partners; (c) community features including messaging, reviews, and networking; (d) service provider tools including analytics, promotional features, and availability management; and (e) buyer protection programs and dispute resolution services.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">3.2 Business Model</h3>
                  <p>ExpatTray operates on a commission-based model generating revenue through: (a) transaction commissions on successful service bookings; (b) Token System fees for appointment bookings and premium features; (c) promotional and advertising services for enhanced listing visibility; and (d) payment processing fees.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">3.3 Service Availability and Modifications</h3>
                  <p>ExpatTray strives to maintain Platform availability but does not guarantee uninterrupted service. We reserve the right to: (a) modify, suspend, or discontinue any aspect of the Platform with reasonable notice; (b) impose usage limits or restrictions; (c) update technical requirements; (d) implement new features or remove existing features; and (e) restrict access in certain geographic regions due to legal or business considerations.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">3.4 Third-Party Services</h3>
                  <p>The Platform integrates with various third-party service providers including payment processors, identity verification services, scheduling systems, and communication tools. ExpatTray is not responsible for the availability, functionality, or performance of third-party services, though we endeavor to select reliable partners.</p>
                </div>
              </div>
            </div>

            {/* Section 4: User Categories */}
            <div id="user-categories" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">4. User Categories and Account Requirements</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">4.1 Guest User Rights and Limitations</h3>
                  <p>Guest Users may: (a) browse public service listings and provider profiles; (b) search and filter services; (c) make service bookings without account registration; (d) access customer support for transactions; and (e) leave basic transaction feedback. Guest Users cannot: (a) create service listings or offer services; (b) access advanced features or personalization; (c) participate in community discussions; (d) save favorites or create wishlists; or (e) access detailed transaction history.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">4.2 Registered User Accounts</h3>
                  <p>Registered Users who create accounts gain access to: (a) full service booking capabilities as buyers without verification requirements; (b) personalized recommendations and saved preferences; (c) comprehensive transaction history; (d) community participation features; (e) advanced messaging and networking tools; and (f) service provider dashboard and analytics upon completing mandatory verification (KYC for individuals, KYC+KYB for business entities) only when creating service listings. Users acting solely as buyers do not require verification. Users must provide accurate personal information and complete appropriate verification only before offering services on the Platform.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">4.3 Individual vs. Business Operations</h3>
                  <p><strong>Individual Operations:</strong> Users operating as natural persons must complete KYC verification before becoming Service Providers. Individual operations include personal consulting, freelance services, and small-scale service activities.</p>
                  <p><strong>Business Operations:</strong> Users operating as legal entities must complete KYB verification before becoming Service Providers. Business operations include corporate services, professional service firms, and large-scale commercial service activities. Business operations receive enhanced features including bulk operations, advanced analytics, promotional tools, and dedicated support.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">4.4 Account Security Obligations</h3>
                  <p>Users are solely responsible for: (a) maintaining confidentiality of login credentials; (b) all activities occurring under their Account; (c) immediately notifying ExpatTray of unauthorized access; (d) using strong passwords and enabling available security features; and (e) keeping contact information current and accessible. ExpatTray is not liable for losses resulting from unauthorized Account use when Users fail to maintain adequate security.</p>
                </div>
              </div>
            </div>

            {/* Section 5: Verification */}
            <div id="verification" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">5. Verification and Compliance Obligations</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('SERVICE PROVIDERS')}`}>
                  SERVICE PROVIDERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">5.1 Know Your Customer (KYC) Requirements</h3>
                  <p>All Service Providers must complete appropriate verification before listing any services on the Platform. Service Providers are required to complete verification after submitting their first listing - KYC for individuals operating as natural persons, or KYC+KYB for business entities. Verification is mandatory for: (a) all service provision activities regardless of transaction value; (b) enhanced security and fraud prevention; (c) compliance with applicable anti-money laundering regulations; and (d) maintaining Platform trust and safety. KYC documentation includes government-issued photo identification, proof of address, phone verification, and additional documentation as required by regulatory authorities.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">5.2 Know Your Business (KYB) Requirements</h3>
                  <p>All Service Providers operating as business entities must complete KYB verification including: (a) business registration and incorporation documents; (b) tax identification numbers and VAT registration; (c) authorized representative identification and authority documentation; (d) business address verification; (e) banking information and financial statements; and (f) professional licenses where applicable. Enhanced due diligence may be required for high-risk service categories or jurisdictions.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">5.3 Ongoing Compliance Obligations</h3>
                  <p>Verified Users must: (a) maintain current and accurate verification information; (b) notify ExpatTray of material changes within thirty (30) days; (c) cooperate with periodic re-verification requests; (d) comply with applicable tax reporting and collection obligations; (e) maintain required licenses and regulatory approvals; and (f) adhere to applicable professional standards and regulations.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">5.4 Verification Processing and Status</h3>
                  <p>ExpatTray will process verification requests within five (5) business days of receiving complete documentation. Users will receive real-time status updates and may appeal negative verification decisions. Incomplete or fraudulent verification attempts may result in Account suspension or termination. Re-verification may be required based on ID validity (every 2 years if ID does not expire, or upon ID expiration) or upon material Account changes.</p>
                </div>
              </div>
            </div>

            {/* Section 6: Marketplace Transaction Framework */}
            <div id="marketplace" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">6. Marketplace Transaction Framework</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('BUYERS & SERVICE PROVIDERS')}`}>
                  BUYERS & SERVICE PROVIDERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">6.1 Listing Creation and Standards</h3>
                  <p>Service Providers must ensure all Listings: (a) contain accurate, complete, and truthful service descriptions; (b) include appropriate pricing and availability information; (c) comply with applicable laws and Platform policies; (d) contain high-quality images or materials representative of services offered; (e) specify clear terms of service including the Service Provider's cancellation and refund conditions within Platform guidelines; (f) maintain current availability and calendar status; (g) disclose all required professional licenses or credentials; (h) specify service delivery method (online, in-person, or hybrid); and (i) include clear geographical service areas or remote service capabilities.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">6.2 Service Booking and Delivery Process</h3>
                  <p>Upon service booking: (a) Service Providers must confirm or decline booking requests within 48 hours; (b) payment is immediately captured and held by our payment partners; (c) Providers must fulfill confirmed bookings according to specified timelines and descriptions; (d) appointment scheduling and confirmation must be provided for time-based services; (e) service delivery must occur as scheduled and described; (f) digital services may utilize Platform-integrated communication tools; (g) service completion must be confirmed by both parties; (h) time zone clarifications must be provided for remote services; (i) session recordings require prior consent from all parties; and (j) both parties receive automated notifications throughout the booking process.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">6.3 Cancellation and Rescheduling Policies</h3>
                  <p><strong>Rescheduling Rights:</strong> Both Buyers and Service Providers may request rescheduling according to provider-specific policies and Platform guidelines. Reasonable accommodation should be made for emergency or unforeseen circumstances.</p>
                  <p><strong>Provider Cancellations:</strong> If a Service Provider cancels a confirmed booking, the Buyer receives a full refund. Repeated Provider cancellations may result in performance penalties, account restrictions, or suspension.</p>
                  <p><strong>Buyer Cancellations:</strong> Buyer cancellation policies vary by service provider and must be clearly stated in service listings. Late cancellations or no-shows may result in partial or full forfeiture of fees as specified in the service policy and consistent with applicable consumer protection laws.</p>
                  <p><strong>Consumer Rights:</strong> EU/EEA and UK consumers have a statutory 14-day withdrawal right for distance contracts under the Consumer Rights Directive and UK Consumer Contracts Regulations. Consumers may cancel their service booking within 14 days of the contract conclusion without giving any reason. However, if a service begins during the 14-day withdrawal period with the consumer's express request and acknowledgment that they will lose their right of withdrawal once performance has begun, the right of withdrawal may not apply or may be subject to a proportionate fee for services already performed, consistent with applicable consumer protection law.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">6.4 International Service Considerations</h3>
                  <p>For cross-border service transactions: (a) Service Providers are responsible for compliance with professional licensing requirements in the jurisdiction where services are delivered or targeted; (b) remote services must comply with regulations in both the provider's location and the buyer's jurisdiction; (c) Buyers are responsible for local compliance requirements for receiving professional services; (d) currency conversion rates are provided for transparency; (e) additional documentation may be required for regulated services; (f) dispute resolution may involve multiple jurisdictions; and (g) tax obligations may vary based on service delivery location and applicable international agreements.</p>
                </div>
              </div>
            </div>

            {/* Section 7: Commission Structure */}
            <div id="commission" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">7. Commission Structure and Payment Processing</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('SERVICE PROVIDERS')}`}>
                  SERVICE PROVIDERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">7.1 Commission Rates and Structure</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Services commission: 2.75–7% of the service booking value based on transaction thresholds (exact rates shown in your dashboard and at checkout). See our Fees FAQ for detailed fee information.</li>
                    <li>Additional fees:
                      <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                        <li>Payment processing: Variable based on payment method and partner. Fees for making payments are borne by Buyers, while fees for payouts are borne by Service Providers (see Fees FAQ for current rates)</li>
                        <li>Currency conversion (if applicable): Subject to payment partner fees (displayed on seller's finance page before withdrawal)</li>
                        <li>Chargeback fee: $25 per occurrence</li>
                        <li>Express settlement (optional): +1% for 24-hour release</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">7.2 Payment Processing and Escrow</h3>
                  <p>ExpatTray provides secure payment processing through trusted payment partners (including but not limited to Stripe, Paystack, and similar payment processors): (a) PCI DSS compliant payment systems via our payment partners; (b) multiple payment methods including cards, digital wallets, and bank transfers; (c) fraud detection and prevention measures; (d) payment holding through our partners until service completion; (e) automated release to withdrawable balance upon successful completion; and (f) dispute hold functionality for contested transactions.</p>
                  <p><strong>Payment Release Conditions:</strong> Funds held by our payment partners are made available in withdrawable balance upon: (a) Buyer confirmation of service completion; (b) lapse of the confirmation window without dispute filing; (c) completion of agreed service milestones; or (d) dispute resolution outcome.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">7.3 Settlement and Withdrawal</h3>
                  <p>Service Provider earnings are made available in withdrawable balance and can be withdrawn: (a) twice per month on the 1st and 15th (or next working day if these fall on non-working days) for completed transactions; (b) immediately for express settlement (additional fee applies); (c) upon dispute resolution for contested transactions; (d) subject to applicable taxes and withholdings; and (e) to verified payment methods only. Minimum withdrawal amounts and processing fees may apply based on payment method and jurisdiction.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">7.4 Tax Obligations and Reporting</h3>
                  <p>ExpatTray operates as a marketplace platform facilitating service transactions between independent parties. Tax responsibilities are distributed between Service Providers and the Platform based on applicable jurisdictional requirements and the nature of the business relationship.</p>
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-[#1B1C20] mb-2">Service Provider Tax Responsibilities:</h4>
                    <p>Service Providers are independent contractors responsible for their own tax obligations. ExpatTray collects payments, deducts Platform fees, and makes earnings available for withdrawal, but Service Providers must handle their own tax filing and compliance. Specific responsibilities include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li><strong>Service Tax Determination and Remittance:</strong> Service Providers must determine applicable service taxes, VAT, GST, and other transaction-related taxes and include them in their service pricing where required by jurisdictions where services are provided or where they are tax-resident. Service Providers are responsible for remitting these taxes to appropriate authorities from their Platform earnings.</li>
                      <li><strong>Income Tax Reporting:</strong> All Platform earnings must be reported as income in applicable jurisdictions where Service Providers are tax-resident or where they have tax obligations.</li>
                      <li><strong>Tax Registration Compliance:</strong> Service Providers must register for appropriate tax numbers, VAT/GST registration, business licenses, and other required documentation when earnings exceed local thresholds or when required by law.</li>
                      <li><strong>Record Maintenance:</strong> Service Providers must maintain comprehensive records including transaction details, service descriptions, client information (where legally permissible), expense documentation, and all tax-related correspondence.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8: Prohibited Items */}
            <div id="prohibited" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">8. Prohibited Items and Activities</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">8.1 Universal Service Prohibitions</h3>
                  <p>The following services are prohibited across all jurisdictions: (a) illegal services or services without required professional licensing; (b) medical, legal, financial, or other regulated advisory services without proper credentials and authorization; (c) adult content, services, or sexually explicit materials; (d) services facilitating fraud, money laundering, or evasion of law; (e) services involving harassment, discrimination, hate, or violence; (f) services that may cause harm to persons or property; (g) services violating intellectual property rights; (h) unlicensed professional services requiring certification; and (i) any services prohibited by applicable law or Platform policies.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">8.2 Regional Compliance Requirements</h3>
                  <div className="space-y-2">
                    <p><strong>European Union/EEA Specific Restrictions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Services requiring professional qualifications under EU directives without proper recognition</li>
                      <li>Services violating consumer protection regulations or unfair commercial practices</li>
                      <li>Services subject to specific licensing requirements in member states</li>
                      <li>Services prohibited under sector-specific EU regulations</li>
                    </ul>
                    
                    <p><strong>United Kingdom Specific Restrictions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Services requiring regulated professional qualifications without authorization</li>
                      <li>Services violating UK consumer protection standards and regulations</li>
                      <li>Financial services without FCA authorization where required</li>
                      <li>Services affected by post-Brexit professional recognition requirements</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">8.3 Platform-Specific Service Prohibitions</h3>
                  <p>Users may not offer: (a) services designed to manipulate Platform systems or rankings; (b) fake reviews or testimonial services; (c) services that circumvent Platform policies or fees; (d) services that violate third-party terms of service; (e) pyramid schemes or multi-level marketing services; (f) services that harvest personal data without consent; or (g) services that violate privacy or data protection laws.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">8.4 Enforcement and Penalties</h3>
                  <p>Violations may result in: (a) immediate listing removal; (b) Account warnings or restrictions; (c) temporary or permanent Account suspension; (d) forfeiture of funds held by payment partners where legally permitted; (e) referral to law enforcement authorities; (f) civil legal action for damages; and (g) cooperation with regulatory investigations. ExpatTray reserves the right to take any action deemed necessary to protect the Platform and its Users.</p>
                </div>
              </div>
            </div>

            {/* Section 9: Content Rights */}
            <div id="content" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">9. Content Rights and Intellectual Property</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">9.1 User Content Ownership</h3>
                  <p>Users retain ownership of all Content they create and submit to the Platform. However, by posting Content, Users grant ExpatTray a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to: (a) use, reproduce, distribute, prepare derivative works of, display, and perform the Content; (b) modify Content for technical compatibility and display optimization; (c) translate Content for international Users; (d) use Content for marketing, promotional, and business purposes; and (e) exercise all rights necessary to operate and improve the Platform.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">9.2 Content Standards and Compliance</h3>
                  <p>All User Content must: (a) be original or properly licensed; (b) not infringe third-party intellectual property rights; (c) comply with applicable laws and regulations; (d) be accurate, truthful, and not misleading; (e) be appropriate for a diverse, international audience; (f) not contain malicious code, viruses, or spam; and (g) comply with Platform policies and standards.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">9.3 Platform Intellectual Property</h3>
                  <p>ExpatTray owns all rights in: (a) Platform software, code, algorithms, and architecture; (b) trademarks, service marks, logos, and brand elements; (c) Platform design, user interface, and user experience; (d) proprietary data, analytics, and recommendation systems; (e) business processes, methodologies, and know-how; and (f) documentation, training materials, and support content.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">9.4 Intellectual Property Protection</h3>
                  <p>ExpatTray respects intellectual property rights and prohibits: (a) unauthorized use of third-party trademarks; (b) offering of infringing services; (c) misleading brand associations or endorsements; (d) brand impersonation or confusion; and (e) violation of copyright in service materials. Intellectual property holders may report violations to our legal team at legal@expatray.com.</p>
                </div>
              </div>
            </div>

            {/* Section 10: User Obligations */}
            <div id="obligations" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">10. User Obligations and Representations</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('BUYERS & SERVICE PROVIDERS')}`}>
                  BUYERS & SERVICE PROVIDERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">10.1 Service Provider Obligations</h3>
                  <p>Service Providers represent and warrant that they: (a) are qualified and legally permitted to offer their services; (b) possess all necessary licenses, certifications, regulatory approvals, and insurance where legally required; (c) will maintain evidence of service delivery completion; (d) will perform services to professional standards; (e) will maintain confidentiality of client information as required; (f) will comply with applicable professional codes of conduct; (g) will provide accurate service descriptions and qualifications; and (h) will keep all communications within the Platform and not exchange contact details before service booking or outside of service delivery.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">10.2 Buyer Obligations</h3>
                  <p>Buyers must: (a) provide accurate information for service bookings; (b) ensure attendance and technical readiness for scheduled services; (c) provide necessary materials or information for service delivery; (d) maintain appropriate technology and connectivity for remote services; (e) comply with provider policies and Platform guidelines; (f) communicate professionally and respectfully; (g) provide honest feedback and reviews; and (h) keep all communications within the Platform and not exchange contact details before service booking or outside of service delivery.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">10.3 Legal Compliance Obligations</h3>
                  <p>All Users represent and warrant that their use of the Platform: (a) complies with all applicable laws, regulations, and ordinances; (b) does not violate any contractual obligations or fiduciary duties; (c) does not infringe third-party rights including intellectual property, privacy, or publicity rights; (d) includes all necessary permissions and authorizations; and (e) adheres to applicable professional standards and ethical requirements.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">10.4 Good Faith and Professional Conduct</h3>
                  <p>Users must: (a) communicate promptly and professionally with other Users; (b) resolve disputes fairly and in good faith; (c) provide honest and accurate information; (d) honor all confirmed commitments and agreements; (e) maintain confidentiality where appropriate; and (f) act with integrity in all Platform interactions.</p>
                </div>
              </div>
            </div>

            {/* Section 11: Platform Rights */}
            <div id="platform-rights" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">11. Platform Rights and Enforcement</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">11.1 Content Moderation Rights</h3>
                  <p>ExpatTray reserves the right to: (a) review, approve, reject, or remove any Content at its sole discretion; (b) modify Content for legal compliance or Platform standards; (c) implement automated content screening and filtering systems; (d) suspend or terminate Accounts for Content violations; (e) cooperate with law enforcement regarding illegal content; and (f) implement additional content restrictions as necessary.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">11.2 Account Management Powers</h3>
                  <p>ExpatTray may: (a) suspend or terminate Accounts for Terms violations; (b) restrict access to specific Platform features; (c) require additional verification or documentation; (d) freeze or hold funds during investigations; (e) implement spending or transaction limits; (f) require enhanced security measures; and (g) take any action necessary to protect Platform integrity and User safety.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">11.3 Investigation and Enforcement Authority</h3>
                  <p>ExpatTray has the right to: (a) investigate suspected violations of these Terms; (b) access and review Account information and transaction data; (c) cooperate with law enforcement and regulatory authorities; (d) preserve evidence and documentation for legal proceedings; (e) take immediate action to prevent harm or further violations; and (f) impose penalties, restrictions, or termination as appropriate.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">11.4 Off-Platform Transaction Prohibition</h3>
                  <p>Users are prohibited from: (a) soliciting or completing service transactions outside the Platform to avoid fees; (b) sharing contact information for the purpose of circumventing Platform policies; (c) directing buyers to external payment methods; (d) using the Platform solely for lead generation with completion elsewhere; and (e) any other attempts to circumvent Platform transaction processes or fee structures.</p>
                </div>
              </div>
            </div>

            {/* Section 12: Buyer Protection */}
            <div id="buyer-protection" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">12. Buyer Protection and Provider Obligations</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('BUYERS & SERVICE PROVIDERS')}`}>
                  BUYERS & SERVICE PROVIDERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">12.1 Buyer Protection (Services)</h3>
                  <p>Buyers are protected if Services are not performed as agreed, not delivered, or materially not as described.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">12.2 Provider Performance Standards</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Maintain accurate service descriptions and schedules.</li>
                    <li>Meet appointment times and perform Services to a professional standard.</li>
                    <li>Respond to Buyer inquiries promptly (within 24 hours where feasible).</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">12.3 Refund and Credit Policies</h3>
                  <p><strong>Full Refunds:</strong> Available for services not delivered, cancelled by provider, or completely failing to meet description.</p>
                  <p><strong>Partial Refunds:</strong> Available for services materially not as described, partially performed, or of significantly substandard quality. Time-and-materials services may be prorated based on work completed.</p>
                  <p><strong>Service Credits:</strong> May be offered as alternative resolution for minor issues or as goodwill gestures. Credits can be applied to future Platform transactions.</p>
                  <p><strong>Processing Timeline:</strong> Refund processing is initiated immediately upon approval. Time for funds to reach the Buyer depends on the processing timeline of our payment partners (e.g., Stripe, Paystack). International transactions may require additional processing time.</p>
                </div>
              </div>
            </div>

            {/* Dispute Resolution Section */}
            <div id="dispute-resolution" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">13. Dispute Resolution and Payment Hold Services</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('BUYERS & SERVICE PROVIDERS')}`}>
                  BUYERS & SERVICE PROVIDERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">13.1 Internal Dispute Resolution</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-[#1B1C20]">Step 1: Direct Communication (7 days)</h4>
                      <p>Buyers and Service Providers are expected to communicate directly through the Platform to resolve issues amicably. For physical services, parties should work together to address concerns based on the service delivered. For remote services, parties should refer to the listed service terms and descriptions.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1B1C20]">Step 2: Formal Dispute Filing (within 60 days)</h4>
                      <p>If direct resolution fails, either party may file a formal dispute with supporting evidence within 60 days of the scheduled service completion date. The dispute will be evaluated based on Platform policies and the Service Provider's stated policies.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1B1C20]">Step 3: Platform Investigation (10–15 business days)</h4>
                      <p>ExpatTray will investigate the dispute using both Platform policies and Service Provider's policies as guidelines. Funds held by our payment partners will be distributed according to the investigation outcome.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">13.2 Payment Hold and Release Mechanics (Services)</h3>
                  <p>ExpatTray uses trusted payment partners to process and hold funds securely. Upon service booking, payment is captured by our payment partners. For successfully delivered services, funds (minus Platform fees) are made available in the Service Provider's withdrawable balance according to the payout schedule. If services are not delivered as agreed, funds will be returned to the Buyer through our payment partner. Funds are released based on: (a) service completion confirmation; (b) milestone achievement for multi-stage services; or (c) dispute resolution outcomes.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">13.3 Alternative Dispute Resolution</h3>
                  <p>For disputes that cannot be resolved through Platform mediation, binding arbitration is available for qualifying disputes exceeding $500 USD. Both parties share responsibility for arbitration costs if Platform dispute resolution and direct negotiation fail. Arbitration proceedings follow the process detailed in Section 18.3.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">13.4 Legal Action Limitations</h3>
                  <p>Legal proceedings may only be initiated after exhausting the dispute resolution hierarchy: (1) direct negotiation, (2) Platform dispute resolution, and (3) arbitration for qualifying disputes. If arbitration fails or is not applicable, parties may pursue legal action in their respective jurisdictions. ExpatTray will provide relevant documentation to support either party's case but will not be directly involved in legal proceedings and is not responsible for any associated costs. Class action lawsuits are waived (subject to 30-day opt-out rights as specified in Section 18.5). Each party bears their own legal costs unless otherwise determined by the court or arbitrator.</p>
                </div>
              </div>
            </div>

            {/* Section 14: Privacy */}
            <div id="privacy" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">14. Privacy and Data Processing</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">14.1 Privacy Policy Reference</h3>
                  <p>Personal data handling is governed by our Privacy Policy: <a href="https://expatray.com/legal/privacy" className="text-[#3D1560] hover:underline">https://expatray.com/legal/privacy</a></p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">14.2 Providers as Controllers/Processors</h3>
                  <p>If you process Buyer data, our DPA applies: <a href="https://expatray.com/legal/dpa" className="text-[#3D1560] hover:underline">https://expatray.com/legal/dpa</a></p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">14.3 Data Security and Breach Notification</h3>
                  <p>We implement appropriate technical and organizational measures to protect personal data. In the event of a data breach likely to affect rights and freedoms, we will notify Users and authorities as required by law.</p>
                </div>
              </div>
            </div>

            {/* Section 15: Disclaimers */}
            <div id="disclaimers" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">15. Disclaimers and Limitations of Liability</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">15.1 Service Disclaimers</h3>
                  <p className="font-semibold text-[#DF678C] mb-2">THE PLATFORM IS PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. EXPATRAY SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE.</p>
                  <p>ExpatTray does not warrant that: (a) the Platform will meet your specific requirements; (b) Platform operation will be uninterrupted or error-free; (c) defects will be corrected; (d) the Platform is free from viruses or harmful components; (e) information provided by Users is accurate or reliable; or (f) service transactions between Users will be completed successfully.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">15.2 Third-Party Services and Content</h3>
                  <p>ExpatTray does not endorse, warrant, or assume responsibility for: (a) services offered by Service Providers; (b) User-generated Content, reviews, or communications; (c) third-party websites or services linked from the Platform; (d) accuracy of User-provided information; (e) quality, safety, or legality of services offered; or (f) fulfillment of service agreements between Users.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">15.3 Limitation of Liability</h3>
                  <p className="font-semibold text-[#DF678C] mb-2">EXPATRAY OPERATES AS AN ONLINE SERVICES MARKETPLACE PLATFORM CONNECTING BUYERS AND SERVICE PROVIDERS. EXPATRAY ITSELF IS NOT A PARTY TO ANY CONTRACTS BETWEEN USERS AND DISCLAIMS LIABILITY FOR THE PERFORMANCE, QUALITY, OR LEGALITY OF SERVICES PROVIDED BY INDEPENDENT SERVICE PROVIDERS.</p>
                  <p>ExpatTray's role is limited to: (a) facilitating the formation of service contracts; (b) offering secure payment processing features through trusted payment partners; (c) providing dispute resolution tools to assist users; and (d) maintaining Platform infrastructure and features. ExpatTray does not supervise, direct, control, or monitor the delivery of services by Service Providers and is not responsible for any issues, losses, or damages arising from user agreements or transactions conducted through the Platform.</p>
                  <p className="font-semibold text-[#DF678C] mt-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW, EXPATRAY SHALL NOT BE LIABLE FOR: (A) INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES; (B) LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES; (C) SERVICE FAILURES, QUALITY ISSUES, OR PROFESSIONAL STANDARDS; (D) PERSONAL INJURY OR PROPERTY DAMAGE ARISING FROM SERVICES; (E) THE ACTIONS, OMISSIONS, OR CONTENT OF USERS; OR (F) ANY DAMAGES EXCEEDING THE PLATFORM FEES COLLECTED FOR THE SPECIFIC TRANSACTION.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">15.4 User Assumption of Risk</h3>
                  <p>Users acknowledge and assume risks including: (a) potential for fraudulent or misrepresented service listings; (b) disputes with other Users; (c) technical failures or security breaches; (d) currency fluctuations affecting international transactions; (e) changes in laws affecting Platform availability; and (f) economic or political conditions affecting international service delivery.</p>
                </div>
              </div>
            </div>

            {/* Section 16: Indemnification */}
            <div id="indemnification" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">16. Indemnification Obligations</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">16.1 User Indemnification</h3>
                  <p>You agree to defend, indemnify, and hold harmless ExpatTray, its affiliates, officers, directors, employees, agents, and partners from and against any and all claims, damages, costs, and expenses (including reasonable attorneys' fees) arising from or related to:</p>
                  
                  <div className="mt-3 space-y-2">
                    <p><strong>Your Platform Use:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Violation of these Terms or applicable laws</li>
                      <li>Breach of representations or warranties made herein</li>
                      <li>Negligent or wrongful conduct in connection with the Platform</li>
                      <li>Your use or misuse of Platform services and features</li>
                    </ul>
                    
                    <p><strong>Your Content and Service Transactions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Content you post, upload, or transmit through the Platform</li>
                      <li>Infringement of intellectual property or other third-party rights</li>
                      <li>Services provided through the Platform</li>
                      <li>Breach of service agreements with buyers or service recipients</li>
                      <li>Violation of consumer protection or other applicable laws</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">16.2 Defense and Settlement Rights</h3>
                  <p>ExpatTray reserves the right to: (a) assume exclusive defense of any indemnified claim; (b) select legal counsel and control litigation strategy; (c) settle claims at its sole discretion; and (d) require your cooperation in defense efforts. You must provide prompt notice of potential claims and assist in investigation and defense.</p>
                </div>
              </div>
            </div>

            {/* Section 17: Termination */}
            <div id="termination" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">17. Termination and Account Suspension</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">17.1 Termination by Users</h3>
                  <p>Users may terminate their Accounts: (a) at any time through Platform settings; (b) by providing written notice to customer support; (c) immediately for material breach by ExpatTray; or (d) within thirty (30) days of notice of material Terms changes. Users must complete pending service transactions before termination and remain liable for pre-termination obligations.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">17.2 Account Suspension and Termination by ExpatTray</h3>
                  <p><strong>Account Suspension:</strong> ExpatTray may temporarily suspend or freeze Accounts: (a) pending investigation of Terms violations; (b) during verification review processes; (c) when suspicious activity is detected; (d) for non-response to verification requests; (e) for providers who fail to respond to or decline 3 consecutive bookings for the same listing (listing disabled); or (f) for providers who decline or don't respond to any 5 consecutive bookings (all active listings disabled).</p>
                  <p><strong>Account Termination:</strong> ExpatTray may permanently terminate Accounts: (a) immediately for confirmed Terms violations or illegal activities; (b) immediately for harmful conduct toward other Users; (c) immediately for fraud, deception, or security threats; (d) with thirty (30) days' notice without cause; (e) immediately for failure to complete required verification after suspension; or (f) immediately for repeated performance issues or policy violations after warnings.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">17.3 Effect of Termination</h3>
                  <p>Upon termination: (a) User access to Platform features ceases immediately; (b) all pending service transactions must be completed or cancelled; (c) funds held by payment partners are processed according to transaction status; (d) User data is handled according to Privacy Policy retention schedules; and (e) certain provisions of these Terms survive termination including payment obligations, indemnification, and liability limitations.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">17.4 Data Retrieval and Account Closure</h3>
                  <p>Before termination, Users may: (a) download personal data and transaction history; (b) export service listing content and materials; (c) retrieve financial records and tax documentation; and (d) access customer contact information where legally permitted. Data retrieval must be requested within ninety (90) days of termination notice.</p>
                </div>
              </div>
            </div>

            {/* Section 18: Governing Law */}
            <div id="governing-law" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">18. Governing Law and Jurisdiction</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">18.1 Multi-Jurisdictional Governing Law Framework</h3>
                  <p><strong>Primary Governing Law:</strong> These Terms are governed by the laws of the Republic of Estonia (where ConnecTech OÜ is incorporated) and the United Kingdom (where ConnecTech Digital UK Ltd is incorporated), subject to mandatory consumer protection laws as specified below.</p>
                  
                  <div className="mt-3 space-y-2">
                    <p><strong>Consumer Protection Overlay by User Location:</strong></p>
                    <p><strong>European Union/EEA Users:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>EU Consumer Rights Directive and distance selling regulations apply</li>
                      <li>Local EU member state consumer protection laws take precedence for consumer transactions</li>
                      <li>EU Digital Services Act compliance required for Platform operations</li>
                      <li>Unfair contract terms regulations of user's residence country apply</li>
                    </ul>
                    
                    <p><strong>United Kingdom Users:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>UK Consumer Rights Act 2015 takes precedence for consumer transactions</li>
                      <li>UK unfair contract terms legislation applies to consumer contracts</li>
                      <li>UK distance selling and cooling-off period regulations applicable</li>
                      <li>Financial services regulations apply to payment processing</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">18.2 Dispute Resolution Hierarchy</h3>
                  <p><strong>Mandatory Resolution Sequence:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li><strong>Direct Negotiation:</strong> 30-day good faith resolution attempt required</li>
                    <li><strong>Platform Dispute Resolution:</strong> Formal filing and investigation process</li>
                    <li><strong>Alternative Dispute Resolution:</strong> Mediation or arbitration for qualifying disputes</li>
                    <li><strong>Court Proceedings:</strong> Limited to small claims court or emergency injunctive relief</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">18.3 Arbitration Agreement</h3>
                  <p>For disputes exceeding $500 USD, both parties agree to binding arbitration. The specific arbitration body and rules will be mutually agreed upon by both parties, with costs shared equally if Platform dispute resolution fails. If parties cannot agree on an arbitration body, they may proceed to the next tier of resolution (court proceedings) as outlined in Section 18.2. Arbitration shall be conducted in English with hearings via video conference when possible. Single arbitrator for disputes under $10,000; three-arbitrator panel for larger disputes.</p>
                  <p className="mt-2"><strong>Consumer Protection Exception:</strong> For UK and EU/EEA consumers purchasing services for personal use, this arbitration requirement does not apply where prohibited by mandatory consumer protection laws. Such consumers retain their statutory rights to bring proceedings in their local courts and are not bound by this arbitration clause if it conflicts with their consumer rights.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">18.4 Jurisdiction and Venue</h3>
                  <p><strong>Primary Jurisdiction:</strong> Courts of Tallinn, Estonia, or London, United Kingdom, depending on the operating entity involved, with both parties consenting to jurisdiction.</p>
                  <p><strong>Consumer Protection Venue Rights:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>EU/EEA consumers may bring proceedings in courts of their country of residence</li>
                    <li>UK consumers may bring proceedings in UK courts with jurisdiction</li>
                    <li>US consumers may bring proceedings in their state of residence for consumer matters</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">18.5 Class Action Waiver</h3>
                  <p>Users agree that dispute resolution proceedings will be conducted only on an individual basis. Class action lawsuits, collective arbitration, and representative actions are waived. Users may opt out of this waiver by written notice within thirty (30) days of first accepting these Terms.</p>
                  <p className="mt-2"><strong>Consumer Protection Exception:</strong> For UK and EU/EEA consumers purchasing services for personal use, this class action waiver does not apply where prohibited by mandatory consumer protection laws. Such consumers retain their statutory rights to participate in collective actions and class proceedings where permitted by applicable law.</p>
                </div>
              </div>
            </div>

            {/* Section 19: General Provisions */}
            <div id="general" className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">19. General Legal Provisions</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUserBadgeColor('ALL USERS')}`}>
                  ALL USERS
                </span>
              </div>
              
              <div className="space-y-4 text-sm text-[#383A47]">
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.1 Entire Agreement and Integration</h3>
                  <p>These Terms, together with the Privacy Policy and any additional terms referenced herein, constitute the entire agreement between the parties and supersede all prior agreements, understandings, and communications. No modification shall be effective unless in writing and agreed to by both parties, except for Platform-initiated updates as specified herein.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.2 Severability and Enforceability</h3>
                  <p>If any provision of these Terms is found invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be severed and the remaining provisions shall remain in full force and effect. Invalid provisions shall be automatically replaced with valid provisions that most closely achieve the same commercial purpose and intent while complying with applicable law. If no such replacement provision is possible, the invalid provision shall be deemed modified to the minimum extent necessary to make it enforceable. The invalidity of any provision shall not affect the validity or enforceability of any other provision unless the invalid provision is so fundamental that its removal would frustrate the purpose of the entire agreement.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.3 Assignment and Transfer</h3>
                  <p>ExpatTray (including ConnecTech OÜ and ConnecTech Digital UK Ltd) may assign these Terms and all rights hereunder in connection with any merger, acquisition, sale of assets, or corporate reorganization. Users may not assign their rights or obligations without ExpatTray's prior written consent. Any attempted assignment in violation hereof shall be void.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.4 Force Majeure</h3>
                  <p>ExpatTray shall not be liable for failure to perform obligations due to causes beyond its reasonable control, including acts of God, natural disasters, war, terrorism, government actions, labor disputes, internet outages, cyber attacks, pandemics, or changes in applicable laws.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.5 Notices</h3>
                  <p>All notices shall be in writing and deemed given when: (a) delivered to registered email addresses; (b) posted as Platform announcements; (c) sent via in-app messaging; or (d) published on the Platform. Legal notices to ExpatTray must be sent to legal@expatray.com with copy to registered office address.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.6 Survival</h3>
                  <p>The following provisions survive termination: Sections 9 (Intellectual Property), 15 (Disclaimers), 16 (Indemnification), 18 (Governing Law), and 19 (General Provisions), along with all payment obligations, representations and warranties, and limitations of liability.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.7 Waiver</h3>
                  <p>Failure to enforce any provision hereof shall not constitute waiver of such provision or right to future enforcement. Any waiver must be in writing and signed by ExpatTray. No waiver of any provision shall be deemed a waiver of any other provision.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-2">19.8 Language and Interpretation</h3>
                  <p>These Terms are written in English. Any translations are for convenience only, and the English version shall prevail in case of conflicts. Headings are for convenience and do not affect interpretation. "Including" means "including without limitation," and singular includes plural and vice versa.</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-lg p-6">
              <h2 className="text-xl font-bold text-[#3D1560] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong className="text-[#3D1560]">Legal Inquiries:</strong> legal@expatray.com</p>
                  <p><strong className="text-[#3D1560]">Customer Support:</strong> support@expatray.com</p>
                  <p><strong className="text-[#3D1560]">Data Protection Officer:</strong> dpo@expatray.com</p>
                </div>
                <div>
                  <p><strong className="text-[#3D1560]">ConnecTech OÜ</strong></p>
                  <p className="text-xs">Tartu maakond, Tartu linn, Tartu linn, Pärna tn 29-1, 50604, Estonia</p>
                  <p className="text-xs">Registration Code: 16425836</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
