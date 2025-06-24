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
  initialFilter?: 'all' | 'pending' | 'confirmed';
}

export function MyBookingsPage({ onBack, onViewBookingDetails, initialFilter = 'all' }: MyBookingsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed'>(initialFilter);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

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

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date, day: number) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const getBookingsForDate = (date: Date, day: number) => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), day);
    return allBookings.filter(booking => {
      if (!booking.appointmentDate) return false;
      return isSameDay(booking.appointmentDate, targetDate);
    });
  };

  const getDateStatus = (date: Date, day: number) => {
    const bookings = getBookingsForDate(date, day);
    if (bookings.length === 0) return null;
    
    const hasConfirmed = bookings.some(b => ['confirmed', 'scheduled'].includes(b.status));
    const hasPending = bookings.some(b => ['requested', 'pending'].includes(b.status));
    
    if (hasConfirmed) return 'confirmed';
    if (hasPending) return 'pending';
    return null;
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    // Filter bookings for this date
    const dateBookings = getBookingsForDate(currentDate, day);
    if (dateBookings.length > 0) {
      // You could add logic here to highlight these bookings in the list
      console.log('Bookings for this date:', dateBookings);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1B1C20]">Calendar View</h2>
                <div className="flex items-center justify-between text-xs">
                  <button 
                    onClick={() => navigateMonth('prev')} 
                    className="p-1 rounded hover:bg-[#E8E9ED] text-[#383A47]"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-medium text-[#3D1560] mx-3">
                    {currentMonthYear}
                  </span>
                  <button 
                    onClick={() => navigateMonth('next')} 
                    className="p-1 rounded hover:bg-[#E8E9ED] text-[#383A47]"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Enhanced Calendar - Profile Page Style */}
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                {/* Calendar Header - Day Names */}
                <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-[#70727F] mb-2">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
                    <div key={index} className="py-1">{day}</div>
                  ))}
                </div>
                
                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const daysInMonth = getDaysInMonth(currentDate);
                    const firstDay = getFirstDayOfMonth(currentDate);
                    const days = [];
                    
                                          // Add empty cells for days before the first day of the month
                      // Adjust for Monday start (subtract 1, but handle Sunday case)
                      const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
                      for (let i = 0; i < adjustedFirstDay; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="p-2 text-center"></div>
                        );
                      }
                    
                                          // Add days of the month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const dateStatus = getDateStatus(currentDate, day);
                        const isCurrentDay = isToday(currentDate, day);
                        const isSelected = selectedDate && isSameDay(selectedDate, new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                        const bookingsOnDay = getBookingsForDate(currentDate, day);
                        const bookingCount = bookingsOnDay.length;
                        
                        // Create enhanced tooltip text for bookings on this day
                        const tooltipText = bookingCount > 0 
                          ? `${bookingCount} booking${bookingCount > 1 ? 's' : ''} on this day:\n${bookingsOnDay.map(b => `• ${b.service?.name || 'Service'} at ${b.appointmentDate ? formatTime(b.appointmentDate) : 'TBD'} (${b.status})`).join('\n')}`
                          : '';
                        
                        let dayClasses = 'relative p-2 text-center text-base rounded cursor-default hover:bg-[#D8C4E9] min-h-[32px] flex items-center justify-center ';
                        
                        if (isCurrentDay) {
                          dayClasses += 'border-2 border-[#3D1560] ring-1 ring-offset-1 ring-[#6D26AB] ';
                        }
                        
                        if (isSelected) {
                          dayClasses += 'bg-[#3D1560] text-white font-semibold ';
                        } else if (dateStatus === 'confirmed') {
                          dayClasses += 'bg-[#EDD9FF] text-[#3D1560] font-semibold ';
                        } else if (dateStatus === 'pending') {
                          dayClasses += 'bg-[#E8E9ED] text-[#70727F] font-medium ';
                        } else {
                          dayClasses += 'text-gray-700 ';
                        }
                        
                        days.push(
                          <div 
                            key={day} 
                            className={dayClasses}
                            onClick={() => handleDateClick(day)}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            style={{ 
                              cursor: bookingCount > 0 ? 'pointer' : 'default',
                              position: 'relative'
                            }}
                          >
                            <div className="relative w-full h-full flex items-center justify-center">
                              {day}
                              
                              {/* OPTION 1: Small Dot Indicators */}
                              {bookingCount > 0 && (
                                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                  {Array.from({ length: Math.min(bookingCount, 3) }, (_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-1 h-1 rounded-full ${
                                        dateStatus === 'confirmed' ? 'bg-[#3D1560]' : 
                                        dateStatus === 'pending' ? 'bg-[#70727F]' : 'bg-gray-400'
                                      }`}
                                    />
                                  ))}
                                  {bookingCount > 3 && (
                                    <div className="text-[8px] font-bold ml-0.5">+</div>
                                  )}
                                </div>
                              )}
                              
                              {/* Custom Hover Tooltip */}
                              {hoveredDay === day && bookingCount > 0 && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 bg-white border-2 border-[#3D1560] text-[#383A47] text-xs rounded-lg p-3 shadow-xl max-w-xs whitespace-nowrap">
                                  <div className="font-semibold mb-1 text-[#3D1560]">
                                    {bookingCount} booking{bookingCount > 1 ? 's' : ''} on this day:
                                  </div>
                                  <div className="space-y-1">
                                    {bookingsOnDay.map((booking, index) => (
                                      <div key={index} className="text-[11px] text-[#383A47]">
                                        • {booking.service?.name || 'Service'} at{' '}
                                        {booking.appointmentDate ? formatTime(booking.appointmentDate) : 'TBD'}{' '}
                                        <span className={`font-medium ${
                                          booking.status === 'confirmed' ? 'text-[#3D1560]' : 'text-[#70727F]'
                                        }`}>
                                          ({booking.status})
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Tooltip Arrow */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0.5 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-[#3D1560]"></div>
                                </div>
                              )}
                              
                              {/* OPTION 2: Corner Badge */}
                              {/* {bookingCount > 0 && (
                                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-white ${
                                  dateStatus === 'confirmed' ? 'bg-[#3D1560]' : 
                                  dateStatus === 'pending' ? 'bg-[#70727F]' : 'bg-gray-400'
                                }`}>
                                  {bookingCount > 9 ? '9+' : bookingCount}
                                </div>
                              )} */}
                              
                              {/* OPTION 3: Side Bar Indicator (Comment out others to see this) */}
                              {/* {bookingCount > 0 && (
                                <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-4 rounded-r ${
                                  dateStatus === 'confirmed' ? 'bg-[#3D1560]' : 
                                  dateStatus === 'pending' ? 'bg-[#70727F]' : 'bg-gray-400'
                                }`} />
                              )} */}
                              
                              {/* OPTION 4: Underline with Count (Comment out others to see this) */}
                              {/* {bookingCount > 0 && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                  <div className={`w-6 h-0.5 ${
                                    dateStatus === 'confirmed' ? 'bg-[#3D1560]' : 
                                    dateStatus === 'pending' ? 'bg-[#70727F]' : 'bg-gray-400'
                                  }`} />
                                  <div className="text-[8px] font-bold mt-0.5">{bookingCount}</div>
                                </div>
                              )} */}
                            </div>
                          </div>
                        );
                      }
                    
                                            // Add empty cells to complete the grid
                        const totalRenderedCells = adjustedFirstDay + daysInMonth;
                        const remainingCellsToFill = (Math.ceil(totalRenderedCells / 7) * 7) - totalRenderedCells;
                        for (let i = 0; i < remainingCellsToFill; i++) {
                          days.push(<div key={`empty-next-${i}`} className="p-2 text-center"></div>);
                        }
                    
                    return days;
                  })()}
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