import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Typography,
  Button,
  Divider
} from '@mui/material';
import {
  MoreVertical,
  Edit,
  MessageSquare,
  Calendar,
  CalendarX,
  CheckCircle,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { Appointment } from '../../types';

interface SellerBookingListProps {
  appointments: Appointment[];
  onViewBookingDetails: (bookingId: string) => void;
  onCancel: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onMessageCustomer: (appointment: Appointment) => void;
  onAccept?: (appointment: Appointment) => void;
  onViewListing?: (appointment: Appointment) => void;
  onReviewCustomer?: (appointment: Appointment) => void; // Add review customer handler
}

export default function SellerBookingList({
  appointments,
  onViewBookingDetails,
  onCancel,
  onComplete,
  onReschedule,
  onMessageCustomer,
  onAccept,
  onViewListing,
  onReviewCustomer
}: SellerBookingListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleAction = (action: (appointment: Appointment) => void) => {
    if (selectedAppointment) {
      action(selectedAppointment);
      handleMenuClose();
    }
  };

  // Helper function to check if seller can review customer
  const canSellerReviewCustomer = (appointment: Appointment): boolean => {
    // Only allow reviews for completed services
    if (appointment.status !== 'completed') return false;
    
    // Check if service was completed within the last 30 days
    const completionDate = new Date(appointment.start);
    const daysSinceCompletion = Math.floor((new Date().getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCompletion > 30) return false;
    
    // In a real app, would check if seller has already reviewed this customer for this booking
    // For now, assume they haven't reviewed yet
    return true;
  };

  // Get status-aware actions configuration (simplified menu)
  const getStatusConfig = (appointment: Appointment) => {
    const status = appointment.status;
    switch (status) {
      case 'pending':
        return {
          canAccept: true,
          canDecline: true,
          canReschedule: false,
          canMessage: true,
          canViewListing: true,
          canReview: false
        };
      case 'confirmed':
        return {
          canAccept: false,
          canDecline: false,
          canReschedule: true,
          canMessage: true,
          canViewListing: true,
          canReview: false
        };
      case 'completed':
        return {
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: true,
          canViewListing: true,
          canReview: canSellerReviewCustomer(appointment) && onReviewCustomer // Only show if handler provided and conditions met
        };
      case 'canceled':
        return {
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: false,
          canViewListing: true,
          canReview: false
        };
      default:
        return {
          canAccept: false,
          canDecline: false,
          canReschedule: false,
          canMessage: true,
          canViewListing: true,
          canReview: false
        };
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time nicely
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#3D1560', color: 'white' };
      case 'pending':
        return { bg: '#DF678C', color: 'white' };
      case 'completed':
        return { bg: '#4CAF50', color: 'white' };
      case 'canceled':
        return { bg: '#CDCED8', color: '#383A47' };
      default:
        return { bg: '#E8E9ED', color: '#383A47' };
    }
  };

  // Get payment status chip color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#4CAF50', color: 'white' };
      case 'unpaid':
        return { bg: '#F9A825', color: 'white' };
      case 'refunded':
        return { bg: '#CDCED8', color: '#383A47' };
      default:
        return { bg: '#E8E9ED', color: '#383A47' };
    }
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #CDCED8' }}>
        <Table sx={{ minWidth: 650 }} role="grid" aria-label="Appointments List">
          <TableHead sx={{ backgroundColor: '#F8F8FA' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#1B1C20' }} aria-label="Date and Time">Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1B1C20' }} aria-label="Service">Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1B1C20' }} aria-label="Customer">Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1B1C20' }} aria-label="Status">Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1B1C20' }} aria-label="Payment">Payment</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1B1C20' }} aria-label="Actions">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="#70727F">No appointments found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow 
                  key={appointment.id}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: '#F8F8FA',
                      cursor: 'pointer' 
                    },
                    backgroundColor: appointment.status === 'canceled' ? '#F8F8FA' : 'white'
                  }}
                  onClick={() => onViewBookingDetails(appointment.id)}
                  role="gridcell"
                >
                  <TableCell sx={{ borderBottom: '1px solid #E8E9ED' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="medium" color="#1B1C20">
                        {formatDate(appointment.start)}
                      </Typography>
                      <Typography variant="body2" color="#70727F">
                        {formatTime(appointment.start)} - {formatTime(appointment.end)}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: '1px solid #E8E9ED' }}>
                    <Typography variant="body2" fontWeight="medium" color="#1B1C20">
                      {appointment.service.name}
                    </Typography>
                    <Typography variant="body2" color="#70727F">
                      {appointment.service.duration} min
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: '1px solid #E8E9ED' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={appointment.customer.avatar}
                        alt={appointment.customer.name}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {appointment.customer.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" color="#1B1C20">
                          {appointment.customer.name}
                        </Typography>
                        <Typography variant="body2" color="#70727F">
                          {appointment.customer.id || `CM${appointment.id.slice(-6).toUpperCase()}`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: '1px solid #E8E9ED' }}>
                    <Chip 
                      label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(appointment.status).bg,
                        color: getStatusColor(appointment.status).color,
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell sx={{ borderBottom: '1px solid #E8E9ED' }}>
                    <Chip 
                      label={appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                      size="small"
                      sx={{ 
                        backgroundColor: getPaymentStatusColor(appointment.paymentStatus).bg,
                        color: getPaymentStatusColor(appointment.paymentStatus).color,
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="right" sx={{ borderBottom: '1px solid #E8E9ED' }}>
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, appointment);
                      }}
                      aria-label={`Actions for appointment with ${appointment.customer.name}`}
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Single Action Menu for all rows */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedAppointment && (() => {
          const statusConfig = getStatusConfig(selectedAppointment);
          const menuItems = [];

          // View Appointment Details - Always available
          menuItems.push(
            <MenuItem key="view-details" onClick={() => handleAction(() => onViewBookingDetails(selectedAppointment?.id || ''))}>
              <Edit size={16} style={{ marginRight: 8 }} /> View Appointment Details
            </MenuItem>
          );

          // Confirm Booking - Only for pending
          if (statusConfig.canAccept && onAccept) {
            menuItems.push(
              <MenuItem key="accept" onClick={() => handleAction(onAccept)}>
                <CheckCircle size={16} style={{ marginRight: 8 }} /> Confirm Booking
              </MenuItem>
            );
          }

          // Decline Booking - Only for pending (renamed from Cancel)
          if (statusConfig.canDecline) {
            menuItems.push(
              <MenuItem key="decline" onClick={() => handleAction(onCancel)}>
                <XCircle size={16} style={{ marginRight: 8 }} /> Decline Booking
              </MenuItem>
            );
          }

          // Reschedule - Only for confirmed
          if (statusConfig.canReschedule) {
            menuItems.push(
              <MenuItem key="reschedule" onClick={() => handleAction(onReschedule)}>
                <Calendar size={16} style={{ marginRight: 8 }} /> Reschedule
              </MenuItem>
            );
          }

          // Review Customer - Only for completed bookings where review is possible
          if (statusConfig.canReview && onReviewCustomer) {
            menuItems.push(
              <MenuItem key="review-customer" onClick={() => handleAction(onReviewCustomer)} sx={{ color: '#4CAF50' }}>
                <svg 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  style={{ marginRight: 8 }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Review Customer
              </MenuItem>
            );
          }

          // Message Customer - Status dependent
          if (statusConfig.canMessage) {
            menuItems.push(
              <MenuItem key="message" onClick={() => handleAction(onMessageCustomer)}>
                <MessageSquare size={16} style={{ marginRight: 8 }} /> Message Customer
              </MenuItem>
            );
          }

          // View Listing - Always available, opens parent listing
          if (statusConfig.canViewListing && onViewListing) {
            menuItems.push(
              <MenuItem key="view-listing" onClick={() => handleAction(onViewListing)}>
                <ExternalLink size={16} style={{ marginRight: 8 }} /> View Listing
              </MenuItem>
            );
          }

          return menuItems;
        })()}
      </Menu>
    </Box>
  );
} 