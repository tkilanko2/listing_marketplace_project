import React from 'react';
import { ChevronLeft } from 'react-feather';
import { Order } from '../types';

interface PlaceholderProps {
  title: string;
  description: string;
  onBack: () => void;
  children?: React.ReactNode;
}

export function PlaceholderPage({ title, description, onBack, children }: PlaceholderProps) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-[#F8F8FA]">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-[#70727F] hover:text-[#383A47] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-[#1B1C20] ml-6">{title}</h1>
      </div>
      
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm p-8 border border-[#CDCED8]">
        <p className="text-[#70727F] mb-6">{description}</p>
        {children}
      </div>
    </div>
  );
}

export function OrderDetailsPage({ order, onBack }: { order: Order, onBack: () => void }) {
  return (
    <PlaceholderPage 
      title="Order Details" 
      description={`View details for order ${order.id}`}
      onBack={onBack}
    >
      <div className="p-6 bg-[#F8F8FA] rounded-lg border border-[#CDCED8]">
        <p className="text-center text-[#70727F]">
          This is a placeholder for the Order Details page. 
          In a complete implementation, this would show detailed information about the order,
          including items, pricing, shipping details, and order history.
        </p>
      </div>
    </PlaceholderPage>
  );
}

export function OrderTrackingPage({ order, onBack }: { order: Order, onBack: () => void }) {
  return (
    <PlaceholderPage 
      title="Track Your Order" 
      description={`Tracking information for order ${order.id}`}
      onBack={onBack}
    >
      <div className="p-6 bg-[#F8F8FA] rounded-lg border border-[#CDCED8]">
        <p className="text-center text-[#70727F] mb-6">
          This is a placeholder for the Order Tracking page. 
          In a complete implementation, this would show the current status and location of your order,
          with a visual timeline of the shipping process.
        </p>
        {order.trackingInfo && (
          <div className="mt-4 p-4 border border-[#CDCED8] rounded-md">
            <p><strong>Carrier:</strong> {order.trackingInfo.carrier}</p>
            <p><strong>Tracking Number:</strong> {order.trackingInfo.trackingNumber}</p>
            <p><strong>Estimated Delivery:</strong> {new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </PlaceholderPage>
  );
}

export function OrderCancellationPage({ order, onBack }: { order: Order, onBack: () => void }) {
  return (
    <PlaceholderPage 
      title="Cancel Order" 
      description={`Cancel your order ${order.id}`}
      onBack={onBack}
    >
      <div className="p-6 bg-[#F8F8FA] rounded-lg border border-[#CDCED8]">
        <p className="text-center text-[#70727F] mb-6">
          This is a placeholder for the Order Cancellation page. 
          In a complete implementation, this would allow you to cancel your order
          and select a reason for cancellation.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-[#E8E9ED] text-[#383A47] rounded hover:bg-[#CDCED8] transition-colors">
            Go Back
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Cancel Order
          </button>
        </div>
      </div>
    </PlaceholderPage>
  );
}

export function OrderReturnPage({ order, onBack }: { order: Order, onBack: () => void }) {
  return (
    <PlaceholderPage 
      title="Return Items" 
      description={`Initiate a return for order ${order.id}`}
      onBack={onBack}
    >
      <div className="p-6 bg-[#F8F8FA] rounded-lg border border-[#CDCED8]">
        <p className="text-center text-[#70727F] mb-6">
          This is a placeholder for the Order Return page. 
          In a complete implementation, this would allow you to select items to return,
          specify a reason, and print a return label.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-[#E8E9ED] text-[#383A47] rounded hover:bg-[#CDCED8] transition-colors">
            Go Back
          </button>
          <button className="px-4 py-2 bg-[#3D1560] text-white rounded hover:bg-[#6D26AB] transition-colors">
            Continue Return Process
          </button>
        </div>
      </div>
    </PlaceholderPage>
  );
}

export function OrderReviewPage({ order, onBack }: { order: Order, onBack: () => void }) {
  return (
    <PlaceholderPage 
      title="Write a Review" 
      description={`Share your feedback for order ${order.id}`}
      onBack={onBack}
    >
      <div className="p-6 bg-[#F8F8FA] rounded-lg border border-[#CDCED8]">
        <p className="text-center text-[#70727F] mb-6">
          This is a placeholder for the Order Review page. 
          In a complete implementation, this would allow you to rate your purchase
          and write a detailed review.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-[#E8E9ED] text-[#383A47] rounded hover:bg-[#CDCED8] transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 bg-[#3D1560] text-white rounded hover:bg-[#6D26AB] transition-colors">
            Submit Review
          </button>
        </div>
      </div>
    </PlaceholderPage>
  );
} 