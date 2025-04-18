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
  Package, 
  RotateCcw, 
  Search, 
  Truck, 
  X 
} from 'react-feather';
import { mockOrders } from '../mockData';
import { Order, OrderStatus } from '../types';

interface MyOrdersPageProps {
  onBack: () => void;
  onViewOrderDetails: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onReturnOrder: (orderId: string) => void;
  onReviewOrder: (orderId: string) => void;
  onReorderItems: (orderId: string) => void;
}

export function MyOrdersPage({
  onBack,
  onViewOrderDetails,
  onTrackOrder,
  onCancelOrder,
  onReturnOrder,
  onReviewOrder,
  onReorderItems
}: MyOrdersPageProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewType, setViewType] = useState<'product' | 'service' | 'all'>('all');

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    console.log('Total mockOrders:', mockOrders.length);
    const filtered = mockOrders.filter(order => {
      // Filter by search query
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.type === 'product' && order.items?.some(item => 
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (order.type === 'service' && order.service?.name.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by status
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

      // Filter by view type
      const matchesType = viewType === 'all' || order.type === viewType;

      // Filter by timeframe
      let matchesTimeframe = true;
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      
      switch (selectedTimeframe) {
        case 'last-month':
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          matchesTimeframe = orderDate >= oneMonthAgo;
          break;
        case 'last-3-months':
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          matchesTimeframe = orderDate >= threeMonthsAgo;
          break;
        case 'last-6-months':
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          matchesTimeframe = orderDate >= sixMonthsAgo;
          break;
        default:
          matchesTimeframe = true;
      }

      return matchesSearch && matchesStatus && matchesType && matchesTimeframe;
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
    console.log('Filtered orders:', filtered.length);
    return filtered;
  }, [searchQuery, selectedStatus, selectedTimeframe, sortBy, sortOrder, viewType]);

  // Toggle sort order
  const toggleSort = (sortType: 'date' | 'amount') => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortType);
      setSortOrder('desc');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-[#F8F8FA] min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-[#DF678C] hover:text-[#D84773] transition-colors duration-200"
        >
          <ChevronLeft className="w-6 h-6 mr-1" />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-3xl font-bold text-[#1B1C20] ml-8">My Orders</h1>
      </div>

      {/* Tabs for Order Type */}
      <div className="flex border-b border-[#CDCED8] mb-8">
        <button
          onClick={() => setViewType('all')}
          className={`px-6 py-3 text-base font-medium border-b-2 -mb-0.5 rounded-t-md transition-colors duration-200 ${
            viewType === 'all' 
              ? 'border-[#DF678C] text-[#DF678C]' 
              : 'border-transparent text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED]'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setViewType('product')}
          className={`px-6 py-3 text-base font-medium border-b-2 -mb-0.5 rounded-t-md transition-colors duration-200 ${
            viewType === 'product' 
              ? 'border-[#DF678C] text-[#DF678C]' 
              : 'border-transparent text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED]'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setViewType('service')}
          className={`px-6 py-3 text-base font-medium border-b-2 -mb-0.5 rounded-t-md transition-colors duration-200 ${
            viewType === 'service' 
              ? 'border-[#DF678C] text-[#DF678C]' 
              : 'border-transparent text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED]'
          }`}
        >
          Services
        </button>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-[#E8E9ED] rounded-xl shadow-md p-6 mb-8 border border-[#CDCED8]">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
                className="appearance-none bg-[#F8F8FA] border border-[#CDCED8] rounded-lg px-5 py-3 pr-10 text-base font-medium text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#DF678C] focus:border-[#DF678C] shadow-sm"
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

            {/* Timeframe Filter */}
            <div className="relative min-w-[160px]">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="appearance-none bg-[#F8F8FA] border border-[#CDCED8] rounded-lg px-5 py-3 pr-10 text-base font-medium text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#DF678C] focus:border-[#DF678C] shadow-sm"
              >
                <option value="all">All Time</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-[#70727F]" />
            </div>

            {/* Additional filters button */}
            <button className="inline-flex items-center bg-[#E8E9ED] text-[#383A47] border border-[#CDCED8] rounded-lg px-4 py-3 text-base font-medium hover:bg-[#CDCED8] transition-colors duration-200 shadow-sm">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-[#CDCED8] rounded-lg pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#DF678C] focus:border-[#DF678C] shadow-sm text-base text-[#383A47] bg-[#F8F8FA]"
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
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="text-base text-[#70727F] font-medium">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-[#70727F] font-medium">Sort by:</span>
          <button 
            className={`inline-flex items-center text-base px-4 py-2 rounded-lg shadow-sm ${
              sortBy === 'date' ? 'bg-[#FFE5ED] text-[#DF678C] font-medium' : 'text-[#383A47] hover:bg-[#E8E9ED]'
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
              sortBy === 'amount' ? 'bg-[#FFE5ED] text-[#DF678C] font-medium' : 'text-[#383A47] hover:bg-[#E8E9ED]'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredOrders.map(order => (
            <OrderCard 
              key={order.id}
              order={order}
              onViewDetails={() => onViewOrderDetails(order.id)}
              onTrack={() => onTrackOrder(order.id)}
              onCancel={() => onCancelOrder(order.id)}
              onReturn={() => onReturnOrder(order.id)}
              onReview={() => onReviewOrder(order.id)}
              onReorder={() => onReorderItems(order.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#E8E9ED] rounded-xl p-10 text-center shadow-sm border border-[#CDCED8] animate-fade-in">
          <h3 className="text-xl font-medium text-[#383A47]">No orders found</h3>
          <p className="text-[#70727F] mt-2 mb-6">
            {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' || viewType !== 'all' 
              ? 'Try adjusting your filters or search terms.' 
              : 'You haven\'t placed any orders yet.'}
          </p>
          <button 
            className="inline-flex items-center justify-center bg-[#DF678C] text-[#FFFFFF] rounded-lg px-6 py-3 font-medium hover:bg-[#D84773] transition-colors duration-200 shadow-sm"
            onClick={onBack}
          >
            Browse Products & Services
            <ExternalLink className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: OrderStatus }) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-[#FFE5ED] text-[#DF678C]';
      case 'processing':
        return 'bg-[#EDD9FF] text-[#3D1560]';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
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
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
}

// Order card component
function OrderCard({ 
  order, 
  onViewDetails,
  onTrack,
  onCancel,
  onReturn,
  onReview,
  onReorder
}: { 
  order: Order,
  onViewDetails: () => void,
  onTrack: () => void,
  onCancel: () => void,
  onReturn: () => void,
  onReview: () => void,
  onReorder: () => void,
}) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if 'View Details' or similar action already exists in order.actions to avoid duplication
  const hasViewDetailsAction = order.actions && order.actions.some((action: any) => action.label.toLowerCase().includes('view') || action.label.toLowerCase().includes('details'));

  return (
    <div className="bg-[#E8E9ED] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-[#CDCED8]" role="article" aria-label={`Order ${order.id} details`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#1B1C20]">Order #{order.id}</h3>
            <p className="text-sm text-[#70727F]">Placed on {formatDate(order.orderDate)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {order.type === 'product' && order.items && order.items.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-[#383A47] mb-2">
              <Package className="h-5 w-5 mr-2 text-[#DF678C]" />
              <span className="text-base font-medium">Product Order</span>
            </div>
            <div className="flex items-center mt-2">
              {order.items[0].product.images && order.items[0].product.images.length > 0 && (
                <div className="w-16 h-16 bg-[#F8F8FA] rounded-lg flex items-center justify-center overflow-hidden mr-3 border border-[#CDCED8]" aria-label={`${order.items[0].product.name} image`}>
                  <img 
                    src={order.items[0].product.images[0]} 
                    alt={order.items[0].product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-[#70727F]">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
                <p className="text-sm font-medium text-[#383A47]">
                  {order.items[0].product.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                </p>
                {/* Placeholder for delivery info if available */}
                <p className="text-sm text-[#70727F]">
                  {order.status === 'shipped' || order.status === 'delivered' ? 'Shipped' : 'Delivery info unavailable'}
                </p>
              </div>
            </div>
          </div>
        )}

        {order.type === 'service' && order.service && (
          <div className="mb-4">
            <div className="flex items-center text-[#383A47] mb-2">
              <Calendar className="h-5 w-5 mr-2 text-[#DF678C]" />
              <span className="text-base font-medium">Service Booking</span>
            </div>
            <div className="flex items-center mt-2">
              {order.service.images && order.service.images.length > 0 && (
                <div className="w-16 h-16 bg-[#F8F8FA] rounded-lg flex items-center justify-center overflow-hidden mr-3 border border-[#CDCED8]" aria-label={`${order.service.name} image`}>
                  <img 
                    src={order.service.images[0]} 
                    alt={order.service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-[#70727F]">{order.service.name}</p>
                {order.appointmentDate && (
                  <p className="text-sm font-medium text-[#DF678C]">
                    Appointment: {formatDate(order.appointmentDate)}
                  </p>
                )}
                <p className="text-sm text-[#70727F]">
                  Provider: {order.service.provider?.username || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-5">
          <p className="text-base font-medium text-[#383A47]">Total: ${order.totalAmount.toFixed(2)}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {order.actions && order.actions.map((action: any, index: number) => {
            const isPrimary = action.type === 'track' || action.type === 'review';
            const isCritical = action.type === 'cancel';
            return (
              <button
                key={index}
                onClick={action.handler}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm ${
                  isCritical
                    ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                    : isPrimary 
                      ? 'bg-[#DF678C] text-[#FFFFFF] hover:bg-[#D84773]'
                      : 'bg-[#F8F8FA] text-[#383A47] hover:bg-[#E8E9ED] border border-[#CDCED8]'
                }`}
              >
                {action.type === 'track' && <Truck className="inline-block h-4 w-4 mr-1" />}
                {action.type === 'review' && <Check className="inline-block h-4 w-4 mr-1" />}
                {action.type === 'reorder' && <RotateCcw className="inline-block h-4 w-4 mr-1" />}
                {action.label}
              </button>
            );
          })}
          {!hasViewDetailsAction && (
            <button
              onClick={onViewDetails}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F8F8FA] text-[#383A47] hover:bg-[#E8E9ED] border border-[#CDCED8] transition-colors duration-200 shadow-sm"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}