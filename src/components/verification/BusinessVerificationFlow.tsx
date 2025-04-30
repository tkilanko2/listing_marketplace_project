import React, { useState } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
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
import { styled } from '@mui/material/styles';
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

// Styled components to match the design system
const StyledTextField = styled(Box)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F8F8FA',
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 2px #EDD9FF',
      borderColor: '#3D1560',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#CDCED8',
  },
  '& .MuiInputLabel-root': {
    color: '#383A47',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
  },
}));

const StyledFormControl = styled(Box)(({ theme }) => ({
  '& .MuiFormControl-root': {
    width: '100%',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F8F8FA',
    },
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 2px #EDD9FF',
      borderColor: '#3D1560',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#CDCED8',
  },
  '& .MuiInputLabel-root': {
    color: '#383A47',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: 'none',
  border: '1px solid #CDCED8',
  padding: 16,
  marginBottom: 16,
  backgroundColor: '#FFFFFF',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F8F8FA',
  color: '#3D1560',
  '&:hover': {
    backgroundColor: '#EDD9FF',
  },
}));

const UploadInput = styled('input')({
  display: 'none',
});

// Create a styled label wrapper to replace button with component="span"
const StyledUploadLabel = styled('label')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3D1560',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#6D26AB',
    boxShadow: '0 4px 12px rgba(61, 21, 96, 0.2)'
  },
  padding: '10px 24px',
  borderRadius: 8,
  fontWeight: 500,
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: '#70727F',
  '&:hover': {
    backgroundColor: '#E8E9ED',
  },
}));

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
    teamMembersCount: '',
    taxIdNumber: ''
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

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setBusinessInfo(prev => ({ ...prev, [name]: checked }));
  };

  const handleListingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setListingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    // Open external verification URL in new tab
    window.open('https://verify.expats.com', '_blank');
    
    // Notify parent that the verification flow is complete
    onComplete();
  };

  const renderBusinessInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2, backgroundColor: '#FFFFFF' }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Business Details
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Please provide information about your registered business.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Registered Business Name*
            </Typography>
            <input
              type="text"
              name="businessName"
              value={businessInfo.businessName}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Brand/Trading Name (if different)
            </Typography>
            <input
              type="text"
              name="brandName"
              value={businessInfo.brandName}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Registration/License Number*
            </Typography>
            <input
              type="text"
              name="registrationNumber"
              value={businessInfo.registrationNumber}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Business Type*
            </Typography>
            <select
              name="businessType"
              value={businessInfo.businessType}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            >
              <option value="">Select Business Type</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#1B1C20', fontWeight: 'bold', mt: 2 }}>
            Business Address
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Street Address*
            </Typography>
            <input
              type="text"
              name="addressLine1"
              value={businessInfo.addressLine1}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Suite/Unit/Floor (Optional)
            </Typography>
            <input
              type="text"
              name="addressLine2"
              value={businessInfo.addressLine2}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              City*
            </Typography>
            <input
              type="text"
              name="city"
              value={businessInfo.city}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              State/Province*
            </Typography>
            <input
              type="text"
              name="state"
              value={businessInfo.state}
              onChange={handleBusinessInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ color: '#1B1C20' }}>
            Document Upload
          </Typography>
          <Typography variant="body2" color="#70727F" paragraph>
            Please upload the following documents to verify your business.
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <StyledCard>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" sx={{ color: '#1B1C20' }}>
                  Business Registration
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {documents.businessRegistration ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon sx={{ color: '#3D1560' }} />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200, color: '#383A47' }}>
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
                  <>
                    <StyledUploadLabel htmlFor="business-registration-upload">
                      <UploadInput
                        id="business-registration-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload('businessRegistration')}
                      />
                      <UploadButton
                        startIcon={<CloudUploadIcon />}
                        variant="outlined"
                      >
                        Upload Certificate
                      </UploadButton>
                    </StyledUploadLabel>
                  </>
                )}
              </Grid>
            </Grid>
          </StyledCard>
          
          <StyledCard>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" sx={{ color: '#1B1C20' }}>
                  Tax ID
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {documents.taxId ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon sx={{ color: '#3D1560' }} />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200, color: '#383A47' }}>
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <StyledTextField>
                      <Typography variant="body2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
                        Tax ID Number
                      </Typography>
                      <input
                        type="text"
                        name="taxIdNumber"
                        value={businessInfo.taxIdNumber || ''}
                        onChange={handleBusinessInfoChange}
                        placeholder="Enter your Tax ID number (optional)"
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          borderRadius: '8px',
                          border: '1px solid #CDCED8',
                          outline: 'none',
                          fontSize: '16px',
                          transition: 'all 0.2s',
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                    </StyledTextField>
                    
                    <Typography variant="body2" sx={{ color: '#70727F', mt: 1 }}>
                      - OR -
                    </Typography>
                    
                    <StyledUploadLabel htmlFor="tax-id-upload">
                      <UploadInput
                        id="tax-id-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload('taxId')}
                      />
                      <UploadButton
                        startIcon={<CloudUploadIcon />}
                        variant="outlined"
                      >
                        Upload Tax Document
                      </UploadButton>
                    </StyledUploadLabel>
                  </Box>
                )}
              </Grid>
            </Grid>
          </StyledCard>
          
          <StyledCard>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" sx={{ color: '#1B1C20' }}>
                  Address Proof
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                {documents.addressProof ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachFileIcon sx={{ color: '#3D1560' }} />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200, color: '#383A47' }}>
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
                  <>
                    <StyledUploadLabel htmlFor="address-proof-upload">
                      <UploadInput
                        id="address-proof-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload('addressProof')}
                      />
                      <UploadButton
                        startIcon={<CloudUploadIcon />}
                        variant="outlined"
                      >
                        Upload Utility Bill
                      </UploadButton>
                    </StyledUploadLabel>
                  </>
                )}
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderListingInformation = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2, backgroundColor: '#FFFFFF' }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Service/Product Details
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        Tell us more about what your business offers.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47' }}>
            Industries
          </Typography>
          <Autocomplete
            multiple
            options={['Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 'Hospitality', 'Manufacturing', 'Construction', 'Transportation', 'Entertainment']}
            renderInput={(params) => (
              <Box component="div" {...params} 
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    border: '1px solid #CDCED8',
                  }
                }} 
              />
            )}
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
              setListingInfo({...listingInfo, industries: newValue});
            }}
            value={listingInfo.industries}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47' }}>
            Service Types
          </Typography>
          <Autocomplete
            multiple
            options={['Consulting', 'Design', 'Development', 'Maintenance', 'Training', 'Support', 'Installation', 'Repair', 'Custom Manufacturing', 'Wholesale']}
            renderInput={(params) => (
              <Box component="div" {...params} 
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    border: '1px solid #CDCED8',
                  }
                }} 
              />
            )}
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
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47' }}>
            Specific Services/Products Description
          </Typography>
          <textarea
            name="specificServices"
            value={listingInfo.specificServices}
            onChange={handleListingInfoChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #CDCED8',
              outline: 'none',
              fontSize: '16px',
              transition: 'all 0.2s',
              backgroundColor: '#FFFFFF',
              minHeight: '120px',
              resize: 'vertical',
            }}
            placeholder="Please describe the specific services or products your business offers"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47' }}>
            Preferred Currency
          </Typography>
          <select
            name="preferredCurrency"
            value={listingInfo.preferredCurrency}
            onChange={handleListingInfoChange}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid #CDCED8',
              outline: 'none',
              fontSize: '16px',
              transition: 'all 0.2s',
              backgroundColor: '#FFFFFF',
            }}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47' }}>
            Languages Spoken
          </Typography>
          <Autocomplete
            multiple
            options={languages}
            renderInput={(params) => (
              <Box component="div" {...params} 
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    border: '1px solid #CDCED8',
                  }
                }} 
              />
            )}
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
      </Grid>
    </Paper>
  );

  const renderOwnerVerification = () => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #CDCED8', borderRadius: 2, backgroundColor: '#FFFFFF' }}>
      <Typography variant="h6" gutterBottom color="#1B1C20" fontWeight="bold">
        Verify Business Representative
      </Typography>
      <Typography variant="body2" paragraph color="#70727F">
        As a final step, we need to verify your identity as an authorized representative of the business.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Full Name*
            </Typography>
            <input
              type="text"
              name="fullName"
              value={ownerInfo.fullName}
              onChange={handleOwnerInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Position/Title*
            </Typography>
            <input
              type="text"
              name="position"
              value={ownerInfo.position}
              onChange={handleOwnerInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Business Email*
            </Typography>
            <input
              type="email"
              name="businessEmail"
              value={ownerInfo.businessEmail}
              onChange={handleOwnerInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledTextField>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#383A47', mb: 1 }}>
              Business Phone*
            </Typography>
            <input
              type="tel"
              name="businessPhone"
              value={ownerInfo.businessPhone}
              onChange={handleOwnerInfoChange}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid #CDCED8',
                outline: 'none',
                fontSize: '16px',
                transition: 'all 0.2s',
                backgroundColor: '#FFFFFF',
              }}
              required
            />
          </StyledTextField>
        </Grid>
      </Grid>
      
      <Box sx={{ bgcolor: '#F8F8FA', p: 3, borderRadius: 2, mb: 4, mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ color: '#1B1C20' }}>
          KYC Verification Only
        </Typography>
        <Typography variant="body2" paragraph sx={{ color: '#383A47' }}>
          The following step will only verify your personal identity through our third-party service. Your business documents will be reviewed separately by our team.
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
          <StyledCard sx={{ width: '100%', maxWidth: 450, mb: 3 }}>
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
              
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#1B1C20' }}>
                Or continue on this device
              </Typography>
              
              <ActionButton
                variant="contained"
                size="large"
                onClick={handleComplete}
              >
                Continue to Verification
              </ActionButton>
            </CardContent>
          </StyledCard>
        </Box>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon sx={{ color: '#3D1560' }} />
            <Typography variant="body2" sx={{ color: '#383A47' }}>
              Your personal information is securely transmitted with end-to-end encryption.
            </Typography>
          </Box>
          
          <Divider />
          
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#70727F' }}>
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
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 }, backgroundColor: '#F8F8FA' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecondaryButton 
          startIcon={<ArrowBackIcon />} 
          onClick={onCancel}
        >
          Cancel
        </SecondaryButton>
        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ color: '#1B1C20' }}>
          Business Account Verification
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
        <SecondaryButton
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
        >
          Back
        </SecondaryButton>
        
        {activeStep === steps.length - 1 ? (
          <ActionButton
            variant="contained"
            onClick={handleComplete}
            endIcon={<CheckCircleIcon />}
          >
            Submit Verification
          </ActionButton>
        ) : (
          <ActionButton
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            Next Step
          </ActionButton>
        )}
      </Box>
    </Box>
  );
};

export default BusinessVerificationFlow;