import React, { useState } from 'react';
import { Service, TimeSlot } from '../types';
import { CreditCard, DollarSign, Clock, User } from 'lucide-react';
import { getServiceTierDetails } from '../mockData';

interface BookingFormProps {
  selectedService: Service;
  selectedSlot?: TimeSlot | null;
  onSubmit: (data: { 
    customerName: string; 
    customerEmail: string; 
    notes: string;
    paymentMethod: 'online' | 'inPerson';
  }) => void;
}

export function BookingForm({ selectedService, selectedSlot, onSubmit }: BookingFormProps) {
  const [selectedTier, setSelectedTier] = useState<string>(selectedService.defaultTier || '');
  
  // Get the current tier details
  const currentTier = selectedTier 
    ? getServiceTierDetails(selectedService.id, selectedTier)
    : null;
  
  // Use tier details if available, otherwise use service defaults
  const displayPrice = currentTier?.price || selectedService.price;
  const displayDuration = currentTier?.duration || selectedService.duration;
  const displayDescription = currentTier?.description || selectedService.description;
  const displayOnlinePayment = currentTier?.onlinePayment || selectedService.paymentOptions.onlinePayment;
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    notes: '',
    paymentMethod: (() => {
      if (displayOnlinePayment) return 'online';
      if (selectedService.paymentOptions.payAtService) return 'inPerson';
      return 'inPerson'; // fallback
    })() as 'online' | 'inPerson'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#1B1C20]">Booking Details</h3>
        <div className="bg-[#E8E9ED] p-4 rounded-lg mb-4 border border-[#CDCED8]">
          <div className="mb-3">
            <h4 className="font-medium text-[#383A47] mb-2">{selectedService.name}</h4>
            <p className="text-sm text-[#70727F] mb-3">{displayDescription}</p>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm text-[#70727F]">
              <Clock className="w-4 h-4 mr-2 text-[#3D1560]" />
              <span>{displayDuration} minutes</span>
            </div>
            
            <div className="flex items-center text-sm text-[#70727F]">
              <User className="w-4 h-4 mr-2 text-[#3D1560]" />
              <span>{selectedService.provider.username || 'Service Provider'}</span>
            </div>
          </div>
          
          {selectedSlot && (
            <div className="mb-3">
              <p className="text-sm text-[#70727F] font-medium">Scheduled for:</p>
              <p className="text-sm text-[#383A47]">
                {selectedSlot.start.toLocaleString('default', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
          
          <div className="pt-3 border-t border-[#CDCED8]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#70727F]">Amount:</span>
              <span className="font-medium text-[#3D1560] text-lg">${displayPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {selectedSlot ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#383A47] mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-[#3D1560]"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#383A47] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-[#3D1560]"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#383A47] mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6D26AB] focus:border-[#3D1560]"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#383A47] mb-1">
              Payment Method
            </label>
            <div className={`flex gap-2 ${(displayOnlinePayment && selectedService.paymentOptions.payAtService) ? 'flex-row' : 'flex-col'}`}>
              {displayOnlinePayment && (
                <label className={`
                  border p-3 rounded-md flex items-center cursor-pointer transition-colors
                  ${(displayOnlinePayment && selectedService.paymentOptions.payAtService) ? 'flex-1 min-w-0' : 'w-64'}
                  ${formData.paymentMethod === 'online' ? 'border-[#3D1560] bg-[#EDD9FF]' : 'border-[#CDCED8] hover:bg-[#E8E9ED]'}
                `}>
                  <input
                    type="radio"
                    className="sr-only"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                  />
                  <CreditCard className="w-5 h-5 mr-2 text-[#3D1560]" />
                  <div>
                    <p className="font-medium text-[#383A47]">Pay Online</p>
                    <p className="text-xs text-[#70727F]">Secure online payment</p>
                  </div>
                </label>
              )}
              
              {selectedService.paymentOptions.payAtService && (
                <label className={`
                  border p-3 rounded-md flex items-center cursor-pointer transition-colors
                  ${(displayOnlinePayment && selectedService.paymentOptions.payAtService) ? 'flex-1 min-w-0' : 'w-64'}
                  ${formData.paymentMethod === 'inPerson' ? 'border-[#3D1560] bg-[#EDD9FF]' : 'border-[#CDCED8] hover:bg-[#E8E9ED]'}
                `}>
                  <input
                    type="radio"
                    className="sr-only"
                    name="paymentMethod"
                    value="inPerson"
                    checked={formData.paymentMethod === 'inPerson'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'inPerson' })}
                  />
                  <DollarSign className="w-5 h-5 mr-2 text-[#3D1560]" />
                  <div>
                    <p className="font-medium text-[#383A47]">Pay at Service</p>
                    <p className="text-xs text-[#70727F]">Pay when service is provided</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3D1560] text-white py-2 px-4 rounded-md hover:bg-[#6D26AB] transition-colors"
          >
            {formData.paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Booking'}
          </button>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-[#70727F]">Please select a date and time to continue</p>
        </div>
      )}
    </div>
  );
}