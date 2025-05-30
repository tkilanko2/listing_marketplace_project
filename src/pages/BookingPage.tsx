import React, { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { ServiceList } from '../components/ServiceList';
import { BookingForm } from '../components/BookingForm';
import { PaymentForm } from '../components/PaymentForm';
import { Service, TimeSlot } from '../types';
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft, Check, CalendarPlus, Edit, CreditCard } from 'lucide-react';

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
  onProceedToPayment?: (details: { 
    customerName: string; 
    customerEmail: string; 
    notes: string;
    timeSlot: TimeSlot;
  }) => void;
}

export function BookingPage({ selectedService, allServices, onBack, onProceedToPayment }: BookingPageProps) {
  const [currentService, setCurrentService] = useState<Service>(selectedService);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    customerName: string;
    customerEmail: string;
    notes: string;
    paymentMethod: 'online' | 'inPerson';
  } | null>(null);
  
  const availableSlots = generateTimeSlots();

  const handleBookingSubmit = (data: { 
    customerName: string; 
    customerEmail: string; 
    notes: string;
    paymentMethod: 'online' | 'inPerson';
  }) => {
    console.log('Booking submitted:', {
      service: currentService,
      slot: selectedSlot,
      customer: data
    });
    
    // Save booking details
    setBookingDetails(data);
    
    // Show payment form or confirm booking directly
    if (data.paymentMethod === 'online' && onProceedToPayment && selectedSlot) {
      onProceedToPayment({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        notes: data.notes,
        timeSlot: selectedSlot
      });
    } else {
      setIsBookingConfirmed(true);
    }
  };
  
  const handlePaymentSubmit = (paymentData: {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    cvv: string;
  }) => {
    console.log('Payment submitted:', paymentData);
    
    // In a real app, you would process the payment here
    // For now, we'll just confirm the booking
    setShowPaymentForm(false);
    setIsBookingConfirmed(true);
  };
  
  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };
  
  const handleEditBooking = () => {
    setIsBookingConfirmed(false);
    setShowPaymentForm(false);
  };
  
  const handleAddToCalendar = () => {
    if (!selectedSlot || !currentService) return;
    
    // Format dates for calendar event
    const startTime = selectedSlot.start.toISOString();
    const endTime = selectedSlot.end.toISOString();
    const eventTitle = encodeURIComponent(`${currentService.name} Appointment`);
    const eventDetails = encodeURIComponent(`Service: ${currentService.name}\nProvider: ${currentService.provider.username || 'Service Provider'}`);
    
    // Generate Google Calendar link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startTime.replace(/[-:]/g, '').replace(/\.\d+/g, '')}/${endTime.replace(/[-:]/g, '').replace(/\.\d+/g, '')}&details=${eventDetails}`;
    
    // Open in new tab
    window.open(googleCalendarUrl, '_blank');
  };

  // Confirmation view component
  const ConfirmationView = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-[#CDCED8]">
      <div className="mx-auto w-16 h-16 bg-[#E8E9ED] rounded-full flex items-center justify-center mb-6">
        <Check className="w-8 h-8 text-[#3D1560]" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2 text-[#1B1C20]">Booking Confirmed!</h2>
      <p className="text-[#70727F] mb-3">
        You've successfully booked {currentService.name} on {selectedSlot?.start.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot?.start.toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' })}.
      </p>
      
      {bookingDetails?.paymentMethod === 'online' ? (
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 bg-[#EDD9FF] text-[#3D1560] rounded-full">
            <CreditCard className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Paid Online</span>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 bg-[#E8E9ED] text-[#383A47] rounded-full">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Pay at Service</span>
          </div>
        </div>
      )}
      
      <p className="text-[#70727F] mb-8">
        A confirmation email has been sent to {bookingDetails?.customerEmail}.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleAddToCalendar}
          className="flex items-center justify-center px-6 py-3 bg-white border border-[#3D1560] text-[#3D1560] rounded-md hover:bg-[#EDD9FF] transition-colors duration-200"
        >
          <CalendarPlus className="w-5 h-5 mr-2" />
          Add to Calendar
        </button>
        
        <button 
          onClick={handleEditBooking}
          className="flex items-center justify-center px-6 py-3 bg-white border border-[#CDCED8] text-[#383A47] rounded-md hover:bg-[#E8E9ED] transition-colors duration-200"
        >
          <Edit className="w-5 h-5 mr-2" />
          Edit Booking
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <header className="bg-white shadow-sm border-b border-[#CDCED8]">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-[#70727F] hover:text-[#383A47]"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={currentService.provider.avatar}
                alt={currentService.provider.username || 'Service Provider'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-[#383A47]">
                  {currentService.provider.username || 'Service Provider'}
                </h3>
                <p className="text-sm text-[#70727F]">Service Provider</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isBookingConfirmed ? (
          <ConfirmationView />
        ) : showPaymentForm && bookingDetails && selectedSlot ? (
          <div className="max-w-2xl mx-auto">
            <PaymentForm 
              service={currentService}
              amount={currentService.price}
              onSubmit={handlePaymentSubmit}
              onCancel={handlePaymentCancel}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-[#CDCED8]">
                <h2 className="text-xl font-semibold mb-4 text-[#1B1C20]">Select a Service</h2>
                <ServiceList
                  services={allServices}
                  selectedService={currentService}
                  onServiceSelect={setCurrentService}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-[#CDCED8]">
                <h2 className="text-xl font-semibold mb-4 text-[#1B1C20]">Select Date & Time</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    availableSlots={availableSlots}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-[#383A47]">Available Times</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots
                        .filter(
                          slot => slot.start.toDateString() === selectedDate.toDateString()
                        )
                        .map((slot, index) => {
                          // Format the time as a string for direct comparison
                          const slotTime = slot.start.toLocaleTimeString('default', {
                            hour: 'numeric',
                            minute: '2-digit'
                          });
                          
                          // Check if this slot's time matches the selected slot's time
                          const isSelected = selectedSlot && 
                            selectedSlot.start.toLocaleTimeString('default', {
                              hour: 'numeric',
                              minute: '2-digit'
                            }) === slotTime;
                          
                          // Debug logs
                          if (isSelected) {
                            console.log("Matched selected time:", slotTime);
                          }
                          
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                console.log("Setting selected time:", slotTime);
                                setSelectedSlot(slot);
                              }}
                              className={`p-2 text-sm rounded-md transition-colors ${
                                selectedSlot?.start.getTime() === slot.start.getTime()
                                  ? 'bg-[#3D1560] text-white'
                                  : 'bg-[#F8F8FA] text-[#383A47] hover:bg-[#E8E9ED] border border-[#CDCED8]'
                              }`}
                            >
                              {slot.start.toLocaleTimeString('default', { 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 border border-[#CDCED8]">
                {currentService && selectedSlot ? (
                  <BookingForm
                    selectedService={currentService}
                    selectedSlot={selectedSlot}
                    onSubmit={handleBookingSubmit}
                  />
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#1B1C20]">Booking Steps</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-[#3D1560]" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[#383A47]">Select a Service</p>
                          <p className="text-sm text-[#70727F]">Choose from available services</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CalendarIcon className="h-6 w-6 text-[#3D1560]" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[#383A47]">Pick a Date</p>
                          <p className="text-sm text-[#70727F]">Select your preferred date</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Clock className="h-6 w-6 text-[#3D1560]" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[#383A47]">Choose a Time</p>
                          <p className="text-sm text-[#70727F]">Pick an available time slot</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}