import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Chip, 
  Divider,
  Stack,
  LinearProgress
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Types for verification status
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'not_started';
export type SellerType = 'individual' | 'business' | undefined;

interface VerificationStatusCardProps {
  status: VerificationStatus;
  sellerType: SellerType;
  onStartVerification: () => void;
  onContinueVerification: () => void;
}

// This component will display verification status in the seller dashboard
// It doesn't replace any existing UI but augments it with new information
const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({
  status,
  sellerType,
  onStartVerification,
  onContinueVerification
}) => {
  // Content based on verification status
  const getContent = () => {
    switch (status) {
      case 'not_started':
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: '#DF678C' }} />,
          title: 'Verification Required',
          message: 'Your listings will remain pending until you complete verification.',
          buttonText: 'Start Verification',
          buttonAction: onStartVerification,
          chipText: 'Required',
          chipColor: '#DF678C',
          chipBgColor: '#FFE5ED',
          progress: 0
        };
      case 'pending':
        return {
          icon: <HourglassEmptyIcon sx={{ fontSize: 40, color: '#F49E4C' }} />,
          title: 'Verification In Progress',
          message: 'Your verification is being processed. This may take 1-2 business days.',
          buttonText: 'Check Status',
          buttonAction: onContinueVerification,
          chipText: 'Pending',
          chipColor: '#F49E4C',
          chipBgColor: '#FFF1E5',
          progress: 50
        };
      case 'approved':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
          title: 'Verification Approved',
          message: 'Your account is verified. Your listings are now visible to customers.',
          buttonText: 'View Profile',
          buttonAction: onContinueVerification,
          chipText: 'Approved',
          chipColor: '#4CAF50',
          chipBgColor: '#E8F5E9',
          progress: 100
        };
      case 'rejected':
        return {
          icon: <ReportProblemIcon sx={{ fontSize: 40, color: '#F44336' }} />,
          title: 'Verification Rejected',
          message: 'Your verification was rejected. Please review and resubmit.',
          buttonText: 'Review & Resubmit',
          buttonAction: onStartVerification,
          chipText: 'Rejected',
          chipColor: '#F44336',
          chipBgColor: '#FFEBEE',
          progress: 75
        };
      case 'expired':
        return {
          icon: <ReportProblemIcon sx={{ fontSize: 40, color: '#F44336' }} />,
          title: 'Verification Expired',
          message: 'Your verification has expired. Please complete the process again.',
          buttonText: 'Renew Verification',
          buttonAction: onStartVerification,
          chipText: 'Expired',
          chipColor: '#F44336',
          chipBgColor: '#FFEBEE',
          progress: 0
        };
      default:
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 40, color: '#DF678C' }} />,
          title: 'Verification Required',
          message: 'Your listings will remain pending until you complete verification.',
          buttonText: 'Start Verification',
          buttonAction: onStartVerification,
          chipText: 'Required',
          chipColor: '#DF678C',
          chipBgColor: '#FFE5ED',
          progress: 0
        };
    }
  };

  const content = getContent();
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid #CDCED8', 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Progress bar at the top */}
      <LinearProgress 
        variant="determinate" 
        value={content.progress} 
        sx={{
          height: 6,
          '& .MuiLinearProgress-bar': {
            backgroundColor: status === 'approved' ? '#4CAF50' : status === 'rejected' ? '#F44336' : '#3D1560',
          }
        }}
      />
      
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* Icon and title */}
          <Box>
            {content.icon}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h6" component="h3" fontWeight="bold">
                {content.title}
              </Typography>
              <Chip 
                label={content.chipText} 
                size="small"
                sx={{ 
                  color: content.chipColor, 
                  bgcolor: content.chipBgColor,
                  fontWeight: 'medium'
                }} 
              />
            </Stack>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {content.message}
            </Typography>
            
            {sellerType && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Account Type: <strong>{sellerType === 'individual' ? 'Individual Seller' : 'Business Account'}</strong>
              </Typography>
            )}
            
            <Button 
              variant="contained" 
              onClick={content.buttonAction}
              sx={{ 
                bgcolor: '#3D1560', 
                color: 'white',
                '&:hover': { bgcolor: '#6D26AB' },
                mt: 1 
              }}
            >
              {content.buttonText}
            </Button>
          </Box>
        </Stack>
      </Box>
      
      {/* Info section at the bottom */}
      {status !== 'approved' && (
        <>
          <Divider />
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: '#F8F8FA', 
              display: 'flex', 
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <VerifiedUserIcon sx={{ color: '#3D1560' }} />
            <Typography variant="body2">
              Verified sellers receive 2.5x more orders and are ranked higher in search results.
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default VerificationStatusCard; 