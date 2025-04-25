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
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormLabel,
  Slider,
  Tabs,
  Tab,
  Switch,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
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
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import { mockServices } from '../../mockData';

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
  country: string;
  coverageAreaKm: string;
  serviceAreas: string[];
  serviceCities: Array<{
    country: string;
    city: string;
    radius: string;
  }>;
  images: File[];
  category: string;
  serviceType: string;
  paymentOptions: {
    onlinePayment: boolean;
    payAtService: boolean;
  };
  availability: {
    type: 'weekdays' | 'weekends' | 'allWeek' | 'custom';
    scheduleType: 'weekly' | 'dateRange';
    customSchedule: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
      timeRanges: Array<{
        startTime: string;
        endTime: string;
        days: string[];
      }>;
    };
    dateRanges: Array<{
      startDate: string;
      endDate: string;
      timeSlots: Array<{
        startTime: string;
        endTime: string;
      }>;
    }>;
  };
  pricingModel: 'flat' | 'tiered';
  flatRatePrice: string;
  pricingTiers: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
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
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.2s ease-in-out',
    '&:hover fieldset': {
      borderColor: '#6D26AB',
    },
    '&.Mui-focused fieldset': {
      boxShadow: '0 0 0 0.3px #9B53D9',
      borderColor: '#3D1560',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.2s ease-in-out',
    '&:hover fieldset': {
      borderColor: '#6D26AB',
    },
    '&.Mui-focused fieldset': {
      boxShadow: '0 0 0 0.3px #9B53D9',
      borderColor: '#3D1560',
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
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
    borderColor: '#6D26AB',
    backgroundColor: '#E8E9ED',
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

// Add array of placeholder image URLs for mock data
const placeholderImages = [
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560523159-4a9692d222f9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80'
];

const ServiceListingForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [availabilityTab, setAvailabilityTab] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const steps = ['Basic Information', 'Category & Availability', 'Pricing Options'];

  // Function to generate a unique ID for new listings
  const generateUniqueId = (): string => {
    return 'service-' + Math.random().toString(36).substr(2, 9);
  };

  // Function to get availability preview text
  const getAvailabilityPreviewText = (availability: any) => {
    if (availability.scheduleType === 'dateRange') {
      return 'Available on specific dates';
    } else if (availability.type === 'custom') {
      return 'Custom weekly schedule';
    } else if (availability.type === 'weekdays') {
      return 'Weekdays, 9AM-5PM';
    } else if (availability.type === 'weekends') {
      return 'Weekends';
    } else {
      return 'All week';
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      location: '',
      country: '',
      coverageAreaKm: '',
      serviceAreas: [],
      serviceCities: [],
      images: [],
      category: '',
      serviceType: '',
      paymentOptions: {
        onlinePayment: false,
        payAtService: true
      },
      availability: {
        type: 'weekdays',
        scheduleType: 'weekly',
        customSchedule: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
          timeRanges: [
            {
              startTime: '09:00',
              endTime: '17:00',
              days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            }
          ]
        },
        dateRanges: []
      },
      pricingModel: 'flat',
      flatRatePrice: '',
      pricingTiers: [
        {
          id: '1',
          name: 'Basic',
          price: '',
          description: '',
          features: []
        },
        {
          id: '2',
          name: 'Standard',
          price: '',
          description: '',
          features: []
        },
        {
          id: '3',
          name: 'Premium',
          price: '',
          description: '',
          features: []
        }
      ]
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      shortDescription: Yup.string().required('Short description is required'),
      detailedDescription: Yup.string().required('Detailed description is required'),
      location: Yup.string().required('City is required'),
      country: Yup.string().required('Country is required'),
      category: Yup.string().required('Category is required'),
      pricingModel: Yup.string().required('Pricing model is required'),
      flatRatePrice: Yup.string().when('pricingModel', {
        is: 'flat',
        then: () => Yup.string().required('Price is required')
      }),
      pricingTiers: Yup.array().when('pricingModel', {
        is: 'tiered',
        then: () => Yup.array().of(
          Yup.object().shape({
            name: Yup.string().required('Tier name is required'),
            price: Yup.string().required('Tier price is required'),
            description: Yup.string().required('Tier description is required')
          })
        )
      })
    }),
    onSubmit: (values) => {
      if (activeStep < 2) {
        handleNext();
      } else {
        console.log('Final form submission:', values);
        
        // Create a new service listing from form values
        const newServiceListing = {
          id: generateUniqueId(),
          name: values.title,
          type: 'service' as const,
          category: values.category,
          price: values.pricingModel === 'flat' 
            ? parseFloat(values.flatRatePrice) || 0 
            : parseFloat(values.pricingTiers[0]?.price) || 0,
          shortDescription: values.shortDescription,
          description: values.detailedDescription,
          longDescription: values.detailedDescription,
          location: {
            city: values.location,
            country: values.country,
          },
          // Use placeholder images instead of URL.createObjectURL
          images: values.images.length > 0 
            ? placeholderImages.slice(0, Math.min(values.images.length, placeholderImages.length))
            : [placeholderImages[0]],
          provider: {
            id: 'current-user', // This would normally be the logged-in user's ID
            username: 'Your Shop Name', // This would be the current user's shop name
            avatar: '', // This would be the current user's avatar
            rating: 0,
            totalBookings: 0,
            joinedDate: new Date(),
            isOnline: true,
            location: {
              city: values.location,
              country: values.country,
            },
            reviews: [],
            responseTime: '1 hour',
            responseRate: '100%',
          },
          createdAt: new Date(),
          trending: false,
          recommended: false,
          duration: 60, // Default duration in minutes
          serviceType: values.serviceType,
          serviceArea: values.serviceCities.length > 0 
            ? `Multiple locations in ${values.serviceCities.length + 1} cities` 
            : `Coverage area: ${values.coverageAreaKm || 'local'} km`,
          availability: getAvailabilityPreviewText(values.availability),
          pricingStructure: values.pricingModel === 'tiered' ? 'tiered' : 'fixed',
          languagesSpoken: ['English'],
          serviceMode: 'both' as const,
          paymentOptions: {
            onlinePayment: values.paymentOptions?.onlinePayment || false,
            payAtService: values.paymentOptions?.payAtService || true
          },
          views: 0,
          saves: 0,
          status: 'active',
        };
        
        // Add the new listing to mockServices
        mockServices.push(newServiceListing);
        
        // Show success message
        setSnackbarMessage('Service listing successfully created!');
        setSnackbarOpen(true);
        
        // Reset form or navigate back to listings page after a delay
        setTimeout(() => {
          onBack();
        }, 2000);
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

  const renderServiceAreaFields = () => {
    // List of countries - you can expand this list as needed
    const countries = [
      'United States',
      'Canada',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'Italy',
      'Japan',
      'China',
      'India',
      'Brazil',
      'Mexico',
      // Add more countries as needed
    ];

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ mr: 1 }} /> Service Locations
        </Typography>
        
        {/* Primary Service Location */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Primary Service Location
          </Typography>
          
          <Card sx={{ 
            mb: 2, 
            p: 1.5, 
            border: '1px solid', 
            borderColor: '#CDCED8', 
            boxShadow: 'none',
            borderRadius: '8px' 
          }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} sm={4}>
                <StyledFormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                  >
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField
                  fullWidth
                  name="location"
                  label="City"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  error={formik.touched.location && Boolean(formik.errors.location)}
                  helperText={formik.touched.location && formik.errors.location}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StyledTextField 
                  fullWidth
                  name="coverageAreaKm"
                  label="Coverage Radius"
                  type="number"
                  defaultValue="10"
                  placeholder="10"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                    }
                  }}
                  value={formik.values.coverageAreaKm}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </Card>
        </Box>
        
        {/* Additional Service Locations */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Additional Service Locations
          </Typography>
          
          {formik.values.serviceCities.length === 0 && (
            <Box sx={{ p: 2, bgcolor: '#F8F8FA', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No additional locations added. Add a location if you serve multiple cities.
              </Typography>
            </Box>
          )}
          
          {formik.values.serviceCities.map((cityData, index) => (
            <Card key={index} sx={{ 
              mb: 2, 
              p: 1.5, 
              border: '1px solid', 
              borderColor: '#CDCED8', 
              boxShadow: 'none',
              borderRadius: '8px' 
            }}>
              <Grid container spacing={1.5} alignItems="center">
                <Grid item xs={12} md={4}>
                  <StyledFormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={cityData.country || ''}
                      onChange={(e) => {
                        const newCities = [...formik.values.serviceCities];
                        newCities[index].country = e.target.value;
                        formik.setFieldValue('serviceCities', newCities);
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <StyledTextField 
                    fullWidth
                    placeholder="Enter city name"
                    label="City"
                    value={cityData.city}
                    onChange={(e) => {
                      const newCities = [...formik.values.serviceCities];
                      newCities[index].city = e.target.value;
                      formik.setFieldValue('serviceCities', newCities);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StyledTextField 
                    fullWidth
                    label="Coverage Radius"
                    type="number"
                    defaultValue="10"
                    placeholder="10"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">km</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                      }
                    }}
                    value={cityData.radius}
                    onChange={(e) => {
                      const newCities = [...formik.values.serviceCities];
                      newCities[index].radius = e.target.value;
                      formik.setFieldValue('serviceCities', newCities);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton 
                    color="error"
                    onClick={() => {
                      const newCities = [...formik.values.serviceCities];
                      newCities.splice(index, 1);
                      formik.setFieldValue('serviceCities', newCities);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Card>
          ))}
          
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={() => {
              formik.setFieldValue('serviceCities', [
                ...formik.values.serviceCities,
                { country: formik.values.country || '', city: '', radius: '10' }
              ]);
            }}
            sx={{ 
              mt: 1, 
              backgroundColor: '#F8F8FA',
              borderColor: '#CDCED8',
              color: '#383A47',
              '&:hover': {
                backgroundColor: '#E8E9ED',
                borderColor: '#70727F',
              }
            }}
          >
            Add Another Location
          </Button>
        </Box>
        
        {/* General service areas (optional) */}
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="service-areas"
            options={[
              'Downtown', 'Suburbs', 'Urban Area', 'Rural Area', 'Entire City',
              'Remote Service', 'Nationwide', 'International'
            ]}
            freeSolo
            value={formik.values.serviceAreas}
            onChange={(_, newValue) => {
              formik.setFieldValue('serviceAreas', newValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <StyledTextField
                {...params}
                variant="outlined"
                label="Additional Service Areas"
                placeholder="Add general areas you cover"
                helperText="Add regions, neighborhoods or service types (e.g., Remote Only)"
              />
            )}
          />
        </Grid>
      </Box>
    );
  };

  const renderAvailabilitySection = () => {
    const weekDays = [
      { value: 'monday', label: 'MON' },
      { value: 'tuesday', label: 'TUE' },
      { value: 'wednesday', label: 'WED' },
      { value: 'thursday', label: 'THU' },
      { value: 'friday', label: 'FRI' },
      { value: 'saturday', label: 'SAT' },
      { value: 'sunday', label: 'SUN' }
    ];

    // Helper function to get time slots for a specific day
    const getTimeSlotsForDay = (day: string) => {
      return formik.values.availability.customSchedule.timeRanges.filter(
        timeRange => timeRange.days.includes(day)
      );
    };
    
    // Add a time slot for a specific day
    const addTimeSlotForDay = (day: string) => {
      const newTimeRanges = [...formik.values.availability.customSchedule.timeRanges];
      newTimeRanges.push({
        startTime: '09:00',
        endTime: '17:00',
        days: [day]
      });
      formik.setFieldValue('availability.customSchedule.timeRanges', newTimeRanges);
    };
    
    // Remove a time slot
    const removeTimeSlot = (index: number) => {
      const newTimeRanges = [...formik.values.availability.customSchedule.timeRanges];
      newTimeRanges.splice(index, 1);
      formik.setFieldValue('availability.customSchedule.timeRanges', newTimeRanges);
    };

    // Helper to safely check if a day is selected
    const isDaySelected = (day: string): boolean => {
      const dayProperty = day as keyof typeof formik.values.availability.customSchedule;
      return Boolean(formik.values.availability.customSchedule[dayProperty]);
    };
    
    // Date range helpers
    const addDateRange = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      formik.setFieldValue('availability.dateRanges', [
        ...formik.values.availability.dateRanges,
        {
          startDate: today.toISOString().split('T')[0],
          endDate: tomorrow.toISOString().split('T')[0],
          timeSlots: [
            {
              startTime: '09:00',
              endTime: '17:00'
            }
          ]
        }
      ]);
    };
    
    const removeDateRange = (index: number) => {
      const newDateRanges = [...formik.values.availability.dateRanges];
      newDateRanges.splice(index, 1);
      formik.setFieldValue('availability.dateRanges', newDateRanges);
    };
    
    const addTimeSlotToDateRange = (dateRangeIndex: number) => {
      const newDateRanges = [...formik.values.availability.dateRanges];
      newDateRanges[dateRangeIndex].timeSlots.push({
        startTime: '09:00',
        endTime: '17:00'
      });
      formik.setFieldValue('availability.dateRanges', newDateRanges);
    };
    
    const removeTimeSlotFromDateRange = (dateRangeIndex: number, timeSlotIndex: number) => {
      const newDateRanges = [...formik.values.availability.dateRanges];
      newDateRanges[dateRangeIndex].timeSlots.splice(timeSlotIndex, 1);
      formik.setFieldValue('availability.dateRanges', newDateRanges);
    };
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setAvailabilityTab(newValue);
      // Update the schedule type based on tab
      formik.setFieldValue('availability.scheduleType', newValue === 0 ? 'weekly' : 'dateRange');
    };
    
    const renderWeeklySchedule = () => (
      <>
        <Typography variant="subtitle1" gutterBottom>
          Select days you're available
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          {weekDays.map((day) => {
            const isSelected = isDaySelected(day.value);
            return (
              <Button
                key={day.value}
                variant={isSelected ? "contained" : "outlined"}
                sx={{ 
                  minWidth: 70,
                  backgroundColor: isSelected ? '#6D26AB' : 'transparent',
                  borderColor: '#CDCED8',
                  color: isSelected ? 'white' : '#383A47',
                  '&:hover': {
                    backgroundColor: isSelected ? '#9B53D9' : '#F8F8FA',
                  }
                }}
                onClick={() => {
                  formik.setFieldValue(
                    `availability.customSchedule.${day.value}`, 
                    !isSelected
                  );
                  // If day is being selected, add default time slot
                  if (!isSelected && getTimeSlotsForDay(day.value).length === 0) {
                    addTimeSlotForDay(day.value);
                  }
                }}
              >
                {day.label}
              </Button>
            );
          })}
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          Set hours for each day
        </Typography>
        
        {weekDays.map((day) => {
          const isSelected = isDaySelected(day.value);
          if (!isSelected) return null;
          
          const timeSlots = formik.values.availability.customSchedule.timeRanges.filter(
            slot => slot.days.includes(day.value)
          );
          
          return (
            <Box key={day.value} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {day.label.charAt(0) + day.label.slice(1).toLowerCase()}
              </Typography>
              
              {timeSlots && timeSlots.map((slot, index) => {
                const slotIndex = formik.values.availability.customSchedule.timeRanges.findIndex(
                  s => s === slot
                );
                
                return (
                  <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                    <Grid item xs={5}>
                      <StyledTextField
                        label="From"
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newTimeRanges = [...formik.values.availability.customSchedule.timeRanges];
                          newTimeRanges[slotIndex].startTime = e.target.value;
                          formik.setFieldValue('availability.customSchedule.timeRanges', newTimeRanges);
                        }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <StyledTextField
                        label="To"
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newTimeRanges = [...formik.values.availability.customSchedule.timeRanges];
                          newTimeRanges[slotIndex].endTime = e.target.value;
                          formik.setFieldValue('availability.customSchedule.timeRanges', newTimeRanges);
                        }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small"
                        onClick={() => removeTimeSlot(slotIndex)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                    <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      {index === timeSlots.length - 1 && (
                        <IconButton 
                          size="small"
                          onClick={() => addTimeSlotForDay(day.value)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                );
              })}
            </Box>
          );
        })}
      </>
    );
    
    const renderDateRangeSchedule = () => (
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add specific date ranges when you're available
          </Typography>
          
          {formik.values.availability.dateRanges.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                No date ranges added yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a date range to specify when you're available
              </Typography>
            </Box>
          )}
          
          {formik.values.availability.dateRanges.map((dateRange, dateIndex) => (
            <Card key={dateIndex} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Date Range {dateIndex + 1}
                </Typography>
                <IconButton size="small" onClick={() => removeDateRange(dateIndex)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(e) => {
                      const newDateRanges = [...formik.values.availability.dateRanges];
                      newDateRanges[dateIndex].startDate = e.target.value;
                      formik.setFieldValue('availability.dateRanges', newDateRanges);
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(e) => {
                      const newDateRanges = [...formik.values.availability.dateRanges];
                      newDateRanges[dateIndex].endDate = e.target.value;
                      formik.setFieldValue('availability.dateRanges', newDateRanges);
                    }}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" gutterBottom>
                Time Slots
              </Typography>
              
              {dateRange.timeSlots.map((timeSlot, timeIndex) => (
                <Grid container spacing={2} key={timeIndex} sx={{ mb: 1, alignItems: 'center' }}>
                  <Grid item xs={12} sm={5}>
                    <StyledTextField
                      label="From"
                      type="time"
                      value={timeSlot.startTime}
                      onChange={(e) => {
                        const newDateRanges = [...formik.values.availability.dateRanges];
                        newDateRanges[dateIndex].timeSlots[timeIndex].startTime = e.target.value;
                        formik.setFieldValue('availability.dateRanges', newDateRanges);
                      }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <StyledTextField
                      label="To"
                      type="time"
                      value={timeSlot.endTime}
                      onChange={(e) => {
                        const newDateRanges = [...formik.values.availability.dateRanges];
                        newDateRanges[dateIndex].timeSlots[timeIndex].endTime = e.target.value;
                        formik.setFieldValue('availability.dateRanges', newDateRanges);
                      }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                      size="small"
                      onClick={() => removeTimeSlotFromDateRange(dateIndex, timeIndex)}
                      disabled={dateRange.timeSlots.length <= 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    {timeIndex === dateRange.timeSlots.length - 1 && (
                      <IconButton 
                        size="small"
                        onClick={() => addTimeSlotToDateRange(dateIndex)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
            </Card>
          ))}
          
          <Button 
            variant="outlined" 
            startIcon={<EventIcon sx={{ color: '#3D1560' }} />}
            onClick={addDateRange}
            sx={{ 
              mt: 1,
              color: '#3D1560',
              borderColor: '#3D1560',
              '&:hover': {
                backgroundColor: '#E8E9ED',
                borderColor: '#6D26AB',
              }
            }}
          >
            Add Date Range
          </Button>
        </Box>
      </>
    );
    
    return (
      <Card sx={{ mt: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
            <CalendarMonthIcon sx={{ mr: 1 }} /> Availability
          </Typography>
          
          <Box sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={availabilityTab}
              onChange={handleTabChange}
              sx={{
                '.MuiTabs-indicator': {
                  backgroundColor: '#3D1560',
                },
                '.MuiTab-root.Mui-selected': {
                  color: '#3D1560',
                },
              }}
            >
              <Tab label="WEEKLY SCHEDULE" />
              <Tab label="SPECIFIC DATE RANGE" />
            </Tabs>
          </Box>
          
          {availabilityTab === 0 ? renderWeeklySchedule() : renderDateRangeSchedule()}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
            <MonetizationOnIcon sx={{ mr: 1 }} /> Payment Options
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={formik.values.paymentOptions.onlinePayment}
                  onChange={(e) => {
                    formik.setFieldValue('paymentOptions.onlinePayment', e.target.checked);
                  }}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#3D1560',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#9B53D9',
                    },
                  }}
                />
              }
              label="Accept Online Payments"
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={formik.values.paymentOptions.payAtService}
                  onChange={(e) => {
                    formik.setFieldValue('paymentOptions.payAtService', e.target.checked);
                  }}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#3D1560',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#9B53D9',
                    },
                  }}
                />
              }
              label="Accept Pay at Service"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderCategoryDetails = () => {
    if (!formik.values.category) {
      return (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Please select a service category to see specific options.
          </Typography>
        </Box>
      );
    }
    
    const categoryFields = categorySpecificFields[formik.values.category as keyof typeof categorySpecificFields] || [];
    
    return (
      <Card sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HandymanIcon sx={{ mr: 1 }} /> Category Details
          </Typography>
          
          <Grid container spacing={2}>
            {categoryFields.map((field) => (
              <Grid item xs={12} md={field.type === 'textarea' ? 12 : 6} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  const renderPricingSection = () => {
    const addFeature = (tierIndex: number) => {
      const newTiers = [...formik.values.pricingTiers];
      newTiers[tierIndex].features.push('');
      formik.setFieldValue('pricingTiers', newTiers);
    };
    
    const removeFeature = (tierIndex: number, featureIndex: number) => {
      const newTiers = [...formik.values.pricingTiers];
      newTiers[tierIndex].features.splice(featureIndex, 1);
      formik.setFieldValue('pricingTiers', newTiers);
    };
    
    return (
      <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
            <MonetizationOnIcon sx={{ mr: 1 }} /> Pricing Options
          </Typography>
          
          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend">Pricing Model</FormLabel>
            <RadioGroup
              name="pricingModel"
              value={formik.values.pricingModel}
              onChange={formik.handleChange}
              row
              sx={{
                '& .MuiRadio-root.Mui-checked': {
                  color: '#3D1560',
                },
              }}
            >
              <FormControlLabel 
                value="flat" 
                control={<Radio />} 
                label="Flat Rate" 
              />
              <FormControlLabel 
                value="tiered" 
                control={<Radio />} 
                label="Tiered Packages" 
              />
            </RadioGroup>
          </FormControl>
          
          {formik.values.pricingModel === 'flat' ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Set Your Flat Rate Price
              </Typography>
              <TextField
                name="flatRatePrice"
                label="Price"
                type="number"
                value={formik.values.flatRatePrice}
                onChange={formik.handleChange}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={formik.touched.flatRatePrice && Boolean(formik.errors.flatRatePrice)}
                helperText={formik.touched.flatRatePrice && formik.errors.flatRatePrice}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Configure Your Service Tiers
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create tiered packages with different prices and features. Customers can choose the package that best fits their needs.
              </Typography>
              
              <Grid container spacing={3}>
                {formik.values.pricingTiers.map((tier, tierIndex) => (
                  <Grid item xs={12} md={4} key={tier.id}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: tierIndex === 1 ? '2px solid #3D1560' : 'none',
                        position: 'relative'
                      }}
                    >
                      {tierIndex === 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -12,
                            left: 0,
                            right: 0,
                            textAlign: 'center'
                          }}
                        >
                          <Chip 
                            label="MOST POPULAR" 
                            size="small" 
                            sx={{ 
                              bgcolor: '#3D1560', 
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                        </Box>
                      )}
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <TextField
                          label="Package Name"
                          value={tier.name}
                          onChange={(e) => {
                            const newTiers = [...formik.values.pricingTiers];
                            newTiers[tierIndex].name = e.target.value;
                            formik.setFieldValue('pricingTiers', newTiers);
                          }}
                          fullWidth
                          margin="normal"
                          placeholder={`e.g., ${tier.name}`}
                          InputProps={{
                            sx: { fontWeight: 'bold', color: '#3D1560' }
                          }}
                        />
                        
                        <TextField
                          label="Price"
                          type="number"
                          value={tier.price}
                          onChange={(e) => {
                            const newTiers = [...formik.values.pricingTiers];
                            newTiers[tierIndex].price = e.target.value;
                            formik.setFieldValue('pricingTiers', newTiers);
                          }}
                          fullWidth
                          margin="normal"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                        
                        <TextField
                          label="Description"
                          value={tier.description}
                          onChange={(e) => {
                            const newTiers = [...formik.values.pricingTiers];
                            newTiers[tierIndex].description = e.target.value;
                            formik.setFieldValue('pricingTiers', newTiers);
                          }}
                          fullWidth
                          margin="normal"
                          multiline
                          rows={2}
                          placeholder="Brief description of this package"
                        />
                        
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Features Included
                        </Typography>
                        
                        {tier.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', mb: 1 }}>
                            <TextField
                              size="small"
                              fullWidth
                              value={feature}
                              onChange={(e) => {
                                const newTiers = [...formik.values.pricingTiers];
                                newTiers[tierIndex].features[featureIndex] = e.target.value;
                                formik.setFieldValue('pricingTiers', newTiers);
                              }}
                              placeholder={`Feature ${featureIndex + 1}`}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CheckIcon fontSize="small" color="success" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => removeFeature(tierIndex, featureIndex)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        
                        <Button
                          startIcon={<AddIcon sx={{ color: '#3D1560' }} />}
                          onClick={() => addFeature(tierIndex)}
                          size="small"
                          sx={{ 
                            mt: 1,
                            color: '#3D1560',
                            '&:hover': {
                              backgroundColor: '#E8E9ED',
                            }
                          }}
                        >
                          Add Feature
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={1.5}>
            <Accordion defaultExpanded sx={{ border: '1px solid #CDCED8', borderRadius: 1, boxShadow: 'none', '&:not(:last-child)': { mb: 1.5 } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#F8F8FA', minHeight: 48 }}>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
                  <InventoryIcon sx={{ mr: 1, color: '#3D1560' }} /> Images
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                {renderImageUpload()}
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded sx={{ border: '1px solid #CDCED8', borderRadius: 1, boxShadow: 'none', '&:not(:last-child)': { mb: 1.5 } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#F8F8FA', minHeight: 48 }}>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
                  <DescriptionIcon sx={{ mr: 1, color: '#3D1560' }} /> Basic Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                <Stack spacing={2}>
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
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded sx={{ border: '1px solid #CDCED8', borderRadius: 1, boxShadow: 'none', '&:not(:last-child)': { mb: 1.5 } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#F8F8FA', minHeight: 48 }}>
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#3D1560' }} /> Service Locations
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                {renderServiceAreaFields()}
              </AccordionDetails>
            </Accordion>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <Card sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 1 }} /> Service Category
                </Typography>
                
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
              </CardContent>
            </Card>
            
            {renderCategoryDetails()}
            {renderAvailabilitySection()}
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            {renderPricingSection()}
          </Stack>
        );
      default:
        return null;
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ position: 'relative', minHeight: 400 }}>
            {renderStepContent(activeStep)}
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {activeStep > 0 && (
              <Button 
                onClick={handleBack}
                startIcon={<ArrowBackIcon sx={{ color: '#3D1560' }} />}
                sx={{ 
                  px: 3,
                  color: '#3D1560',
                  '&:hover': {
                    backgroundColor: '#E8E9ED',
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
                backgroundColor: '#3D1560',
                '&:hover': {
                  boxShadow: 4,
                  backgroundColor: '#6D26AB',
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
            price: Number(formik.values.pricingModel === 'flat' 
              ? formik.values.flatRatePrice || 0 
              : formik.values.pricingTiers[0]?.price || 0),
            shortDescription: formik.values.shortDescription,
            category: formik.values.category,
            location: {
              city: formik.values.location,
              country: formik.values.country || 'Select a country',
            },
            images: formik.values.images.length > 0 
              ? Array.from(formik.values.images).map(file => URL.createObjectURL(file) as string)
              : [],
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
                city: formik.values.location,
                country: formik.values.country || 'Select a country',
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
            serviceArea: formik.values.serviceCities.length > 0 
              ? `Multiple locations in ${formik.values.serviceCities.length + 1} cities` 
              : `Coverage area: ${formik.values.coverageAreaKm || 'local'} km`,
            availability: formik.values.availability.scheduleType === 'dateRange'
              ? `Available on specific dates` 
              : formik.values.availability.type === 'custom'
                ? 'Custom weekly schedule'
                : formik.values.availability.type === 'weekdays'
                  ? 'Weekdays, 9AM-5PM'
                  : formik.values.availability.type === 'weekends'
                    ? 'Weekends'
                    : 'All week',
            pricingStructure: formik.values.pricingModel === 'tiered' ? 'tiered' : 'fixed',
            languagesSpoken: ['English'],
            serviceMode: 'both' as const,
            paymentOptions: {
              onlinePayment: formik.values.paymentOptions?.onlinePayment || false,
              payAtService: formik.values.paymentOptions?.payAtService || true
            },
          }}
          type="service"
        />
      </PreviewSection>
      
      {/* Success message snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ width: '100%', backgroundColor: '#EDD9FF', color: '#3D1560' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default ServiceListingForm; 