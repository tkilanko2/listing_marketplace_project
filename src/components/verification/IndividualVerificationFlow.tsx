import React, { useState } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import { styled } from '@mui/material/styles';

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'India'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Hindi', 'Arabic', 'Portuguese'];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'];

interface IndividualVerificationFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

// Styled components for consistent form elements
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6D26AB',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3D1560',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
  },
  '& .MuiOutlinedInput-root': {
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#6D26AB',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3D1560',
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  border: '1px solid #CDCED8',
  borderRadius: 8,
  boxShadow: 'none',
}));

const IndividualVerificationFlow: React.FC<IndividualVerificationFlowProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Information', 'Listing Information', 'Identity Verification'];
  
  // Form states
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
    dateOfBirth: ''
  });

  const [listingInfo, setListingInfo] = useState({
    serviceTypes: [] as string[],
    specificServices: '',
    preferredCurrency: 'USD',
    languages: [] as string[],
    countries: [] as string[],
    cities: [] as string[],
    operatingHours: '',
    deliveryOptions: ''
  });

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleListingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setListingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleComplete = () => {
    // Open external verification URL in new tab
    window.open('https://verify.expats.com', '_blank');
    
    // Notify parent that the verification flow is complete
    onComplete();
  };

  const renderBasicInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2, bgcolor: '#FFFFFF' }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Personal Information
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Please provide your contact and personal details to verify your identity.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledTextField
            name="fullName"
            label="Full Name"
            fullWidth
            required
            value={basicInfo.fullName}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
            Home Address
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField
            name="addressLine1"
            label="Street Address"
            fullWidth
            required
            value={basicInfo.addressLine1}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField
            name="addressLine2"
            label="Apartment/Unit Number (optional)"
            fullWidth
            value={basicInfo.addressLine2}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            name="city"
            label="City"
            fullWidth
            required
            value={basicInfo.city}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            name="state"
            label="State/Region"
            fullWidth
            required
            value={basicInfo.state}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledFormControl fullWidth required>
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={basicInfo.country}
              label="Country"
              onChange={(e) => setBasicInfo({...basicInfo, country: e.target.value})}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3D1560',
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>{country}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            name="postalCode"
            label="Postal/Zip Code"
            fullWidth
            required
            value={basicInfo.postalCode}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            required
            value={basicInfo.phoneNumber}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            fullWidth
            required
            value={basicInfo.dateOfBirth}
            onChange={handleBasicInfoChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderListingInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2, bgcolor: '#FFFFFF' }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Service/Product Details
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Tell us more about what you'll be selling on our platform.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={['Cleaning', 'Consultation', 'Design', 'Education', 'Maintenance', 'Personal Care', 'Professional Services', 'Transportation']}
            renderInput={(params) => <StyledTextField {...params} label="Service/Product Types" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  sx={{ 
                    bgcolor: '#EDD9FF', 
                    color: '#3D1560',
                    '& .MuiChip-deleteIcon': {
                      color: '#3D1560',
                      '&:hover': {
                        color: '#6D26AB',
                      },
                    },
                  }}
                />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, serviceTypes: newValue});
            }}
            value={listingInfo.serviceTypes}
          />
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField
            name="specificServices"
            label="Specific Services/Products Offered"
            multiline
            rows={3}
            fullWidth
            placeholder="Please describe the specific services or products you plan to offer"
            value={listingInfo.specificServices}
            onChange={handleListingInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledFormControl fullWidth required>
            <InputLabel>Preferred Currency</InputLabel>
            <Select
              name="preferredCurrency"
              value={listingInfo.preferredCurrency}
              label="Preferred Currency"
              onChange={(e) => setListingInfo({...listingInfo, preferredCurrency: e.target.value})}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3D1560',
                },
              }}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={languages}
            renderInput={(params) => <StyledTextField {...params} label="Language(s) Spoken" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  sx={{ 
                    bgcolor: '#EDD9FF', 
                    color: '#3D1560',
                    '& .MuiChip-deleteIcon': {
                      color: '#3D1560',
                      '&:hover': {
                        color: '#6D26AB',
                      },
                    },
                  }}
                />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, languages: newValue});
            }}
            value={listingInfo.languages}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
            Service Area Coverage
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={countries}
            renderInput={(params) => <StyledTextField {...params} label="Countries" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  sx={{ 
                    bgcolor: '#EDD9FF', 
                    color: '#3D1560',
                    '& .MuiChip-deleteIcon': {
                      color: '#3D1560',
                      '&:hover': {
                        color: '#6D26AB',
                      },
                    },
                  }}
                />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, countries: newValue});
            }}
            value={listingInfo.countries}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Paris', 'Berlin', 'Tokyo', 'Sydney']}
            renderInput={(params) => <StyledTextField {...params} label="Cities" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  sx={{ 
                    bgcolor: '#EDD9FF', 
                    color: '#3D1560',
                    '& .MuiChip-deleteIcon': {
                      color: '#3D1560',
                      '&:hover': {
                        color: '#6D26AB',
                      },
                    },
                  }}
                />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, cities: newValue});
            }}
            value={listingInfo.cities}
          />
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField
            name="operatingHours"
            label="Standard Operating Hours"
            fullWidth
            placeholder="e.g., Monday-Friday: 9AM-5PM, Weekends: 10AM-2PM"
            value={listingInfo.operatingHours}
            onChange={handleListingInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField
            name="deliveryOptions"
            label="Delivery Options (if applicable)"
            fullWidth
            placeholder="e.g., Free local delivery, Shipping available nationwide"
            value={listingInfo.deliveryOptions}
            onChange={handleListingInfoChange}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderIdentityVerification = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2, bgcolor: '#FFFFFF' }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Verify Your Identity
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        To complete your verification and make your listings visible to customers, please verify your identity with our secure partner.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
        <StyledCard sx={{ width: '100%', maxWidth: 450, mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <Box 
              sx={{ 
                p: 4, 
                border: '2px dashed #CDCED8', 
                borderRadius: 2, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
                bgcolor: '#F8F8FA'
              }}
            >
              <QrCodeIcon sx={{ fontSize: 120, color: '#3D1560', mb: 2 }} />
              <Typography variant="body2" color="#70727F">
                Scan this QR code with your mobile device to start verification
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom color="#1B1C20">
              Or continue on this device
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              sx={{ 
                mt: 1,
                bgcolor: '#3D1560', 
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': { 
                  bgcolor: '#6D26AB',
                  boxShadow: '0 4px 12px rgba(61, 21, 96, 0.2)'
                } 
              }}
              onClick={handleComplete}
            >
              Continue to Verification
            </Button>
          </CardContent>
        </StyledCard>
        
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 450 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#EDD9FF', borderRadius: 2 }}>
            <SecurityIcon sx={{ color: '#3D1560' }} />
            <Typography variant="body2" color="#3D1560">
              Your information is securely transmitted with end-to-end encryption.
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#70727F' }}>
            The verification process typically takes 1-2 business days. You'll receive an email notification once your verification is complete.
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderListingInformation();
      case 2:
        return renderIdentityVerification();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 }, bgcolor: '#F8F8FA' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onCancel}
          sx={{ 
            color: '#70727F',
            '&:hover': {
              bgcolor: 'rgba(112, 114, 127, 0.08)',
            },
          }}
        >
          Cancel
        </Button>
        <Typography variant="h5" component="h1" fontWeight="bold" color="#1B1C20">
          Individual Seller Verification
        </Typography>
      </Box>
      
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ 
          mb: 4,
          '& .MuiStepLabel-root .Mui-completed': {
            color: '#3D1560',
          },
          '& .MuiStepLabel-root .Mui-active': {
            color: '#3D1560',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent(activeStep)}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            visibility: activeStep === 0 ? 'hidden' : 'visible',
            color: '#70727F',
            '&:hover': {
              bgcolor: 'rgba(112, 114, 127, 0.08)',
            },
          }}
        >
          Back
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleComplete}
            endIcon={<CheckCircleIcon />}
            sx={{ 
              bgcolor: '#3D1560', 
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(61, 21, 96, 0.15)',
              '&:hover': { 
                bgcolor: '#6D26AB',
                boxShadow: '0 4px 12px rgba(61, 21, 96, 0.2)'
              } 
            }}
          >
            Submit Verification
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              bgcolor: '#3D1560', 
              color: 'white',
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(61, 21, 96, 0.15)',
              '&:hover': { 
                bgcolor: '#6D26AB',
                boxShadow: '0 4px 12px rgba(61, 21, 96, 0.2)'
              } 
            }}
          >
            Next Step
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default IndividualVerificationFlow; 