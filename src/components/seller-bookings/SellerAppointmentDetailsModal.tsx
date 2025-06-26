import React from 'react';
import { 
  Box, 
  Modal, 
  Typography, 
  Button, 
  Divider, 
  Avatar, 
  Chip, 
  Grid, 
  Paper,
  IconButton
} from '@mui/material';
import { 
  CalendarClock, 
  MapPin, 
  Clock, 
  CreditCard, 
  MessageCircle,
  Calendar, 
  BadgeCheck, 
  X as CloseIcon,
  ExternalLink
} from 'lucide-react';
import { Appointment } from '../../types';

interface SellerAppointmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
  onMessage: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
}

const SellerAppointmentDetailsModal: React.FC<SellerAppointmentDetailsModalProps> = ({
  open,
  onClose,
  appointment,
  onReschedule,
  onCancel,
  onComplete,
  onMessage,
  onConfirm = () => {}
}) => {
  if (!appointment) return null;

  // Calculate duration in minutes
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);
  const durationInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  
  // Format date (e.g., "Monday, April 24, 2023")
  const formattedDate = start.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format time (e.g., "10:30 AM - 11:30 AM")
  const formattedTimeStart = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const formattedTimeEnd = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const formattedTimeRange = `${formattedTimeStart} - ${formattedTimeEnd}`;

  // Format customer name to first name + last initial for privacy
  const formatCustomerName = (fullName: string): string => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1].charAt(0) + '.';
    return `${firstName} ${lastInitial}`;
  };

  // Get appropriate status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#3D1560'; // Primary color
      case 'pending':
        return '#DF678C'; // Secondary color
      case 'completed':
        return '#4CAF50'; // Green
      case 'canceled':
        return '#70727F'; // Grey
      default:
        return '#3D1560'; // Default purple
    }
  };
  
  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#4CAF50'; // Green
      case 'unpaid':
        return '#FF9800'; // Orange/amber
      case 'refunded':
        return '#70727F'; // Grey
      default:
        return '#3D1560'; // Default purple
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="appointment-details-title"
    >
      <Paper 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {xs: '90%', sm: '550px'},
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 0
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#3D1560',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography id="appointment-details-title" variant="h6" component="h2" color="white">
            Appointment Details
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ color: 'white' }}
          >
            <CloseIcon size={20} />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* Service Information */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar 
                  src={appointment.service.images[0] || ''} 
                  sx={{ width: 64, height: 64 }}
                  variant="rounded"
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h6" color="#1B1C20">
                  {appointment.service.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} 
                    size="small"
                    sx={{ 
                      backgroundColor: getStatusColor(appointment.status),
                      color: 'white',
                      mr: 1
                    }}
                  />
                  <Chip 
                    label={appointment.paymentStatus} 
                    size="small"
                    sx={{ 
                      backgroundColor: getPaymentStatusColor(appointment.paymentStatus),
                      color: 'white'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Date & Time */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="#1B1C20" sx={{ fontWeight: 600, mb: 1 }}>
              Date & Time
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Calendar size={18} style={{ marginRight: 8, color: '#3D1560' }} />
                  <Typography variant="body1">{formattedDate}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarClock size={18} style={{ marginRight: 8, color: '#3D1560' }} />
                  <Typography variant="body2">{formattedTimeRange}</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Clock size={18} style={{ marginRight: 8, color: '#3D1560' }} />
                  <Typography variant="body2">Duration: {durationInMinutes} minutes</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          {/* Location */}
          {appointment.location && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="#1B1C20" sx={{ fontWeight: 600, mb: 1 }}>
                Location
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ marginRight: 8, color: '#3D1560', marginTop: 4 }} />
                <Typography variant="body1">{appointment.location}</Typography>
              </Box>
            </Box>
          )}
          
          {/* Customer Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="#1B1C20" sx={{ fontWeight: 600, mb: 1 }}>
              Customer
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar 
                  alt={formatCustomerName(appointment.customer.name)}
                  src={appointment.customer.avatar || ''}
                  sx={{ width: 48, height: 48 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatCustomerName(appointment.customer.name)}
                </Typography>
                <Typography variant="body2" color="#70727F">
                  {appointment.customer.email}
                </Typography>
                {appointment.customer.phone && (
                  <Typography variant="body2" color="#70727F">
                    {appointment.customer.phone}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
          
          {/* Price Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="#1B1C20" sx={{ fontWeight: 600, mb: 1 }}>
              Payment
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard size={18} style={{ marginRight: 8, color: '#3D1560' }} />
                <Typography variant="body1">
                  {appointment.paymentStatus === 'paid' ? 'Payment completed' : 
                   appointment.paymentStatus === 'refunded' ? 'Payment refunded' : 'Payment pending'}
                </Typography>
              </Box>
              <Typography variant="h6" color="#1B1C20">
                ${appointment.price.toFixed(2)}
              </Typography>
            </Box>
          </Box>
          
          {/* Notes */}
          {appointment.notes && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="#1B1C20" sx={{ fontWeight: 600, mb: 1 }}>
                Notes
              </Typography>
              <Typography variant="body2" sx={{ p: 2, bgcolor: '#F8F8FA', borderRadius: 1 }}>
                {appointment.notes}
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Box>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => {
                  onCancel(appointment);
                }}
                disabled={['canceled', 'completed'].includes(appointment.status)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              
              <Button 
                variant="outlined"
                onClick={() => {
                  onReschedule(appointment);
                }} 
                disabled={['canceled', 'completed'].includes(appointment.status)}
                sx={{ 
                  borderColor: '#3D1560', 
                  color: '#3D1560',
                  '&:hover': {
                    borderColor: '#6D26AB',
                    backgroundColor: 'rgba(61, 21, 96, 0.04)'
                  }
                }}
              >
                Reschedule
              </Button>
            </Box>
            
            <Box>
              <Button 
                variant="outlined"
                onClick={() => {
                  onMessage(appointment);
                }}
                sx={{ 
                  borderColor: '#3D1560', 
                  color: '#3D1560',
                  mr: 1,
                  '&:hover': {
                    borderColor: '#6D26AB',
                    backgroundColor: 'rgba(61, 21, 96, 0.04)'
                  }
                }}
                startIcon={<MessageCircle size={18} />}
              >
                Message
              </Button>
              
              {appointment.status === 'pending' ? (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    onConfirm(appointment);
                  }}
                  sx={{ 
                    backgroundColor: '#3D1560',
                    '&:hover': {
                      backgroundColor: '#6D26AB'
                    }
                  }}
                  startIcon={<BadgeCheck size={18} />}
                >
                  Confirm
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={() => {
                    onComplete(appointment);
                  }}
                  disabled={['canceled', 'completed'].includes(appointment.status)}
                  sx={{ 
                    backgroundColor: '#3D1560',
                    '&:hover': {
                      backgroundColor: '#6D26AB'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#CDCED8'
                    }
                  }}
                  startIcon={<BadgeCheck size={18} />}
                >
                  {appointment.status === 'completed' ? 'Completed' : 'Complete'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default SellerAppointmentDetailsModal; 