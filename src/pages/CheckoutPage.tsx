import React, { useState } from 'react';
import { ArrowLeft, CreditCard, ShoppingBag, UserCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CheckoutPageProps {
  onBack: () => void;
  onProceedAsGuest: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export function CheckoutPage({
  onBack,
  onProceedAsGuest,
  onSignIn,
  onSignUp
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Navigation and Breadcrumb */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">Back to cart</span>
        </button>
        <div className="text-sm text-gray-500">
          Home / Cart / Checkout
        </div>
      </div>

      {/* Checkout Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-1">Complete your purchase</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CreditCard className="w-16 h-16 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How would you like to proceed?</h2>
          <p className="text-gray-600 mb-8">
            Your total is <span className="font-semibold">${getCartTotal().toFixed(2)}</span>
          </p>

          <div className="space-y-4">
            <button
              onClick={onSignIn}
              disabled={processing}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center relative"
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
              className="w-full bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <UserCircle className="w-5 h-5 mr-2" />
              Sign Up for an Account
            </button>
            
            <button
              onClick={handleProceedAsGuest}
              disabled={processing}
              className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
            >
              {processing ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ShoppingBag className="w-5 h-5 mr-2" />
              )}
              {processing ? 'Processing...' : 'Continue as Guest'}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your personal information will be used to process your order and support your experience.
          </p>
        </div>
      </div>
    </div>
  );
} 