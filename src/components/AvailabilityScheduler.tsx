import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  Card,
  CardContent,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface AvailabilitySchedulerProps {
  value: {
    type: 'weekdays' | 'weekends' | 'allWeek' | 'custom';
    scheduleType: 'weekly' | 'dateRange';
    customSchedule: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
      timeRanges: Array<{
        startTime: string;
        endTime: string;
        days: string[];
      }>;
    };
    dateRanges: Array<{
      startDate: string;
      endDate: string;
      timeSlots: Array<{
        startTime: string;
        endTime: string;
      }>;
    }>;
  };
  onChange: (value: any) => void;
}

const weekDays = [
  { label: 'MON', value: 'monday' },
  { label: 'TUE', value: 'tuesday' },
  { label: 'WED', value: 'wednesday' },
  { label: 'THU', value: 'thursday' },
  { label: 'FRI', value: 'friday' },
  { label: 'SAT', value: 'saturday' },
  { label: 'SUN', value: 'sunday' },
];

const StyledTextField = TextField;

export const AvailabilityScheduler: React.FC<AvailabilitySchedulerProps> = ({ value, onChange }) => {
  const [availabilityTab, setAvailabilityTab] = useState(value.scheduleType === 'weekly' ? 0 : 1);

  const isDaySelected = (day: string) => {
    return value.customSchedule[day as keyof typeof value.customSchedule] === true;
  };

  const getTimeSlotsForDay = (day: string) => {
    return value.customSchedule.timeRanges.filter(slot => slot.days.includes(day));
  };

  const addTimeSlotForDay = (day: string) => {
    const newTimeRanges = [...value.customSchedule.timeRanges];
    newTimeRanges.push({
      startTime: '09:00',
      endTime: '17:00',
      days: [day]
    });
    onChange({
      ...value,
      customSchedule: {
        ...value.customSchedule,
        timeRanges: newTimeRanges
      }
    });
  };

  const removeTimeSlot = (index: number) => {
    const newTimeRanges = [...value.customSchedule.timeRanges];
    newTimeRanges.splice(index, 1);
    onChange({
      ...value,
      customSchedule: {
        ...value.customSchedule,
        timeRanges: newTimeRanges
      }
    });
  };

  const addDateRange = () => {
    const newDateRanges = [...value.dateRanges];
    newDateRanges.push({
      startDate: '',
      endDate: '',
      timeSlots: [{ startTime: '09:00', endTime: '17:00' }]
    });
    onChange({
      ...value,
      dateRanges: newDateRanges
    });
  };

  const removeDateRange = (index: number) => {
    const newDateRanges = [...value.dateRanges];
    newDateRanges.splice(index, 1);
    onChange({
      ...value,
      dateRanges: newDateRanges
    });
  };

  const addTimeSlotToDateRange = (dateRangeIndex: number) => {
    const newDateRanges = [...value.dateRanges];
    newDateRanges[dateRangeIndex].timeSlots.push({
      startTime: '09:00',
      endTime: '17:00'
    });
    onChange({
      ...value,
      dateRanges: newDateRanges
    });
  };

  const removeTimeSlotFromDateRange = (dateRangeIndex: number, timeSlotIndex: number) => {
    const newDateRanges = [...value.dateRanges];
    newDateRanges[dateRangeIndex].timeSlots.splice(timeSlotIndex, 1);
    onChange({
      ...value,
      dateRanges: newDateRanges
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setAvailabilityTab(newValue);
    onChange({
      ...value,
      scheduleType: newValue === 0 ? 'weekly' : 'dateRange'
    });
  };

  const renderWeeklySchedule = () => (
    <>
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#383A47', fontWeight: 500, fontSize: '0.9rem' }}>
        Select days you're available
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {weekDays.map((day) => {
          const isSelected = isDaySelected(day.value);
          return (
            <Button
              key={day.value}
              variant={isSelected ? "contained" : "outlined"}
              sx={{ 
                minWidth: 70,
                backgroundColor: isSelected ? '#3D1560' : 'transparent',
                borderColor: '#CDCED8',
                color: isSelected ? 'white' : '#383A47',
                '&:hover': {
                  backgroundColor: isSelected ? '#6D26AB' : '#F8F8FA',
                }
              }}
              onClick={() => {
                const newSchedule = {
                  ...value.customSchedule,
                  [day.value]: !isSelected
                };
                
                // If day is being selected, add default time slot
                if (!isSelected && getTimeSlotsForDay(day.value).length === 0) {
                  newSchedule.timeRanges = [...newSchedule.timeRanges, {
                    startTime: '09:00',
                    endTime: '17:00',
                    days: [day.value]
                  }];
                }
                
                onChange({
                  ...value,
                  customSchedule: newSchedule
                });
              }}
            >
              {day.label}
            </Button>
          );
        })}
      </Box>
      
      <Typography variant="subtitle1" gutterBottom sx={{ color: '#383A47', fontWeight: 500, fontSize: '0.9rem', mt: 2 }}>
        Set hours for each day
      </Typography>
      
      {weekDays.map((day) => {
        const isSelected = isDaySelected(day.value);
        if (!isSelected) return null;
        
        const timeSlots = value.customSchedule.timeRanges.filter(
          slot => slot.days.includes(day.value)
        );
        
          return (
            <Box key={day.value} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#383A47', mb: 1 }}>
                {day.label.charAt(0) + day.label.slice(1).toLowerCase()}
              </Typography>
            
            {timeSlots && timeSlots.map((slot, index) => {
              const slotIndex = value.customSchedule.timeRanges.findIndex(
                s => s === slot
              );
              
              return (
                <Grid container spacing={1.5} key={index} sx={{ mb: 0.5, alignItems: 'center' }}>
                  <Grid item xs={12} sm={5} md={4.5}>
                    <StyledTextField
                      label="From"
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => {
                        const newTimeRanges = [...value.customSchedule.timeRanges];
                        newTimeRanges[slotIndex].startTime = e.target.value;
                        onChange({
                          ...value,
                          customSchedule: {
                            ...value.customSchedule,
                            timeRanges: newTimeRanges
                          }
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5} md={4.5}>
                    <StyledTextField
                      label="To"
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => {
                        const newTimeRanges = [...value.customSchedule.timeRanges];
                        newTimeRanges[slotIndex].endTime = e.target.value;
                        onChange({
                          ...value,
                          customSchedule: {
                            ...value.customSchedule,
                            timeRanges: newTimeRanges
                          }
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton 
                      size="small"
                      onClick={() => removeTimeSlot(slotIndex)}
                      sx={{ color: '#70727F', '&:hover': { color: '#DF678C', backgroundColor: '#FFE5ED' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    {index === timeSlots.length - 1 && (
                      <IconButton 
                        size="small"
                        onClick={() => addTimeSlotForDay(day.value)}
                        sx={{ color: '#3D1560', '&:hover': { color: '#6D26AB', backgroundColor: '#EDD9FF' } }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        );
      })}
    </>
  );
  
  const renderDateRangeSchedule = () => (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#383A47', fontWeight: 500, fontSize: '0.9rem' }}>
          Add specific date ranges when you're available
        </Typography>
        
        {value.dateRanges.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1, mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No date ranges added yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a date range to specify when you're available
            </Typography>
          </Box>
        )}
        
        {value.dateRanges.map((dateRange, dateIndex) => (
          <Card key={dateIndex} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: '#E8E9ED', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#383A47' }}>
                Date Range {dateIndex + 1}
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => removeDateRange(dateIndex)}
                sx={{ color: '#70727F', '&:hover': { color: '#DF678C', backgroundColor: '#FFE5ED' } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Grid container spacing={1.5} sx={{ mb: 1.5, alignItems: 'center' }}>
              <Grid item xs={12} sm={5} md={4.5}>
                <StyledTextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(e) => {
                    const newDateRanges = [...value.dateRanges];
                    newDateRanges[dateIndex].startDate = e.target.value;
                    onChange({
                      ...value,
                      dateRanges: newDateRanges
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={5} md={4.5}>
                <StyledTextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(e) => {
                    const newDateRanges = [...value.dateRanges];
                    newDateRanges[dateIndex].endDate = e.target.value;
                    onChange({
                      ...value,
                      dateRanges: newDateRanges
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
            </Grid>
            
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', fontWeight: 600, fontSize: '0.85rem', mt: 1 }}>
              Time Slots
            </Typography>
            
            {dateRange.timeSlots.map((timeSlot, timeIndex) => (
              <Grid container spacing={1.5} key={timeIndex} sx={{ mb: 1, alignItems: 'center' }}>
                <Grid item xs={12} sm={5} md={4.5}>
                  <StyledTextField
                    label="From"
                    type="time"
                    value={timeSlot.startTime}
                    onChange={(e) => {
                      const newDateRanges = [...value.dateRanges];
                      newDateRanges[dateIndex].timeSlots[timeIndex].startTime = e.target.value;
                      onChange({
                        ...value,
                        dateRanges: newDateRanges
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={4.5}>
                  <StyledTextField
                    label="To"
                    type="time"
                    value={timeSlot.endTime}
                    onChange={(e) => {
                      const newDateRanges = [...value.dateRanges];
                      newDateRanges[dateIndex].timeSlots[timeIndex].endTime = e.target.value;
                      onChange({
                        ...value,
                        dateRanges: newDateRanges
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs="auto" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton 
                    size="small"
                    onClick={() => removeTimeSlotFromDateRange(dateIndex, timeIndex)}
                    disabled={dateRange.timeSlots.length <= 1}
                    sx={{ color: '#70727F', '&:hover': { color: '#DF678C', backgroundColor: '#FFE5ED' } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {timeIndex === dateRange.timeSlots.length - 1 && (
                    <IconButton 
                      size="small"
                      onClick={() => addTimeSlotToDateRange(dateIndex)}
                      sx={{ color: '#3D1560', '&:hover': { color: '#6D26AB', backgroundColor: '#EDD9FF' } }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
          </Card>
        ))}
        
        <Button 
          variant="outlined" 
          startIcon={<EventIcon />}
          onClick={addDateRange}
          sx={{ 
            mt: 1,
            color: '#3D1560',
            borderColor: '#3D1560',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#EDD9FF',
              borderColor: '#6D26AB',
              color: '#6D26AB',
            }
          }}
        >
          Add Date Range
        </Button>
      </Box>
    </>
  );
  
  return (
    <Card sx={{ mt: 0, p: 2, border: '1px solid', borderColor: '#E8E9ED', boxShadow: 'none', borderRadius: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#1B1C20', fontSize: '1rem', fontWeight: 600, mb: 2 }}>
          <CalendarMonthIcon sx={{ mr: 1, color: '#3D1560' }} /> Availability
        </Typography>
        
        <Box sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={availabilityTab}
            onChange={handleTabChange}
            sx={{
              minHeight: '40px',
              '.MuiTabs-indicator': {
                backgroundColor: '#3D1560',
              },
              '.MuiTab-root': {
                textTransform: 'none',
                minHeight: '40px',
                py: 1,
                px: 2,
                fontSize: '0.875rem',
                color: '#70727F',
                '&:hover': {
                  color: '#6D26AB',
                },
              },
              '.MuiTab-root.Mui-selected': {
                color: '#3D1560',
                fontWeight: 600,
              },
            }}
          >
            <Tab label="Weekly Schedule" />
            <Tab label="Specific Date Range" />
          </Tabs>
        </Box>
        
        {availabilityTab === 0 ? renderWeeklySchedule() : renderDateRangeSchedule()}
        
      </CardContent>
    </Card>
  );
};

