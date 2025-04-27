import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  Stack,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';

// This component will be shown after a successful listing submission
// It will not replace the existing success dialog but will appear afterward

interface SellerVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onCompleteNow: (verificationType: 'individual' | 'business') => void;
  onCompleteLater: () => void;
}

const SellerVerificationModal: React.FC<SellerVerificationModalProps> = ({
  open,
  onClose,
  onCompleteNow,
  onCompleteLater,
}) => {
  const [verificationType, setVerificationType] = useState<'individual' | 'business'>('individual');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: '#F8F8FA', 
          borderBottom: '1px solid #CDCED8',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: '#3D1560',
          p: 3
        }}
      >
        <VerifiedUserIcon color="primary" />
        <Typography variant="h5" component="span" fontWeight="bold">
          Complete Your Seller Profile
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 4, px: isMobile ? 2 : 4 }}>
        <Typography variant="body1" paragraph>
          Your listing has been created and is pending verification. To get your listing approved and visible to potential customers, you need to complete your seller profile.
        </Typography>
        
        <Box sx={{ 
          bgcolor: '#EDD9FF', 
          color: '#3D1560', 
          p: 2, 
          borderRadius: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: 3
        }}>
          <VerifiedUserIcon fontSize="small" />
          <Typography variant="body2">
            <strong>Verified sellers</strong> receive <strong>2.5x more orders</strong> and are <strong>ranked higher</strong> in search results.
          </Typography>
        </Box>

        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
          Choose your seller type:
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <RadioGroup
            value={verificationType}
            onChange={(e) => setVerificationType(e.target.value as 'individual' | 'business')}
          >
            <Stack spacing={2}>
              <Paper 
                elevation={verificationType === 'individual' ? 3 : 1} 
                sx={{ 
                  p: 2, 
                  border: `2px solid ${verificationType === 'individual' ? '#3D1560' : '#CDCED8'}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onClick={() => setVerificationType('individual')}
              >
                <FormControlLabel 
                  value="individual" 
                  control={<Radio sx={{ color: '#3D1560', '&.Mui-checked': { color: '#3D1560' } }} />} 
                  label={
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="subtitle1" display="flex" alignItems="center" gap={1}>
                        <PersonIcon /> Individual Seller
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        For personal accounts selling services or products
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
              </Paper>

              <Paper 
                elevation={verificationType === 'business' ? 3 : 1} 
                sx={{ 
                  p: 2, 
                  border: `2px solid ${verificationType === 'business' ? '#3D1560' : '#CDCED8'}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onClick={() => setVerificationType('business')}
              >
                <FormControlLabel 
                  value="business" 
                  control={<Radio sx={{ color: '#3D1560', '&.Mui-checked': { color: '#3D1560' } }} />} 
                  label={
                    <Box sx={{ pl: 1 }}>
                      <Typography variant="subtitle1" display="flex" alignItems="center" gap={1}>
                        <BusinessCenterIcon /> Business Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        For registered businesses, companies, or organizations
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
              </Paper>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          What happens next?
        </Typography>
        
        <Box component="ol" sx={{ pl: 2.5, mt: 1 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Complete a simple 3-step form with your seller details
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Verify your identity through our secure verification partner
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Once approved, all of your listings will become active
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #CDCED8', justifyContent: 'space-between' }}>
        <Button 
          onClick={onCompleteLater} 
          color="inherit"
          sx={{ color: '#70727F' }}
        >
          Complete Later
        </Button>
        <Button
          onClick={() => onCompleteNow(verificationType)}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            bgcolor: '#3D1560', 
            color: 'white',
            px: 3,
            '&:hover': { bgcolor: '#6D26AB' } 
          }}
        >
          Complete Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SellerVerificationModal; 