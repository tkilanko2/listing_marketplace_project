import React from 'react';
import { CheckCircle } from 'lucide-react';

interface OrderConfirmationProps {
  onContinueShopping: () => void;
  onViewOrders: () => void;
  orderId?: string;
  email?: string;
}

export function OrderConfirmation({ 
  onContinueShopping, 
  onViewOrders,
  orderId = 'ORD12345',
  email = 'your@email.com'
}: OrderConfirmationProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA]">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-[#CDCED8] max-w-3xl mx-auto">
        <div className="text-center py-8">
          <div className="bg-[#EDD9FF] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#3D1560]" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#1B1C20] mb-2">Thank You For Your Order!</h1>
          <p className="text-lg text-[#383A47] mb-6">Your order #{orderId} has been placed successfully.</p>
          
          <p className="text-[#70727F] mb-6">
            We\'ve sent a confirmation email to {email} with all the details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={onContinueShopping}
              className="bg-[#F8F8FA] text-[#383A47] border border-[#CDCED8] px-6 py-3 rounded-lg font-medium hover:bg-[#E8E9ED] transition-colors duration-200 shadow-sm"
            >
              Continue Shopping
            </button>
            
            <button 
              onClick={onViewOrders}
              className="bg-[#3D1560] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors duration-200 shadow-sm"
            >
              View Order Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 