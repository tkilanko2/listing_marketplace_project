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
  Info,
  BarChart3
} from 'lucide-react';
import { Order, ActivityLogEntry, OrderStatus } from '../types';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

interface SellerOrderDetailsPageProps {
  order: Order;
  onBack: () => void;
  onNavigateToListing?: (productId: string) => void;
  onNavigateToMessages?: (threadId?: string, orderInfo?: {
    id: string;
    type: 'booking' | 'order';
    title: string;
    sellerName: string;
    sellerId: string;
  }) => void;
}

interface SellerPaymentBreakdown {
  itemSubtotal: number;
  shippingFee: number;
  taxAmount: number;
  customerTotal: number;
  platformFee: number;
  paymentProcessingFee: number;
  transactionFee: number;
  withdrawalFee: number;
  totalFees: number;
  netEarnings: number;
  profitMargin: number;
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

// Separate Modal Component to prevent re-mounting issues
interface AddTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  carrier: string;
  setCarrier: (value: string) => void;
  proofPhotos: File[];
  setProofPhotos: React.Dispatch<React.SetStateAction<File[]>>;
  importantNotes: string;
  setImportantNotes: (value: string) => void;
  onSubmit: () => void;
}

interface AddNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  setNotes: (value: string) => void;
  onSubmit: () => void;
}

const AddTrackingModal: React.FC<AddTrackingModalProps> = ({
  isOpen,
  onClose,
  trackingNumber,
  setTrackingNumber,
  carrier,
  setCarrier,
  proofPhotos,
  setProofPhotos,
  importantNotes,
  setImportantNotes,
  onSubmit
}) => {
  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProofPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setProofPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add Tracking Information</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#CDCED8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Required Fields */}
          <div>
            <label className="block text-sm font-medium text-[#1B1C20] mb-2">Carrier *</label>
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
            <label className="block text-sm font-medium text-[#1B1C20] mb-2">Tracking Number *</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number or shipping id"
              className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560]"
            />
          </div>

          {/* Optional Fields */}
          <div className="border-t border-[#E8E9ED] pt-4">
            <h4 className="text-sm font-medium text-[#383A47] mb-3">Optional Information</h4>
            
            {/* Photo Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1B1C20] mb-2">
                Add Photos (Proof of Items Sent)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#EDD9FF] file:text-[#3D1560] hover:file:bg-[#D0B0EE]"
              />
              <p className="text-xs text-[#70727F] mt-1">Upload photos showing items before shipping (optional)</p>
              
              {/* Photo Preview */}
              {proofPhotos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {proofPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Proof ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-[#CDCED8]"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-[#DF678C] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-[#D84773] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div>
              <label className="block text-sm font-medium text-[#1B1C20] mb-2">
                Important Notes
              </label>
              <textarea
                value={importantNotes}
                onChange={(e) => setImportantNotes(e.target.value)}
                placeholder="Add any important notes about shipping, handling, or special instructions..."
                rows={3}
                className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] resize-none"
              />
              <p className="text-xs text-[#70727F] mt-1">These notes will be visible to the customer (optional)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSubmit}
              disabled={!trackingNumber || !carrier}
              className="flex-1 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Tracking
            </button>
            <button
              onClick={onClose}
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

const AddNotesModal: React.FC<AddNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  setNotes,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full">
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add Order Notes</h3>
          <button 
            onClick={onClose}
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
              onClick={onSubmit}
              disabled={!notes.trim()}
              className="flex-1 bg-[#3D1560] text-white px-4 py-2 rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Notes
            </button>
            <button
              onClick={onClose}
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

export function SellerOrderDetailsPage({ order, onBack, onNavigateToListing, onNavigateToMessages }: SellerOrderDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'earnings' | 'activity'>('details');
  const [trackingDetailsOpen, setTrackingDetailsOpen] = useState(false);
  const [addTrackingOpen, setAddTrackingOpen] = useState(false);
  const [addNotesOpen, setAddNotesOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [notes, setNotes] = useState('');
  const [proofPhotos, setProofPhotos] = useState<File[]>([]);
  const [importantNotes, setImportantNotes] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [addedNotes, setAddedNotes] = useState<Array<{id: number, note: string, timestamp: Date}>>([]);

  // Enhanced seller payment breakdown with comprehensive fee structure
  const calculateSellerPaymentBreakdown = (): SellerPaymentBreakdown => {
    const itemTotalIncVAT = order.items?.reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0) || order.totalAmount;
    
    // VAT is included in the price (tax-inclusive pricing)
    const vatRate = 0.20; // 20% VAT for UK/EU
    const itemSubtotal = itemTotalIncVAT / (1 + vatRate); // Extract base price without VAT
    const taxAmount = itemTotalIncVAT - itemSubtotal; // VAT amount
    
    // Shipping fee logic - can be free or charged (VAT-inclusive if applicable)
    const shippingFee = itemTotalIncVAT >= 50 ? 0 : 5.99; // Free shipping over $50
    
    const customerTotal = itemTotalIncVAT + shippingFee;
    
    // Seller fees (realistic marketplace structure)
    const platformFeeRate = 0.025; // 2.5% platform fee (applied to base price)
    const paymentProcessingRate = 0.029; // 2.9% + $0.30
    const paymentProcessingFixed = 0.30;
    
    const platformFee = itemSubtotal * platformFeeRate;
    const paymentProcessingFee = (customerTotal * paymentProcessingRate) + paymentProcessingFixed;
    
    // Additional realistic fees
    const transactionFee = 0.25; // Fixed transaction fee
    const withdrawalFee = customerTotal > 50 ? 0 : 1.50; // Free withdrawal over $50
    
    const totalFees = platformFee + paymentProcessingFee + transactionFee + withdrawalFee;
    const netEarnings = itemSubtotal + shippingFee - totalFees; // Seller keeps shipping, VAT goes to government
    const profitMargin = (netEarnings / customerTotal) * 100;

    return {
      itemSubtotal: itemTotalIncVAT, // Show the full price customer sees
      shippingFee,
      taxAmount,
      customerTotal,
      platformFee,
      paymentProcessingFee,
      transactionFee,
      withdrawalFee,
      totalFees,
      netEarnings,
      profitMargin,
      feeRate: platformFeeRate * 100
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
          urgency: '⚠️ Respond within 24 hours to maintain seller rating',
          timeEstimate: 'Expected response: Within 24 hours',
          primaryActions: ['Accept Order', 'Decline Order'],
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
          urgency: '📦 Ship within 2 business days to maintain performance',
          timeEstimate: 'Expected shipping: Within 2 business days',
          primaryActions: ['Print Shipping Label', 'Mark as Shipped'],
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
          urgency: '💡 Add tracking info to reduce customer inquiries by 60%',
          timeEstimate: 'Expected delivery: 3-5 business days',
          primaryActions: ['Update Tracking', 'Message Customer'],
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
          urgency: '🎉 Order completed successfully!',
          timeEstimate: 'Payment will be processed within 24 hours',
          primaryActions: ['Message Customer', 'Request Review'],
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
          urgency: 'ℹ️ Review cancellation reason and improve listing',
          timeEstimate: 'No further action required',
          primaryActions: ['View Reason', 'Contact Customer'],
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
          urgency: '📋 Process return and issue refund if applicable',
          timeEstimate: 'Refund processing: 3-5 business days',
          primaryActions: ['Process Return', 'Contact Customer'],
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
          urgency: '⚠️ Contact support for assistance',
          timeEstimate: 'Status update needed',
          primaryActions: ['Contact Support'],
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
    const fullName = 'John Smith';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
    const displayName = `${firstName} ${lastNameInitial}.`;
    
    return {
      name: fullName,
      displayName: displayName,
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

    // Add tracking information activity if tracking details are available
    if (trackingNumber && carrier) {
      baseActivities.push({
        id: 4,
        type: 'tracking_added',
        title: 'Tracking Information Added',
        description: `${carrier} tracking: ${trackingNumber}${proofPhotos.length > 0 ? ` (${proofPhotos.length} proof photo${proofPhotos.length > 1 ? 's' : ''})` : ''}${importantNotes.trim() ? ' with notes' : ''}`,
        timestamp: new Date(order.orderDate.getTime() + 1.5 * 24 * 60 * 60 * 1000),
        icon: Truck
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      baseActivities.push({
        id: 5,
        type: 'order_shipped',
        title: 'Package Shipped',
        description: 'You marked the order as shipped',
        timestamp: new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        icon: Truck
      });
    }

    if (order.status === 'delivered') {
      baseActivities.push({
        id: 6,
        type: 'order_delivered',
        title: 'Order Delivered',
        description: 'Customer confirmed delivery',
        timestamp: new Date(order.orderDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        icon: CheckCircle2
      });
    }

    // Add notes activities
    addedNotes.forEach((noteEntry, index) => {
      baseActivities.push({
        id: 100 + noteEntry.id, // Ensure unique IDs
        type: 'note_added',
        title: 'Order Note Added',
        description: noteEntry.note,
        timestamp: noteEntry.timestamp,
        icon: Info
      });
    });

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
      console.log('Add tracking:', { 
        orderId: order.id, 
        trackingNumber, 
        carrier,
        proofPhotos: proofPhotos.length,
        importantNotes: importantNotes.trim()
      });
      
      // Here you would typically save this data to your backend
      // For now, we'll simulate success and keep the data for display
      
      setAddTrackingOpen(false);
      // Don't reset the form data so we can display it
      // setTrackingNumber('');
      // setCarrier('');
      // setProofPhotos([]);
      // setImportantNotes('');
    }
  };

  const handleMarkShipped = () => {
    console.log('Mark as shipped:', order.id);
    // In real app, this would call an API to update order status
  };

  const handleContactCustomer = () => {
    console.log('Contact customer for order:', order.id);
    if (onNavigateToMessages) {
      // Sellers can only reply to existing threads, so just pass the thread ID
      onNavigateToMessages(order.id);
    }
  };

  const handleAddNotes = () => {
    if (notes.trim()) {
      const newNote = {
        id: Date.now(), // Simple ID generation
        note: notes.trim(),
        timestamp: new Date()
      };
      
      setAddedNotes(prev => [...prev, newNote]);
      console.log('Add notes:', { orderId: order.id, notes: notes.trim() });
      setAddNotesOpen(false);
      setNotes('');
    }
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

        {/* Enhanced Status Header Card */}
        <div className="mb-6">
          <div className={`flex flex-col gap-4 px-6 py-5 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
            {/* Main Status Row */}
            <div className="flex items-center gap-4">
              <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              <div className="flex-1">
                <h2 className={`text-xl font-semibold ${statusConfig.color}`}>{statusConfig.title}</h2>
                <p className={`text-sm ${statusConfig.color} opacity-80`}>{statusConfig.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#70727F]">Amount</p>
                <p className="text-xl font-bold text-[#3D1560]">${paymentBreakdown.customerTotal.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Contextual Assistance */}
            {statusConfig.urgency && (
              <div className="flex items-start gap-3 p-3 bg-[#FFFFFF] bg-opacity-50 rounded-lg border border-[#FFFFFF] border-opacity-30">
                <Info className="w-5 h-5 text-[#3D1560] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#3D1560]">{statusConfig.urgency}</p>
                  {statusConfig.timeEstimate && (
                    <p className="text-xs text-[#3D1560] opacity-80 mt-1">{statusConfig.timeEstimate}</p>
                  )}
                </div>
              </div>
            )}
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
                userRole="seller"
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
                    {/* Enhanced Items Sold Card */}
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Items Sold</h3>
                      <div className="space-y-4">
                        {order.items?.map((item, index) => (
                          <div key={index} className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                            <div className="flex gap-4">
                              {item.product.images && item.product.images.length > 0 && (
                                <div 
                                  className="w-20 h-20 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0 cursor-pointer hover:opacity-80 hover:border-[#3D1560] transition-all duration-200"
                                  onClick={() => {
                                    if (order.listingId && onNavigateToListing) {
                                      onNavigateToListing(order.listingId);
                                    } else {
                                      console.log('Navigate to listing details:', order.listingId);
                                    }
                                  }}
                                  title="View listing details"
                                >
                                  <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 
                                    className="text-lg font-semibold text-[#3D1560] cursor-pointer hover:text-[#6D26AB] transition-colors duration-200"
                                    onClick={() => {
                                      if (order.listingId && onNavigateToListing) {
                                        onNavigateToListing(order.listingId);
                                      } else {
                                        console.log('Navigate to listing details:', order.listingId);
                                      }
                                    }}
                                    title="View listing details"
                                  >
                                    {item.product.name}
                                  </h4>
                                  <button
                                    onClick={() => {
                                      if (order.listingId && onNavigateToListing) {
                                        onNavigateToListing(order.listingId);
                                      } else {
                                        console.log('Navigate to edit listing for:', order.listingId);
                                      }
                                    }}
                                    className="text-[#3D1560] hover:text-[#6D26AB] p-1 rounded"
                                    title="Edit listing"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                </div>
                                <p className="text-[#70727F] mb-3 text-sm">{item.product.description}</p>
                                
                                {/* Enhanced Product Info */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div className="bg-[#FFFFFF] p-2 rounded border">
                                    <p className="text-xs text-[#70727F]">Inventory Impact</p>
                                    <p className="text-sm font-medium text-[#1B1C20]">3 remaining</p>
                                  </div>
                                  <div className="bg-[#FFFFFF] p-2 rounded border">
                                    <p className="text-xs text-[#70727F]">This Month</p>
                                    <p className="text-sm font-medium text-[#4CAF50]">8 sold</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-[#70727F]">
                                    <span>Qty: {item.quantity || 1}</span>
                                    <span>${item.product.price.toFixed(2)} each</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-[#1B1C20]">
                                      ${(item.product.price * (item.quantity || 1)).toFixed(2)}
                                    </div>
                                  </div>
                                </div>

                                {/* Performance Insight */}
                                <div className="mt-3 p-2 bg-[#E8F5E9] rounded-lg">
                                  <p className="text-xs text-[#4CAF50] font-medium">
                                    💡 This item typically sells more during the summer months
                                  </p>
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
                                <p className="font-medium text-[#383A47]">{customerInfo.displayName}</p>
                                <p className="text-sm text-[#70727F]">Lagos, Nigeria</p>
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
                              <p className="text-sm text-[#70727F] mb-1">Please send item to:</p>
                              <p className="font-medium text-[#383A47]">Mary Johnson</p>
                              <p className="text-[#70727F]">{order.location || '123 Main St'}</p>
                              <p className="text-[#70727F]">City, State 12345</p>
                              <p className="text-[#70727F]">United States</p>
                              <p className="text-[#70727F] mt-2 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#3D1560]" />
                                {customerInfo.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Tracking Info */}
                      {(order.trackingInfo || (trackingNumber && carrier)) && (
                        <div className="mt-6 pt-6 border-t border-[#CDCED8]">
                          <h4 className="font-semibold text-[#1B1C20] mb-4">Tracking Information</h4>
                          
                          {/* Basic Tracking Details */}
                          <div className="bg-[#F8F8FA] rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Truck className="w-6 h-6 text-[#3D1560]" />
                              <div className="flex-1">
                                <p className="font-semibold text-[#1B1C20] text-lg">
                                  {order.trackingInfo?.carrier || carrier}: {order.trackingInfo?.trackingNumber || trackingNumber}
                                </p>
                                <p className="text-sm text-[#70727F]">
                                  Last updated: {formatDateTime(new Date())}
                                </p>
                              </div>
                              <button
                                onClick={() => navigator.clipboard.writeText(order.trackingInfo?.trackingNumber || trackingNumber)}
                                className="text-[#3D1560] hover:text-[#6D26AB] p-2 rounded-md hover:bg-[#EDD9FF] transition-colors"
                                title="Copy tracking number"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                              <div className="bg-[#3D1560] text-white px-3 py-1 rounded-full text-xs font-medium">
                                In Transit
                              </div>
                              <span className="text-xs text-[#70727F]">
                                Estimated delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Proof Photos */}
                          {proofPhotos.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-[#1B1C20] mb-3">Proof of Shipment</h5>
                              <div className="grid grid-cols-4 gap-2">
                                {proofPhotos.slice(0, 3).map((photo, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setCurrentImageIndex(index);
                                      setLightboxOpen(true);
                                    }}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-[#CDCED8] hover:border-[#3D1560] transition-colors group"
                                  >
                                    <img
                                      src={URL.createObjectURL(photo)}
                                      alt={`Proof ${index + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                      <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </button>
                                ))}
                                {proofPhotos.length > 3 && (
                                  <button
                                    onClick={() => {
                                      setCurrentImageIndex(3);
                                      setLightboxOpen(true);
                                    }}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-[#CDCED8] hover:border-[#3D1560] transition-colors bg-[#E8E9ED] flex items-center justify-center"
                                  >
                                    <div className="text-center">
                                      <Plus className="w-6 h-6 text-[#3D1560] mx-auto mb-1" />
                                      <span className="text-xs font-medium text-[#3D1560]">
                                        +{proofPhotos.length - 3}
                                      </span>
                                    </div>
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Important Notes - Collapsible */}
                          {importantNotes.trim() && (
                            <div className="border border-[#CDCED8] rounded-lg">
                              <button
                                onClick={() => setNotesExpanded(!notesExpanded)}
                                className="w-full flex items-center justify-between p-3 hover:bg-[#F8F8FA] transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-[#3D1560]" />
                                  <span className="font-medium text-[#1B1C20]">Important Shipping Notes</span>
                                </div>
                                <div className={`transform transition-transform ${notesExpanded ? 'rotate-180' : ''}`}>
                                  <ArrowLeft className="w-4 h-4 text-[#70727F] rotate-90" />
                                </div>
                              </button>
                              {notesExpanded && (
                                <div className="px-3 pb-3 border-t border-[#E8E9ED]">
                                  <div className="bg-[#F8F8FA] rounded-md p-3 mt-3">
                                    <p className="text-sm text-[#383A47] whitespace-pre-wrap">
                                      {importantNotes}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Earnings Tab */}
                {activeTab === 'earnings' && (
                  <div className="space-y-6">
                    {/* Financial Transparency Card */}
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Financial Summary</h3>
                      
                      {/* Customer Payment vs Seller Earnings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#F8F8FA] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#70727F] mb-2">Customer Paid</h4>
                          <p className="text-2xl font-bold text-[#1B1C20]">${paymentBreakdown.customerTotal.toFixed(2)}</p>
                          <p className="text-xs text-[#70727F] mt-1">Items + shipping + tax</p>
                        </div>
                        <div className="bg-[#EDD9FF] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#3D1560] mb-2">You Receive</h4>
                          <p className="text-2xl font-bold text-[#3D1560]">${paymentBreakdown.netEarnings.toFixed(2)}</p>
                          <p className="text-xs text-[#3D1560] opacity-80 mt-1">After all fees & charges</p>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="space-y-3 mb-5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#383A47] font-medium">Item Subtotal:</span>
                          <span className="text-[#383A47] font-medium">${paymentBreakdown.itemSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#383A47] font-medium">Shipping Fee:</span>
                          <span className="text-[#383A47] font-medium">+${paymentBreakdown.shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">VAT/Tax (20%):</span>
                          <span className="text-[#70727F]">${paymentBreakdown.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Platform Fee ({paymentBreakdown.feeRate}%):</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Payment Processing:</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.paymentProcessingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Transaction Fee:</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.transactionFee.toFixed(2)}</span>
                        </div>
                        {paymentBreakdown.withdrawalFee > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#70727F]">Withdrawal Fee:</span>
                            <span className="text-[#70727F]">-${paymentBreakdown.withdrawalFee.toFixed(2)}</span>
                          </div>
                        )}
                        <hr className="border-t border-[#E8E9ED] my-3" />
                        <div className="flex justify-between items-center text-base">
                          <span className="text-[#383A47] font-semibold">Net Earnings:</span>
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
            {/* Primary Actions Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Primary Actions</h3>
              <div className="space-y-3 mb-4">
                {/* Primary Actions - Most Important */}
                {statusConfig.canAccept && (
                  <button
                    onClick={handleAcceptOrder}
                    className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept Order
                  </button>
                )}
                {statusConfig.canMarkShipped && (
                  <button
                    onClick={handleMarkShipped}
                    className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <Package className="w-5 h-5" />
                    Mark as Shipped
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => console.log('Print shipping label')}
                    className="w-full flex items-center justify-center gap-2 bg-[#6D26AB] text-[#FFFFFF] hover:bg-[#9B53D9] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Print Shipping Label
                  </button>
                )}
                {statusConfig.canContactCustomer && (
                  <button
                    onClick={handleContactCustomer}
                    className="w-full flex items-center justify-center gap-2 bg-[#DF678C] text-[#FFFFFF] hover:bg-[#D84773] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Message Customer
                  </button>
                )}
                {statusConfig.canDecline && (
                  <button
                    onClick={handleDeclineOrder}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#DF678C] text-[#DF678C] hover:bg-[#FFE5ED] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm"
                  >
                    <XCircle className="w-5 h-5" />
                    Decline Order
                  </button>
                )}
              </div>
              
              {/* Secondary Actions - Progressive Disclosure */}
              <div className="border-t border-[#E8E9ED] pt-4">
                <h4 className="text-sm font-medium text-[#70727F] mb-3">Additional Actions</h4>
                <div className="space-y-2">
                  {statusConfig.canAddTracking && (
                    <button
                      onClick={() => setAddTrackingOpen(true)}
                      className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Truck className="w-4 h-4" />
                      Add Tracking Info
                    </button>
                  )}
                  {statusConfig.canAddNotes && (
                    <button
                      onClick={() => setAddNotesOpen(true)}
                      className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Order Notes
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (order.listingId && onNavigateToListing) {
                        onNavigateToListing(order.listingId);
                      } else {
                        console.log('Navigate to listing performance for:', order.listingId);
                      }
                    }}
                    className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Performance
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Order Summary Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Order Summary</h3>
              <div className="space-y-3">
                {/* Core Identifiers */}
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Order ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#383A47]">#{order.id}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(order.id)}
                      className="text-[#3D1560] hover:text-[#6D26AB] p-1"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Order Date</span>
                  <span className="font-medium text-[#383A47]">{formatDate(order.orderDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Status</span>
                  <span className={`font-medium ${statusConfig.color}`}>{statusConfig.title}</span>
                </div>
                
                {/* Financial Summary */}
                <div className="bg-[#F8F8FA] p-3 rounded-lg mt-4">
                  <h4 className="text-sm font-semibold text-[#383A47] mb-3">Order Breakdown</h4>
                  
                  {/* Customer Payment Breakdown */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#70727F]">Items Total (inc. VAT)</span>
                      <span className="text-[#383A47]">${paymentBreakdown.itemSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-xs">
                      <span className="text-[#70727F] italic">└ VAT (20%) included</span>
                      <span className="text-[#70727F]">${paymentBreakdown.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#70727F]">Shipping Fee</span>
                      <span className="text-[#383A47]">
                        {paymentBreakdown.shippingFee === 0 ? 'FREE' : `$${paymentBreakdown.shippingFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t border-[#CDCED8] pt-2">
                      <span className="text-[#383A47]">Customer Total</span>
                      <span className="text-[#383A47]">${paymentBreakdown.customerTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Seller Fees */}
                  <div className="space-y-1 mb-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Platform Fee (2.5%)</span>
                      <span className="text-[#70727F]">-${paymentBreakdown.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Payment Processing</span>
                      <span className="text-[#70727F]">-${paymentBreakdown.paymentProcessingFee.toFixed(2)}</span>
                    </div>
                    {paymentBreakdown.transactionFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#70727F]">Transaction Fee</span>
                        <span className="text-[#70727F]">-${paymentBreakdown.transactionFee.toFixed(2)}</span>
                      </div>
                    )}
                    {paymentBreakdown.withdrawalFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#70727F]">Withdrawal Fee</span>
                        <span className="text-[#70727F]">-${paymentBreakdown.withdrawalFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Final Earnings */}
                  <div className="border-t border-[#CDCED8] pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#383A47]">Your Earnings</span>
                      <span className="text-lg font-bold text-[#3D1560]">${paymentBreakdown.netEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Info */}
                <div className="pt-3 border-t border-[#CDCED8]">
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Items to Ship</span>
                    <span className="font-medium text-[#383A47]">
                      {order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1} item(s)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Shipping Status</span>
                    <span className={`font-medium ${paymentBreakdown.shippingFee === 0 ? 'text-[#4CAF50]' : 'text-[#383A47]'}`}>
                      {paymentBreakdown.shippingFee === 0 ? 'FREE (Over $50)' : `$${paymentBreakdown.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  {order.status === 'pending' && (
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Ship By</span>
                      <span className="font-medium text-[#DF678C]">
                        {new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Customer</span>
                    <span className="font-medium text-[#383A47]">{customerInfo.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Customer Type</span>
                    <span className="font-medium text-[#4CAF50]">Returning</span>
                  </div>
                </div>

                {/* Performance Insight */}
                <div className="bg-[#E8F5E9] p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#4CAF50]" />
                    <span className="text-sm font-medium text-[#4CAF50]">Performance Tip</span>
                  </div>
                  <p className="text-xs text-[#4CAF50] opacity-80">
                    Similar orders typically ship in 1.5 days. Ship early to boost your seller rating!
                  </p>
                </div>
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
      <AddTrackingModal
        isOpen={addTrackingOpen}
        onClose={() => setAddTrackingOpen(false)}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        carrier={carrier}
        setCarrier={setCarrier}
        proofPhotos={proofPhotos}
        setProofPhotos={setProofPhotos}
        importantNotes={importantNotes}
        setImportantNotes={setImportantNotes}
        onSubmit={handleAddTracking}
      />
      <AddNotesModal
        isOpen={addNotesOpen}
        onClose={() => setAddNotesOpen(false)}
        notes={notes}
        setNotes={setNotes}
        onSubmit={handleAddNotes}
      />
      
      {/* Lightbox for Photo Gallery */}
      {lightboxOpen && proofPhotos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-[#CDCED8] transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            {proofPhotos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : proofPhotos.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#CDCED8] transition-colors bg-black bg-opacity-50 rounded-full p-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev < proofPhotos.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-[#CDCED8] transition-colors bg-black bg-opacity-50 rounded-full p-3"
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>
              </>
            )}
            
            {/* Current Image */}
            <div className="flex items-center justify-center max-h-full">
              <img
                src={URL.createObjectURL(proofPhotos[currentImageIndex])}
                alt={`Proof ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            
            {/* Image Counter */}
            {proofPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {proofPhotos.length}
              </div>
            )}
            
            {/* Image Info */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
              <p className="font-medium">Proof of Shipment</p>
              <p className="text-xs opacity-80">Added: {formatDateTime(new Date())}</p>
            </div>
          </div>
        </div>
      )}
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