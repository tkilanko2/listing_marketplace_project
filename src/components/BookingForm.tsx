import React, { useState } from 'react';
import { Service, TimeSlot } from '../types';
import { CreditCard, DollarSign } from 'lucide-react';

interface BookingFormProps {
  selectedService: Service;
  selectedSlot: TimeSlot;
  onSubmit: (data: { 
    customerName: string; 
    customerEmail: string; 
    notes: string;
    paymentMethod: 'online' | 'inPerson'; 
  }) => void;
}

export function BookingForm({ selectedService, selectedSlot, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    notes: '',
    paymentMethod: selectedService.paymentOptions.onlinePayment ? 'online' : 'inPerson' as 'online' | 'inPerson'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-[#1B1C20]">Booking Details</h3>
        <div className="bg-[#E8E9ED] p-4 rounded-lg mb-4 border border-[#CDCED8]">
          <p className="font-medium text-[#383A47]">{selectedService.name}</p>
          <p className="text-sm text-[#70727F]">
            {selectedSlot.start.toLocaleString('default', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
          <div className="mt-2 pt-2 border-t border-[#CDCED8]">
            <p className="font-medium text-[#3D1560]">${selectedService.price.toFixed(2)}</p>
          </div>
        </div>
      </div>

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

      {/* Payment options */}
      {selectedService.paymentOptions.onlinePayment && selectedService.paymentOptions.payAtService && (
        <div>
          <label className="block text-sm font-medium text-[#383A47] mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label 
              className={`
                border p-3 rounded-md flex items-center cursor-pointer transition-colors
                ${formData.paymentMethod === 'online' 
                  ? 'border-[#3D1560] bg-[#EDD9FF]' 
                  : 'border-[#CDCED8] hover:bg-[#E8E9ED]'
                }
              `}
            >
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
                <p className="text-xs text-[#70727F]">Secure card payment</p>
              </div>
            </label>
            
            <label 
              className={`
                border p-3 rounded-md flex items-center cursor-pointer transition-colors
                ${formData.paymentMethod === 'inPerson' 
                  ? 'border-[#3D1560] bg-[#EDD9FF]' 
                  : 'border-[#CDCED8] hover:bg-[#E8E9ED]'
                }
              `}
            >
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
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-[#3D1560] text-white py-2 px-4 rounded-md hover:bg-[#6D26AB] transition-colors"
      >
        {formData.paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Booking'}
      </button>
    </form>
  );
}