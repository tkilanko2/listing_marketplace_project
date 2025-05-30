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
  X
} from 'lucide-react';
import { Order } from '../types';
import SellerTermsModal from '../components/SellerTermsModal';

interface BookingDetailsPageProps {
  booking: Order;
  onBack: () => void;
  userRegion?: 'US' | 'EU' | 'UK'; // For tax calculation display
  selectedServiceMode?: 'at_seller' | 'at_buyer' | 'remote'; // Service delivery mode
}

interface PaymentBreakdown {
  serviceFee: number;
  tax: number;
  taxType: 'Sales Tax' | 'VAT';
  taxRate: number;
  total: number;
}

export function BookingDetailsPage({ booking, onBack, userRegion = 'US', selectedServiceMode = 'at_seller' }: BookingDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'activity'>('details');
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false);
  const [serviceTermsOpen, setServiceTermsOpen] = useState(false);

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
    switch (booking.status) {
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
            <h1 className="text-3xl font-bold text-[#1B1C20] mb-2">Booking #{booking.id}</h1>
            <p className="text-[#70727F] text-lg">
              Booked on {formatDate(booking.orderDate)}
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
          {/* Status Alert */}
          {booking.status === 'requested' && (
            <div className="bg-[#E8E9ED] border border-[#70727F] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-[#70727F] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#70727F] mb-1">Awaiting Confirmation</h3>
                  <p className="text-sm text-[#70727F] opacity-80">
                    Your booking request has been sent to the provider. You'll receive a notification once they confirm your appointment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {booking.status === 'scheduled' && booking.appointmentDate && (
            <div className="bg-[#EDD9FF] border border-[#6D26AB] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#6D26AB] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#6D26AB] mb-1">Upcoming Appointment</h3>
                  <p className="text-sm text-[#6D26AB] opacity-80">
                    Your appointment is scheduled for {formatDateTime(booking.appointmentDate)}
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
                  { id: 'details', label: 'Booking Details', icon: FileText },
                  { id: 'payment', label: 'Payment Info', icon: CreditCard },
                  { id: 'activity', label: 'Activity', icon: Clock }
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
              {/* Booking Details Tab */}
              {activeTab === 'details' && booking.service && (
                <div className="space-y-6">
                  {/* Service Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#1B1C20] mb-4">Service Details</h3>
                    <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                      <div className="flex gap-4">
                        {booking.service.images && booking.service.images.length > 0 && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0">
                            <img 
                              src={booking.service.images[0]} 
                              alt={booking.service.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#1B1C20] mb-2">{booking.service.name}</h4>
                          <p className="text-[#70727F] mb-2">{booking.service.shortDescription}</p>
                          <div className="flex items-center gap-4 text-sm text-[#70727F]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.service.duration} minutes
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {booking.service.location.city}, {booking.service.location.country}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Delivery & Appointment Information */}
                  {booking.appointmentDate && (
                    <div>
                      <h3 className="text-xl font-semibold text-[#1B1C20] mb-4">Appointment Details</h3>
                      <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#3D1560]" />
                            <div>
                              <p className="text-sm text-[#70727F]">Date</p>
                              <p className="font-medium text-[#383A47]">{formatDate(booking.appointmentDate)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#3D1560]" />
                            <div>
                              <p className="text-sm text-[#70727F]">Time</p>
                              <p className="font-medium text-[#383A47]">{formatTime(booking.appointmentDate)}</p>
                            </div>
                          </div>
                          {serviceLocationDetails && (
                            <div className="flex items-start gap-3 md:col-span-2">
                              <serviceLocationDetails.icon className="w-5 h-5 text-[#3D1560] mt-0.5" />
                              <div>
                                <p className="text-sm text-[#70727F]">{serviceLocationDetails.type}</p>
                                <p className="font-medium text-[#383A47] mb-1">{serviceLocationDetails.address}</p>
                                <p className="text-xs text-[#70727F]">{serviceLocationDetails.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Provider Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#1B1C20] mb-4">Service Provider</h3>
                    <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#CDCED8]">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-[#CDCED8]">
                          <img 
                            src={booking.service.provider.avatar} 
                            alt={booking.service.provider.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-[#1B1C20] mb-1">{booking.service.provider.username}</h4>
                          <div className="flex items-center gap-4 text-sm text-[#70727F]">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              {booking.service.provider.rating.toFixed(1)} ({booking.service.provider.totalBookings} bookings)
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {booking.service.provider.location.city}, {booking.service.provider.location.country}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#1B1C20]">Payment Information</h3>
                  
                  {/* Payment Breakdown */}
                  <div className="bg-[#F8F8FA] rounded-lg p-6 border border-[#CDCED8]">
                    <h4 className="text-lg font-semibold text-[#1B1C20] mb-4">Amount Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[#70727F]">Service Fee</span>
                        <span className="font-medium text-[#383A47]">${paymentBreakdown.serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#70727F]">
                          {paymentBreakdown.taxType} ({paymentBreakdown.taxRate}% - {userRegion})
                        </span>
                        <span className="font-medium text-[#383A47]">${paymentBreakdown.tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-[#CDCED8] pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-[#1B1C20]">Total Paid</span>
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
                          <p className="font-medium text-[#383A47] font-mono text-sm">TXN-{booking.id}-{Date.now().toString().slice(-6)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#3D1560]" />
                        <div>
                          <p className="text-sm text-[#70727F]">Payment Date</p>
                          <p className="font-medium text-[#383A47]">{formatDateTime(booking.orderDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${booking.paymentStatus === 'paid' ? 'text-[#1B1C20]' : 'text-[#70727F]'}`} />
                        <div>
                          <p className="text-sm text-[#70727F]">Payment Status</p>
                          <p className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-[#1B1C20]' : 'text-[#70727F]'}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
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
                  <h3 className="text-xl font-semibold text-[#1B1C20]">Booking Activity</h3>
                  
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
              {statusConfig.canViewDetails && (
                <button 
                  onClick={() => setAppointmentDetailsOpen(true)}
                  className="w-full flex items-center gap-3 p-3 text-left bg-[#F3E8F9] border border-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors duration-200"
                >
                  <Eye className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#3D1560]">View Appointment Details</span>
                </button>
              )}
              
              {/* Service Terms Button */}
              <button 
                onClick={() => setServiceTermsOpen(true)}
                className="w-full flex items-center gap-3 p-3 text-left bg-[#F8F8FA] border border-[#70727F] rounded-lg hover:bg-[#E8E9ED] transition-colors duration-200"
              >
                <FileText className="w-5 h-5 text-[#70727F]" />
                <span className="font-medium text-[#383A47]">View Service Agreement</span>
              </button>
              
              {statusConfig.canReschedule && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#EDD9FF] border border-[#6D26AB] rounded-lg hover:bg-[#F3E8F9] transition-colors duration-200">
                  <Calendar className="w-5 h-5 text-[#6D26AB]" />
                  <span className="font-medium text-[#6D26AB]">Reschedule Appointment</span>
                </button>
              )}
              
              {statusConfig.canMessage && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#F8F8FA] border border-[#3D1560] rounded-lg hover:bg-[#EDD9FF] transition-colors duration-200">
                  <MessageCircle className="w-5 h-5 text-[#3D1560]" />
                  <span className="font-medium text-[#3D1560]">Message Provider</span>
                </button>
              )}
              
              {booking.status === 'completed' && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#F8F8FA] border border-[#1B1C20] rounded-lg hover:bg-[#E8E9ED] transition-colors duration-200">
                  <Star className="w-5 h-5 text-[#1B1C20]" />
                  <span className="font-medium text-[#1B1C20]">Leave a Review</span>
                </button>
              )}
              
              {statusConfig.canCancel && (
                <button className="w-full flex items-center gap-3 p-3 text-left bg-[#FFE5ED] border border-[#DF678C] rounded-lg hover:bg-[#FFD1DC] transition-colors duration-200">
                  <XCircle className="w-5 h-5 text-[#DF678C]" />
                  <span className="font-medium text-[#DF678C]">Cancel Booking</span>
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

          {/* Booking Summary */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm p-6 border border-[#CDCED8]">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Booking Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#70727F]">Booking ID</span>
                <span className="font-medium text-[#383A47]">#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70727F]">Service</span>
                <span className="font-medium text-[#383A47]">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70727F]">Duration</span>
                <span className="font-medium text-[#383A47]">{booking.service?.duration} min</span>
              </div>
              {serviceLocationDetails && (
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Service Type</span>
                  <span className="font-medium text-[#383A47]">{serviceLocationDetails.type}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#70727F]">Total Paid</span>
                <span className="font-bold text-[#1B1C20] text-base">${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal />
      
      {/* Service Terms Modal */}
      <SellerTermsModal 
        open={serviceTermsOpen}
        onClose={() => setServiceTermsOpen(false)}
        serviceName={booking.service?.name}
        providerName={booking.service?.provider.username}
        serviceType="service"
      />
    </div>
  );
} 