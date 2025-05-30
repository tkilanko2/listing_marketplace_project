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
  const [serviceFilter, setServiceFilter] = useState<'upcoming' | 'past' | 'all'>('all');
  const [productFilter, setProductFilter] = useState<'buyAgain' | 'notShipped' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

      // Filter by timeframe for products or regular orders
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

      // Additional filter for services based on upcoming/past appointments
      let matchesServiceFilter = true;
      if (viewType === 'service' && order.type === 'service' && order.appointmentDate) {
        const appointmentDate = new Date(order.appointmentDate);
        if (serviceFilter === 'upcoming') {
          matchesServiceFilter = appointmentDate >= now;
        } else if (serviceFilter === 'past') {
          matchesServiceFilter = appointmentDate < now;
        }
      }

      // Additional filter for products based on buy again or not yet shipped
      let matchesProductFilter = true;
      if (viewType === 'product' && order.type === 'product') {
        if (productFilter === 'buyAgain') {
          matchesProductFilter = order.status === 'delivered';
        } else if (productFilter === 'notShipped') {
          matchesProductFilter = order.status === 'pending' || order.status === 'processing';
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesTimeframe && matchesServiceFilter && matchesProductFilter;
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
  }, [searchQuery, selectedStatus, selectedTimeframe, sortBy, sortOrder, viewType, serviceFilter, productFilter]);

  // Pagination calculations
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
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

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-[#F8F8FA] min-h-screen">
      {/* Breadcrumb and Navigation */}
      <div className="mb-6">
        <div className="text-sm text-[#70727F] mb-2">
          <span className="hover:text-[#383A47] cursor-pointer">Home</span> &gt; 
          <span className="hover:text-[#383A47] cursor-pointer">My Account</span> &gt; 
          <span className="text-[#383A47]">Orders & Bookings</span>
      </div>
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <h1 className="text-3xl font-bold text-[#1B1C20] flex-1">My Orders & Bookings</h1>
          <div className="flex gap-2 flex-wrap">
            <button className={`text-sm font-medium px-4 py-2 rounded-lg ${viewType === 'all' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
          onClick={() => setViewType('all')}
        >
          All Orders
        </button>
            <button className={`text-sm font-medium px-4 py-2 rounded-lg ${viewType === 'product' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
          onClick={() => setViewType('product')}
        >
          Products
        </button>
            <button className={`text-sm font-medium px-4 py-2 rounded-lg ${viewType === 'service' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
          onClick={() => setViewType('service')}
        >
          Services
        </button>
            {viewType === 'all' || viewType === 'product' ? (
              <>
                <button className={`text-sm font-medium px-4 py-2 rounded-lg ${productFilter === 'buyAgain' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
                  onClick={() => setProductFilter('buyAgain')}
                >
                  Buy Again
                </button>
                <button className={`text-sm font-medium px-4 py-2 rounded-lg ${productFilter === 'notShipped' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
                  onClick={() => setProductFilter('notShipped')}
                >
                  Not Yet Shipped
                </button>
              </>
            ) : (
              <>
                <button className={`text-sm font-medium px-4 py-2 rounded-lg ${serviceFilter === 'upcoming' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
                  onClick={() => setServiceFilter('upcoming')}
                >
                  Upcoming Appointments
                </button>
                <button className={`text-sm font-medium px-4 py-2 rounded-lg ${serviceFilter === 'past' ? 'bg-[#EDD9FF] text-[#3D1560]' : 'text-[#383A47] hover:bg-[#E8E9ED]'} transition-colors duration-200 shadow-sm`}
                  onClick={() => setServiceFilter('past')}
                >
                  Past Services
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-[#E8E9ED] rounded-xl shadow-md p-6 mb-8 border border-[#CDCED8]">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Search and Timeframe prominent */}
          <div className="flex flex-col sm:flex-row flex-grow gap-4 max-w-md">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search orders & bookings..."
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
                className="appearance-none bg-[#F8F8FA] border border-[#CDCED8] rounded-lg px-5 py-3 pr-10 text-base font-medium text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] shadow-sm"
              >
                <option value="all">All Time</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-[#70727F]" />
            </div>
          </div>
          {/* Collapsible filters for status and more */}
          <div className="flex items-center gap-4 md:justify-end">
            <button 
              className="inline-flex items-center bg-[#E8E9ED] text-[#383A47] border border-[#CDCED8] rounded-lg px-4 py-3 text-base font-medium hover:bg-[#CDCED8] transition-colors duration-200 shadow-sm"
              onClick={() => {/* Toggle filter collapse - logic to be added if needed */}}
            >
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
            {/* Hidden by default on mobile, shown on md+ or when toggled */}
            <div className="hidden md:block">
              <div className="relative min-w-[160px]">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
                  className="appearance-none bg-[#F8F8FA] border border-[#CDCED8] rounded-lg px-5 py-3 pr-10 text-base font-medium text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] shadow-sm"
                >
                  <option value="all">All Statuses</option>
                  {/* Product Statuses */}
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                  {/* Service Statuses */}
                  <option value="requested">Requested</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="no_show">No Show</option>
                  <option value="rescheduled">Rescheduled</option>
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
          Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'item' : 'items'}
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
          {paginatedOrders.map(order => (
            <div 
              key={order.id}
              className={`${
                order.type === 'service' 
                  ? 'bg-gradient-to-r from-[#EBF4FF] to-[#E8E9ED] border-l-4 border-l-[#4299E1]' 
                  : 'bg-gradient-to-r from-[#F8F8FA] to-[#E8E9ED] border-l-4 border-l-[#3D1560]'
              } rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#CDCED8] cursor-pointer hover:bg-opacity-80`}
              onClick={() => onViewOrderDetails(order.id)}
              role="article" 
              aria-label={`${order.type === 'service' ? 'Booking' : 'Order'} ${order.id} details`}
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Enhanced Icon/Image Section */}
                  <div className="flex flex-col items-center gap-2">
                    {order.type === 'product' && order.items && order.items.length > 0 && order.items[0].product.images && order.items[0].product.images.length > 0 ? (
                      <div className="w-16 h-16 bg-[#F8F8FA] rounded-lg flex items-center justify-center overflow-hidden border-2 border-[#3D1560] border-opacity-20" aria-label={`${order.items[0].product.name} image`}>
                        <img 
                          src={order.items[0].product.images[0]} 
                          alt={order.items[0].product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : order.type === 'service' && order.service && order.service.images && order.service.images.length > 0 ? (
                      <div className="w-16 h-16 bg-[#EDD9FF] rounded-lg flex items-center justify-center overflow-hidden border-2 border-[#3D1560] border-opacity-20" aria-label={`${order.service.name} image`}>
                        <img 
                          src={order.service.images[0]} 
                          alt={order.service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center border-2 ${
                        order.type === 'service' 
                          ? 'bg-[#EDD9FF] border-[#3D1560] border-opacity-20' 
                          : 'bg-[#F8F8FA] border-[#3D1560] border-opacity-20'
                      }`}>
                        {order.type === 'service' ? (
                          <Calendar className="w-8 h-8 text-[#3D1560]" />
                        ) : (
                          <Package className="w-8 h-8 text-[#3D1560]" />
                        )}
                      </div>
                    )}
                    {/* Type indicator badge */}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.type === 'service' 
                        ? 'bg-[#3D1560] text-white' 
                        : 'bg-[#3D1560] text-white'
                    }`}>
                      {order.type === 'service' ? 'Service' : 'Product'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    {/* Enhanced Header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-[#1B1C20]">
                        {order.type === 'service' ? 'Booking' : 'Order'} #{order.id}
                      </h3>
                      <StatusBadge status={order.status} />
                      {/* Priority indicator for services */}
                      {order.type === 'service' && order.appointmentDate && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          new Date(order.appointmentDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) 
                            ? 'bg-[#DF678C] text-white' 
                            : 'bg-[#EDD9FF] text-[#6D26AB]'
                        }`}>
                          {new Date(order.appointmentDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000) ? 'Soon' : 'Upcoming'}
                        </span>
                      )}
                    </div>

                    {/* Enhanced Item/Service Details */}
                    <div className="space-y-1">
                      {order.type === 'product' && order.items && order.items.length > 0 && (
                        <>
                          <p className="text-lg font-semibold text-[#383A47]">
                            {order.items[0].product.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                          </p>
                          <p className="text-sm text-[#70727F]">
                            Quantity: {order.items.reduce((total, item) => total + (item.quantity || 1), 0)} items
                          </p>
                        </>
                      )}
                      {order.type === 'service' && order.service && (
                        <>
                          <p className="text-lg font-semibold text-[#383A47]">{order.service.name}</p>
                          <p className="text-sm text-[#70727F]">
                            Duration: {order.service.duration} minutes • Provider: {order.service.provider.username}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Enhanced Date/Time Information */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#70727F]">
                          {order.type === 'service' ? 'Booked' : 'Placed'}:
                        </span>
                        <span className="font-medium text-[#383A47]">{formatDate(order.orderDate)}</span>
                      </div>
                      {order.type === 'service' && order.appointmentDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#3D1560]" />
                          <span className="text-[#3D1560] font-semibold">
                            {formatDateTime(order.appointmentDate)}
                          </span>
                        </div>
                      )}
                      {order.type === 'product' && order.trackingInfo && (
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#6D26AB]" />
                          <span className="text-[#6D26AB] font-medium">
                            {order.trackingInfo.carrier}: {order.trackingInfo.trackingNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions Section */}
                <div className="flex flex-col gap-3 pt-4 md:pt-0 border-t border-[#CDCED8] md:border-0 md:pl-4">
                  {/* Price prominently displayed */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1B1C20]">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-[#70727F]">Total {order.type === 'service' ? 'Cost' : 'Amount'}</p>
                  </div>
                  
                  {/* Action buttons with better grouping */}
                  <div className="flex gap-2 flex-wrap justify-end">
                    {/* Primary action button */}
                    {order.type === 'product' && order.actions && order.actions.some((action: any) => action.type === 'track') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const trackAction = order.actions.find((a: any) => a.type === 'track') as unknown as { type: string; handler?: () => void };
                          if (trackAction && typeof trackAction.handler === 'function') trackAction.handler();
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm"
                      >
                        <Truck className="inline-block h-4 w-4 mr-1" /> Track Package
                      </button>
                    )}
                    
                    {order.type === 'service' && order.actions && order.actions.some((action: any) => action.type === 'reschedule') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const rescheduleAction = order.actions.find((a: any) => a.type === 'reschedule') as unknown as { type: string; handler?: () => void };
                          if (rescheduleAction && typeof rescheduleAction.handler === 'function') rescheduleAction.handler();
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-[#6D26AB] text-[#FFFFFF] hover:bg-[#9B53D9] transition-colors duration-200 shadow-sm"
                      >
                        <Calendar className="inline-block h-4 w-4 mr-1" /> Reschedule
                      </button>
                    )}
                    
                    {/* Secondary actions */}
                    {order.type === 'service' && order.actions && order.actions.some((action: any) => action.type === 'message') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const messageAction = order.actions.find((a: any) => a.type === 'message') as unknown as { type: string; handler?: () => void };
                          if (messageAction && typeof messageAction.handler === 'function') messageAction.handler();
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-[#F8F8FA] text-[#3D1560] border border-[#3D1560] hover:bg-[#3D1560] hover:text-white transition-colors duration-200"
                      >
                        <MessageCircle className="inline-block h-4 w-4 mr-1" /> Message
                      </button>
                    )}
                    
                    {order.actions && order.actions.some((action: any) => action.type === 'review') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const reviewAction = order.actions.find((a: any) => a.type === 'review') as unknown as { type: string; handler?: () => void };
                          if (reviewAction && typeof reviewAction.handler === 'function') reviewAction.handler();
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-[#F8F8FA] text-[#4CAF50] border border-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors duration-200"
                      >
                        <Star className="inline-block h-4 w-4 mr-1" /> Review
                      </button>
                    )}
                  </div>
                  
                  {/* View Details - Always available, styled as secondary */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrderDetails(order.id);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] transition-colors duration-200"
                  >
                    View Full Details
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
              {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' || viewType !== 'all' ? (
                <div className="w-16 h-16 mx-auto mb-4 bg-[#EDD9FF] rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#3D1560]" />
                </div>
              ) : (
                <div className="flex justify-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-[#EDD9FF] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#3D1560]" />
                  </div>
                  <div className="w-12 h-12 bg-[#EDD9FF] rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#3D1560]" />
                  </div>
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-[#1B1C20] mb-2">
              {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' || viewType !== 'all' 
                ? 'No matching results' 
                : 'Ready to get started?'}
            </h3>
            
            <p className="text-[#70727F] mb-6 text-lg">
              {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' || viewType !== 'all' 
                ? 'Try adjusting your filters or search terms to find what you\'re looking for.' 
                : 'Browse our marketplace to discover amazing products and book professional services.'}
            </p>
            
            {searchQuery || selectedStatus !== 'all' || selectedTimeframe !== 'all' || viewType !== 'all' ? (
              <div className="flex gap-3 justify-center">
                <button 
                  className="inline-flex items-center justify-center bg-[#E8E9ED] text-[#383A47] rounded-lg px-6 py-3 font-medium hover:bg-[#CDCED8] transition-colors duration-200 shadow-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('all');
                    setSelectedTimeframe('all');
                    setViewType('all');
                  }}
                >
                  Clear Filters
                </button>
                <button 
                  className="inline-flex items-center justify-center bg-[#3D1560] text-[#FFFFFF] rounded-lg px-6 py-3 font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm"
                  onClick={onBack}
                >
                  Browse Marketplace
                  <ExternalLink className="ml-2 h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3 justify-center">
                <button 
                  className="inline-flex items-center justify-center bg-[#3D1560] text-[#FFFFFF] rounded-lg px-6 py-3 font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm"
                  onClick={onBack}
                >
                  <Package className="mr-2 h-5 w-5" />
                  Shop Products
                </button>
                <button 
                  className="inline-flex items-center justify-center bg-[#4299E1] text-[#FFFFFF] rounded-lg px-6 py-3 font-medium hover:bg-[#3182CE] transition-colors duration-200 shadow-sm"
                  onClick={onBack}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Services
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-2">
          <div className="text-sm text-[#70727F] mb-4 md:mb-0">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} items
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

// Status badge component
function StatusBadge({ status }: { status: OrderStatus }) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
      case 'requested':
        return 'bg-[#E8E9ED] text-[#70727F] border border-[#70727F] border-opacity-30';
      case 'processing':
      case 'in_progress':
        return 'bg-[#EDD9FF] text-[#6D26AB] border border-[#6D26AB] border-opacity-30';
      case 'confirmed':
        return 'bg-[#EDD9FF] text-[#3D1560] border border-[#3D1560] border-opacity-30';
      case 'shipped':
      case 'scheduled':
        return 'bg-[#EDD9FF] text-[#6D26AB] border border-[#6D26AB] border-opacity-30';
      case 'delivered':
      case 'completed':
        return 'bg-[#F8F8FA] text-[#1B1C20] border border-[#CDCED8] border-opacity-30';
      case 'cancelled':
      case 'no_show':
        return 'bg-[#FFE5ED] text-[#DF678C] border border-[#DF678C] border-opacity-30';
      case 'rescheduled':
        return 'bg-[#E8E9ED] text-[#70727F] border border-[#70727F] border-opacity-30';
      default:
        return 'bg-[#CDCED8] text-[#70727F] border border-[#70727F] border-opacity-30';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'requested':
        return 'Awaiting Confirmation';
      case 'processing':
        return 'Processing';
      case 'in_progress':
        return 'Service in Progress';
      case 'confirmed':
        return 'Confirmed';
      case 'scheduled':
        return 'Scheduled';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Service Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'no_show':
        return 'No Show';
      case 'rescheduled':
        return 'Rescheduled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
      case 'requested':
        return '⏳';
      case 'processing':
      case 'in_progress':
        return '🔄';
      case 'confirmed':
      case 'scheduled':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'delivered':
      case 'completed':
        return '✅';
      case 'cancelled':
      case 'no_show':
        return '❌';
      case 'rescheduled':
        return '📅';
      default:
        return '';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor()}`}>
      <span>{getStatusIcon()}</span>
      {getStatusText()}
    </span>
  );
}