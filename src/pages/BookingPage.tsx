import React, { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { ServiceList } from '../components/ServiceList';
import { BookingForm } from '../components/BookingForm';
import { Service, TimeSlot } from '../types';
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft } from 'lucide-react';

// Generate mock time slots for the next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  
  for (let day = 0; day < 7; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() + day);
    
    for (let hour = 9; hour < 17; hour++) {
      const start = new Date(date.setHours(hour, 0, 0));
      const end = new Date(date.setHours(hour + 1, 0, 0));
      slots.push({
        start,
        end,
        available: Math.random() > 0.3
      });
    }
  }
  
  return slots;
};

interface BookingPageProps {
  selectedService: Service;
  allServices: Service[];
  onBack: () => void;
}

export function BookingPage({ selectedService, allServices, onBack }: BookingPageProps) {
  const [currentService, setCurrentService] = useState<Service>(selectedService);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const availableSlots = generateTimeSlots();

  const handleBookingSubmit = (data: { customerName: string; customerEmail: string; notes: string }) => {
    console.log('Booking submitted:', {
      service: currentService,
      slot: selectedSlot,
      customer: data
    });
    alert('Booking confirmed! Check your email for details.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={currentService.provider.avatar}
                alt={currentService.provider.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {currentService.provider.name}
                </h3>
                <p className="text-sm text-gray-600">Service Provider</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
              <ServiceList
                services={allServices}
                selectedService={currentService}
                onServiceSelect={setCurrentService}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  availableSlots={availableSlots}
                />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Available Times</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots
                      .filter(
                        slot => slot.start.toDateString() === selectedDate.toDateString()
                      )
                      .map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2 text-sm rounded-md border
                            ${
                              selectedSlot === slot
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          disabled={!slot.available}
                        >
                          {slot.start.toLocaleTimeString('default', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {currentService && selectedSlot ? (
                <BookingForm
                  selectedService={currentService}
                  selectedSlot={selectedSlot}
                  onSubmit={handleBookingSubmit}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Booking Steps</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Select a Service</p>
                        <p className="text-sm text-gray-500">Choose from available services</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Pick a Date</p>
                        <p className="text-sm text-gray-500">Select your preferred date</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Clock className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Choose a Time</p>
                        <p className="text-sm text-gray-500">Pick an available time slot</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}