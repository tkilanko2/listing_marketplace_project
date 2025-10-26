import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ChevronRight,
  ChevronDown,
  CreditCard,
  CheckCircle2,
  X,
  Download,
  ExternalLink,
  Info
} from 'lucide-react';
import { 
  mockPayoutRecords,
  allFinancialTransactionsExport as allFinancialTransactions,
  FinancialTransaction,
  formatCustomerNameForDisplay
} from '../mockData';

interface PayoutHistoryPageProps {
  onBack?: () => void;
  onViewBookingDetails?: (bookingId: string) => void;
  onViewOrderDetails?: (orderId: string) => void;
}

export function PayoutHistoryPage({ onBack, onViewBookingDetails, onViewOrderDetails }: PayoutHistoryPageProps) {
  const [expandedPayouts, setExpandedPayouts] = useState<Set<string>>(new Set());
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<'all' | 'completed' | 'processing' | 'pending' | 'failed'>('all');
  const [payoutCurrentPage, setPayoutCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);

  const formatCurrency = (amount: number | undefined) => `$${(amount || 0).toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  // Filter and paginate payouts
  const filteredPayouts = useMemo(() => {
    return mockPayoutRecords.filter(payout => {
      if (payoutStatusFilter !== 'all' && payout.status !== payoutStatusFilter) {
        return false;
      }
      return true;
    });
  }, [payoutStatusFilter]);

  const PAYOUTS_PER_PAGE = 25;
  const totalPayouts = filteredPayouts.length;
  const totalPages = Math.ceil(totalPayouts / PAYOUTS_PER_PAGE);
  const startIndex = (payoutCurrentPage - 1) * PAYOUTS_PER_PAGE;
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + PAYOUTS_PER_PAGE);

  const togglePayoutExpansion = (payoutId: string) => {
    const newExpanded = new Set(expandedPayouts);
    if (newExpanded.has(payoutId)) {
      newExpanded.delete(payoutId);
    } else {
      newExpanded.add(payoutId);
    }
    setExpandedPayouts(newExpanded);
  };

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'processing': return 'bg-[#FFF4E5] text-[#FF9800]';
      case 'pending': return 'bg-[#E3F2FD] text-[#2196F3]';
      case 'failed': return 'bg-[#FFEBEE] text-[#F44336]';
      default: return 'bg-[#E8E9ED] text-[#70727F]';
    }
  };

  const getPayoutStatusTooltip = (status: string) => {
    switch (status) {
      case 'completed': return 'Money has been sent to your bank account';
      case 'processing': return 'Transfer in progress (typically 3-7 business days)';
      case 'pending': return 'Awaiting transfer to your bank';
      case 'failed': return 'Transfer failed - please check your bank details';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-3 sm:px-4 lg:px-6 bg-[#F8F8FA] min-h-screen">
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#70727F] hover:text-[#3D1560] text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Finance
        </button>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1B1C20]">Payout History</h1>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl border border-[#E8E9ED] shadow-sm">
        <div className="p-5 border-b border-[#E8E9ED]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#1B1C20]">All Payouts</h2>
              <span className="text-sm text-[#70727F]">({totalPayouts})</span>
            </div>
            
            {/* Status Filter */}
            <select
              value={payoutStatusFilter}
              onChange={(e) => {
                setPayoutStatusFilter(e.target.value as any);
                setPayoutCurrentPage(1);
              }}
              className="text-sm border border-[#E8E9ED] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Payout List */}
        {paginatedPayouts.length > 0 ? (
          <>
            <div className="divide-y divide-[#E8E9ED]">
              {paginatedPayouts.map((payout) => {
                const isExpanded = expandedPayouts.has(payout.id);
                return (
                  <div key={payout.id} className="hover:bg-[#F5EDFF] transition-all border-l-4 border-transparent hover:border-[#3D1560]">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#EDD9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-5 h-5 text-[#3D1560]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1B1C20] text-xl">{formatCurrency(payout.amount)}</p>
                            <p className="text-sm text-[#70727F]">
                              {formatDate(payout.initiatedDate)} • {payout.accountDetails.bankName || payout.accountDetails.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right flex flex-col items-end gap-2">
                            <div className="group relative">
                              <span className={`px-3 py-1 text-xs rounded-full font-medium cursor-help flex items-center gap-1 ${getPayoutStatusColor(payout.status)}`}>
                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                <Info className="w-3 h-3 opacity-60" />
                              </span>
                              {/* Tooltip */}
                              <div className="absolute right-0 top-full mt-2 w-64 bg-[#1B1C20] text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
                                <div className="absolute -top-1 right-4 w-2 h-2 bg-[#1B1C20] rotate-45"></div>
                                {getPayoutStatusTooltip(payout.status)}
                              </div>
                            </div>
                            <p className="text-xs text-[#70727F]">
                              {payout.transactionIds.length} transaction{payout.transactionIds.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => togglePayoutExpansion(payout.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors font-medium text-sm"
                          >
                            {isExpanded ? (
                              <>
                                Hide Details
                                <ChevronDown className="w-4 h-4" />
                              </>
                            ) : (
                              <>
                                View Details
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-[#E8E9ED] bg-[#F8F8FA]">
                        <div className="pt-4 space-y-3">
                          {/* Compact Info Row */}
                          <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3 border border-[#E8E9ED]">
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="text-xs text-[#70727F]">Payout ID</p>
                                <p className="font-mono text-[#383A47] font-medium">{payout.id}</p>
                              </div>
                              {payout.completedDate && (
                                <div>
                                  <p className="text-xs text-[#70727F]">Completed</p>
                                  <p className="text-[#383A47] font-medium">{formatDate(payout.completedDate)}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-[#70727F]">Destination</p>
                                <p className="text-[#383A47] font-medium">
                                  {payout.accountDetails.bankName} ****{payout.accountDetails.last4}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[#70727F]">Net to Bank</p>
                              <p className="text-lg font-bold text-[#4CAF50]">{formatCurrency(payout.netAmount || payout.amount)}</p>
                            </div>
                          </div>

                          {/* Transactions Included */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-[#383A47]">
                                {payout.transactionIds.length} Transaction{payout.transactionIds.length !== 1 ? 's' : ''}
                              </p>
                              <p className="text-xs text-[#70727F]">Click for details</p>
                            </div>
                            <div className="space-y-1.5">
                              {payout.transactionIds.map((transactionId, idx) => {
                                const transaction = allFinancialTransactions.find(t => t.transactionId === transactionId);
                                return transaction ? (
                                  <div 
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-[#F5EDFF] hover:border-[#3D1560] border border-[#E8E9ED] transition-all cursor-pointer group"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTransaction(transaction);
                                    }}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-[#383A47] group-hover:text-[#3D1560] transition-colors truncate">
                                        {transaction.listingName || transaction.description}
                                      </p>
                                      <p className="text-xs text-[#70727F]">{formatDate(transaction.date)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                      <p className="font-semibold text-[#383A47]">{formatCurrency(transaction.netToSeller)}</p>
                                      <ChevronRight className="w-4 h-4 text-[#70727F] group-hover:text-[#3D1560] transition-colors flex-shrink-0" />
                                    </div>
                                  </div>
                                ) : (
                                  <div key={idx} className="p-3 bg-white rounded-lg border border-[#E8E9ED]">
                                    <p className="text-sm text-[#70727F] font-mono">{transactionId}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-5 border-t border-[#E8E9ED]">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#70727F]">
                    Showing {startIndex + 1} to {Math.min(startIndex + PAYOUTS_PER_PAGE, totalPayouts)} of {totalPayouts} payouts
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPayoutCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={payoutCurrentPage === 1}
                      className="px-4 py-2 border border-[#E8E9ED] rounded-lg text-[#383A47] hover:bg-[#F8F8FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-[#70727F]">
                      Page {payoutCurrentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPayoutCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={payoutCurrentPage === totalPages}
                      className="px-4 py-2 border border-[#E8E9ED] rounded-lg text-[#383A47] hover:bg-[#F8F8FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-[#70727F]">No payouts found matching your filters</p>
          </div>
        )}
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

