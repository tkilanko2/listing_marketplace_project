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
  Home,
  Edit,
  Send,
  Plus,
  Copy,
  PlusCircle,
  Info
} from 'lucide-react';
import { Order, ActivityLogEntry, OrderStatus } from '../types';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

interface SellerOrderDetailsPageProps {
  order: Order;
  onBack: () => void;
}

interface SellerPaymentBreakdown {
  itemTotal: number;
  platformFee: number;
  processingFee: number;
  netEarnings: number;
  feeRate: number;
}

interface SellerActivityEntry {
  id: number;
  type: 'order_received' | 'payment_processed' | 'order_accepted' | 'tracking_added' | 'order_shipped' | 'order_delivered' | 'note_added' | 'status_updated';
  title: string;
  description: string;
  timestamp: Date;
  icon?: any;
}

export function SellerOrderDetailsPage({ order, onBack }: SellerOrderDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'earnings' | 'activity'>('details');
  const [trackingDetailsOpen, setTrackingDetailsOpen] = useState(false);
  const [addTrackingOpen, setAddTrackingOpen] = useState(false);
  const [addNotesOpen, setAddNotesOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [notes, setNotes] = useState('');

  // Calculate seller payment breakdown
  const calculateSellerPaymentBreakdown = (): SellerPaymentBreakdown => {
    const itemTotal = order.items?.reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0) || order.totalAmount * 0.85;
    const feeRate = 0.08; // 8% platform fee
    const platformFee = itemTotal * feeRate;
    const processingFee = itemTotal * 0.029; // 2.9% processing fee
    const netEarnings = itemTotal - platformFee - processingFee;

    return {
      itemTotal,
      platformFee,
      processingFee,
      netEarnings,
      feeRate: feeRate * 100
    };
  };

  const paymentBreakdown = calculateSellerPaymentBreakdown();

  const getStatusConfig = () => {
    switch (order.status) {
      case 'pending':
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#E8E9ED]',
          borderColor: 'border-[#70727F]',
          icon: Clock3,
          title: 'Awaiting Action',
          description: 'Customer order needs your attention',
          canAccept: true,
          canDecline: true,
          canAddTracking: false,
          canMarkShipped: false,
          canContactCustomer: true,
          canAddNotes: true
        };
      case 'processing':
        return {
          color: 'text-[#6D26AB]',
          bgColor: 'bg-[#EDD9FF]',
          borderColor: 'border-[#6D26AB]',
          icon: RefreshCw,
          title: 'Processing',
          description: 'Order accepted, preparing for shipment',
          canAccept: false,
          canDecline: false,
          canAddTracking: true,
          canMarkShipped: true,
          canContactCustomer: true,
          canAddNotes: true
        };
      case 'shipped':
        return {
          color: 'text-[#3D1560]',
          bgColor: 'bg-[#EDD9FF]',
          borderColor: 'border-[#3D1560]',
          icon: Truck,
          title: 'Shipped',
          description: 'Order is on its way to customer',
          canAccept: false,
          canDecline: false,
          canAddTracking: true,
          canMarkShipped: false,
          canContactCustomer: true,
          canAddNotes: true
        };
      case 'delivered':
        return {
          color: 'text-[#1B1C20]',
          bgColor: 'bg-[#F8F8FA]',
          borderColor: 'border-[#CDCED8]',
          icon: CheckCircle2,
          title: 'Delivered',
          description: 'Order successfully delivered to customer',
          canAccept: false,
          canDecline: false,
          canAddTracking: false,
          canMarkShipped: false,
          canContactCustomer: true,
          canAddNotes: true
        };
      case 'cancelled':
        return {
          color: 'text-[#DF678C]',
          bgColor: 'bg-[#FFE5ED]',
          borderColor: 'border-[#DF678C]',
          icon: XCircle,
          title: 'Cancelled',
          description: 'This order has been cancelled',
          canAccept: false,
          canDecline: false,
          canAddTracking: false,
          canMarkShipped: false,
          canContactCustomer: true,
          canAddNotes: true
        };
      case 'returned':
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#E8E9ED]',
          borderColor: 'border-[#70727F]',
          icon: RotateCcw,
          title: 'Returned',
          description: 'Order has been returned by customer',
          canAccept: false,
          canDecline: false,
          canAddTracking: false,
          canMarkShipped: false,
          canContactCustomer: true,
          canAddNotes: true
        };
      default:
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#CDCED8]',
          borderColor: 'border-[#70727F]',
          icon: Circle,
          title: 'Unknown Status',
          description: 'Status information unavailable',
          canAccept: false,
          canDecline: false,
          canAddTracking: false,
          canMarkShipped: false,
          canContactCustomer: false,
          canAddNotes: false
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

  // Mock customer info (in real app, this would come from order data)
  const getCustomerInfo = () => {
    return {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      avatar: '/placeholder-avatar.jpg'
    };
  };

  const customerInfo = getCustomerInfo();

  // Enhanced seller activity timeline
  const getActivityTimeline = (): SellerActivityEntry[] => {
    const baseActivities: SellerActivityEntry[] = [
      {
        id: 1,
        type: 'order_received',
        title: 'Order Received',
        description: 'New order received from customer',
        timestamp: order.orderDate,
        icon: ShoppingBag
      },
      {
        id: 2,
        type: 'payment_processed',
        title: 'Payment Processed',
        description: `Payment of $${paymentBreakdown.netEarnings.toFixed(2)} will be deposited`,
        timestamp: new Date(order.orderDate.getTime() + 30 * 60 * 1000),
        icon: CreditCard
      }
    ];

    // Add status-specific activities
    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      baseActivities.push({
        id: 3,
        type: 'order_accepted',
        title: 'Order Accepted',
        description: 'You accepted and started processing the order',
        timestamp: new Date(order.orderDate.getTime() + 60 * 60 * 1000),
        icon: CheckCircle
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      baseActivities.push({
        id: 4,
        type: 'order_shipped',
        title: 'Package Shipped',
        description: 'You marked the order as shipped',
        timestamp: new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        icon: Truck
      });
    }

    if (order.status === 'delivered') {
      baseActivities.push({
        id: 5,
        type: 'order_delivered',
        title: 'Order Delivered',
        description: 'Customer confirmed delivery',
        timestamp: new Date(order.orderDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        icon: CheckCircle2
      });
    }

    return baseActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const activityTimeline = getActivityTimeline();

  // Activity Log rendering
  const renderActivityLog = () => {
    if (activityTimeline.length === 0) {
      return <p className="text-sm text-[#70727F]">No activity recorded for this order yet.</p>;
    }
    
    return (
      <ul className="space-y-4">
        {activityTimeline.map((entry) => {
          const { icon: IconComponent, bgColor, iconColor } = getIconForActivity(entry.type);
          const ActualIcon = entry.icon || IconComponent;

          return (
            <li key={entry.id} className="flex items-start gap-3 pb-4 border-b border-[#F8F8FA] last:border-b-0 last:pb-0">
              <div className={`p-2 rounded-full ${bgColor} mt-0.5 flex-shrink-0`}>
                {ActualIcon && <ActualIcon className={`w-4 h-4 ${iconColor}`} />}
              </div>
              <div>
                <p className="text-sm text-[#383A47] font-medium">
                  {entry.title}
                </p>
                <p className="text-xs text-[#70727F] leading-relaxed">
                  {entry.description}
                </p>
                <p className="text-xs text-[#CDCED8] mt-1">
                  {formatDateTime(entry.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleAcceptOrder = () => {
    console.log('Accept order:', order.id);
    // In real app, this would call an API to update order status
  };

  const handleDeclineOrder = () => {
    console.log('Decline order:', order.id);
    // In real app, this would call an API to decline order
  };

  const handleAddTracking = () => {
    if (trackingNumber && carrier) {
      console.log('Add tracking:', { orderId: order.id, trackingNumber, carrier });
      setAddTrackingOpen(false);
      setTrackingNumber('');
      setCarrier('');
    }
  };

  const handleMarkShipped = () => {
    console.log('Mark as shipped:', order.id);
    // In real app, this would call an API to update order status
  };

  const handleContactCustomer = () => {
    console.log('Contact customer for order:', order.id);
    // In real app, this would open messaging interface
  };

  const handleAddNotes = () => {
    if (notes.trim()) {
      console.log('Add notes:', { orderId: order.id, notes });
      setAddNotesOpen(false);
      setNotes('');
    }
  };

  // Add Tracking Modal
  const AddTrackingModal = () => {
    if (!addTrackingOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full">
          <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">Add Tracking Information</h3>
            <button 
              onClick={() => setAddTrackingOpen(false)}
              className="text-white hover:text-[#CDCED8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1B1C20] mb-2">Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560]"
              >
                <option value="">Select Carrier</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B1C20] mb-2">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddTracking}
                disabled={!trackingNumber || !carrier}
                className="flex-1 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Tracking
              </button>
              <button
                onClick={() => setAddTrackingOpen(false)}
                className="flex-1 border border-[#CDCED8] text-[#383A47] px-4 py-2 rounded-lg hover:bg-[#E8E9ED] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add Notes Modal
  const AddNotesModal = () => {
    if (!addNotesOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full">
          <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">Add Order Notes</h3>
            <button 
              onClick={() => setAddNotesOpen(false)}
              className="text-white hover:text-[#CDCED8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1B1C20] mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this order..."
                rows={4}
                className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddNotes}
                disabled={!notes.trim()}
                className="flex-1 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Notes
              </button>
              <button
                onClick={() => setAddNotesOpen(false)}
                className="flex-1 border border-[#CDCED8] text-[#383A47] px-4 py-2 rounded-lg hover:bg-[#E8E9ED] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#F8F8FA] min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button and Page Title */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={onBack} 
            className="text-[#383A47] hover:text-[#3D1560] transition-colors duration-200 flex items-center mr-4 p-2 rounded-md hover:bg-[#E8E9ED]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1C20]">
              Order #{order.id}
            </h1>
            <p className="text-[#70727F] text-sm mt-1">
              Placed on {formatDate(order.orderDate)} • Customer: {customerInfo.name}
            </p>
          </div>
        </div>

        {/* Status Header Card */}
        <div className="mb-6">
          <div className={`flex items-center gap-4 px-6 py-4 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
            <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
            <div className="flex-1">
              <h2 className={`text-xl font-semibold ${statusConfig.color}`}>{statusConfig.title}</h2>
              <p className={`text-sm ${statusConfig.color} opacity-80`}>{statusConfig.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#70727F]">Your Earnings</p>
              <p className="text-xl font-bold text-[#3D1560]">${paymentBreakdown.netEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Details) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline Card */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <OrderStatusTimeline 
                currentStatus={order.status}
                orderType="product"
                orderDate={order.orderDate}
              />
            </div>

            {/* Tab Navigation Card */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED]">
              <div className="border-b border-[#E8E9ED]">
                <nav className="flex space-x-1 md:space-x-2 px-3 sm:px-4">
                  {[
                    { id: 'details', label: 'Order Details', icon: Package },
                    { id: 'earnings', label: 'Earnings Info', icon: CreditCard },
                    { id: 'activity', label: 'Order Activity', icon: Clock }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-3.5 px-3 sm:px-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D1560] focus-visible:ring-opacity-50 rounded-t-md ${
                          activeTab === tab.id
                            ? 'border-[#3D1560] text-[#3D1560]'
                            : 'border-transparent text-[#70727F] hover:text-[#383A47] hover:border-[#CDCED8]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Order Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Items Sold Card */}
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Items Sold</h3>
                      <div className="space-y-4">
                        {order.items?.map((item, index) => (
                          <div key={index} className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                            <div className="flex gap-4">
                              {item.product.images && item.product.images.length > 0 && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0">
                                  <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-2 text-[#1B1C20]">
                                  {item.product.name}
                                </h4>
                                <p className="text-[#70727F] mb-2 text-sm">{item.product.description}</p>
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
                        ))}
                      </div>
                    </div>

                    {/* Customer & Shipping Information Card */}
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Customer & Shipping</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div>
                          <h4 className="font-semibold text-[#1B1C20] mb-3">Customer Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-[#3D1560]" />
                              <div>
                                <p className="font-medium text-[#383A47]">{customerInfo.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-[#3D1560]" />
                              <div>
                                <p className="text-[#383A47]">{customerInfo.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-[#3D1560]" />
                              <div>
                                <p className="text-[#383A47]">{customerInfo.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div>
                          <h4 className="font-semibold text-[#1B1C20] mb-3">Shipping Address</h4>
                          <div className="flex items-start gap-3">
                            <Home className="w-5 h-5 text-[#3D1560] mt-0.5" />
                            <div>
                              <p className="font-medium text-[#383A47]">{customerInfo.name}</p>
                              <p className="text-[#70727F]">{order.location || '123 Main St'}</p>
                              <p className="text-[#70727F]">City, State 12345</p>
                              <p className="text-[#70727F]">United States</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.trackingInfo && (
                        <div className="mt-6 pt-6 border-t border-[#CDCED8]">
                          <h4 className="font-semibold text-[#1B1C20] mb-3">Tracking Information</h4>
                          <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-[#3D1560]" />
                            <div>
                              <p className="font-medium text-[#383A47]">
                                {order.trackingInfo.carrier}: {order.trackingInfo.trackingNumber}
                              </p>
                              <p className="text-sm text-[#70727F]">
                                Last updated: {formatDateTime(new Date())}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                  <div className="space-y-6">
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Earnings Breakdown</h3>
                      <div className="space-y-3 mb-5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Item Total:</span>
                          <span className="text-[#383A47] font-medium">${paymentBreakdown.itemTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Platform Fee ({paymentBreakdown.feeRate}%):</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Processing Fee (2.9%):</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.processingFee.toFixed(2)}</span>
                        </div>
                        <hr className="border-t border-[#E8E9ED] my-2" />
                        <div className="flex justify-between items-center text-base">
                          <span className="text-[#383A47] font-semibold">Your Earnings:</span>
                          <span className="text-[#3D1560] font-bold text-lg">${paymentBreakdown.netEarnings.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-[#E8E9ED] pt-5">
                        <h4 className="text-base font-semibold text-[#1B1C20] mb-3">Payment Status</h4>
                        <div className="bg-[#EDD9FF] rounded-lg p-4 border border-[#3D1560]">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-[#3D1560]" />
                            <div>
                              <p className="font-medium text-[#3D1560]">Payment Processing</p>
                              <p className="text-sm text-[#3D1560] opacity-80">
                                Earnings will be deposited to your account within 2-3 business days after delivery confirmation.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button className="w-full sm:w-auto flex-1 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm">
                          <Download className="w-4 h-4" />
                          Download Receipt
                        </button>
                        <button className="w-full sm:w-auto flex-1 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] hover:border-[#B0B2C0] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm">
                          <Shield className="w-4 h-4" />
                          Payment Help
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Order Activity</h3>
                      {renderActivityLog()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Actions & Quick Info) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Manage Order Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Manage Order</h3>
              <div className="space-y-3">
                {statusConfig.canAccept && (
                  <button
                    onClick={handleAcceptOrder}
                    className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept Order
                  </button>
                )}
                {statusConfig.canDecline && (
                  <button
                    onClick={handleDeclineOrder}
                    className="w-full flex items-center justify-center gap-2 border border-[#DF678C] text-[#DF678C] hover:bg-[#FFE5ED] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline Order
                  </button>
                )}
                {statusConfig.canAddTracking && (
                  <button
                    onClick={() => setAddTrackingOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] hover:border-[#B0B2C0] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm"
                  >
                    <Truck className="w-4 h-4" />
                    Add Tracking
                  </button>
                )}
                {statusConfig.canMarkShipped && (
                  <button
                    onClick={handleMarkShipped}
                    className="w-full flex items-center justify-center gap-2 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] hover:border-[#B0B2C0] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm"
                  >
                    <Package className="w-4 h-4" />
                    Mark as Shipped
                  </button>
                )}
                {statusConfig.canContactCustomer && (
                  <button
                    onClick={handleContactCustomer}
                    className="w-full flex items-center justify-center gap-2 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] hover:border-[#B0B2C0] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Customer
                  </button>
                )}
                {statusConfig.canAddNotes && (
                  <button
                    onClick={() => setAddNotesOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] hover:border-[#B0B2C0] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Notes
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Order ID</span>
                  <span className="font-medium text-[#383A47]">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Order Date</span>
                  <span className="font-medium text-[#383A47]">{formatDate(order.orderDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Customer</span>
                  <span className="font-medium text-[#383A47]">{customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Total Amount</span>
                  <span className="font-bold text-[#1B1C20]">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#CDCED8]">
                  <span className="text-[#70727F]">Your Earnings</span>
                  <span className="font-bold text-[#3D1560]">${paymentBreakdown.netEarnings.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Customer</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#CDCED8]">
                  <img 
                    src={customerInfo.avatar} 
                    alt={customerInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1B1C20]">{customerInfo.name}</h4>
                  <p className="text-sm text-[#70727F]">Customer since 2023</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#CDCED8]">
                <button
                  onClick={handleContactCustomer}
                  className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Customer
                </button>
              </div>
            </div>

            {/* Support & Help Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-3">Support & Resources</h3>
              <div className="space-y-2.5">
                <button className="w-full flex items-center text-sm text-[#3D1560] hover:text-[#6D26AB] transition-colors p-3 rounded-md hover:bg-[#EDD9FF] border border-transparent hover:border-[#D0B0EE] gap-2.5">
                  <MessageCircle className="w-4 h-4" /> 
                  Contact Support
                </button>
                <button className="w-full flex items-center text-sm text-[#3D1560] hover:text-[#6D26AB] transition-colors p-3 rounded-md hover:bg-[#EDD9FF] border border-transparent hover:border-[#D0B0EE] gap-2.5">
                  <FileText className="w-4 h-4" /> 
                  Seller Help Center
                </button>
                <button className="w-full flex items-center text-sm text-[#3D1560] hover:text-[#6D26AB] transition-colors p-3 rounded-md hover:bg-[#EDD9FF] border border-transparent hover:border-[#D0B0EE] gap-2.5">
                  <Shield className="w-4 h-4" />
                  Seller Protection
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTrackingModal />
      <AddNotesModal />
    </div>
  );
}

// Helper function to get icon and colors for activity log entries
const getIconForActivity = (type: SellerActivityEntry['type']) => {
  switch (type) {
    case 'order_received': return { icon: ShoppingBag, bgColor: 'bg-[#E8F5E9]', iconColor: 'text-[#4CAF50]' };
    case 'payment_processed': return { icon: CreditCard, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#383A47]' };
    case 'order_accepted': return { icon: CheckCircle, bgColor: 'bg-[#EDD9FF]', iconColor: 'text-[#3D1560]' };
    case 'tracking_added': return { icon: Truck, bgColor: 'bg-[#EDD9FF]', iconColor: 'text-[#6D26AB]' };
    case 'order_shipped': return { icon: Truck, bgColor: 'bg-[#EDD9FF]', iconColor: 'text-[#6D26AB]' };
    case 'order_delivered': return { icon: CheckCircle2, bgColor: 'bg-[#E8F5E9]', iconColor: 'text-[#4CAF50]' };
    case 'note_added': return { icon: Info, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#70727F]' };
    case 'status_updated': return { icon: RefreshCw, bgColor: 'bg-[#FFF9C4]', iconColor: 'text-[#FBC02D]' };
    default: return { icon: Info, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#70727F]' };
  }
}; 