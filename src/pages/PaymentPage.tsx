import React, { useState } from 'react';
import { Service, TimeSlot } from '../types';
import { PaymentForm } from '../components/PaymentForm';
import { ArrowLeft, Clock, Shield, CreditCard } from 'lucide-react';

interface PaymentPageProps {
  service: Service;
  selectedSlot: TimeSlot;
  customerName: string;
  customerEmail: string;
  onSuccessfulPayment: () => void;
  onBack: () => void;
}

export function PaymentPage({
  service,
  selectedSlot,
  customerName,
  customerEmail,
  onSuccessfulPayment,
  onBack
}: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = (data: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  }) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccessfulPayment();
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
              disabled={isProcessing}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            You're just one step away from confirming your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <PaymentForm
              service={service}
              amount={service.price}
              onSubmit={handlePaymentSubmit}
              onCancel={onBack}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
            
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h3 className="font-medium">{service.name}</h3>
              <div className="flex items-center mt-2 text-gray-600">
                <Clock className="w-4 h-4 mr-1.5" />
                <span className="text-sm">{formatDate(selectedSlot.start)}</span>
              </div>
              
              <div className="mt-4 flex items-center">
                <img
                  src={service.provider.avatar}
                  alt="Provider"
                  className="h-8 w-8 rounded-full object-cover mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{service.provider.name || 'Service Provider'}</p>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(service.provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({service.provider.reviews.length})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{customerName}</p>
              <p className="text-sm text-gray-500">{customerEmail}</p>
            </div>
            
            <div className="flex justify-between items-center font-medium mb-4">
              <span>Total</span>
              <span className="text-lg">${service.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-blue-500" />
                <span>Secure transaction</span>
              </div>
              <CreditCard className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </main>
      
      {isProcessing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-center font-medium">Processing your payment...</p>
            <p className="text-center text-sm text-gray-500 mt-2">Please do not close this window</p>
          </div>
        </div>
      )}
    </div>
  );
} 