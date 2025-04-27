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
  Divider,
  IconButton
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Japan', 'India'];
const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', 'Chinese', 'Hindi', 'Arabic', 'Portuguese'];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'];
const businessTypes = ['Sole Proprietorship', 'LLC', 'Corporation', 'Partnership', 'Non-Profit', 'Other'];

interface BusinessVerificationFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface DocumentFile {
  name: string;
  size: number;
  type: string;
}

const BusinessVerificationFlow: React.FC<BusinessVerificationFlowProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Business Information', 'Listing Information', 'Owner Verification'];
  
  // Form states
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    brandName: '',
    registrationNumber: '',
    businessType: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    socialMedia: '',
    phoneNumber: '',
    personalEmail: '',
    hasTeamMembers: false,
    teamMembersCount: ''
  });

  const [documents, setDocuments] = useState({
    businessRegistration: null as DocumentFile | null,
    taxId: null as DocumentFile | null,
    addressProof: null as DocumentFile | null
  });

  const [listingInfo, setListingInfo] = useState({
    industries: [] as string[],
    serviceTypes: [] as string[],
    specificServices: '',
    preferredCurrency: 'USD',
    languages: [] as string[],
    countries: [] as string[],
    cities: [] as string[],
    businessHours: '',
    shippingOptions: ''
  });

  const [ownerInfo, setOwnerInfo] = useState({
    fullName: '',
    position: '',
    businessEmail: '',
    businessPhone: ''
  });

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: checked }));
  };

  const handleListingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setListingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOwnerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = (documentType: 'businessRegistration' | 'taxId' | 'addressProof') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          name: file.name,
          size: file.size,
          type: file.type
        }
      }));
    }
  };

  const handleRemoveDocument = (documentType: 'businessRegistration' | 'taxId' | 'addressProof') => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
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

  const renderBusinessInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Business Details
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Please provide information about your registered business.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            name="businessName"
            label="Registered Business Name"
            fullWidth
            required
            value={businessInfo.businessName}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="brandName"
            label="Trading/Brand Name (if different)"
            fullWidth
            value={businessInfo.brandName}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="registrationNumber"
            label="Business Registration Number"
            fullWidth
            required
            value={businessInfo.registrationNumber}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Business Type</InputLabel>
            <Select
              name="businessType"
              value={businessInfo.businessType}
              label="Business Type"
              onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
            >
              {businessTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Document Upload
          </Typography>
          <Typography variant="body2" color="#70727F" paragraph>
            Please upload the following documents to verify your business.
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Card sx={{ p: 2, mb: 2, border: '1px solid #CDCED8', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">
                  Business Registration
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {documents.businessRegistration ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon color="primary" />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {documents.businessRegistration.name}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveDocument('businessRegistration')}
                      sx={{ color: '#F44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      color: '#3D1560',
                      borderColor: '#3D1560',
                      '&:hover': { borderColor: '#6D26AB', color: '#6D26AB' }
                    }}
                  >
                    Upload Certificate
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload('businessRegistration')}
                    />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
          
          <Card sx={{ p: 2, mb: 2, border: '1px solid #CDCED8', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">
                  Tax ID Document
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {documents.taxId ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon color="primary" />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {documents.taxId.name}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveDocument('taxId')}
                      sx={{ color: '#F44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      color: '#3D1560',
                      borderColor: '#3D1560',
                      '&:hover': { borderColor: '#6D26AB', color: '#6D26AB' }
                    }}
                  >
                    Upload Tax ID
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload('taxId')}
                    />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
          
          <Card sx={{ p: 2, mb: 2, border: '1px solid #CDCED8', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">
                  Proof of Address
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {documents.addressProof ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon color="primary" />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {documents.addressProof.name}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveDocument('addressProof')}
                      sx={{ color: '#F44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      color: '#3D1560',
                      borderColor: '#3D1560',
                      '&:hover': { borderColor: '#6D26AB', color: '#6D26AB' }
                    }}
                  >
                    Upload Address Proof
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload('addressProof')}
                    />
                  </Button>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Business Address
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="addressLine1"
            label="Street Address"
            fullWidth
            required
            value={businessInfo.addressLine1}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="addressLine2"
            label="Building/Suite Number (optional)"
            fullWidth
            value={businessInfo.addressLine2}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="city"
            label="City"
            fullWidth
            required
            value={businessInfo.city}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="state"
            label="State/Region"
            fullWidth
            required
            value={businessInfo.state}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={businessInfo.country}
              label="Country"
              onChange={(e) => setBusinessInfo({...businessInfo, country: e.target.value})}
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
            value={businessInfo.postalCode}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="website"
            label="Business Website (optional)"
            fullWidth
            value={businessInfo.website}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="socialMedia"
            label="Social Media Handles (optional)"
            fullWidth
            value={businessInfo.socialMedia}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="phoneNumber"
            label="Business Phone Number"
            fullWidth
            required
            value={businessInfo.phoneNumber}
            onChange={handleBusinessInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="personalEmail"
            label="Personal Email"
            fullWidth
            required
            value={businessInfo.personalEmail}
            onChange={handleBusinessInfoChange}
            helperText="For account recovery and personal communications"
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={businessInfo.hasTeamMembers}
                onChange={handleCheckboxChange}
                name="hasTeamMembers"
                sx={{ 
                  color: '#3D1560',
                  '&.Mui-checked': {
                    color: '#3D1560',
                  },
                }}
              />
            }
            label="Will other team members from your business join you to sell on this platform?"
          />
        </Grid>
        
        {businessInfo.hasTeamMembers && (
          <Grid item xs={12} md={6}>
            <TextField
              name="teamMembersCount"
              label="Estimated number of team members"
              type="number"
              fullWidth
              value={businessInfo.teamMembersCount}
              onChange={handleBusinessInfoChange}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );

  const renderListingInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Service/Product Details
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Tell us more about what your business offers.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={['Retail', 'Technology', 'Healthcare', 'Education', 'Finance', 'Hospitality', 'Manufacturing', 'Real Estate']}
            renderInput={(params) => <TextField {...params} label="Industries" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            onChange={(_, newValue) => {
              setListingInfo({...listingInfo, industries: newValue});
            }}
            value={listingInfo.industries}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={['Consultation', 'Design', 'Maintenance', 'Software', 'Hardware', 'Training', 'Manufacturing', 'Retail Products']}
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
            placeholder="Please describe the specific services or products your business plans to offer"
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
            renderInput={(params) => <TextField {...params} label="Language(s) Used for Business" />}
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
            name="businessHours"
            label="Business Hours"
            fullWidth
            placeholder="e.g., Monday-Friday: 9AM-5PM, Weekends: Closed"
            value={listingInfo.businessHours}
            onChange={handleListingInfoChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="shippingOptions"
            label="Shipping/Delivery Options (if applicable)"
            fullWidth
            placeholder="e.g., Free shipping over $50, International shipping available"
            value={listingInfo.shippingOptions}
            onChange={handleListingInfoChange}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderOwnerVerification = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Verify Business Representative
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        As a final step, we need to verify your identity as an authorized representative of the business.
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Representative Personal Information
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            required
            value={ownerInfo.fullName}
            onChange={handleOwnerInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="position"
            label="Position/Title in Company"
            fullWidth
            required
            value={ownerInfo.position}
            onChange={handleOwnerInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="businessEmail"
            label="Business Email"
            fullWidth
            required
            value={ownerInfo.businessEmail}
            onChange={handleOwnerInfoChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            name="businessPhone"
            label="Business Phone"
            fullWidth
            required
            value={ownerInfo.businessPhone}
            onChange={handleOwnerInfoChange}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ bgcolor: '#F8F8FA', p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          KYC Verification Only
        </Typography>
        <Typography variant="body2" paragraph>
          The following step will only verify your personal identity through our third-party service. Your business documents will be reviewed separately by our team.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
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
                  Scan this QR code with your mobile device to start identity verification
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
        </Box>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon sx={{ color: '#3D1560' }} />
            <Typography variant="body2">
              Your personal information is securely transmitted with end-to-end encryption.
            </Typography>
          </Box>
          
          <Divider />
          
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            The personal identity verification typically takes 1-2 business days. Business document verification may take 2-3 additional business days. You'll receive an email notification once your verification is complete.
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBusinessInformation();
      case 1:
        return renderListingInformation();
      case 2:
        return renderOwnerVerification();
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
          Business Account Verification
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

export default BusinessVerificationFlow; 