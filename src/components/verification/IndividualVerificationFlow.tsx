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

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'India'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Hindi', 'Arabic', 'Portuguese'];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'];

interface IndividualVerificationFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

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
    // Submit verification data
    onComplete();
  };

  const renderBasicInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Personal Information
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Please provide your contact and personal details to verify your identity.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            required
            value={basicInfo.fullName}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Home Address
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="addressLine1"
            label="Street Address"
            fullWidth
            required
            value={basicInfo.addressLine1}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="addressLine2"
            label="Apartment/Unit Number (optional)"
            fullWidth
            value={basicInfo.addressLine2}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="city"
            label="City"
            fullWidth
            required
            value={basicInfo.city}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="state"
            label="State/Region"
            fullWidth
            required
            value={basicInfo.state}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={basicInfo.country}
              label="Country"
              onChange={(e) => setBasicInfo({...basicInfo, country: e.target.value})}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>{country}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="postalCode"
            label="Postal/Zip Code"
            fullWidth
            required
            value={basicInfo.postalCode}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            required
            value={basicInfo.phoneNumber}
            onChange={handleBasicInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
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
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2 }}>
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
            renderInput={(params) => <TextField {...params} label="Service/Product Types" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, serviceTypes: newValue});
            }}
            value={listingInfo.serviceTypes}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
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
          <FormControl fullWidth required>
            <InputLabel>Preferred Currency</InputLabel>
            <Select
              name="preferredCurrency"
              value={listingInfo.preferredCurrency}
              label="Preferred Currency"
              onChange={(e) => setListingInfo({...listingInfo, preferredCurrency: e.target.value})}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>{currency}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={languages}
            renderInput={(params) => <TextField {...params} label="Language(s) Spoken" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, languages: newValue});
            }}
            value={listingInfo.languages}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Service Area Coverage
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={countries}
            renderInput={(params) => <TextField {...params} label="Countries" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
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
            renderInput={(params) => <TextField {...params} label="Cities" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, cities: newValue});
            }}
            value={listingInfo.cities}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="operatingHours"
            label="Standard Operating Hours"
            fullWidth
            placeholder="e.g., Monday-Friday: 9AM-5PM, Weekends: 10AM-2PM"
            value={listingInfo.operatingHours}
            onChange={handleListingInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
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
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Verify Your Identity
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        To complete your verification and make your listings visible to customers, please verify your identity with our secure partner.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
        <Card sx={{ width: '100%', maxWidth: 450, mb: 3 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box 
              sx={{ 
                p: 4, 
                border: '2px dashed #CDCED8', 
                borderRadius: 2, 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <QrCodeIcon sx={{ fontSize: 120, color: '#3D1560', mb: 2 }} />
              <Typography variant="body2" color="#70727F">
                Scan this QR code with your mobile device to start verification
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Or continue on this device
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              sx={{ 
                mt: 1,
                bgcolor: '#3D1560', 
                color: 'white',
                '&:hover': { bgcolor: '#6D26AB' } 
              }}
              onClick={handleComplete}
            >
              Continue to Verification
            </Button>
          </CardContent>
        </Card>
        
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 450 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon sx={{ color: '#3D1560' }} />
            <Typography variant="body2">
              Your information is securely transmitted with end-to-end encryption.
            </Typography>
          </Box>
          
          <Divider />
          
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
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
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onCancel}
          sx={{ color: '#70727F' }}
        >
          Cancel
        </Button>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Individual Seller Verification
        </Typography>
      </Box>
      
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ mb: 4 }}
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
          sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
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
              '&:hover': { bgcolor: '#6D26AB' } 
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
              '&:hover': { bgcolor: '#6D26AB' } 
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