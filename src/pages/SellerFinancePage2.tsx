import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  TrendingUp,
  Wallet,
  Download,
  DollarSign,
  Calendar,
  CheckCircle2,
  Search,
  Eye,
  Clock,
  Building,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  BarChart3,
  X,
  ExternalLink
} from 'lucide-react';
import { 
  allFinancialTransactions, 
  mockPayoutRecords, 
  calculateFinancialSummary,
  formatCustomerNameForDisplay,
  getNextPayoutDates,
  calculateProjectedEarnings,
  getListingPerformance,
  FinancialTransaction,
} from '../mockData';

interface SellerFinancePage2Props {
  onBack?: () => void;
  onViewBookingDetails?: (bookingId: string) => void;
  onViewOrderDetails?: (orderId: string) => void;
}

const CURRENT_SELLER_ID = 'SELLER001';

export function SellerFinancePage2({ onBack, onViewBookingDetails, onViewOrderDetails }: SellerFinancePage2Props) {
  const [timeFilter, setTimeFilter] = useState<'all' | '30d' | '7d' | '24h'>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  // Calculate financial summary
  const financialSummary = useMemo(() => 
    calculateFinancialSummary(allFinancialTransactions, timeFilter), 
    [timeFilter]
  );

  // Get payout window info
  const nextPayout = getNextPayoutDates();

  // Get projected earnings
  const projectedData = calculateProjectedEarnings(CURRENT_SELLER_ID);

  // Get listing performance
  const listingPerformance = getListingPerformance(CURRENT_SELLER_ID, allFinancialTransactions);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allFinancialTransactions.filter(transaction => {
      const matchesSearch = searchTerm === '' || 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.listingName && transaction.listingName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [searchTerm]);

  const formatCurrency = (amount: number | undefined) => `$${(amount || 0).toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-3 sm:px-4 lg:px-6 bg-[#F8F8FA] min-h-screen">
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#70727F] hover:text-[#3D1560] text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      )}

      {/* Page Header - Compact */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B1C20] mb-2">Finance</h1>
        <p className="text-[#70727F]">Manage your earnings, payouts, and financial reports</p>
      </div>

      {/* Hero Balance Cards - Side by Side Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Available Balance - Prominent */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#4CAF50] to-[#45A049] rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white opacity-90 text-sm font-medium mb-1">Available to Withdraw</p>
              <h2 className="text-5xl font-bold tracking-tight">{formatCurrency(financialSummary.availableForWithdrawal)}</h2>
            </div>
            <Wallet className="w-10 h-10 opacity-80" />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button className="bg-white text-[#4CAF50] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Withdraw Now
            </button>
            <div className="text-sm opacity-90">
              <p>Next payout: {nextPayout.windowLabel}</p>
              <p className="text-xs opacity-75">Processing in 3-7 days</p>
            </div>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-gradient-to-br from-[#DF678C] to-[#E688A1] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-8 h-8 opacity-80" />
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-white opacity-90 text-sm mb-1">Pending</p>
          <h3 className="text-3xl font-bold mb-1">{formatCurrency(financialSummary.pendingEarnings)}</h3>
          <p className="text-sm opacity-75">Available Apr 15-20</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-[#E8E9ED] hover:border-[#3D1560] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#70727F] text-sm">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#3D1560]" />
          </div>
          <p className="text-2xl font-bold text-[#1B1C20]">{formatCurrency(financialSummary.totalRevenue)}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#4CAF50] text-xs font-medium">↑ +{financialSummary.revenueGrowth}%</span>
            <span className="text-[#70727F] text-xs">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E8E9ED] hover:border-[#3D1560] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#70727F] text-sm">Net Earnings</span>
            <DollarSign className="w-4 h-4 text-[#4CAF50]" />
          </div>
          <p className="text-2xl font-bold text-[#1B1C20]">{formatCurrency(financialSummary.netEarnings)}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#3D1560] text-xs font-medium">{((financialSummary.netEarnings / financialSummary.totalRevenue) * 100).toFixed(1)}% margin</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E8E9ED] hover:border-[#3D1560] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#70727F] text-sm">Transactions</span>
            <CreditCard className="w-4 h-4 text-[#70727F]" />
          </div>
          <p className="text-2xl font-bold text-[#1B1C20]">{financialSummary.completedTransactions}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#70727F] text-xs">{formatCurrency(financialSummary.averageOrderValue)} avg</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E8E9ED] hover:border-[#3D1560] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#70727F] text-sm">Projected</span>
            <BarChart3 className="w-4 h-4 text-[#DF678C]" />
          </div>
          <p className="text-2xl font-bold text-[#1B1C20]">{formatCurrency(projectedData.projectedEarnings)}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#70727F] text-xs">{projectedData.upcomingBookings} upcoming</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Transactions Card */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm">
            <div className="p-6 border-b border-[#E8E9ED]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1B1C20]">Recent Transactions</h2>
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as any)}
                  className="text-sm border border-[#CDCED8] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="24h">Last 24 Hours</option>
                </select>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#70727F]" />
                <input
                  type="text"
                  placeholder="Search transactions, customers, listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                />
              </div>
            </div>

            {/* Transaction List */}
            <div className="divide-y divide-[#E8E9ED]">
              {filteredTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="p-5 hover:bg-[#F8F8FA] transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#383A47] truncate">
                          {transaction.listingName || transaction.description}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          transaction.status === 'completed' ? 'bg-[#E8F5E9] text-[#4CAF50]' : 
                          transaction.status === 'pending' ? 'bg-[#FFE5ED] text-[#DF678C]' : 
                          'bg-[#E8E9ED] text-[#70727F]'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#70727F] mb-2">
                        {formatCustomerNameForDisplay(transaction.customerName)} • {formatDate(transaction.date)}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#383A47] font-medium">
                          {formatCurrency(transaction.amount)} → {formatCurrency(transaction.netToSeller)} net
                        </span>
                        {transaction.availableDate && (
                          <span className="text-[#4CAF50] text-xs">
                            Available {formatDate(transaction.availableDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTransaction(transaction)}
                      className="flex items-center gap-1 text-[#3D1560] hover:text-[#6D26AB] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#E8E9ED] text-center">
              <button className="text-[#3D1560] hover:text-[#6D26AB] font-medium text-sm">
                View All Transactions →
              </button>
            </div>
          </div>

          {/* Top Performing Listings */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1B1C20]">Top Performing Listings</h2>
              <button className="text-[#3D1560] hover:text-[#6D26AB] text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {listingPerformance.slice(0, 5).map((listing, index) => (
                <div key={listing.listingId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F8F8FA] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#EDD9FF] flex items-center justify-center text-[#3D1560] font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#383A47] truncate">{listing.listingName}</h4>
                    <p className="text-xs text-[#70727F]">{listing.transactionCount} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1B1C20]">{formatCurrency(listing.totalEarnings)}</p>
                    <p className="text-xs text-[#70727F]">{formatCurrency(listing.averageTransaction)} avg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Payout Schedule */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B1C20] mb-4">Next Payout</h3>
            <div className="bg-[#F8F8FA] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#3D1560] rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#1B1C20] text-lg">{nextPayout.windowLabel}</p>
                  <p className="text-sm text-[#70727F]">Payout Window</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm pt-3 border-t border-[#E8E9ED]">
                <span className="text-[#70727F]">Expected arrival:</span>
                <span className="font-medium text-[#383A47]">
                  {formatDate(nextPayout.earliestDate)} - {formatDate(nextPayout.latestDate)}
                </span>
              </div>
            </div>
            
            {/* Banking Info */}
            <div className="bg-[#F8F8FA] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-[#3D1560]" />
                <div className="flex-1">
                  <p className="font-medium text-[#383A47]">Chase Bank</p>
                  <p className="text-sm text-[#70727F] font-mono">****1234</p>
                </div>
                <button className="text-[#3D1560] hover:text-[#6D26AB] text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Projected Earnings */}
          {projectedData.upcomingBookings > 0 && (
            <div className="bg-gradient-to-br from-[#3D1560] to-[#6D26AB] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">Projected This Month</h3>
                <BarChart3 className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-bold mb-2">{formatCurrency(projectedData.projectedEarnings)}</p>
              <p className="text-sm opacity-90">
                Based on {projectedData.upcomingBookings} confirmed upcoming bookings
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B1C20] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-[#F8F8FA] hover:bg-[#E8E9ED] rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#383A47]">Export Reports</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#70727F] group-hover:text-[#3D1560] transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-[#F8F8FA] hover:bg-[#E8E9ED] rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#383A47]">Payout History</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#70727F] group-hover:text-[#3D1560] transition-colors" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-[#F8F8FA] hover:bg-[#E8E9ED] rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#383A47]">Banking Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#70727F] group-hover:text-[#3D1560] transition-colors" />
              </button>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#1B1C20] mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-sm text-[#383A47]">Bank Verified</span>
                </div>
                <span className="text-xs bg-[#E8F5E9] text-[#4CAF50] px-2 py-1 rounded-full font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-sm text-[#383A47]">Identity Verified</span>
                </div>
                <span className="text-xs bg-[#E8F5E9] text-[#4CAF50] px-2 py-1 rounded-full font-medium">
                  Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payout History Section */}
      <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm">
        <div className="p-6 border-b border-[#E8E9ED]">
          <h2 className="text-xl font-bold text-[#1B1C20]">Payout History</h2>
        </div>
        <div className="divide-y divide-[#E8E9ED]">
          {mockPayoutRecords.slice(0, 5).map((payout) => (
            <div key={payout.id} className="p-6 hover:bg-[#F8F8FA] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#383A47] text-lg">{formatCurrency(payout.amount)}</p>
                    <p className="text-sm text-[#70727F]">
                      {formatDate(payout.initiatedDate)} • {payout.accountDetails.bankName || payout.accountDetails.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 text-xs bg-[#E8F5E9] text-[#4CAF50] rounded-full font-medium">
                    {payout.status === 'completed' ? 'Completed' : payout.status === 'processing' ? 'Processing' : 'Pending'}
                  </span>
                  <p className="text-xs text-[#70727F] mt-1">{payout.transactionIds.length} transactions</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E9ED] sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#1B1C20]">Transaction Details</h2>
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="text-[#70727F] hover:text-[#3D1560] p-2 rounded-full hover:bg-[#F8F8FA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Listing Image and Name Section */}
              {selectedTransaction.listingImage && (
                <div className="flex gap-4 mb-4">
                  <img 
                    src={selectedTransaction.listingImage} 
                    alt={selectedTransaction.listingName || 'Listing'}
                    className="w-24 h-24 object-cover rounded-lg border border-[#E8E9ED]"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#383A47] mb-2">
                      {selectedTransaction.listingName || selectedTransaction.description}
                    </h3>
                    {selectedTransaction.serviceCategory && (
                      <span className="inline-block px-3 py-1 text-sm bg-[#EDD9FF] text-[#3D1560] rounded-full">
                        {selectedTransaction.serviceCategory}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback if no image */}
              {!selectedTransaction.listingImage && (
                <div>
                  <h3 className="text-lg font-semibold text-[#383A47] mb-4">
                    {selectedTransaction.listingName || selectedTransaction.description}
                  </h3>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#70727F]">Customer:</span>
                    <p className="font-medium text-[#383A47]">
                      {formatCustomerNameForDisplay(selectedTransaction.customerName)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#70727F]">Date:</span>
                    <p className="font-medium text-[#383A47]">{formatDate(selectedTransaction.date)}</p>
                  </div>
                  <div>
                    <span className="text-[#70727F]">Transaction ID:</span>
                    <p className="font-medium text-[#383A47] font-mono text-xs">
                      {selectedTransaction.transactionId}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#70727F]">Payment Method:</span>
                    <p className="font-medium text-[#383A47] capitalize">
                      {selectedTransaction.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-[#F8F8FA] rounded-xl p-5">
                <h4 className="font-semibold text-[#383A47] mb-4">Financial Breakdown</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Gross Revenue:</span>
                    <span className="font-semibold text-[#383A47]">{formatCurrency(selectedTransaction.amount)}</span>
                  </div>
                  <div className="h-px bg-[#E8E9ED]"></div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Platform Fee (2.5%):</span>
                    <span className="text-[#DF678C]">-{formatCurrency(selectedTransaction.platformFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Payment Processing (2.9% + $0.30):</span>
                    <span className="text-[#DF678C]">-{formatCurrency(selectedTransaction.paymentProcessingFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Transaction Fee:</span>
                    <span className="text-[#DF678C]">-{formatCurrency(selectedTransaction.transactionFee)}</span>
                  </div>
                  <div className="h-px bg-[#CDCED8]"></div>
                  <div className="flex justify-between text-base">
                    <span className="font-semibold text-[#383A47]">Your Net Earnings:</span>
                    <span className="font-bold text-[#4CAF50]">{formatCurrency(selectedTransaction.netToSeller)}</span>
                  </div>
                </div>
              </div>

              {/* Settlement Timeline */}
              {selectedTransaction.availableDate && (
                <div className="bg-[#E8F5E9] rounded-xl p-5">
                  <h4 className="font-semibold text-[#383A47] mb-3">Settlement Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                      <div>
                        <p className="font-medium text-[#383A47]">Service Completed</p>
                        <p className="text-[#70727F] text-xs">
                          {formatDate(selectedTransaction.completionDate || selectedTransaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                      <div>
                        <p className="font-medium text-[#383A47]">Funds Available</p>
                        <p className="text-[#70727F] text-xs">
                          {formatDate(selectedTransaction.availableDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tax Information */}
              {selectedTransaction.taxAmount && selectedTransaction.taxAmount > 0 && (
                <div className="bg-[#FFE5ED] rounded-xl p-5">
                  <h4 className="font-semibold text-[#383A47] mb-3">Tax Information</h4>
                  <p className="text-sm text-[#70727F] mb-2">
                    Tax collected from customer: <span className="font-medium text-[#383A47]">{formatCurrency(selectedTransaction.taxAmount)}</span>
                  </p>
                  <p className="text-xs text-[#DF678C]">
                    ⓘ You are responsible for remitting this tax to the appropriate authorities.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#E8E9ED]">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
                <button 
                  onClick={() => {
                    if (selectedTransaction.bookingId && onViewBookingDetails) {
                      onViewBookingDetails(selectedTransaction.bookingId);
                    } else if (selectedTransaction.orderId && onViewOrderDetails) {
                      onViewOrderDetails(selectedTransaction.orderId);
                    }
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#3D1560] text-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View {selectedTransaction.type === 'booking_payment' ? 'Booking' : 'Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

