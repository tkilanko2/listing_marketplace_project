import React, { useState } from 'react';
import { 
  Box, 
  Modal, 
  Typography, 
  Button, 
  Paper, 
  IconButton,
  TextField,
  Grid,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Calendar, Clock, AlertCircle, X as CloseIcon, ChevronRight } from 'lucide-react';
import { Appointment } from '../../types';

interface RescheduleBookingModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onReschedule: (appointment: Appointment, newStart: Date, newEnd: Date) => void;
}

const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({
  open,
  onClose,
  appointment,
  onReschedule
}) => {
  if (!appointment) return null;

  // Parse the original appointment start and end times
  const originalStart = new Date(appointment.start);
  const originalEnd = new Date(appointment.end);
  
  // Calculate original duration in milliseconds
  const originalDurationMs = originalEnd.getTime() - originalStart.getTime();
  
  // State for new date and time
  const [selectedDate, setSelectedDate] = useState<Date | null>(originalStart);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(originalStart);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(originalEnd);
  const [error, setError] = useState<string | null>(null);

  // Format original date and times for display
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
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle date change
  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    setError(null);
    
    // If we have both a date and start time, update the end time based on the original duration
    if (newDate && selectedStartTime) {
      const newStartDateTime = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        selectedStartTime.getHours(),
        selectedStartTime.getMinutes()
      );
      
      const newEndDateTime = new Date(newStartDateTime.getTime() + originalDurationMs);
      setSelectedEndTime(newEndDateTime);
    }
  };

  // Handle start time change
  const handleStartTimeChange = (newTime: Date | null) => {
    setSelectedStartTime(newTime);
    setError(null);
    
    // If we have both a date and start time, update the end time based on the original duration
    if (selectedDate && newTime) {
      const newStartDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        newTime.getHours(),
        newTime.getMinutes()
      );
      
      const newEndDateTime = new Date(newStartDateTime.getTime() + originalDurationMs);
      setSelectedEndTime(newEndDateTime);
    }
  };

  // Handle end time change
  const handleEndTimeChange = (newTime: Date | null) => {
    setSelectedEndTime(newTime);
    setError(null);
  };

  // Format customer name to first name + last initial for privacy
  const formatCustomerName = (fullName: string): string => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1].charAt(0) + '.';
    return `${firstName} ${lastInitial}`;
  };

  // Handle reschedule submission
  const handleSubmit = () => {
    // Validate inputs
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      setError('Please select a date and time for the appointment.');
      return;
    }
    
    // Create new start and end dates
    const newStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedStartTime.getHours(),
      selectedStartTime.getMinutes()
    );
    
    const newEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedEndTime.getHours(),
      selectedEndTime.getMinutes()
    );
    
    // Validate that end time is after start time
    if (newEnd <= newStart) {
      setError('End time must be after start time.');
      return;
    }
    
    // If valid, call the onReschedule handler
    onReschedule(appointment, newStart, newEnd);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="reschedule-appointment-title"
      >
        <Paper 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {xs: '95%', sm: '600px'},
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
            <Typography id="reschedule-appointment-title" variant="h6" component="h2" color="white">
              Reschedule Appointment
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
            {/* Appointment Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="#1B1C20" fontWeight={500}>
                {appointment.service.name} with {formatCustomerName(appointment.customer.name)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Calendar size={16} style={{ marginRight: 8, color: '#70727F' }} />
                <Typography variant="body2" color="#70727F">
                  Currently scheduled for {formatDate(originalStart)} at {formatTime(originalStart)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Date Picker */}
            <Typography variant="subtitle1" color="#1B1C20" sx={{ fontWeight: 600, mb: 2 }}>
              New Date and Time
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Start Time"
                  value={selectedStartTime}
                  onChange={handleStartTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="End Time"
                  value={selectedEndTime}
                  onChange={handleEndTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Error message */}
            {error && (
              <Box sx={{ 
                mt: 2, 
                p: 1.5, 
                bgcolor: '#FFF4F4', 
                borderRadius: 1,
                border: '1px solid #FFCDD2',
                display: 'flex',
                alignItems: 'center'
              }}>
                <AlertCircle size={20} style={{ color: '#F44336', marginRight: 8 }} />
                <Typography variant="body2" color="#D32F2F">
                  {error}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ 
              mt: 3, 
              display: 'flex', 
              justifyContent: 'flex-end',
              gap: 2
            }}>
              <Button 
                variant="outlined" 
                onClick={onClose}
                sx={{ 
                  borderColor: '#CDCED8',
                  color: '#70727F',
                  '&:hover': {
                    borderColor: '#383A47',
                    backgroundColor: 'transparent'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                startIcon={<ChevronRight size={18} />}
                sx={{
                  backgroundColor: '#3D1560',
                  '&:hover': {
                    backgroundColor: '#6D26AB'
                  }
                }}
              >
                Reschedule
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </LocalizationProvider>
  );
};

export default RescheduleBookingModal; 