import React, { useState, useMemo } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  Check, 
  ChevronDown, 
  ChevronLeft, 
  ExternalLink, 
  Filter, 
  MessageCircle, 
  Package, 
  RotateCcw, 
  Search, 
  Star, 
  Truck, 
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Clipboard
} from 'react-feather';
import { getAllOrdersWithBookings } from '../mockData';
import { Order, OrderStatus } from '../types';

interface SellerOrdersPageProps {
  onBack: () => void;
  onViewOrderDetails?: (orderId: string) => void;
}

// Mock current seller ID - in real app this would come from auth context
const CURRENT_SELLER_ID = 'SELLER001';

export function SellerOrdersPage({ onBack, onViewOrderDetails }: SellerOrdersPageProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter orders to show only those for current seller's products
  const filteredOrders = useMemo(() => {
    const allOrders = getAllOrdersWithBookings();
    console.log('Total orders:', allOrders.length);
    
    const sellerOrders = allOrders.filter(order => 
      order.type === 'product' && 
      order.items && 
      order.items.some((item: any) => item.product.seller.id === CURRENT_SELLER_ID)
    );
    
    console.log('Seller orders:', sellerOrders.length);
    
    const filtered = sellerOrders.filter(order => {
      // Filter by search query
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.items?.some((item: any) => 
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        // Search by customer name - we'll simulate this
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

      // Filter by timeframe
      let matchesTimeframe = true;
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      
      switch (selectedTimeframe) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          matchesTimeframe = orderDate >= today;
          break;
        case 'this-week':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesTimeframe = orderDate >= oneWeekAgo;
          break;
        case 'this-month':
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          matchesTimeframe = orderDate >= oneMonthAgo;
          break;
        case 'last-3-months':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          matchesTimeframe = orderDate >= threeMonthsAgo;
          break;
        default:
          matchesTimeframe = true;
      }

      return matchesSearch && matchesStatus && matchesTimeframe;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.orderDate.getTime() - b.orderDate.getTime()
          : b.orderDate.getTime() - a.orderDate.getTime();
      } else {
        return sortOrder === 'asc'
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      }
    });
    
    console.log('Filtered seller orders:', filtered.length);
    return filtered;
  }, [searchQuery, selectedStatus, selectedTimeframe, sortBy, sortOrder]);

  // Pagination calculations
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Toggle sort order
  const toggleSort = (sortType: 'date' | 'amount') => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortType);
      setSortOrder('desc');
    }
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Seller-specific action handlers
  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // In real app, this would make an API call
  };

  const handleAddTracking = (orderId: string) => {
    console.log(`Adding tracking for order ${orderId}`);
    // In real app, this would open a modal for tracking info
  };

  const handleContactCustomer = (orderId: string) => {
    console.log(`Contacting customer for order ${orderId}`);
    // In real app, this would open messaging interface
  };

  const handleBulkStatusUpdate = (newStatus: OrderStatus) => {
    console.log(`Bulk updating ${selectedOrders.length} orders to status: ${newStatus}`);
    setSelectedOrders([]);
    setShowBulkActions(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate mock customer name based on order ID
  const getCustomerName = (orderId: string) => {
    const names = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Davis', 'Robert Wilson', 'Lisa Anderson', 'David Miller', 'Jennifer Taylor'];
    const index = orderId.charCodeAt(orderId.length - 1) % names.length;
    return names[index];
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-[#F8F8FA] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="text-sm text-[#70727F] mb-2">
          <span className="hover:text-[#383A47] cursor-pointer">Dashboard</span> &gt; 
          <span className="text-[#383A47]">Orders Management</span>
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1B1C20] flex-1">
            Orders <span className="text-[#70727F] font-medium">(Products)</span>
          </h1>
          <div className="flex gap-2 flex-wrap">
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#383A47] bg-[#EDD9FF] px-3 py-2 rounded-lg">
                  {selectedOrders.length} selected
                </span>
                <button 
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-[#3D1560] text-white hover:bg-[#6D26AB] transition-colors duration-200"
                >
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions Dropdown */}
        {showBulkActions && selectedOrders.length > 0 && (
          <div className="mb-4 bg-white rounded-lg shadow-md p-4 border border-[#CDCED8]">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-3">Bulk Actions</h3>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => handleBulkStatusUpdate('processing')}
                className="px-3 py-2 text-sm rounded-lg bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors"
              >
                Mark as Processing
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate('shipped')}
                className="px-3 py-2 text-sm rounded-lg bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors"
              >
                Mark as Shipped
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate('delivered')}
                className="px-3 py-2 text-sm rounded-lg bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors"
              >
                Mark as Delivered
              </button>
              <button 
                onClick={() => {setSelectedOrders([]); setShowBulkActions(false);}}
                className="px-3 py-2 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                Cancel Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search Section */}
      <div className="bg-[#E8E9ED] rounded-xl shadow-md p-6 mb-8 border border-[#CDCED8]">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Search and Timeframe */}
          <div className="flex flex-col sm:flex-row flex-grow gap-4 max-w-md">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#CDCED8] rounded-lg pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] shadow-sm text-base text-[#383A47] bg-[#F8F8FA]"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#70727F]" />
              {searchQuery && (
                <button 
                  className="absolute right-4 top-3.5"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5 text-[#70727F] hover:text-[#383A47] transition-colors duration-200" />
                </button>
              )}
            </div>
            
            <div className="relative min-w-[160px]">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="appearance-none bg-[#F8F8FA] border border-[#CDCED8] rounded-lg px-5 py-3 pr-10 text-base font-medium text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] shadow-sm w-full"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-3-months">Last 3 Months</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-[#70727F]" />
            </div>
          </div>

          <div className="flex items-center gap-4 md:justify-end">
            <button 
              className="inline-flex items-center bg-[#E8E9ED] text-[#383A47] border border-[#CDCED8] rounded-lg px-4 py-3 text-base font-medium hover:bg-[#CDCED8] transition-colors duration-200 shadow-sm"
              onClick={() => {/* Toggle filter collapse */}}
            >
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
            <div className="hidden md:block">
              <div className="relative min-w-[160px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
                  className="appearance-none bg-[#F8F8FA] border border-[#CDCED8] rounded-lg px-5 py-3 pr-10 text-base font-medium text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] shadow-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-[#70727F]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-base text-[#70727F] font-medium">
          Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-[#70727F] font-medium">Sort by:</span>
          <button 
            className={`inline-flex items-center text-base px-4 py-2 rounded-lg shadow-sm ${
              sortBy === 'date' ? 'bg-[#EDD9FF] text-[#3D1560] font-medium' : 'text-[#383A47] hover:bg-[#E8E9ED]'
            }`}
            onClick={() => toggleSort('date')}
          >
            Date
            {sortBy === 'date' && (
              sortOrder === 'asc' ? 
                <ArrowUp className="ml-2 h-4 w-4" /> : 
                <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </button>
          <button 
            className={`inline-flex items-center text-base px-4 py-2 rounded-lg shadow-sm ${
              sortBy === 'amount' ? 'bg-[#EDD9FF] text-[#3D1560] font-medium' : 'text-[#383A47] hover:bg-[#E8E9ED]'
            }`}
            onClick={() => toggleSort('amount')}
          >
            Amount
            {sortBy === 'amount' && (
              sortOrder === 'asc' ? 
                <ArrowUp className="ml-2 h-4 w-4" /> : 
                <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Orders Grid or Empty State */}
      {filteredOrders.length > 0 ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Select All Header */}
          <div className="bg-[#E8E9ED] rounded-lg p-4 border border-[#CDCED8]">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-[#3D1560] focus:ring-[#3D1560] border-[#CDCED8] rounded"
              />
              <span className="ml-2 text-sm font-medium text-[#383A47]">
                Select All ({paginatedOrders.length} orders)
              </span>
            </label>
          </div>

          {paginatedOrders.map(order => (
            <div 
              key={order.id}
              className="bg-gradient-to-r from-[#F8F8FA] to-[#E8E9ED] border-l-4 border-l-[#3D1560] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#CDCED8] cursor-pointer"
              onClick={() => onViewOrderDetails?.(order.id)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {/* Selection Checkbox */}
                  <label className="flex items-center cursor-pointer mt-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-[#3D1560] focus:ring-[#3D1560] border-[#CDCED8] rounded"
                    />
                  </label>

                  {/* Product Image */}
                  <div className="flex flex-col items-center gap-2">
                    {order.items && order.items.length > 0 && order.items[0].product.images && order.items[0].product.images.length > 0 ? (
                      <div className="w-16 h-16 bg-[#F8F8FA] rounded-lg flex items-center justify-center overflow-hidden border-2 border-[#3D1560] border-opacity-20">
                        <img 
                          src={order.items[0].product.images[0]} 
                          alt={order.items[0].product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-[#EDD9FF] rounded-lg flex items-center justify-center border-2 border-[#3D1560] border-opacity-20">
                        <Package className="w-8 h-8 text-[#3D1560]" />
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="flex flex-col gap-2 flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-[#1B1C20]">
                        Order #{order.id}
                      </h3>
                      <SellerStatusBadge status={order.status} />
                      <span className="text-sm font-bold text-[#3D1560]">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Product & Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ShoppingBag className="w-4 h-4 text-[#3D1560]" />
                          <span className="font-medium text-[#383A47]">
                            {order.items?.[0]?.product.name || 'Product'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#70727F]">Qty:</span>
                          <span className="font-medium text-[#383A47]">
                            {order.items?.[0]?.quantity || 1}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-[#3D1560]" />
                          <span className="font-medium text-[#383A47]">
                            {getCustomerName(order.id)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#70727F]">Ordered:</span>
                          <span className="font-medium text-[#383A47]">
                            {formatDate(order.orderDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                      {order.trackingInfo && (
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#6D26AB]" />
                          <span className="text-[#6D26AB] font-medium">
                            {order.trackingInfo.carrier}: {order.trackingInfo.trackingNumber}
                          </span>
                        </div>
                      )}
                      {order.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#70727F]" />
                          <span className="text-[#70727F]">
                            {order.location.substring(0, 30)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#CDCED8]" onClick={(e) => e.stopPropagation()}>
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, 'processing');
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-[#3D1560] text-white hover:bg-[#6D26AB] transition-colors duration-200"
                      >
                        <CheckCircle className="inline-block h-4 w-4 mr-1" /> Accept Order
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, 'cancelled');
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      >
                        <X className="inline-block h-4 w-4 mr-1" /> Decline
                      </button>
                    </>
                  )}
                  
                  {order.status === 'processing' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTracking(order.id);
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-[#3D1560] text-white hover:bg-[#6D26AB] transition-colors duration-200"
                      >
                        <Truck className="inline-block h-4 w-4 mr-1" /> Add Tracking
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, 'shipped');
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                      >
                        <Package className="inline-block h-4 w-4 mr-1" /> Mark Shipped
                      </button>
                    </>
                  )}
                  
                  {order.status === 'shipped' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, 'delivered');
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                      >
                        <CheckCircle className="inline-block h-4 w-4 mr-1" /> Mark Delivered
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`View tracking for ${order.id}`);
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors duration-200"
                      >
                        <Eye className="inline-block h-4 w-4 mr-1" /> View Tracking
                      </button>
                    </>
                  )}
                  
                  {(order.status === 'delivered' || order.status === 'completed') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactCustomer(order.id);
                      }}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors duration-200"
                    >
                      <MessageCircle className="inline-block h-4 w-4 mr-1" /> Contact Customer
                    </button>
                  )}
                  
                  {/* Universal Actions */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactCustomer(order.id);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors duration-200"
                  >
                    <MessageCircle className="inline-block h-4 w-4 mr-1" /> Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#F8F8FA] to-[#E8E9ED] rounded-xl p-12 text-center shadow-sm border border-[#CDCED8] animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' ? (
                <div className="w-16 h-16 mx-auto mb-4 bg-[#EDD9FF] rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#3D1560]" />
                </div>
              ) : (
                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-[#EDD9FF] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#3D1560]" />
                  </div>
                  <div className="w-12 h-12 bg-[#EDD9FF] rounded-lg flex items-center justify-center">
                    <Clipboard className="w-6 h-6 text-[#3D1560]" />
                  </div>
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-[#1B1C20] mb-2">
              {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' 
                ? 'No matching orders found' 
                : 'No orders yet'}
            </h3>
            
            <p className="text-[#70727F] mb-6 text-lg">
              {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' 
                ? 'Try adjusting your filters or search terms to find what you\'re looking for.' 
                : 'Orders for your products will appear here once customers start purchasing.'}
            </p>
            
            {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' ? (
              <button 
                className="inline-flex items-center justify-center bg-[#E8E9ED] text-[#383A47] rounded-lg px-6 py-3 font-medium hover:bg-[#CDCED8] transition-colors duration-200 shadow-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                  setSelectedTimeframe('all');
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button 
                className="inline-flex items-center justify-center bg-[#3D1560] text-[#FFFFFF] rounded-lg px-6 py-3 font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm"
                onClick={onBack}
              >
                <Package className="mr-2 h-5 w-5" />
                Manage Products
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-2">
          <div className="text-sm text-[#70727F] mb-4 md:mb-0">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} orders
          </div>
          <div className="flex gap-2 flex-wrap justify-center mb-4 md:mb-0">
            <button
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-[#E8E9ED] text-[#CDCED8] cursor-not-allowed' : 'bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8]'} transition-colors duration-200`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page ? 'bg-[#3D1560] text-[#FFFFFF]' : 'bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8]'} transition-colors duration-200`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-[#E8E9ED] text-[#CDCED8] cursor-not-allowed' : 'bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8]'} transition-colors duration-200`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#70727F]">Show:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-[#F8F8FA] border border-[#CDCED8] rounded-md px-2 py-1 text-sm text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560]"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <span className="text-sm text-[#70727F]">per page</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Seller-specific status badge component
function SellerStatusBadge({ status }: { status: OrderStatus }) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending': return 'Awaiting Confirmation';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'returned': return 'Returned';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '🚚';
      case 'delivered':
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      case 'returned': return '↩️';
      default: return '';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor()}`}>
      <span>{getStatusIcon()}</span>
      {getStatusText()}
    </span>
  );
} 