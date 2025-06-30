import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  FileText,
  Download,
  Upload,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Plus,
  Settings,
  X,
  Copy,
  ExternalLink,
  Info,
  Shield,
  Clock,
  User,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  TrendingDown
} from 'lucide-react';
import { 
  allFinancialTransactions, 
  mockPayoutRecords, 
  calculateFinancialSummary,
  FinancialTransaction,
  PayoutRecord,
  FinancialSummary 
} from '../mockData';

interface SellerFinancePageProps {
  onBack?: () => void;
}

type ActiveTab = 'overview' | 'revenue' | 'payouts' | 'transactions' | 'tax';
type TimeFilter = 'all' | '30d' | '7d' | '24h';

// Modal state types
interface TransactionDetailsModalState {
  isOpen: boolean;
  transaction: FinancialTransaction | null;
}

interface PayoutDetailsModalState {
  isOpen: boolean;
  payout: PayoutRecord | null;
}

interface WithdrawalModalState {
  isOpen: boolean;
  step: 'select' | 'confirm' | 'processing' | 'complete';
  amount: string;
  method: 'standard' | 'express' | 'instant';
}

interface ExportModalState {
  isOpen: boolean;
  dateRange: { from: string; to: string };
  transactionTypes: string[];
  columns: string[];
  format: 'csv' | 'excel' | 'pdf';
}

interface TaxDocumentModalState {
  isOpen: boolean;
  document: {
    id: string;
    title: string;
    type: string;
    year: string;
    size: string;
    pages: number;
  } | null;
}

interface ComplianceDetailsModalState {
  isOpen: boolean;
  item: {
    title: string;
    status: string;
    details: any;
  } | null;
}

// Loading and Animation Components
const SkeletonLoader = ({ className = "" }: { className?: string }) => (
  <div 
    className={`animate-pulse bg-gradient-to-r from-[#E8E9ED] via-[#F8F8FA] to-[#E8E9ED] rounded ${className}`}
    style={{ 
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite'
    }}
  >
    
  </div>
);

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'default',
  isLoading = false,
  delay = 0 
}: {
  title: string;
  value: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
  delay?: number;
}) => {
  const colorClasses = {
    default: 'from-[#FFFFFF] to-[#F8F8FA] border-[#E8E9ED] text-[#1B1C20]',
    primary: 'from-[#3D1560] to-[#6D26AB] border-[#3D1560] text-white',
    success: 'from-[#4CAF50] to-[#45A049] border-[#4CAF50] text-white',
    warning: 'from-[#DF678C] to-[#E688A1] border-[#DF678C] text-white',
    danger: 'from-[#DC2626] to-[#EF4444] border-[#DC2626] text-white'
  };

  const iconColorClasses = {
    default: 'text-[#3D1560]',
    primary: 'text-white',
    success: 'text-white',
    warning: 'text-white',
    danger: 'text-white'
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-[#E8E9ED] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-5 w-5 rounded" />
        </div>
        <SkeletonLoader className="h-8 w-32 mb-2" />
        <SkeletonLoader className="h-4 w-20" />
      </div>
    );
  }

  return (
    <div 
      className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-medium ${color === 'default' ? 'text-[#70727F]' : 'text-white opacity-90'}`}>
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${color === 'default' ? 'bg-[#EDD9FF]' : 'bg-white bg-opacity-20'} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-5 h-5 ${iconColorClasses[color]}`} />
        </div>
      </div>
      <p className={`text-3xl font-bold mb-2 ${color === 'default' ? 'text-[#1B1C20]' : 'text-white'}`}>
        {value}
      </p>
      {trend && trendValue && (
        <div className="flex items-center text-sm">
          {trend === 'up' ? (
            <ArrowUpRight className={`w-4 h-4 mr-1 ${color === 'default' ? 'text-[#4CAF50]' : 'text-white'}`} />
          ) : trend === 'down' ? (
            <ArrowDownRight className={`w-4 h-4 mr-1 ${color === 'default' ? 'text-[#DF678C]' : 'text-white'}`} />
          ) : (
            <div className={`w-4 h-4 mr-1 ${color === 'default' ? 'text-[#70727F]' : 'text-white opacity-70'}`}>—</div>
          )}
          <span className={`font-medium ${
            color === 'default' 
              ? trend === 'up' ? 'text-[#4CAF50]' : trend === 'down' ? 'text-[#DF678C]' : 'text-[#70727F]'
              : 'text-white'
          }`}>
            {trendValue}
          </span>
          <span className={`ml-1 ${color === 'default' ? 'text-[#70727F]' : 'text-white opacity-70'}`}>
            vs last period
          </span>
        </div>
      )}
    </div>
  );
};

// Simple Chart Components
const SimpleLineChart = ({ data, className = "" }: { data: number[], className?: string }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 80; // 80% height, 10% padding top/bottom
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E8E9ED" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Gradient fill */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3D1560" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3D1560" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon 
          points={`0,100 ${points} 100,100`}
          fill="url(#chartGradient)"
          className="animate-fadeIn"
        />
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3D1560"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: '200',
            strokeDashoffset: '200',
            animation: 'drawLine 1.5s ease-out forwards'
          }}
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#3D1560"
              style={{ 
                opacity: 0,
                animation: `fadeIn 0.3s ease-out ${index * 100 + 1500}ms forwards`
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

const DonutChart = ({ 
  data, 
  size = 120, 
  strokeWidth = 8, 
  className = "" 
}: { 
  data: { label: string; value: number; color: string }[], 
  size?: number, 
  strokeWidth?: number, 
  className?: string 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;
  
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E8E9ED"
          strokeWidth={strokeWidth}
        />
        
        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = item.value / total;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativePercentage * circumference;
          cumulativePercentage += percentage;
          
          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="animate-drawArc"
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: '1s'
              }}
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-[#1B1C20]">{data.length}</div>
          <div className="text-xs text-[#70727F]">sources</div>
        </div>
      </div>
      

    </div>
  );
};

const ProgressBar = ({ 
  value, 
  max, 
  color = '#3D1560', 
  backgroundColor = '#E8E9ED', 
  height = 8, 
  className = "",
  animated = true 
}: {
  value: number;
  max: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  className?: string;
  animated?: boolean;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`w-full bg-[${backgroundColor}] rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${animated ? 'animate-expandWidth' : ''}`}
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: color,
          animation: animated ? `expandWidth 1.5s ease-out` : undefined
        }}
      />

    </div>
  );
};

export function SellerFinancePage({ onBack }: SellerFinancePageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [transactionModal, setTransactionModal] = useState<TransactionDetailsModalState>({ isOpen: false, transaction: null });
  const [payoutModal, setPayoutModal] = useState<PayoutDetailsModalState>({ isOpen: false, payout: null });
  const [withdrawalModal, setWithdrawalModal] = useState<WithdrawalModalState>({ isOpen: false, step: 'select', amount: '', method: 'standard' });
  const [exportModal, setExportModal] = useState<ExportModalState>({ 
    isOpen: false, 
    dateRange: { from: '', to: '' },
    transactionTypes: ['service', 'product'],
    columns: ['transactionId', 'date', 'customerName', 'amount', 'fees', 'netEarnings'],
    format: 'csv'
  });
  const [taxDocModal, setTaxDocModal] = useState<TaxDocumentModalState>({ isOpen: false, document: null });
  const [complianceModal, setComplianceModal] = useState<ComplianceDetailsModalState>({ isOpen: false, item: null });

  // Calculate financial summary based on filters
  const financialSummary = useMemo(() => 
    calculateFinancialSummary(allFinancialTransactions, timeFilter), 
    [timeFilter]
  );

  // Filter transactions based on search and status
  const filteredTransactions = useMemo(() => {
    return allFinancialTransactions.filter(transaction => {
      const matchesSearch = searchTerm === '' || 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Get revenue by category based on time filter
  const revenueByCategory = useMemo(() => {
    // Filter transactions based on time filter
    const filteredTransactionsByTime = allFinancialTransactions.filter(transaction => {
      if (timeFilter === 'all') return true;
      
      const now = new Date();
      const daysAgo = timeFilter === '30d' ? 30 : timeFilter === '7d' ? 7 : 1;
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      return transaction.date >= cutoffDate;
    });
    
    // Calculate revenue by category using the filtered transactions
    const serviceTransactions = filteredTransactionsByTime.filter(t => t.type === 'booking_payment');
    const productTransactions = filteredTransactionsByTime.filter(t => t.type === 'order_payment');
    
    return {
      'Service Bookings': {
        count: serviceTransactions.length,
        revenue: serviceTransactions.reduce((sum, t) => sum + t.amount, 0),
        netEarnings: serviceTransactions.reduce((sum, t) => sum + t.netToSeller, 0)
      },
      'Product Sales': {
        count: productTransactions.length,
        revenue: productTransactions.reduce((sum, t) => sum + t.amount, 0),
        netEarnings: productTransactions.reduce((sum, t) => sum + t.netToSeller, 0)
      }
    };
  }, [timeFilter]);

  // Helper function to format customer name (consistent with existing codebase)
  const formatCustomerName = (fullName: string): string => {
    if (!fullName) return 'Customer';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1].charAt(0) + '.';
    return `${firstName} ${lastInitial}`;
  };

  const formatCurrency = (amount: number | undefined) => `$${(amount || 0).toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#E8F5E9] text-[#4CAF50]';
      case 'processing': return 'bg-[#EDD9FF] text-[#3D1560]';
      case 'pending': return 'bg-[#FFE5ED] text-[#DF678C]';
      default: return 'bg-[#E8E9ED] text-[#70727F]';
    }
  };

  // Modal handlers
  const handleTransactionDetails = (transaction: FinancialTransaction) => {
    setTransactionModal({ isOpen: true, transaction });
  };

  const handlePayoutDetails = (payout: PayoutRecord) => {
    setPayoutModal({ isOpen: true, payout });
  };

  const handleWithdrawClick = () => {
    setWithdrawalModal({ isOpen: true, step: 'select', amount: financialSummary.availableForWithdrawal.toString(), method: 'standard' });
  };

  const handleExportClick = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setExportModal({ 
      ...exportModal, 
      isOpen: true,
      dateRange: { 
        from: thirtyDaysAgo.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0]
      }
    });
  };

  const handleTaxDocumentClick = (docId: string) => {
    const documents = {
      '2023-annual': {
        id: '2023-annual',
        title: '2023 Annual Tax Statement',
        type: '1099-NEC',
        year: '2023',
        size: '847 KB',
        pages: 3
      },
      'q4-2023': {
        id: 'q4-2023',
        title: 'Q4 2023 Quarterly Summary',
        type: 'Quarterly Report',
        year: '2023',
        size: '1.2 MB',
        pages: 5
      }
    };
    setTaxDocModal({ isOpen: true, document: documents[docId as keyof typeof documents] || null });
  };

  const handleComplianceClick = (title: string, status: string) => {
    const complianceData = {
      'Tax ID Verification': {
        title: 'Tax ID Verification',
        status: 'Complete',
        details: {
          ein: '**-***7890',
          businessName: 'Smith Photography LLC',
          verifiedDate: 'January 15, 2024',
          verifiedBy: 'IRS Database Match',
          benefits: ['Instant payouts available', 'Higher transaction limits', 'Priority customer support']
        }
      },
      'Banking Verification': {
        title: 'Banking Verification',
        status: 'Complete',
        details: {
          bankName: 'Chase Bank',
          accountType: 'Business Checking',
          verifiedDate: 'January 10, 2024',
          lastUpdate: 'March 1, 2024'
        }
      }
    };
    setComplianceModal({ isOpen: true, item: complianceData[title as keyof typeof complianceData] || null });
  };

  const renderOverviewTab = () => {
    // Sample data for charts
    const revenueData = [2450, 2680, 2890, 3100, 3350, 3480, 3720, 3650, 3890, 4120, 4250, 4380];
    const donutData = [
      { label: 'Services', value: 65, color: '#3D1560' },
      { label: 'Products', value: 35, color: '#DF678C' }
    ];

    return (
      <div className="space-y-8">
        {/* Enhanced Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(financialSummary.totalRevenue)}
            icon={TrendingUp}
            trend="up"
            trendValue={`+${financialSummary.revenueGrowth}%`}
            color="default"
            delay={0}
          />
          
          <MetricCard
            title="Net Earnings"
            value={formatCurrency(financialSummary.netEarnings)}
            icon={DollarSign}
            trend="up"
            trendValue={`${((financialSummary.netEarnings / financialSummary.totalRevenue) * 100).toFixed(1)}% margin`}
            color="primary"
            delay={100}
          />
          
          <MetricCard
            title="Pending"
            value={formatCurrency(financialSummary.pendingEarnings)}
            icon={Clock}
            trend="neutral"
            trendValue="2-3 days"
            color="warning"
            delay={200}
          />
          
          <MetricCard
            title="Available"
            value={formatCurrency(financialSummary.availableForWithdrawal)}
            icon={Wallet}
            trend="up"
            trendValue="Ready to withdraw"
            color="success"
            delay={300}
          />
        </div>

        {/* Enhanced Revenue Chart & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#FFFFFF] p-6 rounded-xl border border-[#E8E9ED] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1B1C20]">Revenue Trend</h3>
              <div className="flex items-center gap-2">
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                  className="text-sm border border-[#CDCED8] rounded-lg px-3 py-1.5 bg-[#FFFFFF] focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="24h">Last 24 Hours</option>
                </select>
              </div>
            </div>
            
            {/* Interactive Line Chart */}
            <div className="h-64 mb-4">
              <SimpleLineChart data={revenueData} className="h-full" />
            </div>
            
            {/* Chart Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8E9ED]">
              <div className="text-center">
                <p className="text-sm text-[#70727F] mb-1">Peak Revenue</p>
                <p className="text-lg font-bold text-[#4CAF50]">{formatCurrency(Math.max(...revenueData))}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#70727F] mb-1">Average</p>
                <p className="text-lg font-bold text-[#383A47]">{formatCurrency(revenueData.reduce((a, b) => a + b, 0) / revenueData.length)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#70727F] mb-1">Growth Rate</p>
                <p className="text-lg font-bold text-[#3D1560]">+{financialSummary.revenueGrowth}%</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E8E9ED] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Quick Actions</h3>
            
            {/* Key Status Info */}
            <div className="mb-4 p-3 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-sm text-[#383A47]">Next Payout</span>
                </div>
                <span className="text-sm font-medium text-[#4CAF50]">April 18</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#DF678C]" />
                  <span className="text-sm text-[#383A47]">Tax Documents</span>
                </div>
                <span className="px-2 py-1 text-xs bg-[#FFE5ED] text-[#DF678C] rounded-full">Action Needed</span>
              </div>
            </div>

            {/* Rectangular Quick Actions */}
            <div className="space-y-2">
              <button 
                onClick={handleWithdrawClick}
                className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#4CAF50] to-[#45A049] text-white rounded-lg hover:from-[#45A049] hover:to-[#3E8E41] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Withdraw Funds</span>
                </div>
                <span className="text-sm opacity-90">{formatCurrency(financialSummary.availableForWithdrawal)}</span>
              </button>
              
              <button 
                onClick={handleExportClick}
                className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#3D1560] to-[#6D26AB] text-white rounded-lg hover:from-[#6D26AB] hover:to-[#9B53D9] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Export Reports</span>
                </div>
                <span className="text-sm opacity-90">CSV/PDF</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="mt-4 pt-3 border-t border-[#E8E9ED]">
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('payouts')}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-sm text-[#DF678C] bg-[#FFE5ED] hover:bg-[#FFD1DC] rounded-lg transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  Banking
                </button>
                <button 
                  onClick={() => setActiveTab('tax')}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-sm text-[#70727F] bg-[#F8F8FA] hover:bg-[#E8E9ED] rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Tax Docs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1B1C20]">Recent Financial Activity</h3>
          <button 
            onClick={() => setActiveTab('transactions')}
            className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {allFinancialTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border border-[#E8E9ED] rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.status === 'completed' ? 'bg-[#4CAF50]' : 
                  transaction.status === 'processing' ? 'bg-[#3D1560]' : 'bg-[#DF678C]'
                }`} />
                <div>
                  <p className="text-sm font-medium text-[#383A47]">
                    {formatCurrency(transaction.amount)} → {formatCurrency(transaction.netToSeller)} net
                  </p>
                  <p className="text-xs text-[#70727F]">
                    {formatDate(transaction.date)} | {transaction.category} | ID: {transaction.id}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                {transaction.status === 'completed' ? '✅' : transaction.status === 'processing' ? '⏳' : '⏸️'}
              </span>
            </div>
          ))}
        </div>
      </div>
      </div>
    );
  };

  // Get filtered transactions for revenue tab calculations
  const filteredTransactionsForRevenue = useMemo(() => {
    if (timeFilter === 'all') return allFinancialTransactions;
    
    const now = new Date();
    const daysAgo = timeFilter === '30d' ? 30 : timeFilter === '7d' ? 7 : 1;
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return allFinancialTransactions.filter(t => t.date >= cutoffDate);
  }, [timeFilter]);

  const renderRevenueTab = () => (
    <div className="space-y-6">
      {/* Revenue Composition */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1B1C20]">Revenue Composition</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#70727F]">Time Period:</label>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="text-sm border border-[#CDCED8] rounded-lg px-3 py-1.5 bg-[#FFFFFF] focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
          <div className="bg-[#F8F8FA] p-4 rounded-lg">
            <h4 className="text-sm font-medium text-[#70727F] mb-2">Gross Revenue</h4>
            <p className="text-2xl font-bold text-[#1B1C20]">{formatCurrency(financialSummary.totalRevenue)}</p>
            <p className="text-xs text-[#70727F] mt-1">{financialSummary.completedTransactions} transactions</p>
          </div>
          <div className="bg-[#FFE5ED] p-4 rounded-lg">
            <h4 className="text-sm font-medium text-[#70727F] mb-2">Total Fees</h4>
            <p className="text-2xl font-bold text-[#DF678C]">{formatCurrency(financialSummary.totalFees)}</p>
            <p className="text-xs text-[#70727F] mt-1">{((financialSummary.totalFees / financialSummary.totalRevenue) * 100).toFixed(1)}% of revenue</p>
          </div>
          <div className="bg-[#EDD9FF] p-4 rounded-lg">
            <h4 className="text-sm font-medium text-[#3D1560] mb-2">Net Earnings</h4>
            <p className="text-2xl font-bold text-[#3D1560]">{formatCurrency(financialSummary.netEarnings)}</p>
            <p className="text-xs text-[#3D1560] opacity-80 mt-1">{((financialSummary.netEarnings / financialSummary.totalRevenue) * 100).toFixed(1)}% profit margin</p>
          </div>
        </div>

        {/* Fee Structure Breakdown */}
        <div className="border-t border-[#E8E9ED] pt-6">
          <h4 className="text-base font-semibold text-[#1B1C20] mb-4">Fee Structure Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-3 bg-[#F8F8FA] rounded-lg">
              <p className="text-xs text-[#70727F] mb-1">Platform Fees</p>
              <p className="text-lg font-bold text-[#383A47]">
                {formatCurrency(filteredTransactionsForRevenue.reduce((sum, t) => sum + t.platformFee, 0))}
              </p>
              <p className="text-xs text-[#70727F]">2.5% avg</p>
            </div>
            <div className="text-center p-3 bg-[#F8F8FA] rounded-lg">
              <p className="text-xs text-[#70727F] mb-1">Payment Processing</p>
              <p className="text-lg font-bold text-[#383A47]">
                {formatCurrency(filteredTransactionsForRevenue.reduce((sum, t) => sum + t.paymentProcessingFee, 0))}
              </p>
              <p className="text-xs text-[#70727F]">2.9% + $0.30</p>
            </div>
            <div className="text-center p-3 bg-[#F8F8FA] rounded-lg">
              <p className="text-xs text-[#70727F] mb-1">Transaction Fees</p>
              <p className="text-lg font-bold text-[#383A47]">
                {formatCurrency(filteredTransactionsForRevenue.reduce((sum, t) => sum + t.transactionFee, 0))}
              </p>
              <p className="text-xs text-[#70727F]">$0.25 each</p>
            </div>
            <div className="text-center p-3 bg-[#F8F8FA] rounded-lg">
              <p className="text-xs text-[#70727F] mb-1">Withdrawal Fees</p>
              <p className="text-lg font-bold text-[#383A47]">
                {formatCurrency(0)}
              </p>
              <p className="text-xs text-[#70727F]">Waived &gt;$50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Financial Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <p className="text-sm text-[#70727F] mb-1">Average Transaction Value</p>
            <p className="text-xl font-bold text-[#383A47]">{formatCurrency(financialSummary.averageOrderValue)}</p>
          </div>
          <div>
            <p className="text-sm text-[#70727F] mb-1">Revenue Growth Rate</p>
            <p className="text-xl font-bold text-[#4CAF50]">+{financialSummary.revenueGrowth}%</p>
          </div>
          <div>
            <p className="text-sm text-[#70727F] mb-1">Monthly Target Progress</p>
            <p className="text-xl font-bold text-[#3D1560]">
              {((financialSummary.totalRevenue / financialSummary.monthlyTarget) * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-[#70727F] mb-1">Revenue per Day</p>
            <p className="text-xl font-bold text-[#383A47]">
              {formatCurrency(financialSummary.totalRevenue / 30)}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Revenue by Category</h3>
        <div className="space-y-4">
          {Object.entries(revenueByCategory).map(([category, data]) => {
            const categoryData = data as { count: number; revenue: number; netEarnings: number };
            return (
              <div key={category} className="flex items-center justify-between p-3 bg-[#F8F8FA] rounded-lg">
                <div>
                  <p className="font-medium text-[#383A47]">{category}</p>
                  <p className="text-sm text-[#70727F]">{categoryData.count} transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1B1C20]">{formatCurrency(categoryData.revenue)}</p>
                  <p className="text-sm text-[#4CAF50]">{formatCurrency(categoryData.netEarnings)} net</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPayoutsTab = () => (
    <div className="space-y-6">
      {/* Payout Status */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Payment Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-[#E8F5E9] p-4 rounded-lg border border-[#4CAF50]">
            <h4 className="text-sm font-medium text-[#4CAF50] mb-2">Ready to Withdraw</h4>
            <p className="text-2xl font-bold text-[#4CAF50]">{formatCurrency(financialSummary.availableForWithdrawal)}</p>
            <button 
              onClick={handleWithdrawClick}
              className="w-full mt-3 bg-[#4CAF50] text-white py-2 px-4 rounded-lg hover:bg-[#45A049] transition-colors"
            >
              Withdraw Now
            </button>
          </div>
          <div className="bg-[#EDD9FF] p-4 rounded-lg border border-[#3D1560]">
            <h4 className="text-sm font-medium text-[#3D1560] mb-2">Processing</h4>
            <p className="text-2xl font-bold text-[#3D1560]">{formatCurrency(financialSummary.pendingEarnings)}</p>
            <p className="text-xs text-[#3D1560] opacity-80 mt-1">2-3 business days</p>
          </div>
          <div className="bg-[#F8F8FA] p-4 rounded-lg border border-[#CDCED8]">
            <h4 className="text-sm font-medium text-[#70727F] mb-2">Future Earnings</h4>
            <p className="text-2xl font-bold text-[#383A47]">{formatCurrency(1250)}</p>
            <p className="text-xs text-[#70727F] mt-1">Est. next week</p>
          </div>
        </div>
      </div>

      {/* Banking Configuration */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Banking Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-[#F8F8FA] p-4 rounded-lg border border-[#E8E9ED]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#383A47]">Primary Account</h4>
              <button className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium">
                Update
              </button>
            </div>
            <p className="text-sm text-[#70727F] mb-2">Chase Bank</p>
            <p className="font-mono text-lg">**** **** **** 1234</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#E8F5E9] text-[#4CAF50] rounded-full">
              Active
            </span>
          </div>
          <div className="bg-[#F8F8FA] p-4 rounded-lg border border-[#E8E9ED]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#383A47]">Payout Schedule</h4>
              <button className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium">
                Change
              </button>
            </div>
            <p className="text-sm text-[#70727F] mb-2">Frequency</p>
            <p className="text-lg font-medium">Weekly (Fridays)</p>
            <p className="text-xs text-[#70727F] mt-2">Minimum: $25.00</p>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1B1C20]">Payout History</h3>
          <button className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium">
            Download Statement
          </button>
        </div>
        <div className="space-y-3">
          {mockPayoutRecords.map((payout) => (
            <button
              key={payout.id}
              onClick={() => handlePayoutDetails(payout)}
              className="w-full flex items-center justify-between p-4 border border-[#E8E9ED] rounded-lg hover:bg-[#F8F8FA] transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                </div>
                <div>
                  <p className="font-medium text-[#383A47]">{formatCurrency(payout.amount)}</p>
                  <p className="text-sm text-[#70727F]">{formatDate(payout.initiatedDate)} • {payout.transactionIds[0]}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 text-xs bg-[#E8F5E9] text-[#4CAF50] rounded-full">
                  Completed
                </span>
                <p className="text-xs text-[#70727F] mt-1">to {payout.accountDetails.bankName || payout.accountDetails.email || 'Payment Account'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#70727F]" />
            <input
              type="text"
              placeholder="Search by transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
          <button 
            onClick={handleExportClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E8E9ED] shadow-sm">
        <div className="p-6 border-b border-[#E8E9ED]">
          <h3 className="text-lg font-semibold text-[#1B1C20]">Financial Transaction History</h3>
          <p className="text-sm text-[#70727F] mt-1">Showing {filteredTransactions.length} transactions</p>
        </div>
        <div className="divide-y divide-[#E8E9ED]">
          {filteredTransactions.slice(0, 20).map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-[#F8F8FA] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-[#383A47]">{transaction.transactionId}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? '✅ Completed' : 
                       transaction.status === 'processing' ? '⏳ Processing' : 
                       '⏸️ Pending'}
                    </span>
                    <span className="text-xs text-[#70727F]">
                      {formatDate(transaction.date)} | {transaction.category || 'Product'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-[#70727F]">Revenue: </span>
                      <span className="font-medium text-[#383A47]">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <div>
                      <span className="text-[#70727F]">Net: </span>
                      <span className="font-medium text-[#4CAF50]">{formatCurrency(transaction.netToSeller)}</span>
                    </div>
                    <div>
                      <span className="text-[#70727F]">Fees: </span>
                      <span className="font-medium text-[#DF678C]">
                        {formatCurrency(transaction.platformFee + transaction.paymentProcessingFee + transaction.transactionFee)}
                      </span>
                      <span className="text-xs text-[#70727F] ml-1">
                        ({(((transaction.platformFee + transaction.paymentProcessingFee + transaction.transactionFee) / transaction.amount) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleTransactionDetails(transaction)}
                  className="flex items-center gap-2 text-sm text-[#3D1560] hover:text-[#6D26AB]"
                >
                  <Eye className="w-4 h-4" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTransactions.length > 20 && (
          <div className="p-6 border-t border-[#E8E9ED] text-center">
            <button className="text-[#3D1560] hover:text-[#6D26AB] font-medium">
              Load More Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderTaxTab = () => (
    <div className="space-y-6">
      {/* Tax Summary */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Tax Summary (2023)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-[#F8F8FA] rounded-lg">
            <p className="text-sm text-[#70727F] mb-1">Total Earnings</p>
            <p className="text-xl font-bold text-[#383A47]">{formatCurrency(financialSummary.totalRevenue * 3.2)}</p>
          </div>
          <div className="text-center p-4 bg-[#F8F8FA] rounded-lg">
            <p className="text-sm text-[#70727F] mb-1">Total Fees Paid</p>
            <p className="text-xl font-bold text-[#383A47]">{formatCurrency(financialSummary.totalFees * 3.2)}</p>
          </div>
          <div className="text-center p-4 bg-[#FFE5ED] rounded-lg">
            <p className="text-sm text-[#70727F] mb-1">Est. Tax Liability</p>
            <p className="text-xl font-bold text-[#DF678C]">{formatCurrency(financialSummary.totalRevenue * 3.2 * 0.25)}</p>
            <p className="text-xs text-[#70727F] mt-1">25% rate</p>
          </div>
          <div className="text-center p-4 bg-[#EDD9FF] rounded-lg">
            <p className="text-sm text-[#70727F] mb-1">1099-NEC Status</p>
            <p className="text-sm font-medium text-[#3D1560]">Will be issued</p>
            <p className="text-xs text-[#70727F] mt-1">January 2024</p>
          </div>
        </div>
      </div>

      {/* Tax Documents */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Tax Documents</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-[#E8E9ED] rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#3D1560]" />
              <div>
                <p className="font-medium text-[#383A47]">2023 Annual Statement</p>
                <p className="text-sm text-[#70727F]">Complete year-end tax summary</p>
              </div>
            </div>
            <button 
              onClick={() => handleTaxDocumentClick('2023-annual')}
              className="flex items-center gap-2 text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-[#E8E9ED] rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#3D1560]" />
              <div>
                <p className="font-medium text-[#383A47]">Q4 2023 Quarterly Summary</p>
                <p className="text-sm text-[#70727F]">October - December earnings</p>
              </div>
            </div>
            <button 
              onClick={() => handleTaxDocumentClick('q4-2023')}
              className="flex items-center gap-2 text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-[#E8E9ED] rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#70727F]" />
              <div>
                <p className="font-medium text-[#383A47]">Monthly Revenue Reports</p>
                <p className="text-sm text-[#70727F]">Generate custom reports</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium">
              <RefreshCw className="w-4 h-4" />
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-[#FFFFFF] p-6 rounded-lg border border-[#E8E9ED] shadow-sm">
        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Compliance Status</h3>
        <div className="space-y-4">
          <button 
            onClick={() => handleComplianceClick('Tax ID Verification', 'Complete')}
            className="w-full flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg hover:bg-[#E0F2E0] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
              <span className="text-[#383A47]">Tax ID Verification</span>
            </div>
            <span className="text-sm font-medium text-[#4CAF50]">Complete</span>
          </button>
          
          <button 
            onClick={() => handleComplianceClick('Banking Verification', 'Complete')}
            className="w-full flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg hover:bg-[#E0F2E0] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
              <span className="text-[#383A47]">Banking Verification</span>
            </div>
            <span className="text-sm font-medium text-[#4CAF50]">Complete</span>
          </button>
          
          <div className="flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
              <span className="text-[#383A47]">Identity Verification</span>
            </div>
            <span className="text-sm font-medium text-[#4CAF50]">Complete</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#FFF8DD] rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#DAA520]" />
              <span className="text-[#383A47]">Business License</span>
            </div>
            <span className="text-sm font-medium text-[#DAA520]">Optional (Recommended)</span>
          </div>
        </div>
      </div>
    </div>
  );



  // Modal Components
  const TransactionDetailsModal = () => {
    if (!transactionModal.isOpen || !transactionModal.transaction) return null;

    const transaction = transactionModal.transaction;
    const customerName = formatCustomerName(`Customer ${transaction.id.slice(-3)}`);
    const totalFees = transaction.fees.platformFee + transaction.fees.paymentProcessing + transaction.fees.transactionFee + transaction.fees.withdrawalFee;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-[#E8E9ED]">
            <h2 className="text-xl font-semibold text-[#1B1C20]">Transaction Details</h2>
            <button 
              onClick={() => setTransactionModal({ isOpen: false, transaction: null })}
              className="text-[#70727F] hover:text-[#3D1560] p-1 rounded-full hover:bg-[#F8F8FA]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-[#383A47] mb-3">Transaction #{transaction.transactionId}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#70727F]">Date:</span>
                  <p className="font-medium text-[#383A47]">{formatDate(transaction.date)}</p>
                </div>
                <div>
                  <span className="text-[#70727F]">Service:</span>
                  <p className="font-medium text-[#383A47]">{transaction.serviceCategory || 'Product Sale'}</p>
                </div>
                <div>
                  <span className="text-[#70727F]">Customer:</span>
                  <p className="font-medium text-[#383A47]">{customerName}</p>
                </div>
                <div>
                  <span className="text-[#70727F]">Customer ID:</span>
                  <p className="font-medium text-[#383A47]">CM{transaction.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-[#F8F8FA] p-4 rounded-lg">
              <h4 className="font-medium text-[#383A47] mb-3">Financial Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Gross Revenue:</span>
                  <span className="font-medium text-[#383A47]">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Platform Fee (2.5%):</span>
                  <span className="text-[#DF678C]">-{formatCurrency(transaction.fees.platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Payment Processing:</span>
                  <span className="text-[#DF678C]">-{formatCurrency(transaction.fees.paymentProcessing)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Transaction Fee:</span>
                  <span className="text-[#DF678C]">-{formatCurrency(transaction.fees.transactionFee)}</span>
                </div>
                <div className="border-t border-[#CDCED8] pt-2 flex justify-between font-medium">
                  <span className="text-[#383A47]">Your Net Earnings:</span>
                  <span className="text-[#4CAF50]">{formatCurrency(transaction.netEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Payout Status */}
            <div>
              <h4 className="font-medium text-[#383A47] mb-3">Payout Status</h4>
              <div className="flex items-center gap-3 p-3 bg-[#E8F5E9] rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
                <div>
                  <p className="font-medium text-[#4CAF50]">
                    {transaction.status === 'completed' ? 'Payment Received' : 'Payment Processing'}
                  </p>
                  <p className="text-sm text-[#4CAF50] opacity-80">
                    Available for withdrawal after service completion
                  </p>
                </div>
              </div>
            </div>

            {/* Service Completion */}
            <div>
              <h4 className="font-medium text-[#383A47] mb-3">Service Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#70727F]">Status:</span>
                  <p className="font-medium text-[#383A47] capitalize">{transaction.status}</p>
                </div>
                <div>
                  <span className="text-[#70727F]">Type:</span>
                  <p className="font-medium text-[#383A47]">{transaction.type === 'service' ? 'Service Booking' : 'Product Sale'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E8E9ED]">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors">
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#3D1560] text-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors">
                <ExternalLink className="w-4 h-4" />
                View Full Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WithdrawalModal = () => {
    if (!withdrawalModal.isOpen) return null;

    const fees = {
      standard: 0,
      express: 1.00,
      instant: 3.00
    };

    const handleMethodChange = (method: 'standard' | 'express' | 'instant') => {
      setWithdrawalModal({ ...withdrawalModal, method });
    };

    const handleConfirmWithdrawal = () => {
      setWithdrawalModal({ ...withdrawalModal, step: 'processing' });
      // Simulate processing
      setTimeout(() => {
        setWithdrawalModal({ ...withdrawalModal, step: 'complete' });
      }, 2000);
    };

    const handleClose = () => {
      setWithdrawalModal({ isOpen: false, step: 'select', amount: '', method: 'standard' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex items-center justify-between p-6 border-b border-[#E8E9ED]">
            <h2 className="text-xl font-semibold text-[#1B1C20]">
              {withdrawalModal.step === 'select' && 'Withdraw Funds'}
              {withdrawalModal.step === 'confirm' && 'Confirm Withdrawal'}
              {withdrawalModal.step === 'processing' && 'Processing...'}
              {withdrawalModal.step === 'complete' && 'Withdrawal Complete'}
            </h2>
            <button 
              onClick={handleClose}
              className="text-[#70727F] hover:text-[#3D1560] p-1 rounded-full hover:bg-[#F8F8FA]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {withdrawalModal.step === 'select' && (
              <div className="space-y-6">
                <div className="text-center p-4 bg-[#E8F5E9] rounded-lg">
                  <p className="text-sm text-[#70727F] mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-[#4CAF50]">{formatCurrency(financialSummary.availableForWithdrawal)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#383A47] mb-2">Withdrawal Method</label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F8F8FA]">
                      <input 
                        type="radio" 
                        name="withdrawalMethod" 
                        value="standard"
                        checked={withdrawalModal.method === 'standard'}
                        onChange={() => handleMethodChange('standard')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#383A47]">Standard Transfer (Free)</p>
                        <p className="text-sm text-[#70727F]">2-3 business days • No fees</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F8F8FA]">
                      <input 
                        type="radio" 
                        name="withdrawalMethod" 
                        value="express"
                        checked={withdrawalModal.method === 'express'}
                        onChange={() => handleMethodChange('express')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#383A47]">Express Transfer ($1.00 fee)</p>
                        <p className="text-sm text-[#70727F]">Same business day • Available until 3:00 PM EST</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F8F8FA]">
                      <input 
                        type="radio" 
                        name="withdrawalMethod" 
                        value="instant"
                        checked={withdrawalModal.method === 'instant'}
                        onChange={() => handleMethodChange('instant')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#383A47]">Instant Transfer ($3.00 fee)</p>
                        <p className="text-sm text-[#70727F]">Within 30 minutes • Available 24/7</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#383A47] mb-2">Withdrawal Amount</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={withdrawalModal.amount}
                      onChange={(e) => setWithdrawalModal({ ...withdrawalModal, amount: e.target.value })}
                      className="w-full px-3 py-2 pr-16 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                    />
                    <button 
                      onClick={() => setWithdrawalModal({ ...withdrawalModal, amount: financialSummary.availableForWithdrawal.toString() })}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs text-[#70727F] mt-1">Minimum: $25.00</p>
                </div>

                <div className="bg-[#F8F8FA] p-4 rounded-lg">
                  <h4 className="font-medium text-[#383A47] mb-2">Destination Account</h4>
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-[#3D1560]" />
                    <div>
                      <p className="font-medium text-[#383A47]">Chase Bank ****1234</p>
                      <p className="text-sm text-[#70727F]">John Smith</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8F8FA] p-4 rounded-lg">
                  <h4 className="font-medium text-[#383A47] mb-2">Withdrawal Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Amount:</span>
                      <span className="text-[#383A47]">{formatCurrency(parseFloat(withdrawalModal.amount) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Fee:</span>
                      <span className="text-[#383A47]">{formatCurrency(fees[withdrawalModal.method])}</span>
                    </div>
                    <div className="border-t border-[#CDCED8] pt-2 flex justify-between font-medium">
                      <span className="text-[#383A47]">You'll Receive:</span>
                      <span className="text-[#4CAF50]">{formatCurrency((parseFloat(withdrawalModal.amount) || 0) - fees[withdrawalModal.method])}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-[#CDCED8] text-[#70727F] rounded-lg hover:bg-[#F8F8FA] transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setWithdrawalModal({ ...withdrawalModal, step: 'confirm' })}
                    className="flex-1 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {withdrawalModal.step === 'confirm' && (
              <div className="space-y-6">
                <div className="text-center p-6 bg-[#F8F8FA] rounded-lg">
                  <p className="text-lg font-medium text-[#383A47] mb-2">Confirm Withdrawal</p>
                  <p className="text-2xl font-bold text-[#3D1560]">{formatCurrency((parseFloat(withdrawalModal.amount) || 0) - fees[withdrawalModal.method])}</p>
                  <p className="text-sm text-[#70727F] mt-1">to Chase Bank ****1234</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Transfer Method:</span>
                    <span className="text-[#383A47] capitalize">{withdrawalModal.method} Transfer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Estimated Arrival:</span>
                    <span className="text-[#383A47]">
                      {withdrawalModal.method === 'standard' && 'March 25, 2024'}
                      {withdrawalModal.method === 'express' && 'Today by 6:00 PM'}
                      {withdrawalModal.method === 'instant' && 'Within 30 minutes'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setWithdrawalModal({ ...withdrawalModal, step: 'select' })}
                    className="flex-1 px-4 py-2 border border-[#CDCED8] text-[#70727F] rounded-lg hover:bg-[#F8F8FA] transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleConfirmWithdrawal}
                    className="flex-1 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </div>
            )}

            {withdrawalModal.step === 'processing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-[#3D1560] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-medium text-[#383A47] mb-2">Processing Withdrawal</p>
                <p className="text-sm text-[#70727F]">Please wait while we process your request...</p>
              </div>
            )}

            {withdrawalModal.step === 'complete' && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-[#4CAF50] mx-auto mb-4" />
                <p className="text-lg font-medium text-[#4CAF50] mb-2">Withdrawal Successful!</p>
                <p className="text-sm text-[#70727F] mb-6">Your funds are on the way to your account.</p>
                <button 
                  onClick={handleClose}
                  className="px-6 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ExportModal = () => {
    if (!exportModal.isOpen) return null;

    const handleToggleTransactionType = (type: string) => {
      const newTypes = exportModal.transactionTypes.includes(type)
        ? exportModal.transactionTypes.filter(t => t !== type)
        : [...exportModal.transactionTypes, type];
      setExportModal({ ...exportModal, transactionTypes: newTypes });
    };

    const handleToggleColumn = (column: string) => {
      const newColumns = exportModal.columns.includes(column)
        ? exportModal.columns.filter(c => c !== column)
        : [...exportModal.columns, column];
      setExportModal({ ...exportModal, columns: newColumns });
    };

    const handleExport = () => {
      // Simulate export
      alert(`Exporting ${filteredTransactions.length} transactions as ${exportModal.format.toUpperCase()}...`);
      setExportModal({ ...exportModal, isOpen: false });
    };

    const estimatedRecords = filteredTransactions.filter(t => 
      exportModal.transactionTypes.includes(t.type) &&
      new Date(t.date) >= new Date(exportModal.dateRange.from) &&
      new Date(t.date) <= new Date(exportModal.dateRange.to)
    ).length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-[#E8E9ED]">
            <h2 className="text-xl font-semibold text-[#1B1C20]">Export Transaction Data</h2>
            <button 
              onClick={() => setExportModal({ ...exportModal, isOpen: false })}
              className="text-[#70727F] hover:text-[#3D1560] p-1 rounded-full hover:bg-[#F8F8FA]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-[#383A47] mb-3">Date Range</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#70727F] mb-1">From</label>
                  <input 
                    type="date" 
                    value={exportModal.dateRange.from}
                    onChange={(e) => setExportModal({ 
                      ...exportModal, 
                      dateRange: { ...exportModal.dateRange, from: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#70727F] mb-1">To</label>
                  <input 
                    type="date" 
                    value={exportModal.dateRange.to}
                    onChange={(e) => setExportModal({ 
                      ...exportModal, 
                      dateRange: { ...exportModal.dateRange, to: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-[#CDCED8] rounded-lg focus:ring-2 focus:ring-[#3D1560] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => {
                    const today = new Date();
                    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setExportModal({ 
                      ...exportModal, 
                      dateRange: { 
                        from: thirtyDaysAgo.toISOString().split('T')[0],
                        to: today.toISOString().split('T')[0]
                      }
                    });
                  }}
                  className="px-3 py-1 text-xs bg-[#F8F8FA] text-[#3D1560] rounded-full hover:bg-[#EDD9FF] transition-colors"
                >
                  Last 30 days
                </button>
                <button 
                  onClick={() => {
                    const today = new Date();
                    const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                    setExportModal({ 
                      ...exportModal, 
                      dateRange: { 
                        from: ninetyDaysAgo.toISOString().split('T')[0],
                        to: today.toISOString().split('T')[0]
                      }
                    });
                  }}
                  className="px-3 py-1 text-xs bg-[#F8F8FA] text-[#3D1560] rounded-full hover:bg-[#EDD9FF] transition-colors"
                >
                  Last 90 days
                </button>
              </div>
            </div>

            {/* Transaction Types */}
            <div>
              <label className="block text-sm font-medium text-[#383A47] mb-3">Transaction Types</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'service', label: 'Service Bookings' },
                  { id: 'product', label: 'Product Sales' }
                ].map((type) => (
                  <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={exportModal.transactionTypes.includes(type.id)}
                      onChange={() => handleToggleTransactionType(type.id)}
                      className="rounded border-[#CDCED8] text-[#3D1560] focus:ring-[#3D1560]"
                    />
                    <span className="text-sm text-[#383A47]">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Columns to Include */}
            <div>
              <label className="block text-sm font-medium text-[#383A47] mb-3">Columns to Include</label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { id: 'transactionId', label: 'Transaction ID' },
                  { id: 'date', label: 'Date & Time' },
                  { id: 'customerName', label: 'Customer Name' },
                  { id: 'serviceName', label: 'Service/Product Name' },
                  { id: 'amount', label: 'Gross Amount' },
                  { id: 'platformFee', label: 'Platform Fee' },
                  { id: 'paymentFee', label: 'Payment Processing Fee' },
                  { id: 'netEarnings', label: 'Net Earnings' },
                  { id: 'status', label: 'Status' },
                  { id: 'payoutDate', label: 'Payout Date' }
                ].map((column) => (
                  <label key={column.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={exportModal.columns.includes(column.id)}
                      onChange={() => handleToggleColumn(column.id)}
                      className="rounded border-[#CDCED8] text-[#3D1560] focus:ring-[#3D1560]"
                    />
                    <span className="text-sm text-[#383A47]">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* File Format */}
            <div>
              <label className="block text-sm font-medium text-[#383A47] mb-3">File Format</label>
              <div className="space-y-2">
                {[
                  { id: 'csv', label: 'CSV (Comma Separated)', description: 'Compatible with Excel and most applications' },
                  { id: 'excel', label: 'Excel (.xlsx)', description: 'Native Excel format with formatting' },
                  { id: 'pdf', label: 'PDF Report', description: 'Formatted report for viewing and printing' }
                ].map((format) => (
                  <label key={format.id} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-[#F8F8FA]">
                    <input 
                      type="radio" 
                      name="exportFormat" 
                      value={format.id}
                      checked={exportModal.format === format.id}
                      onChange={() => setExportModal({ ...exportModal, format: format.id as 'csv' | 'excel' | 'pdf' })}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-[#383A47]">{format.label}</p>
                      <p className="text-sm text-[#70727F]">{format.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Summary */}
            <div className="bg-[#F8F8FA] p-4 rounded-lg">
              <h4 className="font-medium text-[#383A47] mb-2">Export Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Estimated Records:</span>
                  <span className="text-[#383A47] font-medium">{estimatedRecords} transactions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">File Format:</span>
                  <span className="text-[#383A47] font-medium">{exportModal.format.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Estimated Size:</span>
                  <span className="text-[#383A47] font-medium">
                    {estimatedRecords < 100 ? '< 1 MB' : 
                     estimatedRecords < 500 ? '1-2 MB' : 
                     estimatedRecords < 1000 ? '2-5 MB' : '5+ MB'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#E8E9ED]">
              <button 
                onClick={() => setExportModal({ ...exportModal, isOpen: false })}
                className="flex-1 px-4 py-2 border border-[#CDCED8] text-[#70727F] rounded-lg hover:bg-[#F8F8FA] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
                disabled={estimatedRecords === 0}
              >
                <Download className="w-4 h-4" />
                Export File
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#1B1C20]">Financial Overview</h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-lg border border-[#E8E9ED] w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'revenue', label: 'Revenue & Earnings', icon: TrendingUp },
              { id: 'payouts', label: 'Payouts & Banking', icon: Wallet },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'tax', label: 'Tax & Compliance', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#3D1560] text-white'
                      : 'text-[#70727F] hover:text-[#3D1560] hover:bg-[#F8F8FA]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Tab Content with optimized width for better readability */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'revenue' && renderRevenueTab()}
          {activeTab === 'payouts' && renderPayoutsTab()}
          {activeTab === 'transactions' && renderTransactionsTab()}
          {activeTab === 'tax' && renderTaxTab()}
        </div>

        {/* Transaction Details Modal */}
        {transactionModal.isOpen && <TransactionDetailsModal />}

        {/* Withdrawal Modal */}
        {withdrawalModal.isOpen && <WithdrawalModal />}

        {/* Export Modal */}
        {exportModal.isOpen && <ExportModal />}


      </div>
    </div>
  );
}

 