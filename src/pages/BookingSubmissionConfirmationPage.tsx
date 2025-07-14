import React from 'react';
import { CheckCircle, Clock, Mail, Calendar, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { Service } from '../types';

interface BookingSubmissionConfirmationPageProps {
  service: Service;
  customerName: string;
  customerEmail: string;
  selectedSlot: {
    start: Date;
    end: Date;
  };
  onBack: () => void;
  onViewMyRequests: () => void;
  onContinueBrowsing: () => void;
}

export function BookingSubmissionConfirmationPage({
  service,
  customerName,
  customerEmail,
  selectedSlot,
  onBack,
  onViewMyRequests,
  onContinueBrowsing
}: BookingSubmissionConfirmationPageProps) {
  
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

  const formatTimeRange = () => {
    return `${formatTime(selectedSlot.start)} - ${formatTime(selectedSlot.end)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#CDCED8]">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-[#70727F] hover:text-[#383A47] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-[#CDCED8]">
          {/* Success Icon and Title */}
          <div className="text-center mb-8">
            <div className="bg-[#EDD9FF] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#3D1560]" />
            </div>
            
            <h1 className="text-3xl font-bold text-[#1B1C20] mb-3">
              Booking Request Submitted!
            </h1>
            
            <p className="text-lg text-[#383A47] mb-2">
              Your booking request has been sent to <span className="font-semibold">{service.provider.name || service.provider.username}</span>
            </p>
            
            <p className="text-[#70727F] mb-6">
              They will review and confirm your appointment. You'll be charged once they accept your booking.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="bg-[#E8E9ED] rounded-lg p-4 mb-8 flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#3D1560] mr-3" />
            <span className="text-[#383A47] font-medium">Status: Pending Provider Confirmation</span>
          </div>

          {/* Booking Details Card */}
          <div className="bg-[#F8F8FA] rounded-lg p-6 mb-8 border border-[#E8E9ED]">
            <h2 className="text-xl font-semibold text-[#1B1C20] mb-4">Booking Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#383A47] mb-3">Service</h3>
                <div className="flex items-start space-x-3">
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#CDCED8]"
                  />
                  <div>
                    <p className="font-semibold text-[#1B1C20]">{service.name}</p>
                    <p className="text-sm text-[#70727F]">{service.duration} minutes</p>
                    <p className="text-[#3D1560] font-semibold">${service.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <h3 className="text-sm font-semibold text-[#383A47] mb-3">Date & Time</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#3D1560]" />
                    <span className="text-[#383A47]">{formatDate(selectedSlot.start)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#3D1560]" />
                    <span className="text-[#383A47]">{formatTimeRange()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#383A47] mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#3D1560]" />
                    <span className="text-[#383A47]">{customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#3D1560]" />
                    <span className="text-[#383A47]">{customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Provider Info */}
              <div>
                <h3 className="text-sm font-semibold text-[#383A47] mb-3">Service Provider</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={service.provider.avatar}
                    alt={service.provider.name || service.provider.username}
                    className="w-10 h-10 rounded-full object-cover border border-[#CDCED8]"
                  />
                  <div>
                    <p className="font-semibold text-[#1B1C20]">{service.provider.name || service.provider.username}</p>
                    <p className="text-sm text-[#70727F]">⭐ {service.provider.rating.toFixed(1)} rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-[#EDD9FF] rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#3D1560] mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              What Happens Next?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-[#3D1560] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                <p className="text-[#383A47]">
                  <strong>{service.provider.name || service.provider.username}</strong> will review your booking request (usually within a few hours)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-[#3D1560] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                <p className="text-[#383A47]">
                  You'll receive an email notification when they accept or propose changes
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-[#3D1560] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                <p className="text-[#383A47]">
                  Once confirmed, payment will be processed and you'll receive final booking details
                </p>
              </div>
            </div>
          </div>

          {/* Notification Notice */}
          <div className="bg-white border border-[#3D1560] rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#3D1560]" />
              <p className="text-[#383A47]">
                <strong>Email sent!</strong> A confirmation email has been sent to <span className="text-[#3D1560]">{customerEmail}</span> with your booking request details.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onViewMyRequests}
              className="flex items-center justify-center px-6 py-3 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-colors duration-200 font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              View My Booking Requests
            </button>
            
            <button
              onClick={onContinueBrowsing}
              className="flex items-center justify-center px-6 py-3 bg-white border border-[#CDCED8] text-[#383A47] rounded-lg hover:bg-[#E8E9ED] transition-colors duration-200 font-medium"
            >
              Continue Browsing Services
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 