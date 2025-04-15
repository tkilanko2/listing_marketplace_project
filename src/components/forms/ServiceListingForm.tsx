import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Divider,
  Stack,
  styled,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HandymanIcon from '@mui/icons-material/Handyman';
import ListingPreview from '../ListingPreview';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';

const serviceCategories = [
  'Professional Services',
  'Home Services',
  'Personal Care',
  'Education & Training',
  'Creative & Digital',
  'Events & Entertainment',
  'Health & Wellness',
  'Transportation',
  'Business Services',
  'Other'
];

interface FormValues extends Record<string, any> {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  location: string;
  images: File[];
  category: string;
  serviceType: string;
  paymentOptions: {
    onlinePayment: boolean;
    payAtService: boolean;
  };
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'datetime' | 'currency' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  unit?: string;
  helperText?: string;
}

// Category-specific fields configuration
const categorySpecificFields: Record<string, FieldConfig[]> = {
  'Professional Services': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Consulting', 'Legal', 'Accounting', 'Marketing', 'IT Support'], required: true },
    { name: 'expertise', label: 'Areas of Expertise', type: 'multiselect', options: ['Strategy', 'Tax', 'Corporate Law', 'Digital Marketing', 'Cloud Computing'] },
    { name: 'experience', label: 'Years of Experience', type: 'number', required: true },
    { name: 'certifications', label: 'Professional Certifications', type: 'textarea' },
    { name: 'availability', label: 'Availability', type: 'multiselect', options: ['Weekdays', 'Weekends', 'Evenings', 'Remote', 'On-site'] },
    { name: 'rateType', label: 'Rate Type', type: 'select', options: ['Hourly', 'Project-based', 'Retainer'], required: true },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Home Services': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Cleaning', 'Repairs', 'Landscaping', 'Moving', 'Interior Design'], required: true },
    { name: 'coverage', label: 'Service Coverage', type: 'multiselect', options: ['Indoor', 'Outdoor', 'Residential', 'Commercial'] },
    { name: 'equipment', label: 'Equipment Provided', type: 'boolean' },
    { name: 'insurance', label: 'Insurance Coverage', type: 'textarea', placeholder: 'Describe your insurance coverage' },
    { name: 'minimumBooking', label: 'Minimum Booking Duration', type: 'text', placeholder: 'e.g., 2 hours' },
    { name: 'teamSize', label: 'Team Size', type: 'number', helperText: 'Number of workers for the service' },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Personal Care': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Hair Styling', 'Makeup', 'Massage', 'Nail Care', 'Personal Training'], required: true },
    { name: 'specializations', label: 'Specializations', type: 'multiselect', options: ['Wedding', 'Special Events', 'Sports Massage', 'Therapeutic', 'Wellness'] },
    { name: 'location', label: 'Service Location', type: 'select', options: ['At Home', 'At Studio', 'Mobile Service'], required: true },
    { name: 'duration', label: 'Session Duration', type: 'text', placeholder: 'e.g., 60 minutes', required: true },
    { name: 'products', label: 'Products Used', type: 'textarea', placeholder: 'List the products/brands you use' },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Education & Training': [
    { name: 'subject', label: 'Subject Area', type: 'select', options: ['Languages', 'Mathematics', 'Science', 'Arts', 'Technology'], required: true },
    { name: 'level', label: 'Teaching Level', type: 'multiselect', options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
    { name: 'format', label: 'Class Format', type: 'select', options: ['One-on-One', 'Group', 'Online', 'In-Person'], required: true },
    { name: 'materials', label: 'Learning Materials', type: 'textarea', placeholder: 'Describe the materials provided' },
    { name: 'prerequisites', label: 'Prerequisites', type: 'textarea' },
    { name: 'classSize', label: 'Maximum Class Size', type: 'number', helperText: 'For group sessions' },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Creative & Digital': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Graphic Design', 'Web Development', 'Video Production', 'Content Writing'], required: true },
    { name: 'skills', label: 'Technical Skills', type: 'multiselect', options: ['Adobe Suite', 'WordPress', 'React', 'SEO', 'Video Editing'] },
    { name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true },
    { name: 'revisions', label: 'Revision Policy', type: 'text', placeholder: 'e.g., 2 rounds of revisions included' },
    { name: 'turnaround', label: 'Typical Turnaround Time', type: 'text', required: true },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Events & Entertainment': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['DJ', 'Live Band', 'Photography', 'Catering', 'Event Planning'], required: true },
    { name: 'eventTypes', label: 'Event Types', type: 'multiselect', options: ['Weddings', 'Corporate', 'Parties', 'Concerts', 'Festivals'] },
    { name: 'equipment', label: 'Equipment Provided', type: 'textarea', required: true },
    { name: 'duration', label: 'Performance Duration', type: 'text', required: true },
    { name: 'setup', label: 'Setup Requirements', type: 'textarea' },
    { name: 'travel', label: 'Travel Distance', type: 'text', placeholder: 'Maximum distance willing to travel' },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Health & Wellness': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Yoga', 'Nutrition', 'Counseling', 'Physical Therapy'], required: true },
    { name: 'specialization', label: 'Specialization', type: 'multiselect', options: ['Prenatal', 'Sports', 'Mental Health', 'Weight Management'] },
    { name: 'sessionType', label: 'Session Type', type: 'select', options: ['Individual', 'Group', 'Online', 'In-Person'], required: true },
    { name: 'duration', label: 'Session Duration', type: 'text', required: true },
    { name: 'certification', label: 'Professional Certifications', type: 'textarea', required: true },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Transportation': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Rideshare', 'Moving', 'Delivery', 'Chauffeur'], required: true },
    { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Sedan', 'SUV', 'Van', 'Truck'], required: true },
    { name: 'capacity', label: 'Vehicle Capacity', type: 'text', required: true },
    { name: 'coverage', label: 'Service Area', type: 'textarea', required: true },
    { name: 'availability', label: 'Availability', type: 'multiselect', options: ['Weekdays', 'Weekends', '24/7', 'By Appointment'] },
    { name: 'insurance', label: 'Insurance Details', type: 'textarea' },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  'Business Services': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Consulting', 'Bookkeeping', 'Virtual Assistant', 'HR Services'], required: true },
    { name: 'expertise', label: 'Areas of Expertise', type: 'multiselect', options: ['Strategy', 'Finance', 'Operations', 'Marketing'] },
    { name: 'availability', label: 'Availability', type: 'multiselect', options: ['Full-time', 'Part-time', 'Project-based', 'On-call'] },
    { name: 'tools', label: 'Tools & Software', type: 'textarea', placeholder: 'List the tools and software you use' },
    { name: 'languages', label: 'Languages', type: 'multiselect', options: ['English', 'Spanish', 'French', 'Mandarin', 'Other'] },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ],
  Other: [
    { name: 'serviceType', label: 'Service Type', type: 'text', required: true },
    { name: 'description', label: 'Detailed Description', type: 'textarea', required: true },
    { name: 'requirements', label: 'Special Requirements', type: 'textarea' },
    { name: 'availability', label: 'Availability', type: 'text' },
    { name: 'additionalInfo', label: 'Additional Information', type: 'textarea' },
    { name: 'paymentOptions.payAtService', label: 'Accept Pay at Service', type: 'boolean' },
    { name: 'paymentOptions.onlinePayment', label: 'Accept Online Payment', type: 'boolean' }
  ]
};

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const FormSection = styled(Paper)(({ theme }) => ({
  flex: '1 1 60%',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const PreviewSection = styled(Box)(({ theme }) => ({
  flex: '1 1 40%',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
    },
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
    },
  },
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[100],
  '&:hover .image-overlay': {
    opacity: 1,
  },
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
}));

const StyledUploadButton = styled('label')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const StepIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const ServiceListingForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Information', 'Service Category', 'Category Details'];

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      location: '',
      images: [],
      category: '',
      serviceType: '',
      paymentOptions: {
        onlinePayment: false,
        payAtService: true
      }
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      shortDescription: Yup.string().required('Short description is required'),
      detailedDescription: Yup.string().required('Detailed description is required'),
      price: Yup.string().required('Price is required'),
      location: Yup.string().required('Location is required'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: (values) => {
      if (activeStep < 2) {
        handleNext();
      } else {
        console.log('Final form submission:', values);
      }
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onBack();
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const renderField = (field: FieldConfig) => {
    const fieldValue = formik.values[field.name];

    const commonProps = {
      name: field.name as string,
      label: field.label,
      required: field.required,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'select':
        return (
          <StyledFormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              {...commonProps}
              value={fieldValue || ''}
              onChange={formik.handleChange}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        );
      case 'multiselect':
        return (
          <StyledFormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              {...commonProps}
              multiple
              value={Array.isArray(fieldValue) ? fieldValue : []}
              onChange={formik.handleChange}
              renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : '')}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        );
      case 'textarea':
        return (
          <StyledTextField
            {...commonProps}
            fullWidth
            multiline
            rows={4}
            value={fieldValue || ''}
            onChange={formik.handleChange}
          />
        );
      default:
        return (
          <StyledTextField
            {...commonProps}
            fullWidth
            type={field.type}
            value={fieldValue || ''}
            onChange={formik.handleChange}
            InputProps={field.unit ? {
              endAdornment: <InputAdornment position="end">{field.unit}</InputAdornment>,
            } : undefined}
          />
        );
    }
  };

  const renderImageUpload = () => (
    <Box>
      <input
        type="file"
        multiple
        accept="image/*"
        id="image-upload"
        style={{ display: 'none' }}
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          formik.setFieldValue('images', files);
        }}
      />
      <StyledUploadButton htmlFor="image-upload">
        <InventoryIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
        <Typography variant="subtitle1" gutterBottom>
          Upload Images
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop your images here, or click to select files
        </Typography>
      </StyledUploadButton>
      {formik.values.images.length > 0 && (
        <ImagePreviewContainer>
          {Array.from(formik.values.images).map((file, index) => (
            <ImagePreview key={index}>
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <ImageOverlay className="image-overlay">
                <IconButton
                  size="small"
                  onClick={() => {
                    const newImages = Array.from(formik.values.images);
                    newImages.splice(index, 1);
                    formik.setFieldValue('images', newImages);
                  }}
                  sx={{ color: 'white' }}
                >
                  <DeleteIcon />
                </IconButton>
              </ImageOverlay>
            </ImagePreview>
          ))}
        </ImagePreviewContainer>
      )}
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {renderImageUpload()}
            <StyledTextField
              fullWidth
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <StyledTextField
              fullWidth
              name="shortDescription"
              label="Short Description"
              value={formik.values.shortDescription}
              onChange={formik.handleChange}
              error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
              helperText={formik.touched.shortDescription && formik.errors.shortDescription}
              multiline
              rows={2}
            />
            <StyledTextField
              fullWidth
              name="detailedDescription"
              label="Detailed Description"
              value={formik.values.detailedDescription}
              onChange={formik.handleChange}
              error={formik.touched.detailedDescription && Boolean(formik.errors.detailedDescription)}
              helperText={formik.touched.detailedDescription && formik.errors.detailedDescription}
              multiline
              rows={4}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyledTextField
                  fullWidth
                  name="price"
                  label="Price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  fullWidth
                  name="location"
                  label="Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
            </Grid>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            <StyledFormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                {serviceCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Stack>
        );
      case 2:
        const categoryFields = categorySpecificFields[formik.values.category as keyof typeof categorySpecificFields] || [];
        return (
          <Stack spacing={3}>
            {categoryFields.map((field) => (
              <Box key={field.name}>
                {renderField(field)}
              </Box>
            ))}
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <FormSection>
        <Box sx={{ mb: 3, position: 'relative' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h1">
              Create Service Listing
            </Typography>
          </Stack>
          <StepIndicator>
            <Typography variant="body2" color="text.secondary">
              Step {activeStep + 1} of {steps.length}
            </Typography>
          </StepIndicator>
        </Box>

        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'primary.main',
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: 'primary.main',
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ position: 'relative', minHeight: 400 }}>
            {renderStepContent(activeStep)}
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              type={activeStep === steps.length - 1 ? 'submit' : 'button'}
              onClick={activeStep === steps.length - 1 ? undefined : handleNext}
              endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
              sx={{ 
                px: 4,
                py: 1,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </form>
      </FormSection>

      <PreviewSection>
        <ListingPreview
          formData={{
            id: 'preview',
            name: formik.values.title,
            price: Number(formik.values.price) || 0,
            shortDescription: formik.values.shortDescription,
            category: formik.values.category,
            location: {
              city: formik.values.location,
              country: 'Country',
            },
            images: formik.values.images,
            type: 'service',
            views: 0,
            saves: 0,
            provider: {
              id: 'preview-provider',
              username: 'Your Name',
              avatar: '',
              rating: 0,
              totalBookings: 0,
              joinedDate: new Date(),
              isOnline: true,
              location: {
                city: '',
                country: '',
              },
              reviews: [],
              responseTime: '1 hour',
              responseRate: '100%',
            },
            description: formik.values.detailedDescription,
            longDescription: formik.values.detailedDescription,
            createdAt: new Date(),
            trending: false,
            recommended: false,
            duration: 60,
            serviceType: formik.values.serviceType,
            serviceArea: '',
            availability: '',
            pricingStructure: 'fixed',
            languagesSpoken: ['English'],
            serviceMode: 'both',
            paymentOptions: {
              onlinePayment: formik.values.paymentOptions?.onlinePayment || false,
              payAtService: formik.values.paymentOptions?.payAtService || true
            },
          }}
          type="service"
        />
      </PreviewSection>
    </FormContainer>
  );
};

export default ServiceListingForm; 