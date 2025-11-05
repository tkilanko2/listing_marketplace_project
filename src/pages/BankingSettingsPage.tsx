import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Building, 
  Calendar,
  CreditCard,
  X,
  Edit,
  ChevronRight,
  Wallet
} from 'lucide-react';

interface BankingSettingsPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
  openEditBankModal?: boolean;
  openPayoutScheduleModal?: boolean;
}

interface BankAccount {
  accountName: string;
  bankName: string;
  last4Digits: string;
  accountType: 'checking' | 'savings' | 'business';
  verificationStatus: 'verified' | 'pending' | 'not_verified';
  currency: 'USD' | 'EUR' | 'GBP';
  routingNumber?: string;
}

interface PayoutConfiguration {
  method: 'schedule' | 'threshold';
  scheduleFrequency?: 'bi-monthly' | 'monthly';
  thresholdMinimum: number;
  thresholdMaximum: number | null;
  currency: 'USD' | 'EUR' | 'GBP';
}

export function BankingSettingsPage({ onBack, onNavigate, openEditBankModal = false, openPayoutScheduleModal = false }: BankingSettingsPageProps) {
  // Mock data
  const [bankAccount] = useState<BankAccount>({
    accountName: 'John Doe',
    bankName: 'Chase Bank',
    last4Digits: '1234',
    accountType: 'checking',
    verificationStatus: 'verified',
    currency: 'USD'
  });

  const [payoutConfig, setPayoutConfig] = useState<PayoutConfiguration>({
    method: 'schedule',
    scheduleFrequency: 'bi-monthly',
    thresholdMinimum: 10,
    thresholdMaximum: null,
    currency: 'USD'
  });

  const [showEditBankModal, setShowEditBankModal] = useState(openEditBankModal);
  const [showPayoutMethodModal, setShowPayoutMethodModal] = useState(openPayoutScheduleModal);

  // Auto-open modals if props are provided
  useEffect(() => {
    if (openEditBankModal) {
      setShowEditBankModal(true);
    }
    if (openPayoutScheduleModal) {
      setShowPayoutMethodModal(true);
    }
  }, [openEditBankModal, openPayoutScheduleModal]);

  // Temp state for editing
  const [tempPayoutConfig, setTempPayoutConfig] = useState<PayoutConfiguration>(payoutConfig);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: payoutConfig.currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getNextPayoutDate = () => {
    if (payoutConfig.method === 'schedule') {
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      if (payoutConfig.scheduleFrequency === 'bi-monthly') {
        if (currentDay < 15) {
          return new Date(currentYear, currentMonth, 15);
        } else {
          return new Date(currentYear, currentMonth + 1, 1);
        }
      } else {
        // monthly
        return new Date(currentYear, currentMonth + 1, 1);
      }
    } else {
      return null; // threshold-based
    }
  };

  const handleSavePayoutMethod = () => {
    setPayoutConfig(tempPayoutConfig);
    setShowPayoutMethodModal(false);
  };

  const handleCancelPayoutMethod = () => {
    setTempPayoutConfig(payoutConfig);
    setShowPayoutMethodModal(false);
  };

  const nextPayoutDate = getNextPayoutDate();

  return (
    <div className="max-w-7xl mx-auto py-8 px-3 sm:px-4 lg:px-6 bg-[#F8F8FA] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-[#3D1560] hover:text-[#6D26AB] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Finance
        </button>
        <h1 className="text-3xl font-bold text-[#1B1C20]">Banking & Payout Settings</h1>
        <p className="text-[#70727F] mt-2">Manage your bank account and payout preferences</p>
      </div>

      {/* Verification Status Banner */}
      <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${
        bankAccount.verificationStatus === 'verified' 
          ? 'bg-[#E8F5E9] border-2 border-[#4CAF50]' 
          : bankAccount.verificationStatus === 'pending'
          ? 'bg-[#FFF4E5] border-2 border-[#FF9800]'
          : 'bg-[#FFEBEE] border-2 border-[#F44336]'
      }`}>
        {bankAccount.verificationStatus === 'verified' ? (
          <>
            <CheckCircle2 className="w-6 h-6 text-[#4CAF50]" />
            <div>
              <p className="font-semibold text-[#1B1C20]">Bank Account Verified</p>
              <p className="text-sm text-[#383A47]">Your account is verified and ready for payouts</p>
            </div>
          </>
        ) : bankAccount.verificationStatus === 'pending' ? (
          <>
            <AlertCircle className="w-6 h-6 text-[#FF9800]" />
            <div>
              <p className="font-semibold text-[#1B1C20]">Verification Pending</p>
              <p className="text-sm text-[#383A47]">We're reviewing your bank details</p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="w-6 h-6 text-[#F44336]" />
            <div className="flex-1">
              <p className="font-semibold text-[#1B1C20]">Verification Required</p>
              <p className="text-sm text-[#383A47]">Please add your bank account to receive payouts</p>
            </div>
            <button className="px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors font-medium">
              Start Verification
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Bank Account */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm">
            <div className="p-6 border-b border-[#E8E9ED]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1B1C20]">Primary Account</h2>
                <button 
                  onClick={() => setShowEditBankModal(true)}
                  className="flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#EDD9FF] rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-[#3D1560]" />
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#70727F] mb-1">Account Holder</p>
                      <p className="font-semibold text-[#1B1C20]">{bankAccount.accountName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#70727F] mb-1">Bank Name</p>
                      <p className="font-semibold text-[#1B1C20]">{bankAccount.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#70727F] mb-1">Account Number</p>
                      <p className="font-semibold text-[#1B1C20] font-mono">****{bankAccount.last4Digits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#70727F] mb-1">Account Type</p>
                      <p className="font-semibold text-[#1B1C20] capitalize">{bankAccount.accountType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#70727F] mb-1">Currency</p>
                      <p className="font-semibold text-[#1B1C20]">{bankAccount.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Configuration */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm">
            <div className="p-6 border-b border-[#E8E9ED]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1B1C20]">Payout Configuration</h2>
                  <p className="text-sm text-[#70727F] mt-1">Choose how and when you receive your earnings</p>
                </div>
                <button 
                  onClick={() => {
                    setTempPayoutConfig(payoutConfig);
                    setShowPayoutMethodModal(true);
                  }}
                  className="flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Change
                </button>
              </div>
            </div>
            <div className="p-6">
              {payoutConfig.method === 'schedule' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#4CAF50]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B1C20]">Schedule-Based Payouts</p>
                        <p className="text-sm text-[#70727F]">Automatic payouts on fixed dates</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#E8F5E9] text-[#4CAF50] text-xs font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  </div>

                  <div className="bg-[#F8F8FA] rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#70727F]">Payout Dates</span>
                      <span className="font-semibold text-[#383A47]">
                        1st & 15th of each month
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#70727F]">Next Payout</span>
                      <span className="font-semibold text-[#383A47]">
                        {nextPayoutDate ? formatDate(nextPayoutDate) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#70727F]">Estimated Arrival</span>
                      <span className="font-semibold text-[#383A47]">
                        {nextPayoutDate ? `${formatDate(new Date(nextPayoutDate.getTime() + 3 * 24 * 60 * 60 * 1000))} - ${formatDate(new Date(nextPayoutDate.getTime() + 7 * 24 * 60 * 60 * 1000))}` : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
                    <p className="text-sm text-[#383A47]">
                      <span className="font-semibold">All available balance</span> paid out on scheduled dates. No minimum required.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EDD9FF] rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#3D1560]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B1C20]">Threshold-Based Payouts</p>
                        <p className="text-sm text-[#70727F]">Payouts when balance reaches threshold</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#EDD9FF] text-[#3D1560] text-xs font-semibold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE
                    </span>
                  </div>

                  <div className="bg-[#F8F8FA] rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#70727F]">Minimum Amount</span>
                      <span className="font-semibold text-[#383A47]">{formatCurrency(payoutConfig.thresholdMinimum)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#70727F]">Maximum Amount</span>
                      <span className="font-semibold text-[#383A47]">
                        {payoutConfig.thresholdMaximum ? formatCurrency(payoutConfig.thresholdMaximum) : 'No limit'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#70727F]">Currency</span>
                      <span className="font-semibold text-[#383A47]">{payoutConfig.currency}</span>
                    </div>
                  </div>

                  <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
                    <p className="text-sm text-[#383A47]">
                      Payouts happen <span className="font-semibold">automatically</span> when balance reaches threshold ({formatCurrency(payoutConfig.thresholdMinimum)} minimum).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B1C20] mb-4">Financial Information</h3>
            <div className="space-y-3">
              <button 
                onClick={onBack}
                className="w-full flex items-center justify-between p-3 bg-[#F8F8FA] hover:bg-[#E8E9ED] rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-[#3D1560]" />
                  <div className="text-left">
                    <p className="font-medium text-[#383A47]">View Balance & Earnings</p>
                    <p className="text-xs text-[#70727F]">Check your current balance</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#70727F] group-hover:text-[#3D1560] transition-colors" />
              </button>
              
              <button 
                onClick={() => onNavigate?.('payoutHistory')}
                className="w-full flex items-center justify-between p-3 bg-[#F8F8FA] hover:bg-[#E8E9ED] rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#3D1560]" />
                  <div className="text-left">
                    <p className="font-medium text-[#383A47]">Payout History</p>
                    <p className="text-xs text-[#70727F]">View past transactions</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#70727F] group-hover:text-[#3D1560] transition-colors" />
              </button>
            </div>
          </div>

          {/* Method Comparison */}
          <div className="bg-[#F8F8FA] rounded-xl border border-[#E8E9ED] p-6">
            <h3 className="text-sm font-semibold text-[#1B1C20] mb-3">Choosing a Payout Method</h3>
            <div className="space-y-3 text-xs text-[#70727F]">
              <div>
                <p className="font-semibold text-[#383A47] mb-1">📅 Schedule-Based</p>
                <p>Regular payouts on fixed dates. Best for consistent income.</p>
              </div>
              <div>
                <p className="font-semibold text-[#383A47] mb-1">💰 Threshold-Based</p>
                <p>Flexible payouts when you reach a set amount. Best for variable income.</p>
              </div>
            </div>
          </div>

          {/* Help Link */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] p-6">
            <p className="text-sm text-[#70727F] mb-3">Need to update verification?</p>
            <button className="text-[#3D1560] hover:text-[#6D26AB] font-medium text-sm flex items-center gap-2">
              Go to Verification Settings
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Bank Account Modal */}
      {showEditBankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E9ED]">
              <h2 className="text-xl font-bold text-[#1B1C20]">Update Bank Account</h2>
              <button 
                onClick={() => setShowEditBankModal(false)}
                className="text-[#70727F] hover:text-[#3D1560] p-2 rounded-full hover:bg-[#F8F8FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">Account Holder Name</label>
                <input
                  type="text"
                  defaultValue={bankAccount.accountName}
                  className="w-full px-4 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">Bank Name</label>
                <input
                  type="text"
                  defaultValue={bankAccount.bankName}
                  className="w-full px-4 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• 1234"
                  className="w-full px-4 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">Routing Number</label>
                <input
                  type="text"
                  placeholder="021000021"
                  className="w-full px-4 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">Account Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="accountType" value="checking" defaultChecked={bankAccount.accountType === 'checking'} className="text-[#3D1560]" />
                    <span className="text-sm text-[#383A47]">Checking</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="accountType" value="savings" defaultChecked={bankAccount.accountType === 'savings'} className="text-[#3D1560]" />
                    <span className="text-sm text-[#383A47]">Savings</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="accountType" value="business" defaultChecked={bankAccount.accountType === 'business'} className="text-[#3D1560]" />
                    <span className="text-sm text-[#383A47]">Business</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-2">Currency</label>
                <select
                  defaultValue={bankAccount.currency}
                  className="w-full px-4 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <div className="bg-[#FFF4E5] border border-[#FFE5B4] rounded-lg p-3">
                <p className="text-xs text-[#663C00]">
                  Saving changes will trigger a new verification process. Your current payout schedule may be paused until verification is complete.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-[#E8E9ED]">
              <button
                onClick={() => setShowEditBankModal(false)}
                className="flex-1 px-4 py-3 border-2 border-[#E8E9ED] text-[#383A47] rounded-lg hover:bg-[#F8F8FA] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditBankModal(false)}
                className="flex-1 px-4 py-3 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Payout Method Modal */}
      {showPayoutMethodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E9ED]">
              <h2 className="text-xl font-bold text-[#1B1C20]">Change Payout Schedule</h2>
              <button 
                onClick={handleCancelPayoutMethod}
                className="text-[#70727F] hover:text-[#3D1560] p-2 rounded-full hover:bg-[#F8F8FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Schedule-Based Option */}
              <div 
                onClick={() => setTempPayoutConfig({ ...tempPayoutConfig, method: 'schedule' })}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  tempPayoutConfig.method === 'schedule' 
                    ? 'border-[#3D1560] bg-[#F5EDFF]' 
                    : 'border-[#E8E9ED] hover:border-[#CDCED8]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    checked={tempPayoutConfig.method === 'schedule'}
                    onChange={() => setTempPayoutConfig({ ...tempPayoutConfig, method: 'schedule' })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#3D1560]" />
                      <p className="font-semibold text-[#1B1C20]">Schedule Based</p>
                      <span className="text-xs bg-[#E8F5E9] text-[#4CAF50] px-2 py-1 rounded-full font-medium">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-[#70727F] mb-3">
                      Automatic payouts regardless of amount on fixed dates
                    </p>
                    
                    {tempPayoutConfig.method === 'schedule' && (
                      <div className="mt-3 pt-3 border-t border-[#CDCED8]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                          <span className="text-sm text-[#383A47]">Payouts on 1st & 15th of each month</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Threshold-Based Option */}
              <div 
                onClick={() => setTempPayoutConfig({ ...tempPayoutConfig, method: 'threshold' })}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  tempPayoutConfig.method === 'threshold' 
                    ? 'border-[#3D1560] bg-[#F5EDFF]' 
                    : 'border-[#E8E9ED] hover:border-[#CDCED8]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="radio" 
                    checked={tempPayoutConfig.method === 'threshold'}
                    onChange={() => setTempPayoutConfig({ ...tempPayoutConfig, method: 'threshold' })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-[#3D1560]" />
                      <p className="font-semibold text-[#1B1C20]">Threshold Based</p>
                    </div>
                    <p className="text-sm text-[#70727F] mb-3">
                      Payouts happen automatically when balance reaches threshold
                    </p>
                    
                    {tempPayoutConfig.method === 'threshold' && (
                      <div className="space-y-4 mt-3 pt-3 border-t border-[#CDCED8]">
                        {/* Minimum Amount Info */}
                        <div className="bg-[#F8F8FA] rounded-lg p-3">
                          <p className="text-sm font-medium text-[#383A47] mb-1">Minimum Payout</p>
                          <p className="text-xs text-[#70727F]">$10 USD (or equivalent in your selected currency)</p>
                        </div>

                        {/* Maximum Amount Configuration */}
                        <div>
                          <label className="block text-sm font-medium text-[#383A47] mb-2">
                            Maximum Payout Amount (Optional)
                          </label>
                          <p className="text-xs text-[#70727F] mb-3">
                            Leave empty for no maximum. When empty, payouts happen at the minimum threshold only.
                          </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempPayoutConfig.thresholdMaximum || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setTempPayoutConfig({ 
                                  ...tempPayoutConfig, 
                                  thresholdMaximum: value === '' ? null : Math.min(1000, Math.max(10, parseInt(value) || 10))
                                });
                              }}
                              placeholder="Enter maximum amount"
                              max={1000}
                              min={10}
                              className="flex-1 px-4 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent font-mono placeholder:text-[#CDCED8]"
                            />
                            <select 
                              value={tempPayoutConfig.currency}
                              onChange={(e) => setTempPayoutConfig({ ...tempPayoutConfig, currency: e.target.value as 'USD' | 'EUR' | 'GBP' })}
                              className="px-3 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-[#E8E9ED]">
              <button
                onClick={handleCancelPayoutMethod}
                className="flex-1 px-4 py-3 border-2 border-[#E8E9ED] text-[#383A47] rounded-lg hover:bg-[#F8F8FA] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayoutMethod}
                className="flex-1 px-4 py-3 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

