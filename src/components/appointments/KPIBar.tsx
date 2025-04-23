import React from 'react';
import { Box, Card, Typography, Grid } from '@mui/material';
import { UserCheck, Clock, DollarSign, AlertOctagon, CalendarCheck } from 'lucide-react';

interface KPIMetrics {
  upcoming: number;
  pending: number;
  completed: number;
  canceled: number;
  revenue: number;
  utilization: number;
}

interface KPIBarProps {
  metrics: KPIMetrics;
}

export default function KPIBar({ metrics }: KPIBarProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Upcoming Appointments */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '4px solid',
            borderColor: '#3D1560',
            height: '100%'
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <CalendarCheck size={20} color="#3D1560" />
            <Typography variant="body2" color="#70727F" ml={1}>
              Upcoming
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="#1B1C20">
            {metrics.upcoming}
          </Typography>
        </Card>
      </Grid>

      {/* Pending Requests */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '4px solid',
            borderColor: '#DF678C',
            height: '100%'
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <Clock size={20} color="#DF678C" />
            <Typography variant="body2" color="#70727F" ml={1}>
              Pending
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="#1B1C20">
            {metrics.pending}
          </Typography>
        </Card>
      </Grid>

      {/* Completed */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '4px solid',
            borderColor: '#4CAF50',
            height: '100%'
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <UserCheck size={20} color="#4CAF50" />
            <Typography variant="body2" color="#70727F" ml={1}>
              Completed
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="#1B1C20">
            {metrics.completed}
          </Typography>
        </Card>
      </Grid>

      {/* Revenue */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '4px solid',
            borderColor: '#6D26AB',
            height: '100%'
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <DollarSign size={20} color="#6D26AB" />
            <Typography variant="body2" color="#70727F" ml={1}>
              Revenue
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="#1B1C20">
            {formatCurrency(metrics.revenue)}
          </Typography>
        </Card>
      </Grid>

      {/* Cancellation Rate */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '4px solid',
            borderColor: '#CDCED8',
            height: '100%'
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <AlertOctagon size={20} color="#CDCED8" />
            <Typography variant="body2" color="#70727F" ml={1}>
              Canceled
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="#1B1C20">
            {metrics.canceled}
          </Typography>
        </Card>
      </Grid>

      {/* Utilization Rate */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Card 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '4px solid',
            borderColor: '#3D1560',
            height: '100%'
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <Clock size={20} color="#3D1560" />
            <Typography variant="body2" color="#70727F" ml={1}>
              Utilization
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="#1B1C20">
            {metrics.utilization}%
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
} 