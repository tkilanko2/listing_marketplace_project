import React from 'react';
import { Box, Card, Typography, Grid, Tooltip } from '@mui/material';
import { UserCheck, Clock, DollarSign, AlertOctagon, CalendarCheck } from 'lucide-react';

interface KPIMetrics {
  upcoming: number;
  pending: number;
  completed: number;
  canceled: number;
  revenue: number;
  completionRate: number;
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
      {/* Pending Requests - Most urgent, needs immediate action */}
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

      {/* Upcoming Appointments - Next priority, confirmed bookings */}
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

      {/* Completed */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip 
          title="Successfully finished appointments (all time)" 
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#EDD9FF',
                color: '#3D1560',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '6px',
                '& .MuiTooltip-arrow': {
                  color: '#EDD9FF',
                },
              },
            },
          }}
        >
          <Card 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderLeft: '4px solid',
              borderColor: '#4CAF50',
              height: '100%',
              cursor: 'default',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out'
              }
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
        </Tooltip>
      </Grid>

      {/* Earned Revenue */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip 
          title="Revenue earned from completed appointments (all time)" 
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#EDD9FF',
                color: '#3D1560',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '6px',
                '& .MuiTooltip-arrow': {
                  color: '#EDD9FF',
                },
              },
            },
          }}
        >
          <Card 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderLeft: '4px solid',
              borderColor: '#6D26AB',
              height: '100%',
              cursor: 'default',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <DollarSign size={20} color="#6D26AB" />
              <Typography variant="body2" color="#70727F" ml={1}>
                Earned Revenue
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#1B1C20">
              {formatCurrency(metrics.revenue)}
            </Typography>
          </Card>
        </Tooltip>
      </Grid>

      {/* Canceled */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip 
          title="Appointments canceled by you or customers (all time)" 
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#EDD9FF',
                color: '#3D1560',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '6px',
                '& .MuiTooltip-arrow': {
                  color: '#EDD9FF',
                },
              },
            },
          }}
        >
          <Card 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderLeft: '4px solid',
              borderColor: '#CDCED8',
              height: '100%',
              cursor: 'default',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out'
              }
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
        </Tooltip>
      </Grid>

      {/* Completion Rate */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <Tooltip 
          title="Percentage of booked appointments successfully completed (all time)" 
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: '#EDD9FF',
                color: '#3D1560',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '6px',
                '& .MuiTooltip-arrow': {
                  color: '#EDD9FF',
                },
              },
            },
          }}
        >
          <Card 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-start',
              borderLeft: '4px solid',
              borderColor: '#3D1560',
              height: '100%',
              cursor: 'default',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <UserCheck size={20} color="#3D1560" />
              <Typography variant="body2" color="#70727F" ml={1}>
                Completion Rate
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#1B1C20">
              {metrics.completionRate}%
            </Typography>
          </Card>
        </Tooltip>
      </Grid>
    </Grid>
  );
} 