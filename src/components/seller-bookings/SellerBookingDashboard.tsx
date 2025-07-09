import React, { useState, useEffect, useMemo } from 'react';
import { Box, Card, Tabs, Tab, Divider, Typography, ButtonGroup, Button } from '@mui/material';
import { Calendar, List } from 'lucide-react';
import KPIBar from './KPIBar';
import SellerBookingFilters, { FilterState } from './SellerBookingFilters';
import SellerBookingList from './SellerBookingList';
import CalendarView from './CalendarView';
import { Appointment, Service } from '../../types';
import { mockServices } from '../../mockData';

interface SellerBookingDashboardProps {
  // Data props
  appointments?: Appointment[];
  services?: Service[];
  sellerName?: string; // Added to display whose calendar is being viewed
  
  // Action props
  onViewBookingDetails?: (bookingId: string) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  onMessageCustomer?: (appointment: Appointment) => void;
  onAccept?: (appointment: Appointment) => void;
  onViewListing?: (appointment: Appointment) => void;
  onReviewCustomer?: (appointment: Appointment) => void; // Add review customer handler
  onCreateAppointment?: () => void;
}

export default function SellerBookingDashboard({
  appointments = [],
  services = mockServices,
  sellerName = 'My Calendar',
  onViewBookingDetails = () => {},
  onCancel = () => {},
  onComplete = () => {},
  onReschedule = () => {},
  onMessageCustomer = () => {},
  onAccept = () => {},
  onViewListing = () => {},
  onReviewCustomer = () => {},
  onCreateAppointment = () => {}
}: SellerBookingDashboardProps) {
  // State for view toggle (list or calendar)
  const [view, setView] = useState<'list' | 'calendar'>('list');
  
  // State for filtered appointments
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);
  
  // State for date range
  const [dateView, setDateView] = useState<'today' | 'week' | 'month' | 'all'>('week');
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: ['confirmed', 'pending'],
    serviceId: '',
    startDate: null,
    endDate: null
  });

  // Process appointments whenever they or filters change
  useEffect(() => {
    // Apply filters
    let result = [...appointments];
    
    // Filter by search term (customer name, customer ID, service name, etc.)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(appointment => {
        const customerId = appointment.customer.id || `CM${appointment.id.slice(-6).toUpperCase()}`;
        return (
          appointment.customer.name.toLowerCase().includes(searchTerm) ||
          appointment.customer.email.toLowerCase().includes(searchTerm) ||
          customerId.toLowerCase().includes(searchTerm) ||
          appointment.service.name.toLowerCase().includes(searchTerm)
        );
      });
    }
    
    // Filter by status
    if (filters.status.length > 0) {
      result = result.filter(appointment => 
        filters.status.includes(appointment.status)
      );
    }
    
    // Filter by service
    if (filters.serviceId) {
      result = result.filter(appointment => 
        appointment.service.id === filters.serviceId
      );
    }
    
    // Filter by date range
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      // Set end date to end of day
      endDate.setHours(23, 59, 59);
      
      result = result.filter(appointment => {
        const appointmentDate = new Date(appointment.start);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      });
    }
    
    setFilteredAppointments(result);
  }, [appointments, filters]);

  // Calculate metrics for KPI bar
  const metrics = useMemo(() => {
    const upcoming = appointments.filter(a => 
      a.status === 'confirmed' && new Date(a.start) > new Date()
    ).length;
    
    const pending = appointments.filter(a => a.status === 'pending').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const canceled = appointments.filter(a => a.status === 'canceled').length;
    
    // Calculate earned revenue from completed appointments only
    const revenue = appointments
      .filter(a => a.status === 'completed' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + a.price, 0);
    
    // Calculate completion rate (completed out of all non-canceled appointments)
    const totalNonCanceled = appointments.filter(a => a.status !== 'canceled').length;
    const completionRate = totalNonCanceled > 0 
      ? Math.round((completed / totalNonCanceled) * 100) 
      : 0;
    
    return {
      upcoming,
      pending,
      completed,
      canceled,
      revenue,
      completionRate
    };
  }, [appointments]);

  // Handle date view change
  const handleDateViewChange = (newView: 'today' | 'week' | 'month' | 'all') => {
    setDateView(newView);
    
    const today = new Date();
    let startDate: Date | null = today;
    let endDate: Date | null = today;
    
    switch (newView) {
      case 'today':
        // Keep default (today)
        break;
      case 'week':
        // Set to current week
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
        break;
      case 'month':
        // Set to current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'all':
        // Show all appointments - no date filtering
        startDate = null;
        endDate = null;
        break;
    }
    
    // Update filters with new date range
    setFilters({
      ...filters,
      startDate,
      endDate
    });
  };

  // Simple function to get service name display objects for filter dropdown
  const serviceOptions = useMemo(() => {
    return services.map(service => ({
      id: service.id,
      name: service.name
    }));
  }, [services]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // If date range changed and not from our date buttons, set to all view
    if (newFilters.startDate !== filters.startDate || newFilters.endDate !== filters.endDate) {
      setDateView('all');
    }
  };

  return (
    <Box>
      {/* KPI Metrics */}
      <KPIBar metrics={metrics} />
      
      {/* Action Bar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Date Filter Buttons */}
        <ButtonGroup variant="outlined" size="small" aria-label="date range options">
          <Button 
            onClick={() => handleDateViewChange('today')}
            sx={{ 
              backgroundColor: dateView === 'today' ? '#EDD9FF' : 'transparent',
              color: dateView === 'today' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              }
            }}
          >
            Today
          </Button>
          <Button 
            onClick={() => handleDateViewChange('week')}
            sx={{ 
              backgroundColor: dateView === 'week' ? '#EDD9FF' : 'transparent',
              color: dateView === 'week' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              }
            }}
          >
            Week
          </Button>
          <Button 
            onClick={() => handleDateViewChange('month')}
            sx={{ 
              backgroundColor: dateView === 'month' ? '#EDD9FF' : 'transparent',
              color: dateView === 'month' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              }
            }}
          >
            Month
          </Button>
          <Button 
            onClick={() => handleDateViewChange('all')}
            sx={{ 
              backgroundColor: dateView === 'all' ? '#EDD9FF' : 'transparent',
              color: dateView === 'all' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              }
            }}
          >
            All
          </Button>
        </ButtonGroup>
        
        {/* View Toggle Buttons */}
        <Box>
          <Button 
            onClick={() => setView('list')}
            sx={{ 
              backgroundColor: view === 'list' ? '#EDD9FF' : 'transparent',
              color: view === 'list' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              },
              mr: 1
            }}
            startIcon={<List size={18} />}
          >
            List
          </Button>
          <Button 
            onClick={() => setView('calendar')}
            sx={{ 
              backgroundColor: view === 'calendar' ? '#EDD9FF' : 'transparent',
              color: view === 'calendar' ? '#3D1560' : '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                backgroundColor: '#EDD9FF',
                borderColor: '#3D1560',
              }
            }}
            startIcon={<Calendar size={18} />}
          >
            Calendar
          </Button>
        </Box>
      </Box>
      
      {/* Filters */}
      <SellerBookingFilters 
        onFilterChange={handleFilterChange} 
        services={serviceOptions} 
      />
      
      {/* Content based on view */}
      {view === 'list' ? (
        <SellerBookingList 
          appointments={filteredAppointments}
          onViewBookingDetails={onViewBookingDetails}
          onCancel={onCancel}
          onComplete={onComplete}
          onReschedule={onReschedule}
          onMessageCustomer={onMessageCustomer}
          onAccept={onAccept}
          onViewListing={onViewListing}
          onReviewCustomer={onReviewCustomer}
        />
      ) : (
        <CalendarView 
          appointments={filteredAppointments}
          onViewBookingDetails={onViewBookingDetails}
        />
      )}
    </Box>
  );
} 