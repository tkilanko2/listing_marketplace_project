import React, { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Grid, InputAdornment, IconButton } from '@mui/material';
import { CalendarRange, Search, X } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AppointmentFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  services: { id: string; name: string }[];
}

export type FilterState = {
  search: string;
  status: string[];
  serviceId: string;
  startDate: Date | null;
  endDate: Date | null;
}

export default function AppointmentFilters({ onFilterChange, services }: AppointmentFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: ['confirmed', 'pending'],
    serviceId: '',
    startDate: null,
    endDate: null
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#DF678C' },
    { value: 'confirmed', label: 'Confirmed', color: '#3D1560' },
    { value: 'completed', label: 'Completed', color: '#4CAF50' },
    { value: 'canceled', label: 'Canceled', color: '#CDCED8' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    // Validate date range
    if (key === 'endDate' && newFilters.startDate && value && value < newFilters.startDate) {
      newFilters.endDate = newFilters.startDate;
    } else if (key === 'startDate' && newFilters.endDate && value && value > newFilters.endDate) {
      newFilters.endDate = value;
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const currentStatuses = [...filters.status];
    const statusIndex = currentStatuses.indexOf(status);
    
    if (statusIndex === -1) {
      currentStatuses.push(status);
    } else {
      currentStatuses.splice(statusIndex, 1);
    }
    
    handleFilterChange('status', currentStatuses);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      status: ['confirmed', 'pending'],
      serviceId: '',
      startDate: null,
      endDate: null
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getChipColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#CDCED8';
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            placeholder="Search customer or appointment"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
              endAdornment: filters.search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleFilterChange('search', '')}>
                    <X size={16} />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Service</InputLabel>
            <Select
              value={filters.serviceId}
              label="Service"
              onChange={(e) => handleFilterChange('serviceId', e.target.value)}
            >
              <MenuItem value="">All Services</MenuItem>
              {services.map(service => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DatePicker
                label="From"
                value={filters.startDate}
                onChange={(date: Date | null) => handleFilterChange('startDate', date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <DatePicker
                label="To"
                value={filters.endDate}
                onChange={(date: Date | null) => handleFilterChange('endDate', date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} sm={12} md={2}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton 
              onClick={clearFilters}
              color="primary"
              size="small"
              sx={{ 
                color: '#3D1560',
                '&:hover': { backgroundColor: '#EDD9FF' }
              }}
            >
              <X size={18} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      
      <Box display="flex" gap={1} mt={2}>
        {statusOptions.map(status => (
          <Chip
            key={status.value}
            label={status.label}
            onClick={() => handleStatusToggle(status.value)}
            sx={{
              backgroundColor: filters.status.includes(status.value) ? status.color : 'transparent',
              color: filters.status.includes(status.value) ? 'white' : '#383A47',
              border: `1px solid ${status.color}`,
              '&:hover': {
                backgroundColor: filters.status.includes(status.value) 
                  ? status.color 
                  : '#F8F8FA'
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
} 