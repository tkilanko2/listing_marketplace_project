import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  MessageCircle,
  RotateCcw,
  CheckCircle,
  Clock3,
  Building,
  Home,
  Monitor
} from 'lucide-react';
import { getAllOrdersWithBookings } from '../mockData';
import { Order } from '../types';

interface MyBookingsPageProps {
  onBack: () => void;
  onViewBookingDetails?: (bookingId: string) => void;
}

export function MyBookingsPage({ onBack, onViewBookingDetails }: MyBookingsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get all service bookings for the current user
  const allBookings = useMemo(() => {
    const allOrders = getAllOrdersWithBookings();
    return allOrders.filter(order => order.type === 'service');
  }, []);

  // Filter bookings based on selected filter
  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'all') return allBookings;
    
    return allBookings.filter(booking => {
      if (selectedFilter === 'pending') {
        return booking.status === 'requested' || booking.status === 'pending';
      }
      if (selectedFilter === 'confirmed') {
        return booking.status === 'confirmed' || booking.status === 'scheduled';
      }
      return true;
    });
  }, [allBookings, selectedFilter]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'requested':
      case 'pending':
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#E8E9ED]',
          label: 'Pending'
        };
      case 'confirmed':
      case 'scheduled':
        return {
          color: 'text-[#3D1560]',
          bgColor: 'bg-[#EDD9FF]',
          label: 'Confirmed'
        };
      case 'completed':
        return {
          color: 'text-[#4CAF50]',
          bgColor: 'bg-[#E8F5E9]',
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'text-[#DF678C]',
          bgColor: 'bg-[#FFE5ED]',
          label: 'Cancelled'
        };
      default:
        return {
          color: 'text-[#70727F]',
          bgColor: 'bg-[#E8E9ED]',
          label: 'Unknown'
        };
    }
  };

  const getServiceModeIcon = (mode: string) => {
    switch (mode) {
      case 'at_buyer': return Home;
      case 'remote': return Monitor;
      default: return Building;
    }
  };

  // Get current month name for calendar header
  const currentMonthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-[#F8F8FA] min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={onBack} 
            className="text-[#383A47] hover:text-[#3D1560] transition-colors duration-200 flex items-center mr-4 p-2 rounded-md hover:bg-[#E8E9ED]"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1B1C20]">
              My Bookings
            </h1>
            <p className="text-[#70727F] text-sm mt-1">
              View and manage all your service appointments
            </p>
          </div>
        </div>

        {/* Quick Stats Section - Moved to top */}
        <div className="mb-6">
          <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#383A47] mb-1">{allBookings.length}</div>
                <div className="text-sm text-[#70727F]">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#70727F] mb-1">
                  {allBookings.filter(b => ['requested', 'pending'].includes(b.status)).length}
                </div>
                <div className="text-sm text-[#70727F]">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3D1560] mb-1">
                  {allBookings.filter(b => ['confirmed', 'scheduled'].includes(b.status)).length}
                </div>
                <div className="text-sm text-[#70727F]">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4CAF50] mb-1">
                  {allBookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-[#70727F]">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1B1C20]">Calendar View</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[#E8E9ED] rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4 text-[#383A47]" />
                  </button>
                  <span className="text-sm font-medium text-[#383A47] min-w-[120px] text-center">
                    {currentMonthYear}
                  </span>
                  <button className="p-2 hover:bg-[#E8E9ED] rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 text-[#383A47]" />
                  </button>
                </div>
              </div>

              {/* Calendar Placeholder */}
              <div className="border-2 border-dashed border-[#CDCED8] rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 text-[#CDCED8] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#70727F] mb-2">Calendar View</h3>
                <p className="text-sm text-[#70727F] mb-4">
                  Interactive calendar showing your appointments would be displayed here
                </p>
                <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-xs font-medium text-[#70727F] p-2 text-center">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className="aspect-square border border-[#E8E9ED] rounded flex items-center justify-center text-xs text-[#70727F] hover:bg-[#F8F8FA] transition-colors">
                      {i + 1 <= 30 ? i + 1 : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bookings List */}
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-[#E8E9ED] p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1B1C20]">My Booking List</h3>
                <span className="text-sm text-[#70727F]">
                  {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              </div>

              {/* Mini Tabs */}
              <div className="flex space-x-1 mb-4 bg-[#F8F8FA] p-1 rounded-lg">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'confirmed', label: 'Confirmed' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id as any)}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                      selectedFilter === tab.id
                        ? 'bg-[#3D1560] text-white'
                        : 'text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Bookings List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.status);
                    const ServiceModeIcon = getServiceModeIcon(booking.selectedServiceMode || 'at_seller');
                    
                    return (
                      <div 
                        key={booking.id}
                        className="border border-[#E8E9ED] rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
                        onClick={() => onViewBookingDetails?.(booking.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#CDCED8] flex-shrink-0">
                            {booking.service?.images?.[0] ? (
                              <img 
                                src={booking.service.images[0]} 
                                alt={booking.service.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#EDD9FF] flex items-center justify-center">
                                <User className="w-5 h-5 text-[#3D1560]" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-medium text-[#1B1C20] truncate">
                                {booking.service?.name || 'Service'}
                              </h4>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-[#70727F] mb-2">
                              <Clock3 className="w-3 h-3" />
                              <span>
                                {booking.appointmentDate 
                                  ? `${formatDate(booking.appointmentDate)} at ${formatTime(booking.appointmentDate)}`
                                  : 'Date TBD'
                                }
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-[#70727F]">
                                <ServiceModeIcon className="w-3 h-3" />
                                <span>
                                  {booking.selectedServiceMode === 'at_buyer' ? 'At your location' :
                                   booking.selectedServiceMode === 'remote' ? 'Remote' : 'At provider'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-[#3D1560]">
                                ${booking.totalAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-[#CDCED8] mx-auto mb-3" />
                    <p className="text-sm text-[#70727F]">
                      No {selectedFilter === 'all' ? '' : selectedFilter} appointments found
                    </p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
} 