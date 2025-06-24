import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
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
  Monitor,
  Home,
  Building,
  X,
  Copy,
  PlusCircle,
  Info
} from 'lucide-react';
import { Order, ActivityLogEntry, Service, OrderStatus } from '../types';
import SellerTermsModal from '../components/SellerTermsModal';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';

interface BookingDetailsPageProps {
  booking: Order;
  onBack: () => void;
  userRegion?: 'US' | 'EU' | 'UK'; // For tax calculation display
  selectedServiceMode?: 'at_seller' | 'at_buyer' | 'remote'; // Service delivery mode
  onNavigateToMyBookings?: () => void; // Navigate to My Bookings page
}

interface PaymentBreakdown {
  serviceFee: number;
  tax: number;
  taxType: 'Sales Tax' | 'VAT';
  taxRate: number;
  total: number;
}

// Helper to map service status for buyer/seller view
function mapServiceStatus(status: string, userRole: 'buyer' | 'seller'): string {
  // Backend stores a single status field for service bookings. Frontend maps 'confirmed'/'scheduled' based on user role for display.
  if (status === 'confirmed' || status === 'scheduled') {
    return userRole === 'buyer' ? 'confirmed' : 'scheduled';
  }
  return status;
}

export function BookingDetailsPage({ booking, onBack, userRegion = 'US', selectedServiceMode = 'at_seller', onNavigateToMyBookings }: BookingDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'activity'>('details');
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [serviceTermsOpen, setServiceTermsOpen] = useState(false);

  // Assume My Orders is always buyer view
  const userRole: 'buyer' | 'seller' = 'buyer';
  const mappedStatus = mapServiceStatus(booking.status, userRole) as OrderStatus;

  // Calculate payment breakdown based on region
  const calculatePaymentBreakdown = (): PaymentBreakdown => {
    const serviceFee = booking.totalAmount;
    let taxRate = 0;
    let taxType: 'Sales Tax' | 'VAT' = 'Sales Tax';

    if (userRegion === 'US') {
      taxRate = 0.08; // 8% sales tax
      taxType = 'Sales Tax';
    } else if (userRegion === 'EU' || userRegion === 'UK') {
      taxRate = 0.20; // 20% VAT
      taxType = 'VAT';
    }

    const baseAmount = serviceFee / (1 + taxRate);
    const tax = serviceFee - baseAmount;

    return {
      serviceFee: baseAmount,
      tax,
      taxType,
      taxRate: taxRate * 100,
      total: serviceFee
    };
  };

  const paymentBreakdown = calculatePaymentBreakdown();

  // Get service delivery location details
  const getServiceLocationDetails = () => {
    if (!booking.service) return null;

    switch (selectedServiceMode) {
      case 'at_seller':
        return {
          type: 'At Provider Location',
          address: booking.location || `${booking.service.provider.location.city}, ${booking.service.provider.location.country}`,
          icon: Building,
          description: 'Service will be performed at the provider\'s location'
        };
      case 'at_buyer':
        return {
          type: 'At Your Location',
          address: booking.location || 'Your specified address',
          icon: Home,
          description: 'Provider will come to your location'
        };
      case 'remote':
        return {
          type: 'Remote Service',
          address: 'Online/Virtual',
          icon: Monitor,
          description: 'Service will be delivered remotely online'
        };
      default:
        return {
          type: 'Service Location',
          address: booking.location || `${booking.service.location.city}, ${booking.service.location.country}`,
          icon: MapPin,
          description: 'Service location details'
        };
    }
  };

  const serviceLocationDetails = getServiceLocationDetails();

  const getStatusConfig = () => {
    switch (mappedStatus as OrderStatus) {
      case 'requested':
        return {
          color: 'text-[#70727F]', // Secondary text color
          bgColor: 'bg-[#E8E9ED]', // Light background
          borderColor: 'border-[#70727F]',
          icon: Clock3,
          title: 'Booking Requested',
          description: 'Waiting for provider confirmation',
          canCancel: true,
          canReschedule: false,
          canMessage: true,
          canViewDetails: false
        };
      case 'confirmed':
        return {
          color: 'text-[#3D1560]', // Primary accent
          bgColor: 'bg-[#EDD9FF]', // Primary disabled background
          borderColor: 'border-[#3D1560]',
          icon: CheckCircle,
          title: 'Booking Confirmed',
          description: 'Your appointment is confirmed',
          canCancel: true,
          canReschedule: true,
          canMessage: true,
          canViewDetails: true
        };
      case 'scheduled':
        return {
          color: 'text-[#6D26AB]', // Primary hover
          bgColor: 'bg-[#EDD9FF]', // Primary disabled background
          borderColor: 'border-[#6D26AB]',
          icon: Calendar,
          title: 'Scheduled',
          description: 'Appointment is coming up',
          canCancel: true,
          canReschedule: true,
          canMessage: true,
          canViewDetails: true
        };
      case 'in_progress':
        return {
          color: 'text-[#6D26AB]', // Primary hover
          bgColor: 'bg-[#EDD9FF]', // Primary disabled background
          borderColor: 'border-[#6D26AB]',
          icon: RefreshCw,
          title: 'Service in Progress',
          description: 'Your service is currently being performed',
          canCancel: false,
          canReschedule: false,
          canMessage: true,
          canViewDetails: true
        };
      case 'completed':
        return {
          color: 'text-[#1B1C20]', // Header text for completed
          bgColor: 'bg-[#F8F8FA]', // Ultra-light background
          borderColor: 'border-[#CDCED8]',
          icon: CheckCircle2,
          title: 'Service Completed',
          description: 'Service has been successfully completed',
          canCancel: false,
          canReschedule: false,
          canMessage: true,
          canViewDetails: true
        };
      case 'cancelled':
        return {
          color: 'text-[#DF678C]', // Secondary accent pink for warnings/errors
          bgColor: 'bg-[#FFE5ED]', // Pink background light
          borderColor: 'border-[#DF678C]',
          icon: XCircle,
          title: 'Cancelled',
          description: 'This booking has been cancelled',
          canCancel: false,
          canReschedule: false,
          canMessage: true,
          canViewDetails: false
        };
      case 'no_show':
        return {
          color: 'text-[#DF678C]', // Secondary accent pink
          bgColor: 'bg-[#FFE5ED]', // Pink background light
          borderColor: 'border-[#DF678C]',
          icon: AlertTriangle,
          title: 'No Show',
          description: 'Customer did not show up for the appointment',
          canCancel: false,
          canReschedule: true,
          canMessage: true,
          canViewDetails: false
        };
      case 'rescheduled':
        return {
          color: 'text-[#70727F]', // Secondary text
          bgColor: 'bg-[#E8E9ED]', // Light background
          borderColor: 'border-[#70727F]',
          icon: RotateCcw,
          title: 'Rescheduled',
          description: 'Appointment has been moved to a new time',
          canCancel: true,
          canReschedule: true,
          canMessage: true,
          canViewDetails: true
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
          canReschedule: false,
          canMessage: false,
          canViewDetails: false
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateTime = (date: Date) => {
    return `${formatDate(date)} at ${formatTime(date)}`;
  };

  // Mock activity timeline
  const activityTimeline = [
    {
      id: 1,
      action: 'Booking Confirmed',
      description: 'Your booking has been confirmed by the service provider',
      timestamp: new Date(booking.orderDate.getTime() + 60 * 60 * 1000),
      icon: CheckCircle,
      status: 'completed'
    },
    {
      id: 2,
      action: 'Payment Processed',
      description: `Payment of $${booking.totalAmount.toFixed(2)} was successfully processed`,
      timestamp: new Date(booking.orderDate.getTime() + 30 * 60 * 1000),
      icon: CreditCard,
      status: 'completed'
    },
    {
      id: 3,
      action: 'Booking Requested',
      description: 'Initial booking request was submitted',
      timestamp: booking.orderDate,
      icon: Calendar,
      status: 'completed'
    }
  ];

  const handleServiceClick = (serviceId: string) => {
    // Check if service is still active/live
    const service = booking.service;
    if (service && (service.status === 'active' || !service.status)) {
      // Navigate to service details page
      console.log('Navigate to service:', serviceId);
      // This would typically call a navigation function passed as prop
      // onNavigateToService?.(serviceId);
    }
  };

  const isServiceClickable = (service: any) => {
    return service && (service.status === 'active' || !service.status);
  };

  // Appointment Details Modal Component
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
          <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold">Appointment Details</h3>
            <button 
              onClick={() => setAppointmentDetailsOpen(false)}
              className="text-white hover:text-[#CDCED8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Service Information */}
            <div>
              <div className="flex gap-4 items-center">
                {booking.service.images && booking.service.images.length > 0 && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0">
                    <img 
                      src={booking.service.images[0]} 
                      alt={booking.service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[#1B1C20] mb-1">{booking.service.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                      {statusConfig.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.paymentStatus === 'paid' ? 'bg-[#F8F8FA] text-[#1B1C20]' : 'bg-[#E8E9ED] text-[#70727F]'
                    }`}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Date & Time</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#3D1560]" />
                  <span className="text-[#383A47]">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#3D1560]" />
                  <span className="text-[#383A47]">{formattedTimeRange}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 className="w-5 h-5 text-[#3D1560]" />
                  <span className="text-[#383A47]">Duration: {booking.service.duration} minutes</span>
                </div>
              </div>
            </div>

            {/* Location */}
            {serviceLocationDetails && (
              <div>
                <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Location</h5>
                <div className="flex items-start gap-3">
                  <serviceLocationDetails.icon className="w-5 h-5 text-[#3D1560] mt-0.5" />
                  <div>
                    <p className="text-[#383A47] font-medium">{serviceLocationDetails.type}</p>
                    <p className="text-[#70727F] text-sm">{serviceLocationDetails.address}</p>
                    <p className="text-[#70727F] text-xs mt-1">{serviceLocationDetails.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Provider Information */}
            <div>
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Service Provider</h5>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#CDCED8]">
                  <img 
                    src={booking.service.provider.avatar} 
                    alt={booking.service.provider.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-[#1B1C20]">{booking.service.provider.username}</p>
                  <div className="flex items-center gap-1 text-sm text-[#70727F]">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {booking.service.provider.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h5 className="text-sm font-semibold text-[#1B1C20] mb-3">Payment</h5>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#3D1560]" />
                  <span className="text-[#383A47]">
                    {booking.paymentStatus === 'paid' ? 'Payment completed' : 'Payment pending'}
                  </span>
                </div>
                <span className="text-lg font-bold text-[#1B1C20]">
                  ${booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#CDCED8]">
              {statusConfig.canMessage && (
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#3D1560] text-[#3D1560] rounded-lg hover:bg-[#F3E8F9] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
              )}
              {statusConfig.canReschedule && (
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors">
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

  // Activity Log rendering
  const renderActivityLog = () => {
    if (!booking.activityLog || booking.activityLog.length === 0) {
      return <p className="text-sm text-[#70727F]">No activity recorded for this booking yet.</p>;
    }
    return (
      <ul className="space-y-4">
        {booking.activityLog.map((entry, index) => {
          const { icon: IconComponent, bgColor, iconColor } = getIconForActivity(entry.type);
          const ActualIcon = entry.icon || IconComponent; // Use entry specific icon if available, else default

          return (
            <li key={index} className="flex items-start gap-3 pb-4 border-b border-[#F8F8FA] last:border-b-0 last:pb-0">
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
                  {formatDateTime(new Date(entry.timestamp))}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
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
              Booking #{booking.id}
            </h1>
            <p className="text-[#70727F] text-sm mt-1">
              Booked on {formatDate(booking.orderDate)} • {booking.service?.name || 'Service'}
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
                <p className="text-xl font-bold text-[#3D1560]">${booking.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Contextual Assistance for Booking Status */}
            {(() => {
              let urgencyMessage = '';
              let timeEstimate = '';
              
              switch (mappedStatus) {
                case 'requested':
                  urgencyMessage = '⏳ Waiting for provider confirmation - most providers respond within 2 hours';
                  timeEstimate = 'Expected response: Within 2-4 hours';
                  break;
                case 'confirmed':
                  if (booking.appointmentDate) {
                    const hoursUntilAppointment = (new Date(booking.appointmentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60);
                    if (hoursUntilAppointment <= 24) {
                      urgencyMessage = '🔔 Your appointment is coming up soon - make sure to be ready';
                      timeEstimate = `Appointment in ${Math.round(hoursUntilAppointment)} hours`;
                    } else {
                      urgencyMessage = '📅 Your appointment is confirmed - you can reschedule up to 24 hours before';
                      timeEstimate = `Appointment: ${formatDateTime(booking.appointmentDate)}`;
                    }
                  }
                  break;
                case 'in_progress':
                  urgencyMessage = '🔄 Your service is currently in progress - the provider is working on your request';
                  timeEstimate = 'Service completion depends on scope and duration';
                  break;
                case 'completed':
                  urgencyMessage = '✅ Service completed successfully! Don\'t forget to rate your experience';
                  timeEstimate = 'Payment processed - receipt available';
                  break;
                case 'cancelled':
                  urgencyMessage = 'ℹ️ This booking has been cancelled - you can book a similar service again';
                  timeEstimate = 'Refund processed within 3-5 business days';
                  break;
              }
              
              if (urgencyMessage) {
                return (
                  <div className="flex items-start gap-3 p-3 bg-[#FFFFFF] bg-opacity-50 rounded-lg border border-[#FFFFFF] border-opacity-30">
                    <Info className="w-5 h-5 text-[#3D1560] mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#3D1560]">{urgencyMessage}</p>
                      {timeEstimate && (
                        <p className="text-xs text-[#3D1560] opacity-80 mt-1">{timeEstimate}</p>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Details) */}
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
                    { id: 'payment', label: 'Payment Info', icon: CreditCard },
                    { id: 'activity', label: 'Activity Log', icon: Clock } // Renamed for clarity
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
                {/* Tab Content will go here, styled in next steps */}
                {activeTab === 'details' && (
                  <div className="space-y-8">
                    {/* Service Information Card */}
                    {booking.service && (() => {
                      const service = booking.service;
                      const isClickable = isServiceClickable(service);
                      
                      return (
                        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                          <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Service Information</h3>
                          <div className="flex flex-col sm:flex-row gap-4">
                            {service.images && service.images.length > 0 && (
                              <div 
                                className={`relative w-full sm:w-24 h-32 sm:h-24 rounded-md overflow-hidden border border-[#CDCED8] flex-shrink-0 group ${
                                  isClickable ? 'cursor-pointer' : 'opacity-70'
                                }`}
                                onClick={() => isClickable && handleServiceClick(service.id)}
                              >
                                <img 
                                  src={service.images[0]} 
                                  alt={service.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {!isClickable && (
                                  <div className="absolute inset-0 bg-[#474958] bg-opacity-60 flex items-center justify-center">
                                    <span className="text-xs text-[#FFFFFF] font-medium px-2 py-1 bg-[#1B1C20] bg-opacity-70 rounded">Unavailable</span>
                                  </div>
                                )}
                                {isClickable && (
                                  <div className="absolute inset-0 bg-[#1B1C20] bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-[#FFFFFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 
                                className={`text-xl font-semibold mb-1.5 ${
                                  isClickable 
                                    ? 'text-[#3D1560] hover:text-[#6D26AB] cursor-pointer transition-colors' 
                                    : 'text-[#383A47]'
                                }`}
                                onClick={() => isClickable && handleServiceClick(service.id)}
                              >
                                {service.name}
                              </h4>
                              {!isClickable && (
                                <span className="text-xs bg-[#E8E9ED] text-[#70727F] px-2 py-0.5 rounded-full font-medium inline-block mb-2">
                                  No longer available
                                </span>
                              )}
                              <p className="text-[#70727F] text-sm mb-3 leading-relaxed line-clamp-2">{service.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm text-[#70727F]">
                                  <div className="flex items-center gap-1">
                                    <Clock3 className="w-3.5 h-3.5 text-[#383A47]" />
                                    <span>{service.duration} min</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Circle className="w-3 h-3 text-[#383A47] fill-current" /> {/* Placeholder for category icon */}
                                    <span>{service.category}</span>
                                  </div>
                                </div>
                                <div className="text-xl font-bold text-[#1B1C20]">
                                  ${service.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Appointment & Location Details Card */}
                    {booking.service && (() => {
                      const service = booking.service;
                      const locationDetails = getServiceLocationDetails();
                      return (
                        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                          <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Appointment & Location</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {[ // Array for easy mapping
                              { icon: Calendar, label: "Date", value: booking.appointmentDate ? formatDate(booking.appointmentDate) : 'TBD' },
                              { icon: Clock, label: "Time", value: booking.appointmentDate ? formatTime(booking.appointmentDate) : 'TBD' },
                              { icon: locationDetails?.icon || MapPin, label: locationDetails?.type || "Location", value: locationDetails?.address || 'Not specified' },
                              { icon: Clock3, label: "Duration", value: `${service.duration} minutes` },
                            ].map(detail => (
                              <div key={detail.label} className="flex items-start gap-3">
                                <detail.icon className="w-5 h-5 text-[#3D1560] mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-[#70727F] uppercase tracking-wider font-medium">{detail.label}</p>
                                  <p className="font-medium text-[#383A47] text-sm">{detail.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Provider Information Card */}
                    {booking.service && booking.service.provider && (() => {
                      const provider = booking.service.provider;
                      return (
                        <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                          <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Service Provider</h3>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#EDD9FF]">
                              <img 
                                src={provider.avatar || '/placeholder-avatar.jpg'} 
                                alt={provider.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-[#3D1560] mb-0.5">{provider.username}</h4>
                              <div className="flex items-center gap-3 text-sm text-[#70727F]">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-[#FFC107] fill-current" />
                                  {provider.rating?.toFixed(1) || 'N/A'} 
                                  <span className="text-[#CDCED8]">|</span>
                                  <span>{provider.totalBookings || 0} bookings</span>
                                </div>
                              </div>
                            </div>
                            <button className="text-sm text-[#3D1560] hover:text-[#6D26AB] font-medium py-2 px-4 rounded-md border border-[#3D1560] hover:bg-[#EDD9FF] transition-all duration-200 flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Contact
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Payment Info Tab */}
                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E8E9ED] shadow-sm">
                      <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Payment Summary</h3>
                      
                      <div className="space-y-3 mb-5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">Service Fee:</span>
                          <span className="text-[#383A47] font-medium">${paymentBreakdown.serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#70727F]">{paymentBreakdown.taxType} ({paymentBreakdown.taxRate.toFixed(0)}%):</span>
                          <span className="text-[#383A47] font-medium">${paymentBreakdown.tax.toFixed(2)}</span>
                        </div>
                        <hr className="border-t border-[#E8E9ED] my-2" />
                        <div className="flex justify-between items-center text-base">
                          <span className="text-[#383A47] font-semibold">Total Amount Paid:</span>
                          <span className="text-[#1B1C20] font-bold text-lg">${paymentBreakdown.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-[#E8E9ED] pt-5">
                        <h4 className="text-base font-semibold text-[#1B1C20] mb-3">Payment Method</h4>
                        <div className="flex items-center gap-3 bg-[#F8F8FA] p-3 rounded-md border border-[#E8E9ED]">
                          <CreditCard className="w-6 h-6 text-[#3D1560]" />
                          <div>
                            <p className="text-[#383A47] font-medium text-sm">
                              Visa ending in **** {booking.paymentDetails?.last4 || '1234'} 
                            </p>
                            <p className="text-xs text-[#70727F]">
                              Paid on {formatDate(booking.orderDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button className="w-full sm:w-auto flex-1 bg-[#3D1560] text-[#FFFFFF] hover:bg-[#6D26AB] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </button>
                        <button className="w-full sm:w-auto flex-1 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] hover:border-[#B0B2C0] transition-colors duration-200 px-4 py-2.5 rounded-md font-medium text-sm flex items-center justify-center gap-2">
                          <Shield className="w-4 h-4" />
                          Payment Help
                        </button>
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

          {/* Right Column (Summary Sidebar) */}
          <div className="space-y-6">
            {/* Booking Summary Card */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Booking Summary</h3>
              <div className="space-y-3">
                {/* Core Identifiers */}
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Booking ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#383A47]">#{booking.id}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(booking.id)}
                      className="text-[#3D1560] hover:text-[#6D26AB] p-1"
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
                  <h4 className="text-sm font-semibold text-[#383A47] mb-3">Service Details</h4>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#70727F]">Service</span>
                      <span className="text-[#383A47] font-medium">{booking.service?.name || 'Service'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#70727F]">Duration</span>
                      <span className="text-[#383A47]">{booking.service?.duration || 60} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#70727F]">Provider</span>
                      <span className="text-[#383A47]">{booking.service?.provider?.username || 'Provider'}</span>
                    </div>
                    {booking.appointmentDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#70727F]">Appointment</span>
                        <span className="text-[#383A47] font-medium">{formatDateTime(booking.appointmentDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-sm font-medium border-t border-[#CDCED8] pt-2">
                    <span className="text-[#383A47]">Total Amount</span>
                    <span className="text-[#3D1560] font-bold">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#CDCED8]">
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Payment Status</span>
                    <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-[#4CAF50]' : 'text-[#70727F]'}`}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#70727F]">Service Mode</span>
                    <span className="font-medium text-[#383A47]">
                      {selectedServiceMode === 'at_seller' ? 'At Provider' : 
                       selectedServiceMode === 'at_buyer' ? 'At Your Location' : 'Remote'}
                    </span>
                  </div>
                  {serviceLocationDetails && (
                    <div className="flex justify-between">
                      <span className="text-[#70727F]">Location</span>
                      <span className="font-medium text-[#383A47] text-right text-xs">
                        {serviceLocationDetails.address?.length > 30 
                          ? `${serviceLocationDetails.address.substring(0, 30)}...` 
                          : serviceLocationDetails.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {statusConfig.canMessage && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#3D1560] text-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors duration-200">
                    <MessageCircle className="w-4 h-4" />
                    Message Provider
                  </button>
                )}
                {statusConfig.canReschedule && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors duration-200">
                    <Calendar className="w-4 h-4" />
                    Reschedule
                  </button>
                )}
                {statusConfig.canCancel && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#DF678C] text-[#DF678C] rounded-lg hover:bg-[#FFE5ED] transition-colors duration-200">
                    <X className="w-4 h-4" />
                    Cancel Booking
                  </button>
                )}
                <button 
                  onClick={() => setAppointmentDetailsOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#CDCED8] text-[#383A47] hover:bg-[#E8E9ED] transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  View Full Details
                </button>
                                 {/* My Appointments CTA - Available for all service statuses */}
                 <button 
                   onClick={() => onNavigateToMyBookings?.()}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6D26AB] text-white rounded-lg hover:bg-[#9B53D9] transition-colors duration-200"
                 >
                   <Calendar className="w-4 h-4" />
                   My Appointments
                 </button>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Modals */}
      {appointmentDetailsOpen && booking.service && <AppointmentDetailsModal />}
      {serviceTermsOpen && booking.service && (
        <SellerTermsModal 
          open={serviceTermsOpen} 
          onClose={() => setServiceTermsOpen(false)} 
          serviceName={booking.service.name}
          providerName={booking.service.provider.username}
          serviceType="service" // Explicitly set for bookings
        />
      )}
    </div>
  );
}

// Helper function to get icon and colors for activity log entries
const getIconForActivity = (type: ActivityLogEntry['type']) => {
  switch (type) {
    case 'created': return { icon: PlusCircle, bgColor: 'bg-[#E8F5E9]', iconColor: 'text-[#4CAF50]' };
    case 'confirmed': return { icon: CheckCircle, bgColor: 'bg-[#EDD9FF]', iconColor: 'text-[#3D1560]' };
    case 'rescheduled': return { icon: RefreshCw, bgColor: 'bg-[#FFF9C4]', iconColor: 'text-[#FBC02D]' };
    case 'cancelled': return { icon: XCircle, bgColor: 'bg-[#FFE5ED]', iconColor: 'text-[#DF678C]' };
    case 'completed': return { icon: CheckCircle2, bgColor: 'bg-[#E8F5E9]', iconColor: 'text-[#4CAF50]' };
    case 'payment': return { icon: CreditCard, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#383A47]' };
    case 'note':
    default: return { icon: Info, bgColor: 'bg-[#E8E9ED]', iconColor: 'text-[#70727F]' };
  }
}; 