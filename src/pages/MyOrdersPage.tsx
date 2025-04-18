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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 ml-6">My Orders</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Order Type Filter */}
            <div className="relative">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'product' | 'service' | 'all')}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="product">Products</option>
                <option value="service">Services</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>

            {/* Timeframe Filter */}
            <div className="relative">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>

            {/* Additional filters button */}
            <button className="inline-flex items-center bg-gray-100 text-gray-800 border border-gray-300 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4 mr-1" />
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
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button 
                className="absolute right-3 top-2.5"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button 
            className={`inline-flex items-center text-sm px-3 py-1.5 rounded-md ${
              sortBy === 'date' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => toggleSort('date')}
          >
            Date
            {sortBy === 'date' && (
              sortOrder === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
            )}
          </button>
          <button 
            className={`inline-flex items-center text-sm px-3 py-1.5 rounded-md ${
              sortBy === 'amount' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => toggleSort('amount')}
          >
            Amount
            {sortBy === 'amount' && (
              sortOrder === 'asc' ? 
                <ArrowUp className="ml-1 h-3 w-3" /> : 
                <ArrowDown className="ml-1 h-3 w-3" />
            )}
          </button>
        </div>
      </div>

      {/* Order list */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try changing your search criteria or browse all orders.
          </p>
          <button 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('all');
              setSelectedTimeframe('all');
              setViewType('all');
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
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
      )}
    </div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Calendar className="h-3 w-3 mr-1" /> },
    processing: { color: 'bg-blue-100 text-blue-800', icon: <RotateCcw className="h-3 w-3 mr-1" /> },
    shipped: { color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-3 w-3 mr-1" /> },
    delivered: { color: 'bg-green-100 text-green-800', icon: <Check className="h-3 w-3 mr-1" /> },
    cancelled: { color: 'bg-red-100 text-red-800', icon: <X className="h-3 w-3 mr-1" /> },
    returned: { color: 'bg-gray-100 text-gray-800', icon: <RotateCcw className="h-3 w-3 mr-1" /> },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
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
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Order header */}
      <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div>
            <span className="text-xs text-gray-500">ORDER #</span>
            <span className="ml-1 text-sm font-medium">{order.id}</span>
          </div>
          <span className="hidden sm:block text-gray-300">|</span>
          <div>
            <span className="text-xs text-gray-500">PLACED ON</span>
            <span className="ml-1 text-sm">{formatDate(order.orderDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <button 
            onClick={onViewDetails}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View Details <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Order content */}
      <div className="px-6 py-4">
        {order.type === 'product' && order.items ? (
          <div className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <div key={item.id} className="flex py-4 first:pt-0 last:pb-0">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.product.name}</h3>
                      <p className="ml-4">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.shortDescription}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-medium text-gray-900">{order.service?.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {order.appointmentDate && `Scheduled for: ${formatDate(order.appointmentDate)}`}
                  {order.location && ` at ${order.location}`}
                </p>
              </div>
              <p className="ml-4 text-base font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="mt-2 text-sm italic text-gray-500">
              Service bookings can be managed in the Services section
            </div>
          </div>
        )}
      </div>

      {/* Order actions */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          {order.actions.includes('track') && (
            <button 
              onClick={onTrack}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Truck className="h-4 w-4 mr-1" />
              Track
            </button>
          )}
          {order.actions.includes('cancel') && (
            <button 
              onClick={onCancel}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          )}
          {order.actions.includes('return') && (
            <button 
              onClick={onReturn}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Return
            </button>
          )}
          {order.actions.includes('review') && (
            <button 
              onClick={onReview}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Review
            </button>
          )}
          {order.actions.includes('reorder') && (
            <button 
              onClick={onReorder}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Package className="h-4 w-4 mr-1" />
              Buy Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 