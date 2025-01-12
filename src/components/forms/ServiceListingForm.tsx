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
  FormHelperText,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HandymanIcon from '@mui/icons-material/Handyman';

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

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'datetime' | 'currency' | 'textarea' | 'time';
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
    { name: 'rateType', label: 'Rate Type', type: 'select', options: ['Hourly', 'Project-based', 'Retainer'], required: true }
  ],
  'Home Services': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Cleaning', 'Repairs', 'Landscaping', 'Moving', 'Interior Design'], required: true },
    { name: 'coverage', label: 'Service Coverage', type: 'multiselect', options: ['Indoor', 'Outdoor', 'Residential', 'Commercial'] },
    { name: 'equipment', label: 'Equipment Provided', type: 'boolean' },
    { name: 'insurance', label: 'Insurance Coverage', type: 'textarea', placeholder: 'Describe your insurance coverage' },
    { name: 'minimumBooking', label: 'Minimum Booking Duration', type: 'text', placeholder: 'e.g., 2 hours' },
    { name: 'teamSize', label: 'Team Size', type: 'number', helperText: 'Number of workers for the service' }
  ],
  'Personal Care': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Hair Styling', 'Makeup', 'Massage', 'Nail Care', 'Personal Training'], required: true },
    { name: 'specializations', label: 'Specializations', type: 'multiselect', options: ['Wedding', 'Special Events', 'Sports Massage', 'Therapeutic', 'Wellness'] },
    { name: 'location', label: 'Service Location', type: 'select', options: ['At Home', 'At Studio', 'Mobile Service'], required: true },
    { name: 'duration', label: 'Session Duration', type: 'text', placeholder: 'e.g., 60 minutes', required: true },
    { name: 'products', label: 'Products Used', type: 'textarea', placeholder: 'List the products/brands you use' }
  ],
  'Education & Training': [
    { name: 'subject', label: 'Subject Area', type: 'select', options: ['Languages', 'Mathematics', 'Science', 'Arts', 'Technology'], required: true },
    { name: 'level', label: 'Teaching Level', type: 'multiselect', options: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
    { name: 'format', label: 'Class Format', type: 'select', options: ['One-on-One', 'Group', 'Online', 'In-Person'], required: true },
    { name: 'materials', label: 'Learning Materials', type: 'textarea', placeholder: 'Describe the materials provided' },
    { name: 'prerequisites', label: 'Prerequisites', type: 'textarea' },
    { name: 'classSize', label: 'Maximum Class Size', type: 'number', helperText: 'For group sessions' }
  ],
  'Creative & Digital': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Graphic Design', 'Web Development', 'Video Production', 'Content Writing'], required: true },
    { name: 'skills', label: 'Technical Skills', type: 'multiselect', options: ['Adobe Suite', 'WordPress', 'React', 'SEO', 'Video Editing'] },
    { name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true },
    { name: 'revisions', label: 'Revision Policy', type: 'text', placeholder: 'e.g., 2 rounds of revisions included' },
    { name: 'turnaround', label: 'Typical Turnaround Time', type: 'text', required: true }
  ],
  'Events & Entertainment': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['DJ', 'Live Band', 'Photography', 'Catering', 'Event Planning'], required: true },
    { name: 'eventTypes', label: 'Event Types', type: 'multiselect', options: ['Weddings', 'Corporate', 'Parties', 'Concerts', 'Festivals'] },
    { name: 'equipment', label: 'Equipment Provided', type: 'textarea', required: true },
    { name: 'duration', label: 'Performance Duration', type: 'text', required: true },
    { name: 'setup', label: 'Setup Requirements', type: 'textarea' },
    { name: 'travel', label: 'Travel Distance', type: 'text', placeholder: 'Maximum distance willing to travel' }
  ],
  'Health & Wellness': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Yoga', 'Nutrition', 'Counseling', 'Physical Therapy'], required: true },
    { name: 'specialization', label: 'Specialization', type: 'multiselect', options: ['Prenatal', 'Sports', 'Mental Health', 'Weight Management'] },
    { name: 'sessionType', label: 'Session Type', type: 'select', options: ['Individual', 'Group', 'Online', 'In-Person'], required: true },
    { name: 'duration', label: 'Session Duration', type: 'text', required: true },
    { name: 'certification', label: 'Professional Certifications', type: 'textarea', required: true }
  ],
  'Transportation': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Rideshare', 'Moving', 'Delivery', 'Chauffeur'], required: true },
    { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Sedan', 'SUV', 'Van', 'Truck'], required: true },
    { name: 'capacity', label: 'Vehicle Capacity', type: 'text', required: true },
    { name: 'coverage', label: 'Service Area', type: 'textarea', required: true },
    { name: 'availability', label: 'Availability', type: 'multiselect', options: ['Weekdays', 'Weekends', '24/7', 'By Appointment'] },
    { name: 'insurance', label: 'Insurance Details', type: 'textarea' }
  ],
  'Business Services': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Consulting', 'Bookkeeping', 'Virtual Assistant', 'HR Services'], required: true },
    { name: 'expertise', label: 'Areas of Expertise', type: 'multiselect', options: ['Strategy', 'Finance', 'Operations', 'Marketing'] },
    { name: 'availability', label: 'Availability', type: 'multiselect', options: ['Full-time', 'Part-time', 'Project-based', 'On-call'] },
    { name: 'tools', label: 'Tools & Software', type: 'textarea', placeholder: 'List the tools and software you use' },
    { name: 'languages', label: 'Languages', type: 'multiselect', options: ['English', 'Spanish', 'French', 'Mandarin', 'Other'] }
  ],
  Other: [
    { name: 'serviceType', label: 'Service Type', type: 'text', required: true },
    { name: 'description', label: 'Detailed Description', type: 'textarea', required: true },
    { name: 'requirements', label: 'Special Requirements', type: 'textarea' },
    { name: 'availability', label: 'Availability', type: 'text' },
    { name: 'additionalInfo', label: 'Additional Information', type: 'textarea' }
  ]
};

interface ServiceFormValues {
  // Universal fields
  title: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  location: string;
  images: File[];
  
  // Service category and type
  category: string;
  serviceType: string;
  
  // Dynamic fields - these will be populated based on category
  [key: string]: any;
}

const initialValues: ServiceFormValues = {
  // Universal fields
  title: '',
  shortDescription: '',
  detailedDescription: '',
  price: '',
  location: '',
  images: [],
  
  // Service category and type
  category: '',
  serviceType: '',
};

const validationSchema = Yup.object().shape({
  // Step 1: Basic Information
  title: Yup.string().required('Title is required'),
  shortDescription: Yup.string()
    .required('Short description is required')
    .max(200, 'Short description must be at most 200 characters'),
  detailedDescription: Yup.string()
    .required('Detailed description is required')
    .min(100, 'Detailed description must be at least 100 characters'),
  price: Yup.string().required('Price is required'),
  location: Yup.string().required('Location is required'),
  
  // Step 2: Service Category
  category: Yup.string().required('Service category is required'),
  
  // Step 3: Category-specific fields will be validated dynamically
  serviceType: Yup.string().when('category', {
    is: (category: string) => !!category,
    then: () => Yup.string().required('Service type is required'),
  }),
});

const ServiceListingForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);

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

  const steps = ['Basic Information', 'Service Category', 'Category Details'];

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      // Handle form submission
    },
  });

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formik.values[field.name as keyof typeof formik.values] || ''}
              onChange={formik.handleChange}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'multiselect':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              multiple
              name={field.name}
              value={formik.values[field.name as keyof typeof formik.values] || []}
              onChange={formik.handleChange}
              label={field.label}
              renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : selected)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'boolean':
        return (
          <FormControl fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formik.values[field.name as keyof typeof formik.values] || ''}
              onChange={formik.handleChange}
              label={field.label}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        );
      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={formik.values[field.name as keyof typeof formik.values] || ''}
            onChange={formik.handleChange}
            helperText={field.helperText}
          />
        );
      case 'time':
        return (
          <TextField
            fullWidth
            type="time"
            name={field.name}
            label={field.label}
            value={formik.values[field.name as keyof typeof formik.values] || ''}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            type={field.type === 'number' ? 'number' : 'text'}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={formik.values[field.name as keyof typeof formik.values] || ''}
            onChange={formik.handleChange}
            InputProps={field.unit ? {
              endAdornment: <InputAdornment position="end">{field.unit}</InputAdornment>,
            } : undefined}
            helperText={field.helperText}
          />
        );
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="shortDescription"
                label="Short Description"
                multiline
                rows={2}
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
                error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                helperText={formik.touched.shortDescription && formik.errors.shortDescription}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="detailedDescription"
                label="Detailed Description"
                multiline
                rows={4}
                value={formik.values.detailedDescription}
                onChange={formik.handleChange}
                error={formik.touched.detailedDescription && Boolean(formik.errors.detailedDescription)}
                helperText={formik.touched.detailedDescription && formik.errors.detailedDescription}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="price"
                label="Price"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
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
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Service Category
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  label="Category"
                >
                  {serviceCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <FormHelperText>{formik.errors.category}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        const fields = categorySpecificFields[formik.values.category] || [];
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {formik.values.category} Specific Details
              </Typography>
            </Grid>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <IconButton 
            onClick={onBack}
            sx={{ 
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.paper' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Create Service Listing
          </Typography>
        </Stack>
        <Divider />
      </Box>

      {/* Main Content */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Progress Indicator */}
        <Box sx={{ mb: 5 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
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
        </Box>

        {/* Form Content */}
        <Box sx={{ minHeight: 400 }}>
          <form onSubmit={formik.handleSubmit}>
            {renderStepContent(activeStep)}
            
            {/* Navigation Buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 4,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                {activeStep === steps.length - 1 ? 'Create Listing' : 'Continue'}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>

      {/* Helper Text */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {activeStep === 0 && "Start with the basic information about your service"}
          {activeStep === 1 && "Choose the type of service you'll be offering"}
          {activeStep === 2 && "Add specific details to help clients understand your service better"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ServiceListingForm; 