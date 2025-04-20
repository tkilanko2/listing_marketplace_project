import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShoppingBag, UserCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  onBack: () => void;
  onProceedAsGuest: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onOrderComplete: () => void;
}

export function CheckoutPage({
  onBack,
  onProceedAsGuest,
  onSignIn,
  onSignUp,
  onOrderComplete
}: CheckoutPageProps) {
  const { getCartTotal } = useCart();
  const [processing, setProcessing] = useState(false);
  
  const handleProceedAsGuest = () => {
    setProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setProcessing(false);
      onProceedAsGuest();
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA]">
      {/* Navigation and Breadcrumb */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-[#70727F] hover:text-[#383A47] mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Back to cart</span>
        </button>
        <div className="text-sm text-[#70727F]">
          Home / Cart / Checkout
        </div>
      </div>

      {/* Checkout Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B1C20]">Checkout</h1>
        <p className="text-[#383A47] mt-1">Complete your purchase</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-[#CDCED8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CreditCard className="w-16 h-16 text-[#3D1560]" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#1B1C20] mb-4">How would you like to proceed?</h2>
          <p className="text-[#383A47] mb-8">
            Your total is <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
          </p>

          <div className="space-y-4">
            <button
              onClick={onSignIn}
              disabled={processing}
              className="w-full bg-[#3D1560] text-white px-6 py-4 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors shadow-sm hover:shadow-md flex items-center justify-center relative"
            >
              {processing ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <UserCircle className="w-5 h-5 mr-2" />
              )}
              Sign In to Continue
            </button>
            
            <button
              onClick={onSignUp}
              disabled={processing}
              className="w-full bg-[#9B53D9] text-white px-6 py-4 rounded-lg font-medium hover:bg-[#6D26AB] transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <UserCircle className="w-5 h-5 mr-2" />
              Sign Up for an Account
            </button>
            
            <button
              onClick={handleProceedAsGuest}
              disabled={processing}
              className="w-full bg-[#F8F8FA] border border-[#CDCED8] text-[#383A47] px-6 py-4 rounded-lg font-medium hover:bg-[#E8E9ED] transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
            >
              {processing ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ShoppingBag className="w-5 h-5 mr-2" />
              )}
              {processing ? 'Processing...' : 'Continue as Guest'}
            </button>
          </div>

          <p className="text-sm text-[#70727F] mt-8">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your personal information will be used to process your order and support your experience.
          </p>
        </div>
      </div>
    </div>
  );
} 