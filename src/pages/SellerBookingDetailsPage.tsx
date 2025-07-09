import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageCircle, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Eye,
  FileText,
  Clock3,
  Info,
  Building,
  Home,
  Monitor,
  MapPin,
  X,
  Plus,
  Copy,
  Star,
  PlusCircle,
  Edit,
  BarChart3,
  Shield,
  ExternalLink,
  Circle,
  RefreshCw,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

// Extended Order interface to include customer for booking context
interface BookingOrder extends Order {
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

interface SellerBookingDetailsPageProps {
  booking: BookingOrder;
  onBack: () => void;
  onViewAppointmentDetails?: () => void;
  userRegion?: 'US' | 'EU' | 'UK';
  selectedServiceMode?: 'at_seller' | 'at_buyer' | 'remote';
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToMessages?: (threadId?: string, orderInfo?: {
    id: string;
    type: 'booking' | 'order';
    title: string;
    sellerName: string;
    sellerId: string;
  }) => void;
  onConfirmBooking?: (bookingId: string) => void;
  onDeclineBooking?: (bookingId: string, reason?: string) => void;
}

interface SellerPaymentBreakdown {
  customerPaid: number;
  platformFee: number;
  paymentProcessingFee: number;
  sellerEarnings: number;
  tax: number;
  taxType: 'Sales Tax' | 'VAT';
  taxRate: number;
}

interface AddNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  setNotes: (value: string) => void;
  onSubmit: () => void;
}

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDecline: () => void;
  booking: BookingOrder;
  customerName: string;
}

interface SellerActivityEntry {
  id: number;
  type: 'booking_created' | 'payment_received' | 'booking_confirmed' | 'note_added' | 'status_updated';
  title: string;
  description: string;
  timestamp: Date;
  icon?: any;
}

const AddBookingNotesModal: React.FC<AddNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  setNotes,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add Booking Notes</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#CDCED8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1B1C20] mb-2">
              Notes for this booking
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any important notes about this booking, customer requirements, or special instructions..."
              rows={6}
              className="w-full border border-[#CDCED8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] resize-none"
            />
            <p className="text-xs text-[#70727F] mt-1">
              These notes are private and only visible to you
            </p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-[#E8E9ED]">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#CDCED8] text-[#70727F] rounded-lg hover:bg-[#F8F8FA] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!notes.trim()}
              className="flex-1 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onDecline,
  booking,
  customerName
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full">
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-lg font-semibold">Confirm Booking Request</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#CDCED8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-[#F8F8FA] p-4 rounded-lg">
            <h4 className="font-semibold text-[#1B1C20] mb-3">Booking Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#70727F]">Customer:</span>
                <span className="text-[#383A47] font-medium">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70727F]">Service:</span>
                <span className="text-[#383A47] font-medium">{booking.service?.name}</span>
              </div>
              {booking.appointmentDate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Date:</span>
                    <span className="text-[#383A47] font-medium">{formatDate(booking.appointmentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Time:</span>
                    <span className="text-[#383A47] font-medium">{formatTime(booking.appointmentDate)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-[#70727F]">Duration:</span>
                <span className="text-[#383A47] font-medium">{booking.service?.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70727F]">Total Amount:</span>
                <span className="text-[#3D1560] font-bold">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#EDD9FF] p-4 rounded-lg border border-[#3D1560]">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-[#3D1560] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#3D1560] mb-1">Important</h4>
                <p className="text-sm text-[#3D1560] opacity-90">
                  By confirming this booking, you commit to providing the service at the scheduled time. 
                  The customer is waiting for your confirmation and payment has been secured.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#E8E9ED]">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 border border-[#DF678C] text-[#DF678C] rounded-lg hover:bg-[#FFE5ED] transition-colors font-medium"
            >
              Decline
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors font-medium"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SellerBookingDetailsPage({ 
  booking, 
  onBack, 
  onViewAppointmentDetails,
  userRegion = 'US', 
  selectedServiceMode = 'at_seller',
  onNavigateToService,
  onNavigateToMessages,
  onConfirmBooking,
  onDeclineBooking
}: SellerBookingDetailsPageProps) {
  console.log('🔍 SellerBookingDetailsPage - Rendering with booking:', booking);
  
  // Add error boundary-like behavior
  if (!booking) {
    console.error('❌ SellerBookingDetailsPage - No booking provided');
    return (
      <div className="bg-[#F8F8FA] min-h-screen py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#1B1C20] mb-4">Booking Not Found</h1>
            <p className="text-[#70727F] mb-6">The booking you're looking for could not be found.</p>
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'details' | 'earnings' | 'activity'>('details');
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [addNotesOpen, setAddNotesOpen] = useState(false);
  const [addedNotes, setAddedNotes] = useState<Array<{id: number, note: string, timestamp: Date}>>([]);
  const [bookingConfirmationOpen, setBookingConfirmationOpen] = useState(false);

  // Helper functions
  const mapServiceStatus = (status: string, userRole: 'buyer' | 'seller'): string => {
    if (status === 'confirmed' || status === 'scheduled') {
      return userRole === 'buyer' ? 'confirmed' : 'scheduled';
    }
    return status;
  };

  const formatCustomerName = (fullName: string): string => {
    if (!fullName) return 'Customer';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
    return lastNameInitial ? `${firstName} ${lastNameInitial}.` : firstName;
  };

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('❌ Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } catch (error) {
      console.error('❌ Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const formatDateTime = (date: Date) => {
    try {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('❌ Error formatting datetime:', error);
      return 'Invalid DateTime';
    }
  };

  // Calculate seller payment breakdown
  const calculateSellerPaymentBreakdown = (): SellerPaymentBreakdown => {
    try {
      const customerPaid = booking.totalAmount || 0;
      let taxRate = 0;
      let taxType: 'Sales Tax' | 'VAT' = 'Sales Tax';

      if (userRegion === 'US') {
        taxRate = 0.08;
        taxType = 'Sales Tax';
      } else if (userRegion === 'EU' || userRegion === 'UK') {
        taxRate = 0.20;
        taxType = 'VAT';
      }

      const baseAmount = customerPaid / (1 + taxRate);
      const tax = customerPaid - baseAmount;
      
      const platformFeeRate = 0.05;
      const paymentProcessingRate = 0.029;
      
      const platformFee = baseAmount * platformFeeRate;
      const paymentProcessingFee = baseAmount * paymentProcessingRate;
      const sellerEarnings = baseAmount - platformFee - paymentProcessingFee;

      return {
        customerPaid,
        platformFee,
        paymentProcessingFee,
        sellerEarnings,
        tax,
        taxType,
        taxRate: taxRate * 100
      };
    } catch (error) {
      console.error('❌ Error calculating payment breakdown:', error);
      return {
        customerPaid: 0,
        platformFee: 0,
        paymentProcessingFee: 0,
        sellerEarnings: 0,
        tax: 0,
        taxType: 'Sales Tax',
        taxRate: 0
      };
    }
  };

  // Initialize variables
  const userRole: 'buyer' | 'seller' = 'seller';
  const mappedStatus = mapServiceStatus(booking.status, userRole) as OrderStatus;
  const paymentBreakdown = calculateSellerPaymentBreakdown();

  // Helper function to check if seller can review the customer
  const canSellerReviewCustomer = (): boolean => {
    // Only allow reviews for completed services
    if (mappedStatus !== 'completed') return false;
    
    // Check if provider has already reviewed the customer for this booking
    if (booking.reviews?.providerReviewedCustomer) return false;
    
    // Check if service was completed within the last 30 days
    const completionDate = booking.appointmentDate || booking.orderDate;
    const daysSinceCompletion = Math.floor((new Date().getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCompletion > 30) return false;
    
    return true;
  };

  // Get status configuration
  const getStatusConfig = () => {
    switch (mappedStatus as OrderStatus) {
      case 'pending':
      case 'requested':
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#E8E9ED]',
          borderColor: 'border-[#70727F]',
          icon: Clock3,
          title: 'Booking Confirmation Required',
          description: 'Customer is waiting for you to confirm this booking',
          urgency: '', // Removed to avoid duplication with customer waiting message
          canAccept: true,
          canDecline: true,
          canReschedule: false,
          canMessage: true,
          canViewAppointment: false,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false // Add review capability flag
        };
      case 'scheduled':
        return {
          color: 'text-[#3D1560]',
          bgColor: 'bg-[#EDD9FF]',
          borderColor: 'border-[#3D1560]',
          icon: Calendar,
          title: 'Appointment Scheduled',
          description: 'Booking confirmed, appointment upcoming',
          urgency: '📅 Prepare for upcoming appointment',
          canAccept: false,
          canDecline: false,
          canReschedule: true,
          canMessage: true,
          canViewAppointment: true,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false
        };
      case 'in_progress':
        return {
          color: 'text-[#6D26AB]',
          bgColor: 'bg-[#EDD9FF]',
          borderColor: 'border-[#6D26AB]',
          icon: RefreshCw,
          title: 'Service in Progress',
          description: 'Service is currently being performed',
          urgency: '🔄 Service is active',
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: true,
          canViewAppointment: true,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false
        };
      case 'completed':
        return {
          color: 'text-[#4CAF50]',
          bgColor: 'bg-[#E8F5E8]',
          borderColor: 'border-[#4CAF50]',
          icon: CheckCircle,
          title: 'Service Completed',
          description: 'Service has been completed successfully',
          urgency: '',
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: true,
          canViewAppointment: true,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: canSellerReviewCustomer() // Dynamic review capability
        };
      case 'cancelled':
        return {
          color: 'text-[#DF678C]',
          bgColor: 'bg-[#FFE5ED]',
          borderColor: 'border-[#DF678C]',
          icon: XCircle,
          title: 'Booking Cancelled',
          description: 'This booking has been cancelled',
          urgency: '',
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: true,
          canViewAppointment: false,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false
        };
      case 'no_show':
        return {
          color: 'text-[#DF678C]',
          bgColor: 'bg-[#FFE5ED]',
          borderColor: 'border-[#DF678C]',
          icon: AlertTriangle,
          title: 'Customer No Show',
          description: 'Customer did not show up for the appointment',
          urgency: '',
          canAccept: false,
          canDecline: false,
          canReschedule: true,
          canMessage: true,
          canViewAppointment: false,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false
        };
      case 'rescheduled':
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#E8E9ED]',
          borderColor: 'border-[#70727F]',
          icon: RotateCcw,
          title: 'Rescheduled',
          description: 'Appointment has been moved to a new time',
          urgency: '',
          canAccept: false,
          canDecline: false,
          canReschedule: true,
          canMessage: true,
          canViewAppointment: true,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false
        };
      default:
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#CDCED8]',
          borderColor: 'border-[#70727F]',
          icon: Calendar,
          title: 'Booking Status',
          description: 'Service booking details',
          urgency: '',
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: true,
          canViewAppointment: false,
          canAddNotes: true,
          canViewPerformance: true,
          canReview: false
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const customerInfo = {
    name: formatCustomerName(booking.customer?.name || booking.id),
    email: booking.customer?.email || `customer.${booking.id.toLowerCase()}@example.com`,
    phone: booking.customer?.phone || '(555) 123-4567',
    isReturning: true
  };

  // AppointmentDetailsModal component for seller view
  const AppointmentDetailsModal = () => {
    if (!appointmentDetailsOpen || !booking.service || !booking.appointmentDate) return null;

    const appointmentStart = booking.appointmentDate;
    const appointmentEnd = new Date(appointmentStart.getTime() + (booking.service.duration * 60 * 1000));
    
    const formattedDate = formatDate(appointmentStart);
    const formattedTimeRange = `${formatTime(appointmentStart)} - ${formatTime(appointmentEnd)}`;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#3D1560] text-white p-3.5 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">Booking Details</h3>
            <button 
              onClick={() => setAppointmentDetailsOpen(false)}
              className="text-white hover:text-[#CDCED8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Service Information */}
            <div className="pb-4 border-b border-[#E8E9ED]">
              <div className="flex gap-3 items-center">
                {booking.service.images && booking.service.images.length > 0 && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0">
                    <img 
                      src={booking.service.images[0]} 
                      alt={booking.service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-[#1B1C20] mb-1 truncate">{booking.service.name}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                      {statusConfig.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'paid' ? 'bg-[#E8F5E8] text-[#4CAF50]' : 'bg-[#E8E9ED] text-[#70727F]'
                    }`}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment & Location */}
            <div className="pb-4 border-b border-[#E8E9ED]">
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Appointment & Location</h5>
              <div className="bg-[#F8F8FA] p-3 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#3D1560]" />
                    <div>
                      <p className="text-xs text-[#70727F] font-medium">Date</p>
                      <p className="text-[#383A47] font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#3D1560]" />
                    <div>
                      <p className="text-xs text-[#70727F] font-medium">Time</p>
                      <p className="text-[#383A47] font-medium">{formatTime(booking.appointmentDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-[#3D1560]" />
                    <div>
                      <p className="text-xs text-[#70727F] font-medium">Duration</p>
                      <p className="text-[#383A47] font-medium">{booking.service.duration} min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#3D1560]" />
                    <div>
                      <p className="text-xs text-[#70727F] font-medium">Service Delivery</p>
                      <p className="text-[#383A47] font-medium">
                        {selectedServiceMode === 'at_seller' ? 'At Your Location' : 
                         selectedServiceMode === 'at_buyer' ? 'At Customer Location' : 'Remote'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-[#E8E9ED] pt-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#3D1560]" />
                    <div className="flex-1">
                      <p className="text-xs text-[#70727F] font-medium">City, Country</p>
                      <p className="text-[#383A47] font-medium">
                        {(() => {
                          if (booking.serviceLocation?.city && booking.serviceLocation?.country) {
                            return `${booking.serviceLocation.city}, ${booking.serviceLocation.country}`;
                          } else if (selectedServiceMode === 'remote') {
                            return 'Remote';
                          } else if (booking.service?.provider?.location?.city && booking.service?.provider?.location?.country) {
                            return `${booking.service.provider.location.city}, ${booking.service.provider.location.country}`;
                          }
                          return 'Not specified';
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Service address for seller view */}
                  {booking.serviceAddress && (
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <MapPin className="w-4 h-4 text-[#3D1560]" />
                      <div className="flex-1">
                        <p className="text-xs text-[#70727F] font-medium">Service Address</p>
                        <p className="text-[#383A47] font-medium">
                          {booking.serviceAddress.replace(/,\s*[A-Z]{2}\s*\d{5}/, '').replace(/,\s*United States$/, '')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="pb-4 border-b border-[#E8E9ED]">
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Customer Information</h5>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EDD9FF] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-[#3D1560]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1B1C20] text-sm truncate">{formatCustomerName(customerInfo.name)}</p>
                  <div className="flex items-center gap-2 text-xs text-[#70727F]">
                    <User className="w-3 h-3" />
                    <span className="truncate">CM{booking.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div>
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Your Earnings</h5>
              <div className="bg-[#F8F8FA] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-[#383A47] text-sm">
                    {booking.paymentStatus === 'paid' ? 'Payment received' : 'Payment pending'}
                  </span>
                </div>
                <span className="text-lg font-bold text-[#4CAF50]">
                  ${paymentBreakdown.customerPaid.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-[#E8E9ED]">
              {statusConfig.canMessage && (
                <button 
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[#3D1560] text-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message Customer
                </button>
              )}
              {statusConfig.canReschedule && (
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors text-sm">
                  <Calendar className="w-4 h-4" />
                  Reschedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handler functions
  const handleAddNotes = () => {
    setAddNotesOpen(true);
  };

  const handleSaveNotes = () => {
    if (notes.trim()) {
      const newNote = {
        id: Date.now(), // Simple ID generation
        note: notes.trim(),
        timestamp: new Date()
      };
      
      setAddedNotes(prev => [...prev, newNote]);
      console.log('Saving booking notes:', { bookingId: booking.id, notes: notes.trim() });
      setAddNotesOpen(false);
      setNotes('');
      // Show success message or update UI
    }
  };

  const handleContactCustomer = () => {
    console.log('Opening customer contact');
    if (onNavigateToMessages) {
      // Sellers can only reply to existing threads, so just pass the thread ID
      onNavigateToMessages(booking.id);
    }
  };

  const handleReviewCustomer = () => {
    console.log('Opening review modal for customer:', customerInfo.name);
    // In a real app, this would open a review modal or navigate to review page
    // For now, just show a placeholder action
    alert(`Review ${formatCustomerName(customerInfo.name)}\n\nThis would open a review form where you can:\n- Rate the customer (1-5 stars)\n- Write feedback about communication, punctuality, etc.\n- Provide constructive feedback to help future service providers\n- Submit your experience working with this customer`);
  };

  const handleViewPerformance = () => {
    if (booking.service?.id && onNavigateToService) {
      onNavigateToService(booking.service.id);
    } else {
      console.log('Navigate to service performance for:', booking.service?.id);
    }
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    // Show success toast or feedback
    console.log('Booking ID copied to clipboard');
  };

  const handleAcceptBooking = () => {
    setBookingConfirmationOpen(true);
  };

  const handleConfirmBooking = () => {
    if (onConfirmBooking) {
      onConfirmBooking(booking.id);
    }
    setBookingConfirmationOpen(false);
    console.log('Booking confirmed:', booking.id);
  };

  const handleDeclineBooking = () => {
    if (onDeclineBooking) {
      onDeclineBooking(booking.id);
    }
    setBookingConfirmationOpen(false);
    console.log('Booking declined:', booking.id);
  };

  // Enhanced seller activity timeline for bookings
  const getActivityTimeline = (): SellerActivityEntry[] => {
    const baseActivities: SellerActivityEntry[] = [
      {
        id: 1,
        type: 'booking_created',
        title: 'Booking Created',
        description: 'New booking received from customer',
        timestamp: booking.orderDate,
        icon: Calendar
      },
      {
        id: 2,
        type: 'payment_received',
        title: 'Payment Received',
        description: `Payment of $${paymentBreakdown.customerPaid.toFixed(2)} received from customer`,
        timestamp: new Date(booking.orderDate.getTime() + 30 * 60 * 1000),
        icon: CreditCard
      }
    ];

    // Add status-specific activities
    if (['scheduled', 'confirmed', 'completed'].includes(booking.status)) {
      baseActivities.push({
        id: 3,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        description: 'You confirmed the booking and appointment was scheduled',
        timestamp: new Date(booking.orderDate.getTime() + 60 * 60 * 1000),
        icon: CheckCircle
      });
    }

    // Add notes activities
    addedNotes.forEach((noteEntry, index) => {
      baseActivities.push({
        id: 100 + noteEntry.id, // Ensure unique IDs
        type: 'note_added',
        title: 'Booking Note Added',
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
      return <p className="text-sm text-[#70727F]">No activity recorded for this booking yet.</p>;
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

  console.log('✅ SellerBookingDetailsPage - Rendering successfully');

  return (
    <div className="bg-[#F8F8FA] min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
              Booking #{booking.id}
            </h1>
            <p className="text-[#70727F] text-sm mt-1">
              Booked on {formatDate(booking.orderDate)} • Customer: {customerInfo.name}
            </p>
          </div>
        </div>

        {/* Status Header Card */}
        <div className="mb-6">
          <div className={`flex flex-col gap-4 px-6 py-5 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
            <div className="flex items-center gap-4">
              <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              <div className="flex-1">
                <h2 className={`text-xl font-semibold ${statusConfig.color}`}>{statusConfig.title}</h2>
                <p className={`text-sm ${statusConfig.color} opacity-80`}>{statusConfig.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#70727F]">Booking Amount</p>
                <p className="text-xl font-bold text-[#3D1560]">${paymentBreakdown.customerPaid.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Enhanced waiting message for booking requests */}
            {(mappedStatus === 'pending' || mappedStatus === 'requested') && (
              <div className="flex items-start gap-3 p-4 bg-[#EDD9FF] rounded-lg border-l-4 border-[#3D1560]">
                <div className="w-8 h-8 rounded-full bg-[#3D1560] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1B1C20] mb-1">
                    {customerInfo.name} is waiting for your response
                  </p>
                  <p className="text-xs text-[#383A47] leading-relaxed">
                    ⏰ Respond within 24 hours • 💰 Payment secured • Please confirm or decline to maintain your response rate.
                  </p>
                </div>
                <div className="text-right">
                  <button 
                    onClick={handleAcceptBooking}
                    className="px-3 py-1.5 bg-[#3D1560] text-white rounded-md hover:bg-[#6D26AB] transition-colors text-xs font-medium"
                  >
                    Confirm Now
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline Card */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <OrderStatusTimeline 
                currentStatus={mappedStatus as OrderStatus}
                orderType="service"
                orderDate={booking.orderDate}
                bookingId={booking.id}
                userRole={userRole}
                className="mb-2"
              />
            </div>

            {/* Tab Navigation Card */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED]">
              <div className="border-b border-[#E8E9ED]">
                <nav className="flex space-x-1 md:space-x-2 px-3 sm:px-4">
                  {[
                    { id: 'details', label: 'Booking Details', icon: FileText },
                    { id: 'earnings', label: 'Payment Info', icon: CreditCard },
                    { id: 'activity', label: 'Activity Log', icon: Clock3 }
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
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="space-y-8">
                    {/* Service Information Card */}
            {booking.service && (
              <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Service Information</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                          {booking.service.images && booking.service.images.length > 0 && (
                            <div className="relative w-full sm:w-24 h-32 sm:h-24 rounded-md overflow-hidden border border-[#CDCED8] flex-shrink-0">
                              <img 
                                src={booking.service.images[0]} 
                                alt={booking.service.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                  <div className="flex-1">
                            <h4 className="text-xl font-semibold mb-1.5 text-[#383A47]">
                              {booking.service.name}
                            </h4>
                            <p className="text-[#70727F] text-sm mb-3 leading-relaxed">{booking.service.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-[#70727F]">
                                <div className="flex items-center gap-1">
                                  <Clock3 className="w-3.5 h-3.5 text-[#383A47]" />
                                  <span>{booking.service.duration} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>{booking.service.category}</span>
                                </div>
                      </div>
                              <div className="text-xl font-bold text-[#1B1C20]">
                                ${booking.service.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

                    {/* Appointment & Location Details Card */}
                    {booking.service && (
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                        <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Appointment & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          {[
                            { icon: Calendar, label: "Date", value: booking.appointmentDate ? formatDate(booking.appointmentDate) : 'TBD' },
                            { icon: Clock, label: "Time", value: booking.appointmentDate ? formatTime(booking.appointmentDate) : 'TBD' },
                            { icon: selectedServiceMode === 'at_seller' ? Building : selectedServiceMode === 'at_buyer' ? Home : Monitor, label: "Service Delivery", value: selectedServiceMode === 'at_seller' ? 'At Your Location' : selectedServiceMode === 'at_buyer' ? 'At Customer Location' : 'Remote' },
                            { icon: Clock3, label: "Duration", value: `${booking.service.duration} minutes` },
                            { 
                              icon: MapPin, 
                              label: "Service Location", 
                              value: selectedServiceMode === 'at_seller' ? 'Seller Provided Address' : selectedServiceMode === 'at_buyer' ? 'Buyer Provided Address' : 'Remote',
                              isClickable: selectedServiceMode === 'at_seller',
                              onClick: () => setAppointmentDetailsOpen(true)
                            },
                          ].map(detail => (
                            <div key={detail.label} className="flex items-start gap-3">
                              <detail.icon className="w-5 h-5 text-[#3D1560] mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-[#70727F] uppercase tracking-wider font-medium">{detail.label}</p>
                                {detail.isClickable ? (
                                  <button 
                                    onClick={detail.onClick}
                                    className="font-medium text-[#383A47] text-sm hover:text-[#3D1560] transition-colors duration-200 text-left"
                                  >
                                    {detail.value}
                                  </button>
                                ) : (
                                  <p className="font-medium text-[#383A47] text-sm">{detail.value}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                </div>
                    )}

                    {/* Customer Information Card */}
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Customer Information</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#EDD9FF] flex items-center justify-center">
                          <User className="w-8 h-8 text-[#3D1560]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#3D1560] mb-0.5">{formatCustomerName(customerInfo.name)}</h4>
                          <div className="flex items-center gap-3 text-sm text-[#70727F]">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>CM{booking.id.slice(-6).toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium py-2 px-4 rounded-md border border-[#3D1560] hover:bg-[#EDD9FF] transition-all duration-200 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info Tab */}
                {activeTab === 'earnings' && (
                  <div className="space-y-6">
                    {/* Financial Transparency Card */}
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Financial Summary</h3>
                      
                      {/* Customer Payment vs Seller Earnings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#F8F8FA] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#70727F] mb-2">Customer Paid</h4>
                          <p className="text-2xl font-bold text-[#1B1C20]">${paymentBreakdown.customerPaid.toFixed(2)}</p>
                          <p className="text-xs text-[#70727F] mt-1">Service + taxes</p>
                        </div>
                        <div className="bg-[#EDD9FF] p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-[#3D1560] mb-2">You Receive</h4>
                          <p className="text-2xl font-bold text-[#3D1560]">${paymentBreakdown.sellerEarnings.toFixed(2)}</p>
                          <p className="text-xs text-[#3D1560] opacity-80 mt-1">After all fees & charges</p>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="space-y-3 mb-5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#383A47] font-medium">Service Amount:</span>
                          <span className="text-[#383A47] font-medium">${(paymentBreakdown.customerPaid - paymentBreakdown.tax).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">{paymentBreakdown.taxType} ({paymentBreakdown.taxRate.toFixed(0)}%):</span>
                          <span className="text-[#70727F]">${paymentBreakdown.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Platform Fee:</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Payment Processing:</span>
                          <span className="text-[#70727F]">-${paymentBreakdown.paymentProcessingFee.toFixed(2)}</span>
                        </div>
                        <hr className="border-t border-[#E8E9ED] my-3" />
                        <div className="flex justify-between items-center text-base">
                          <span className="text-[#383A47] font-semibold">Net Earnings:</span>
                          <span className="text-[#3D1560] font-bold text-lg">${paymentBreakdown.sellerEarnings.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#70727F]">Profit Margin:</span>
                          <span className="text-[#70727F] font-medium">
                            {((paymentBreakdown.sellerEarnings / paymentBreakdown.customerPaid) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-[#E8E9ED] pt-5">
                        <h4 className="text-base font-semibold text-[#1B1C20] mb-3">Payment Status</h4>
                        <div className="bg-[#EDD9FF] rounded-lg p-4 border border-[#3D1560]">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-[#3D1560]" />
                            <div>
                              <p className="font-medium text-[#3D1560]">
                                {booking.paymentStatus === 'paid' ? 'Payment Received' : 'Payment Processing'}
                              </p>
                              <p className="text-sm text-[#3D1560] opacity-80">
                                {booking.paymentStatus === 'paid' 
                                  ? `Earnings will be deposited to your account within 2-3 business days after service completion.`
                                  : 'Earnings will be deposited to your account within 2-3 business days after service completion.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Performance Insight */}
                      <div className="mt-6 border-t border-[#E8E9ED] pt-5">
                        <h4 className="text-base font-semibold text-[#1B1C20] mb-3">Service Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#F8F8FA] p-3 rounded-lg text-center">
                            <p className="text-xs text-[#70727F] mb-1">Service Duration</p>
                            <p className="text-lg font-bold text-[#383A47]">{booking.service?.duration || 60} min</p>
                          </div>
                          <div className="bg-[#F8F8FA] p-3 rounded-lg text-center">
                            <p className="text-xs text-[#70727F] mb-1">Hourly Rate</p>
                            <p className="text-lg font-bold text-[#383A47]">
                              ${((paymentBreakdown.sellerEarnings / ((booking.service?.duration || 60) / 60))).toFixed(0)}/hr
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Log Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Booking Activity</h3>
                      {renderActivityLog()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Actions & Quick Info) */}
          <div className="space-y-6">
            {/* Primary Actions Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Primary Actions</h3>
              <div className="space-y-3 mb-4">
                {/* Primary Actions - Most Important */}
                {statusConfig.canAccept && (
                  <button 
                    onClick={handleAcceptBooking}
                    className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm Booking
                  </button>
                )}
                {statusConfig.canReschedule && (
                  <button className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg">
                    <Calendar className="w-5 h-5" />
                    Reschedule
                  </button>
                )}
                {statusConfig.canViewAppointment && (
                  <button 
                    onClick={() => setAppointmentDetailsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#E8E9ED] text-[#383A47] hover:bg-[#CDCED8] hover:text-[#1B1C20] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                    View Appointment Details
                  </button>
                )}
                {statusConfig.canReview && (
                  <button 
                    onClick={handleReviewCustomer}
                    className="w-full flex items-center justify-center gap-2 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Review Customer
                  </button>
                )}
                {statusConfig.canDecline && (
                  <button 
                    onClick={handleDeclineBooking}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#DF678C] text-[#DF678C] hover:bg-[#FFE5ED] transition-colors duration-200 px-4 py-3 rounded-lg font-semibold text-sm"
                  >
                    <XCircle className="w-5 h-5" />
                    Decline Booking
                  </button>
                )}
              </div>
              
              {/* Secondary Actions - Progressive Disclosure */}
              <div className="border-t border-[#E8E9ED] pt-4">
                <h4 className="text-sm font-medium text-[#70727F] mb-3">Additional Actions</h4>
                                <div className="space-y-2">
                  {statusConfig.canMessage && (
                    <button
                      onClick={handleContactCustomer}
                      className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message Customer
                    </button>
                  )}
                  {statusConfig.canAddNotes && (
                    <button
                      onClick={handleAddNotes}
                      className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Booking Notes
                    </button>
                  )}
                  {statusConfig.canViewPerformance && (
                    <button
                      onClick={handleViewPerformance}
                      className="w-full flex items-center gap-2 text-[#3D1560] hover:text-[#6D26AB] hover:bg-[#EDD9FF] transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Performance
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Booking Summary Card */}
            <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Booking Summary</h3>
              <div className="space-y-3">
                {/* Core Identifiers */}
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Booking ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#383A47]">#{booking.id}</span>
                    <button 
                      onClick={handleCopyBookingId}
                      className="text-[#3D1560] hover:text-[#6D26AB] p-1"
                      title="Copy Booking ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Booking Date</span>
                  <span className="font-medium text-[#383A47]">{formatDate(booking.orderDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Status</span>
                  <span className={`font-medium ${statusConfig.color}`}>{statusConfig.title}</span>
                </div>
                
                {/* Service Details */}
                <div className="bg-[#F8F8FA] p-3 rounded-lg mt-4">
                  <h4 className="text-sm font-semibold text-[#383A47] mb-3">Service Breakdown</h4>
                  
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#70727F]">Service</span>
                    <span className="text-[#383A47] font-medium">{booking.service?.name || 'Service'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#70727F]">Duration</span>
                    <span className="text-[#383A47]">{booking.service?.duration || 60} minutes</span>
                  </div>


                  {booking.appointmentDate && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#70727F]">Date</span>
                        <span className="text-[#383A47] font-medium">{formatDate(booking.appointmentDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#70727F]">Time</span>
                        <span className="text-[#383A47] font-medium">{formatTime(booking.appointmentDate)}</span>
                      </div>
                    </>
                  )}
                </div>

                  {/* Enhanced Payment Breakdown */}
                  <div className="space-y-1 mb-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Customer Paid:</span>
                      <span className="text-[#383A47]">${paymentBreakdown.customerPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Platform Fee:</span>
                      <span className="text-[#70727F]">-${paymentBreakdown.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Payment Processing:</span>
                      <span className="text-[#70727F]">-${paymentBreakdown.paymentProcessingFee.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between text-sm font-medium border-t border-[#CDCED8] pt-2">
                  <span className="text-[#383A47]">Your Earnings</span>
                    <span className="text-[#4CAF50] font-bold">${paymentBreakdown.sellerEarnings.toFixed(2)}</span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="pt-3 border-t border-[#CDCED8]">
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Payment Status</span>
                    <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-[#4CAF50]' : 'text-[#70727F]'}`}>
                      {booking.paymentStatus === 'paid' ? 'Received' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Service Delivery</span>
                    <span className="font-medium text-[#383A47]">
                      {selectedServiceMode === 'at_seller' ? 'At Your Location' : 
                       selectedServiceMode === 'at_buyer' ? 'At Customer Location' : 'Remote'}
                    </span>
              </div>
                </div>
              </div>
            </div>

            {/* Support & Resources Card */}
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

      {/* Appointment Details Modal */}
      {appointmentDetailsOpen && (
        <AppointmentDetailsModal />
      )}

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={bookingConfirmationOpen}
        onClose={() => setBookingConfirmationOpen(false)}
        onConfirm={handleConfirmBooking}
        onDecline={handleDeclineBooking}
        booking={booking}
        customerName={customerInfo.name}
      />

      {/* Add Notes Modal */}
      <AddBookingNotesModal
        isOpen={addNotesOpen}
        onClose={() => setAddNotesOpen(false)}
        notes={notes}
        setNotes={setNotes}
        onSubmit={handleSaveNotes}
      />
    </div>
  );
} 

// Helper function to get icon and colors for activity log entries
const getIconForActivity = (type: SellerActivityEntry['type']) => {
  switch (type) {
    case 'booking_created': return { icon: Calendar, bgColor: 'bg-[#E8F5E9]', iconColor: 'text-[#4CAF50]' };
    case 'payment_received': return { icon: CreditCard, bgColor: 'bg-[#EDD9FF]', iconColor: 'text-[#3D1560]' };
    case 'booking_confirmed': return { icon: CheckCircle, bgColor: 'bg-[#EDD9FF]', iconColor: 'text-[#3D1560]' };
    case 'note_added': return { icon: Info, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#70727F]' };
    case 'status_updated': return { icon: Clock3, bgColor: 'bg-[#FFF9C4]', iconColor: 'text-[#FBC02D]' };
    default: return { icon: Info, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#70727F]' };
  }
}; 