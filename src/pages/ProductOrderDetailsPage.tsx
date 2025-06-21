import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  MessageCircle, 
  CreditCard, 
  Receipt, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCcw,
  Eye,
  RefreshCw,
  FileText,
  Shield,
  Download,
  ExternalLink,
  Circle,
  Clock3,
  CheckCircle2,
  X,
  ShoppingBag,
  Box,
  Calendar,
  Clock,
  Home
} from 'lucide-react';
import { Order } from '../types';
import SellerTermsModal from '../components/SellerTermsModal';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

interface ProductOrderDetailsPageProps {
  order: Order;
  onBack: () => void;
  userRegion?: 'US' | 'EU' | 'UK'; // For tax calculation display
  onNavigateToProduct?: (productId: string) => void; // For buyer navigation to product details
}

interface PaymentBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  taxType: 'Sales Tax' | 'VAT';
  taxRate: number;
  total: number;
}

export function ProductOrderDetailsPage({ order, onBack, userRegion = 'US', onNavigateToProduct }: ProductOrderDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'activity'>('details');
  const [trackingDetailsOpen, setTrackingDetailsOpen] = useState(false);
  const [productTermsOpen, setProductTermsOpen] = useState(false);

  // Calculate payment breakdown based on region
  const calculatePaymentBreakdown = (): PaymentBreakdown => {
    const subtotal = order.items?.reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0) || order.totalAmount * 0.85;
    const shipping = order.totalAmount * 0.05; // Assume 5% shipping
    let taxRate = 0;
    let taxType: 'Sales Tax' | 'VAT' = 'Sales Tax';

    if (userRegion === 'US') {
      taxRate = 0.08; // 8% sales tax
      taxType = 'Sales Tax';
    } else if (userRegion === 'EU' || userRegion === 'UK') {
      taxRate = 0.20; // 20% VAT
      taxType = 'VAT';
    }

    const taxableAmount = subtotal + shipping;
    const tax = taxableAmount * taxRate;

    return {
      subtotal,
      shipping,
      tax,
      taxType,
      taxRate: taxRate * 100,
      total: order.totalAmount
    };
  };

  const paymentBreakdown = calculatePaymentBreakdown();

  const getStatusConfig = () => {
    switch (order.status) {
      case 'pending':
        return {
          color: 'text-[#70727F]', // Secondary text color
          bgColor: 'bg-[#E8E9ED]', // Light background
          borderColor: 'border-[#70727F]',
          icon: Clock3,
          title: 'Order Pending',
          description: 'Order is being processed',
          canCancel: true,
          canTrack: false,
          canReturn: false,
          canReview: false,
          canReorder: false
        };
      case 'processing':
        return {
          color: 'text-[#6D26AB]', // Primary hover
          bgColor: 'bg-[#EDD9FF]', // Primary disabled background
          borderColor: 'border-[#6D26AB]',
          icon: RefreshCw,
          title: 'Processing',
          description: 'Order is being prepared for shipment',
          canCancel: true,
          canTrack: false,
          canReturn: false,
          canReview: false,
          canReorder: false
        };
      case 'shipped':
        return {
          color: 'text-[#3D1560]', // Primary accent
          bgColor: 'bg-[#EDD9FF]', // Primary disabled background
          borderColor: 'border-[#3D1560]',
          icon: Truck,
          title: 'Shipped',
          description: 'Order is on its way to you',
          canCancel: false,
          canTrack: true,
          canReturn: false,
          canReview: false,
          canReorder: false
        };
      case 'delivered':
        return {
          color: 'text-[#1B1C20]', // Header text for completed
          bgColor: 'bg-[#F8F8FA]', // Ultra-light background
          borderColor: 'border-[#CDCED8]',
          icon: CheckCircle2,
          title: 'Delivered',
          description: 'Order has been successfully delivered',
          canCancel: false,
          canTrack: true,
          canReturn: true,
          canReview: true,
          canReorder: true
        };
      case 'cancelled':
        return {
          color: 'text-[#DF678C]', // Secondary accent pink for warnings/errors
          bgColor: 'bg-[#FFE5ED]', // Pink background light
          borderColor: 'border-[#DF678C]',
          icon: XCircle,
          title: 'Cancelled',
          description: 'This order has been cancelled',
          canCancel: false,
          canTrack: false,
          canReturn: false,
          canReview: false,
          canReorder: true
        };
      case 'returned':
        return {
          color: 'text-[#70727F]', // Secondary text
          bgColor: 'bg-[#E8E9ED]', // Light background
          borderColor: 'border-[#70727F]',
          icon: RotateCcw,
          title: 'Returned',
          description: 'Order has been returned and refunded',
          canCancel: false,
          canTrack: false,
          canReturn: false,
          canReview: false,
          canReorder: true
        };
      default:
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#CDCED8]',
          borderColor: 'border-[#70727F]',
          icon: Circle,
          title: 'Unknown Status',
          description: 'Status information unavailable',
          canCancel: false,
          canTrack: false,
          canReturn: false,
          canReview: false,
          canReorder: false
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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

  // Mock activity timeline
  const activityTimeline = [
    {
      id: 1,
      action: 'Order Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: new Date(order.orderDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      icon: CheckCircle,
      status: order.status === 'delivered' ? 'completed' : 'pending'
    },
    {
      id: 2,
      action: 'Out for Delivery',
      description: 'Your order is out for delivery',
      timestamp: new Date(order.orderDate.getTime() + 4 * 24 * 60 * 60 * 1000),
      icon: Truck,
      status: ['delivered', 'shipped'].includes(order.status) ? 'completed' : 'pending'
    },
    {
      id: 3,
      action: 'Order Shipped',
      description: 'Your order has been shipped and is on its way',
      timestamp: new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      icon: Package,
      status: ['delivered', 'shipped'].includes(order.status) ? 'completed' : 'pending'
    },
    {
      id: 4,
      action: 'Order Processing',
      description: 'Your order is being prepared for shipment',
      timestamp: new Date(order.orderDate.getTime() + 60 * 60 * 1000),
      icon: RefreshCw,
      status: ['delivered', 'shipped', 'processing'].includes(order.status) ? 'completed' : 'pending'
    },
    {
      id: 5,
      action: 'Payment Processed',
      description: `Payment of $${order.totalAmount.toFixed(2)} was successfully processed`,
      timestamp: new Date(order.orderDate.getTime() + 30 * 60 * 1000),
      icon: CreditCard,
      status: 'completed'
    },
    {
      id: 6,
      action: 'Order Placed',
      description: 'Order was successfully placed',
      timestamp: order.orderDate,
      icon: ShoppingBag,
      status: 'completed'
    }
  ];

  const handleProductClick = (productId: string) => {
    // Check if product is still active/live
    const product = order.items?.[0]?.product;
    if (product && (product.status === 'active' || !product.status)) {
      // Navigate to product details page (buyer view)
      if (onNavigateToProduct) {
        onNavigateToProduct(productId);
      } else {
        console.log('Navigate to product details:', productId);
      }
    }
  };

  const isProductClickable = (product: any) => {
    return product && (product.status === 'active' || !product.status);
  };

  // Tracking Details Modal Component
  const TrackingDetailsModal = () => {
    if (!trackingDetailsOpen || !order.trackingInfo) return null;

    const trackingEvents = [
      {
        date: new Date(order.orderDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: 'Out for Delivery',
        location: 'Local Delivery Facility',
        description: 'Package is out for delivery'
      },
      {
        date: new Date(order.orderDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'In Transit',
        location: 'Distribution Center',
        description: 'Package is in transit to your city'
      },
      {
        date: new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        status: 'Shipped',
        location: 'Origin Facility',
        description: 'Package has been shipped'
      },
      {
        date: new Date(order.orderDate.getTime() + 60 * 60 * 1000),
        status: 'Processing',
        location: 'Fulfillment Center',
        description: 'Order is being prepared'
      }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tracking Details</h3>
            <button 
              onClick={() => setTrackingDetailsOpen(false)}
              className="text-white hover:text-[#CDCED8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Tracking Number */}
            <div>
              <h4 className="text-lg font-semibold text-[#1B1C20] mb-2">Tracking Information</h4>
              <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-5 h-5 text-[#3D1560]" />
                  <div>
                    <p className="font-medium text-[#1B1C20]">{order.trackingInfo.carrier}</p>
                    <p className="text-sm text-[#70727F]">Tracking #: {order.trackingInfo.trackingNumber}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${statusConfig.bgColor}`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                  <div>
                    <p className={`font-semibold ${statusConfig.color}`}>{statusConfig.title}</p>
                    <p className={`text-sm ${statusConfig.color} opacity-80`}>{statusConfig.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Tracking History</h5>
              <div className="space-y-4">
                {trackingEvents.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-[#3D1560]' : 'bg-[#CDCED8]'
                      }`} />
                      {index < trackingEvents.length - 1 && (
                        <div className="w-0.5 h-8 bg-[#CDCED8] mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-[#1B1C20] text-sm">{event.status}</p>
                      <p className="text-xs text-[#70727F] mb-1">{event.location}</p>
                      <p className="text-xs text-[#70727F]">{formatDateTime(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-[#EDD9FF] rounded-lg p-4 border border-[#3D1560]">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-[#3D1560]" />
                <div>
                  <p className="font-medium text-[#3D1560]">Estimated Delivery</p>
                  <p className="text-sm text-[#3D1560]">
                    {formatDate(new Date(order.orderDate.getTime() + 5 * 24 * 60 * 60 * 1000))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-[#3D1560] hover:text-[#6D26AB] font-medium mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to My Orders
        </button>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1B1C20] mb-2">Order #{order.id}</h1>
            <p className="text-[#70727F] text-lg">
              Placed on {formatDate(order.orderDate)}
            </p>
          </div>
          
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
            <div>
              <p className={`font-semibold ${statusConfig.color}`}>{statusConfig.title}</p>
              <p className={`text-sm ${statusConfig.color} opacity-80`}>{statusConfig.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#CDCED8] p-6">
            <OrderStatusTimeline 
              currentStatus={order.status}
              orderType="product"
              orderDate={order.orderDate}
            />
          </div>

          {/* Status Alert */}
          {order.status === 'shipped' && order.trackingInfo && (
            <div className="bg-[#EDD9FF] border border-[#3D1560] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#3D1560] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#3D1560] mb-1">Package Shipped</h3>
                  <p className="text-sm text-[#3D1560] opacity-80">
                    Your order is on its way! Track with {order.trackingInfo.carrier}: {order.trackingInfo.trackingNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="bg-[#F8F8FA] border border-[#CDCED8] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1B1C20] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#1B1C20] mb-1">Order Delivered</h3>
                  <p className="text-sm text-[#70727F]">
                    Your order was successfully delivered. How was your experience?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#CDCED8]">
            <div className="border-b border-[#CDCED8]">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'details', label: 'Order Details', icon: Package },
                  { id: 'payment', label: 'Payment Info', icon: CreditCard },
                  { id: 'activity', label: 'Order History', icon: Clock }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'border-[#3D1560] text-[#3D1560]'
                          : 'border-transparent text-[#70727F] hover:text-[#383A47]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Order Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Items */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#1B1C20] mb-4">Items Ordered</h3>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => {
                        const isClickable = isProductClickable(item.product);
                        return (
                          <div key={index} className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                            <div className="flex gap-4">
                              {item.product.images && item.product.images.length > 0 && (
                                <div 
                                  className={`w-20 h-20 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0 ${
                                    isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'opacity-60'
                                  }`}
                                  onClick={() => isClickable && handleProductClick(item.product.id)}
                                >
                                  <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {!isClickable && (
                                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                                      <span className="text-xs text-white font-medium">Unavailable</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 
                                  className={`text-lg font-semibold mb-2 ${
                                    isClickable 
                                      ? 'text-[#3D1560] cursor-pointer hover:text-[#6D26AB] transition-colors' 
                                      : 'text-[#70727F]'
                                  }`}
                                  onClick={() => isClickable && handleProductClick(item.product.id)}
                                >
                                  {item.product.name}
                                  {!isClickable && (
                                    <span className="ml-2 text-xs bg-[#FFE5ED] text-[#DF678C] px-2 py-1 rounded-full">
                                      No longer available
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[#70727F] mb-2">{item.product.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-[#70727F]">
                                    <span>Quantity: {item.quantity || 1}</span>
                                    <span>Price: ${item.product.price.toFixed(2)} each</span>
                                  </div>
                                  <div className="text-lg font-bold text-[#1B1C20]">
                                    ${(item.product.price * (item.quantity || 1)).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#1B1C20] mb-4">Shipping Information</h3>
                    <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5 text-[#3D1560]" />
                          <div>
                            <p className="text-sm text-[#70727F]">Delivery Address</p>
                            <p className="font-medium text-[#383A47]">{order.location || '123 Main St, City, State 12345'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-[#3D1560]" />
                          <div>
                            <p className="text-sm text-[#70727F]">Shipping Method</p>
                            <p className="font-medium text-[#383A47]">Standard Shipping (5-7 days)</p>
                          </div>
                        </div>
                        {order.trackingInfo && (
                          <div className="flex items-center gap-3 md:col-span-2">
                            <Package className="w-5 h-5 text-[#3D1560]" />
                            <div>
                              <p className="text-sm text-[#70727F]">Tracking Information</p>
                              <p className="font-medium text-[#383A47]">
                                {order.trackingInfo.carrier}: {order.trackingInfo.trackingNumber}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seller Information */}
                  {order.items && order.items[0] && (
                    <div>
                      <h3 className="text-xl font-semibold text-[#1B1C20] mb-4">Seller Information</h3>
                      <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-[#CDCED8]">
                            <img 
                              src={order.items[0].product.seller?.avatar || '/placeholder-avatar.jpg'} 
                              alt={order.items[0].product.seller?.name || 'Seller'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-[#1B1C20] mb-1">
                              {order.items[0].product.seller?.name || 'Marketplace Seller'}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-[#70727F]">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                {order.items[0].product.seller?.rating?.toFixed(1) || '4.8'} 
                                ({order.items[0].product.seller?.totalSales || 1250} sales)
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {order.items[0].product.seller?.location || 'United States'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Information Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#1B1C20]">Payment Information</h3>
                  
                  {/* Payment Breakdown */}
                  <div className="bg-[#F8F8FA] rounded-lg p-6 border border-[#CDCED8]">
                    <h4 className="text-lg font-semibold text-[#1B1C20] mb-4">Order Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#70727F]">Subtotal ({order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                        <span className="font-medium text-[#383A47]">${paymentBreakdown.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#70727F]">Shipping & Handling</span>
                        <span className="font-medium text-[#383A47]">${paymentBreakdown.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#70727F]">
                          {paymentBreakdown.taxType} ({paymentBreakdown.taxRate}% - {userRegion})
                        </span>
                        <span className="font-medium text-[#383A47]">${paymentBreakdown.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-[#CDCED8] pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-[#1B1C20]">Total</span>
                          <span className="text-lg font-bold text-[#1B1C20]">${paymentBreakdown.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-[#F8F8FA] rounded-lg p-6 border border-[#CDCED8]">
                    <h4 className="text-lg font-semibold text-[#1B1C20] mb-4">Payment Details</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#3D1560]" />
                        <div>
                          <p className="text-sm text-[#70727F]">Payment Method</p>
                          <p className="font-medium text-[#383A47]">Card ending in 4242</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-[#3D1560]" />
                        <div>
                          <p className="text-sm text-[#70727F]">Transaction ID</p>
                          <p className="font-medium text-[#383A47] font-mono text-sm">TXN-{order.id}-{Date.now().toString().slice(-6)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#3D1560]" />
                        <div>
                          <p className="text-sm text-[#70727F]">Payment Date</p>
                          <p className="font-medium text-[#383A47]">{formatDateTime(order.orderDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${order.paymentStatus === 'paid' ? 'text-[#1B1C20]' : 'text-[#70727F]'}`} />
                        <div>
                          <p className="text-sm text-[#70727F]">Payment Status</p>
                          <p className={`font-medium ${order.paymentStatus === 'paid' ? 'text-[#1B1C20]' : 'text-[#70727F]'}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Receipt */}
                  <button className="flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] font-medium transition-colors duration-200">
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </button>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#1B1C20]">Order History</h3>
                  
                  <div className="space-y-4">
                    {activityTimeline.map((activity, index) => {
                      const ActivityIcon = activity.icon;
                      return (
                        <div key={activity.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.status === 'completed' ? 'bg-[#E8F5E9] text-[#4CAF50]' : 'bg-[#F8F8FA] text-[#70727F]'
                            }`}>
                              <ActivityIcon className="w-5 h-5" />
                            </div>
                            {index < activityTimeline.length - 1 && (
                              <div className="w-0.5 h-8 bg-[#CDCED8] mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <h4 className="font-medium text-[#1B1C20] mb-1">{activity.action}</h4>
                            <p className="text-[#70727F] text-sm mb-2">{activity.description}</p>
                            <p className="text-xs text-[#70727F]">{formatDateTime(activity.timestamp)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 border border-[#CDCED8]">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {statusConfig.canTrack && (
                <button 
                  onClick={() => setTrackingDetailsOpen(true)}
                  className="w-full flex items-center gap-3 p-3 text-left bg-[#F3E8F9] border border-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors duration-200"
                >
                  <Truck className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#3D1560]">Track Package</span>
                </button>
              )}
              
              {/* Product Terms Button */}
              <button 
                onClick={() => setProductTermsOpen(true)}
                className="w-full flex items-center gap-3 p-3 text-left bg-[#F8F8FA] border border-[#70727F] rounded-lg hover:bg-[#E8E9ED] transition-colors duration-200"
              >
                <FileText className="w-5 h-5 text-[#70727F]" />
                <span className="font-medium text-[#383A47]">View Terms of Sale</span>
              </button>
              
              {statusConfig.canReturn && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#FFE5ED] border border-[#DF678C] rounded-lg hover:bg-[#FFD1DC] transition-colors duration-200">
                  <RotateCcw className="w-5 h-5 text-[#DF678C]" />
                  <span className="font-medium text-[#DF678C]">Return Items</span>
                </button>
              )}
              
              {statusConfig.canReorder && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#EDD9FF] border border-[#6D26AB] rounded-lg hover:bg-[#F3E8F9] transition-colors duration-200">
                  <ShoppingBag className="w-5 h-5 text-[#6D26AB]" />
                  <span className="font-medium text-[#6D26AB]">Buy Again</span>
                </button>
              )}
              
              {statusConfig.canReview && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#F8F8FA] border border-[#1B1C20] rounded-lg hover:bg-[#E8E9ED] transition-colors duration-200">
                  <Star className="w-5 h-5 text-[#1B1C20]" />
                  <span className="font-medium text-[#1B1C20]">Write Review</span>
                </button>
              )}
              
              {order.items && order.items[0] && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#F8F8FA] border border-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors duration-200">
                  <MessageCircle className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#3D1560]">Contact Seller</span>
                </button>
              )}
              
              {statusConfig.canCancel && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#FFE5ED] border border-[#DF678C] rounded-lg hover:bg-[#FFD1DC] transition-colors duration-200">
                  <XCircle className="w-5 h-5 text-[#DF678C]" />
                  <span className="font-medium text-[#DF678C]">Cancel Order</span>
                </button>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 border border-[#CDCED8]">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F8F8FA] rounded-lg transition-colors duration-200">
                <Shield className="w-5 h-5 text-[#70727F]" />
                <span className="font-medium text-[#383A47]">Contact Support</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F8F8FA] rounded-lg transition-colors duration-200">
                <ExternalLink className="w-5 h-5 text-[#70727F]" />
                <span className="font-medium text-[#383A47]">Help Center</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 border border-[#CDCED8]">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#70727F]">Order ID</span>
                <span className="font-medium text-[#383A47]">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70727F]">Items</span>
                <span className="font-medium text-[#383A47]">
                  {order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70727F]">Shipping</span>
                <span className="font-medium text-[#383A47]">Standard</span>
              </div>
              {order.trackingInfo && (
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Carrier</span>
                  <span className="font-medium text-[#383A47]">{order.trackingInfo.carrier}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#70727F]">Total</span>
                <span className="font-bold text-[#1B1C20] text-base">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Details Modal */}
      <TrackingDetailsModal />
      
      {/* Product Terms Modal */}
      <SellerTermsModal 
        open={productTermsOpen}
        onClose={() => setProductTermsOpen(false)}
        serviceName={order.items?.[0]?.product.name || 'Product'}
        providerName={order.items?.[0]?.product.seller?.name || 'Seller'}
        serviceType="product"
      />
    </div>
  );
} 