import React, { useState } from 'react';
import { Service, TimeSlot } from '../types';

interface BookingFormProps {
  selectedService: Service;
  selectedSlot: TimeSlot;
  onSubmit: (data: { customerName: string; customerEmail: string; notes: string }) => void;
}

export function BookingForm({ selectedService, selectedSlot, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="font-medium">{selectedService.name}</p>
          <p className="text-sm text-gray-600">
            {selectedSlot.start.toLocaleString('default', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={formData.customerEmail}
          onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Confirm Booking
      </button>
    </form>
  );
}