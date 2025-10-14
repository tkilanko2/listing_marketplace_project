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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  ListItemText,
  FormHelperText,
  Tooltip,
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
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoIcon from '@mui/icons-material/Info';
import { mockServices } from '../../mockData';
import SellerVerificationModal from '../SellerVerificationModal';
import VerificationFlowModal from '../verification/VerificationFlowModal';

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
  location: string | string[]; // Updated to allow string or string array
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
  status: 'pending' | 'active' | 'draft' | 'inactive';
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
  gap: theme.spacing(3),
  maxWidth: '1400px',
  margin: '0 auto',
  padding: theme.spacing(1),
}));

const FormSection = styled(Paper)(({ theme }) => ({
  flex: '1 1 60%',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const PreviewSection = styled(Box)(({ theme }) => ({
  flex: '1 1 40%',
  position: 'relative',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.2s ease-in-out',
    height: '44px', // Compact control height without reducing font size
    '&:hover fieldset': {
      borderColor: '#6D26AB',
    },
    '&.Mui-focused fieldset': {
      boxShadow: '0 0 0 0.3px #9B53D9',
      borderColor: '#3D1560',
    },
    '&.MuiInputBase-multiline': {
      height: 'auto', // Allow multiline fields to expand
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#3D1560',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem', // Standardize label size
    transform: 'translate(14px, 10px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiOutlinedInput-root': {
    transition: 'all 0.2s ease-in-out',
    height: '44px', // Compact select height
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
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem', // Standardize label size
    transform: 'translate(14px, 10px) scale(1)',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    fontSize: '0.75rem',
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
  padding: theme.spacing(2),
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

const ServiceListingForm: React.FC<{ onBack: (fromFormSubmission?: boolean) => void }> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [availabilityTab, setAvailabilityTab] = useState(0); // 0 for weekly, 1 for date range
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSellerInfoOpen, setIsSellerInfoOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newListingId, setNewListingId] = useState('');
  const [showListingSuccessDialog, setShowListingSuccessDialog] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVerificationFlow, setShowVerificationFlow] = useState(false);
  const [verificationType, setVerificationType] = useState<'individual' | 'business'>('individual');
  const steps = ['Basic Information', 'Category & Availability', 'Pricing Options'];

  // Seller info form state
  const [sellerInfo, setSellerInfo] = useState({
    shopPolicies: '',
    returnsPolicy: '',
    shippingInfo: '',
    sellerBio: '',
    customerServiceHours: '',
    paymentMethods: ['Credit Card', 'PayPal']
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      location: '',
      country: '',
      coverageAreaKm: '', // Changed from 'Entire City' to empty string
      serviceAreas: [],
      serviceCities: [],
      images: [],
      category: '',
      serviceType: '',
      paymentOptions: {
        onlinePayment: true,
        payAtService: true,
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
      ],
      status: 'pending'
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      shortDescription: Yup.string().required('Short description is required'),
      detailedDescription: Yup.string(),
      // Make location and country optional to prevent validation blocking
      location: Yup.string(),
      country: Yup.string(),
      category: Yup.string(),
      // Make pricing model validation strict and required
      pricingModel: Yup.string().required('Please select a pricing model'),
      flatRatePrice: Yup.string().when('pricingModel', {
        is: 'flat',
        then: () => Yup.string()
          .required('Please enter the price')
          .test('is-valid-price', 'Price must be a valid number greater than 0', 
            value => !isNaN(Number(value)) && Number(value) > 0)
      }),
      pricingTiers: Yup.array().when('pricingModel', {
        is: 'tiered',
        then: () => Yup.array().of(
          Yup.object().shape({
            name: Yup.string().required('Tier name is required'),
            price: Yup.string()
              .required('Tier price is required')
              .test('is-valid-price', 'Price must be a valid number greater than 0', 
                value => !isNaN(Number(value)) && Number(value) > 0),
            description: Yup.string().required('Tier description is required')
          })
        ).min(1, 'At least one pricing tier is required')
      })
    }),
    onSubmit: (values) => {
      if (activeStep < 2) {
        handleNext();
      } else {
        console.log('Final form submission:', values);
        
        // Validate pricing information before submission
        let pricingValid = false;
        
        if (values.pricingModel === 'flat') {
          // For flat pricing, check if flatRatePrice is valid
          const price = parseFloat(values.flatRatePrice);
          pricingValid = !isNaN(price) && price > 0;
          
          if (!pricingValid) {
            formik.setFieldError('flatRatePrice', 'Please enter a valid price greater than 0');
            setSnackbarMessage('Please enter a valid price');
            setSnackbarOpen(true);
            return;
          }
        } else if (values.pricingModel === 'tiered') {
          // For tiered pricing, check if at least one tier has a valid price
          pricingValid = values.pricingTiers.length > 0 && 
            values.pricingTiers.every(tier => {
              const price = parseFloat(tier.price);
              const hasValidPrice = !isNaN(price) && price > 0;
              const hasName = !!tier.name;
              const hasDescription = !!tier.description;
              return hasValidPrice && hasName && hasDescription;
            });
          
          if (!pricingValid) {
            setSnackbarMessage('Please complete all pricing tier information');
            setSnackbarOpen(true);
            return;
          }
        } else {
          // If no pricing model is selected
          formik.setFieldError('pricingModel', 'Please select a pricing model');
          setSnackbarMessage('Please select a pricing model');
          setSnackbarOpen(true);
          return;
        }
        
        try {
          setIsProcessing(true);
          
          // Create a new service listing from form values
          const newId = generateUniqueId();
          setNewListingId(newId);
          
          // Set default values for missing fields
          const location = values.location || 'No location specified';
          const country = values.country || 'No country specified';
          const category = values.category || 'Other';
          
          // Fix for pricing - ensure a default price is set
          let price = 99; // Default price if nothing is provided
          if (values.pricingModel === 'flat' && values.flatRatePrice) {
            const parsedPrice = parseFloat(values.flatRatePrice);
            if (!isNaN(parsedPrice)) {
              price = parsedPrice;
            }
          } else if (values.pricingModel === 'tiered' && values.pricingTiers.length > 0 && values.pricingTiers[0]?.price) {
            const parsedPrice = parseFloat(values.pricingTiers[0].price);
            if (!isNaN(parsedPrice)) {
              price = parsedPrice;
            }
          }
          
          const newServiceListing = {
            id: newId,
            name: values.title || 'New Service',
            type: 'service' as const,
            category: category,
            price: price,
            shortDescription: values.shortDescription || 'No description provided',
            description: values.detailedDescription || 'No detailed description provided',
            longDescription: values.detailedDescription || 'No detailed description provided',
            location: {
              city: Array.isArray(values.location) 
                ? values.location.join(', ')
                : values.location,
              country: country,
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
                city: Array.isArray(values.location)
                  ? values.location.join(', ')
                  : values.location,
                country: country,
              },
              reviews: [],
              responseTime: '1 hour',
              responseRate: '100%',
            },
            createdAt: new Date(),
            trending: false,
            recommended: false,
            duration: 60, // Default duration in minutes
            serviceType: values.serviceType || 'general',
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
            status: 'pending' as const,
          };
          
          console.log('Adding new service listing:', newServiceListing);
          
          // Add the new listing to mockServices
          mockServices.push(newServiceListing);
          console.log('mockServices array updated, length:', mockServices.length);
          
          // Log all current pending listings to help debug
          console.log('Current pending listings:', 
            mockServices
              .filter(service => service.status === 'pending')
              .map(service => ({ id: service.id, name: service.name, status: service.status }))
          );
          
          // Show success dialog directly
          setTimeout(() => {
            setIsProcessing(false);
            setShowListingSuccessDialog(true);
          }, 1000);
        } catch (error) {
          console.error('Error creating service listing:', error);
          setSnackbarMessage('Error creating service listing. Please try again.');
          setSnackbarOpen(true);
          setIsProcessing(false);
        }
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
    // Comprehensive list of countries
    const allCountries = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 
      'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 
      'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 
      'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 
      'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 
      'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 
      'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 
      'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 
      'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kosovo', 
      'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 
      'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 
      'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 
      'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 
      'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 
      'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 
      'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 
      'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 
      'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 
      'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 
      'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];

    // Cities based on country selection
    const getCitiesByCountry = (country: string) => {
      const citiesMap: Record<string, string[]> = {
        'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Boston'],
        'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Edinburgh', 'Newcastle', 'Cardiff', 'Belfast', 'Nottingham', 'Leicester', 'Aberdeen', 'Cambridge', 'Oxford', 'Brighton', 'York', 'Southampton'],
        'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax', 'Victoria', 'Saskatoon', 'Regina', 'St. John\'s', 'Kelowna', 'London', 'Windsor', 'Oshawa', 'Gatineau', 'Kitchener'],
        'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Gold Coast', 'Newcastle', 'Wollongong', 'Hobart', 'Geelong', 'Townsville', 'Cairns', 'Darwin', 'Toowoomba', 'Ballarat', 'Bendigo', 'Launceston', 'Mackay', 'Rockhampton'],
        'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster'],
        'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'],
        'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ludhiana'],
        'China': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Chongqing', 'Tianjin', 'Hangzhou', 'Wuhan', 'Chengdu', 'Nanjing', 'Xi\'an', 'Shenyang', 'Harbin', 'Qingdao', 'Jinan', 'Dalian', 'Zhengzhou', 'Changsha', 'Fuzhou', 'Kunming'],
        'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Kobe', 'Kyoto', 'Fukuoka', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Kitakyushu', 'Chiba', 'Sakai', 'Niigata', 'Hamamatsu', 'Kumamoto', 'Sagamihara', 'Okayama'],
        'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia', 'Belém', 'Porto Alegre', 'Campinas', 'São Luís', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina', 'Campo Grande', 'Jaboatão dos Guararapes'],
        'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste', 'Taranto', 'Brescia', 'Prato', 'Modena', 'Reggio Calabria'],
        'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'L\'Hospitalet de Llobregat', 'A Coruña', 'Vitoria-Gasteiz', 'Granada', 'Elche'],
        'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don', 'Ufa', 'Krasnoyarsk', 'Voronezh', 'Perm', 'Volgograd', 'Krasnodar', 'Saratov', 'Tyumen', 'Tolyatti', 'Izhevsk'],
        'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Toluca', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí', 'Mérida', 'Aguascalientes', 'Cuernavaca', 'Acapulco', 'Tampico', 'Chihuahua', 'Saltillo', 'Morelia', 'Veracruz'],
        'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley', 'Rustenburg', 'Pietermaritzburg', 'Welkom', 'George', 'Vereeniging', 'Uitenhage', 'Mthatha', 'Soweto', 'Tembisa', 'Katlehong'],
        'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort', 'Apeldoorn', 'Hoofddorp', 'Maastricht', 'Leiden', 'Dordrecht'],
        'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Linköping', 'Örebro', 'Västerås', 'Helsingborg', 'Norrköping', 'Jönköping', 'Umeå', 'Lund', 'Borås', 'Sundsvall', 'Gävle', 'Eskilstuna', 'Södertälje', 'Karlstad', 'Täby', 'Växjö'],
        'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel/Bienne', 'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Fribourg', 'Schaffhausen', 'Chur', 'Vernier', 'Neuchâtel', 'Uster', 'Sion'],
        'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Gaziantep', 'Konya', 'Antalya', 'Kayseri', 'Eskişehir', 'Diyarbakır', 'Samsun', 'Denizli', 'Şanlıurfa', 'Adapazarı', 'Malatya', 'Kahramanmaraş', 'Erzurum', 'Van', 'Batman'],
        'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'San Miguel de Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Santiago del Estero', 'Corrientes', 'Posadas', 'Morón', 'Quilmes', 'Avellaneda', 'Lanús', 'Tandil', 'Bahía Blanca'],
        'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Tanta', 'Asyut', 'Ismailia', 'Fayyum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'Minya', 'Beni Suef', 'Qena'],
        'Nigeria': ['Lagos', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Zaria', 'Aba', 'Jos', 'Ilorin', 'Oyo', 'Enugu', 'Abeokuta', 'Abuja', 'Sokoto', 'Onitsha', 'Warri', 'Ebute Ikorodu', 'Okene'],
        'Pakistan': ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Peshawar', 'Multan', 'Hyderabad', 'Islamabad', 'Quetta', 'Bahawalpur', 'Sargodha', 'Sialkot', 'Sukkur', 'Larkana', 'Sheikhupura', 'Rahim Yar Khan', 'Jhang', 'Dera Ghazi Khan', 'Gujrat'],
        'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Bekasi', 'Palembang', 'Tangerang', 'Makassar', 'South Tangerang', 'Semarang', 'Depok', 'Padang', 'Denpasar', 'Bandar Lampung', 'Bogor', 'Malang', 'Pekanbaru', 'Yogyakarta', 'Banjarmasin', 'Pontianak'],
        'Philippines': ['Manila', 'Quezon City', 'Caloocan', 'Davao City', 'Cebu City', 'Zamboanga City', 'Taguig', 'Pasig', 'Antipolo', 'Cagayan de Oro', 'Parañaque', 'Makati', 'Las Piñas', 'Muntinlupa', 'Bacolod', 'Mandaue', 'Iloilo City', 'Marikina', 'Calamba', 'Angeles City'],
        'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang', 'Vung Tau', 'Quy Nhon', 'Long Xuyen', 'Thai Nguyen', 'Buon Ma Thuot', 'Da Lat', 'Phan Thiet', 'Cam Pha', 'My Tho', 'Soc Trang', 'Pleiku', 'Vinh'],
        'Thailand': ['Bangkok', 'Nonthaburi', 'Nakhon Ratchasima', 'Chiang Mai', 'Hat Yai', 'Udon Thani', 'Pak Kret', 'Khon Kaen', 'Ubon Ratchathani', 'Nakhon Si Thammarat', 'Chon Buri', 'Lampang', 'Phitsanulok', 'Songkhla', 'Samut Prakan', 'Yala', 'Surat Thani', 'Nakhon Pathom', 'Phuket', 'Chiang Rai'],
        'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Seongnam', 'Goyang', 'Yongin', 'Bucheon', 'Ansan', 'Cheongju', 'Jeonju', 'Cheonan', 'Gimhae', 'Pohang', 'Jinju'],
        'Malaysia': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Kota Kinabalu', 'Kuantan', 'Kajang', 'Sungai Petani', 'Klang', 'Ampang Jaya', 'Subang Jaya', 'Sandakan', 'Seremban', 'Kuching', 'Tawau', 'Miri', 'Alor Setar'],
        'Singapore': ['Singapore', 'Woodlands', 'Jurong West', 'Tampines', 'Hougang', 'Sengkang', 'Yishun', 'Choa Chu Kang', 'Punggol', 'Ang Mo Kio', 'Bukit Batok', 'Bedok', 'Toa Payoh', 'Bishan', 'Serangoon', 'Pasir Ris', 'Bukit Merah', 'Bukit Panjang', 'Geylang', 'Clementi'],
        'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Jebel Ali', 'Madinat Zayed', 'Ruwais', 'Liwa Oasis', 'Dhaid', 'Ghayathi', 'Ar-Rams', 'Dibba Al-Hisn', 'Hatta', 'Kalba', 'Masfut'],
        'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk', 'Buraydah', 'Khamis Mushait', 'Al Hufuf', 'Al Mubarraz', 'Hail', 'Najran', 'Al Jubail', 'Abha', 'Yanbu', 'Al Qatif', 'Al Kharj', 'Arar', 'Hafar Al-Batin'],
        'Estonia': ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Sillamäe', 'Maardu', 'Kuressaare', 'Võru', 'Valga', 'Haapsalu', 'Jõhvi', 'Paide', 'Keila', 'Kiviõli', 'Tapa', 'Põlva', 'Türi'],
        'Gambia': ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Lamin', 'Sukuta', 'Basse Santa Su', 'Gunjur', 'Brufut', 'Soma', 'Kanifing', 'Essau', 'Kerewan', 'Mansakonko', 'Janjanbureh', 'Kuntaur', 'Bansang', 'Sabi', 'Kiang'],
        'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Sekondi', 'Cape Coast', 'Obuasi', 'Teshie', 'Tema', 'Koforidua', 'Wa', 'Ho', 'Sunyani', 'Bolgatanga', 'Kasoa', 'Ashaiman', 'Nkawkaw', 'Winneba', 'Hohoe', 'Dunkwa'],
        'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Kapenguria', 'Bungoma', 'Busia', 'Nyeri', 'Machakos', 'Meru', 'Embu', 'Nanyuki', 'Isiolo', 'Lamu'],
        'Rwanda': ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Byumba', 'Cyangugu', 'Kibuye', 'Rwamagana', 'Kibungo', 'Nzega', 'Kayonza', 'Muhanga', 'Huye', 'Musanze', 'Rubavu', 'Gicumbi', 'Nyagatare', 'Rusizi', 'Kirehe'],
        // Add more countries as needed
      };
      
      // Return a default list with a message for countries not in our map
      return citiesMap[country] || ['City selection will be available soon', 'Please select another country or check back later'];
    };

    // Service coverage options
    const serviceCoverageOptions = ['Entire City', 'Remote Service', 'Nationwide', 'Global'];

    return (
      <Box sx={{ mt: 1.5 }}>
        {/* Service Location Section */}
          <Card sx={{ 
            mb: 2, 
            border: '1px solid', 
            borderColor: '#CDCED8', 
            boxShadow: 'none',
            borderRadius: '8px' 
          }}>
          <CardContent sx={{ p: 1.5 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="country-select"
                  options={allCountries}
                  autoHighlight
                  value={formik.values.country || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('country', newValue || '');
                    formik.setFieldValue('location', '');
                  }}
                  renderInput={(params) => (
                <StyledTextField
                      {...params}
                      label="Country"
                      error={formik.touched.country && Boolean(formik.errors.country)}
                      helperText={formik.touched.country && formik.errors.country}
                      placeholder="Select a country"
                  fullWidth
                  InputProps={{
                        ...params.InputProps,
                        sx: { height: '44px' },
                  }}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      height: '44px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  id="city-select"
                  options={getCitiesByCountry(formik.values.country || '')}
                  value={
                    typeof formik.values.location === 'string' && formik.values.location
                      ? formik.values.location
                      : null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue('location', newValue || '');
                  }}
                  disabled={!formik.values.country}
                  renderInput={(params) => (
                  <StyledTextField 
                      {...params}
                    label="City"
                      error={formik.touched.location && Boolean(formik.errors.location)}
                      helperText={
                        (formik.touched.location && formik.errors.location) || 
                        (!formik.values.country ? 'Select a country first' : '')
                      }
                      placeholder={formik.values.country ? "Select a city" : "Select a country first"}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        sx: { height: '44px' },
                    }}
                    />
                  )}
                    sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      height: '44px',
                    }
                  }}
                  />
                </Grid>
              <Grid item xs={12} sm={4}>
                <StyledFormControl fullWidth>
                  <Autocomplete
                    id="service-coverage-select"
                    options={serviceCoverageOptions}
                    value={formik.values.coverageAreaKm || null}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('coverageAreaKm', newValue || '');
                    }}
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        label="Service Coverage"
                        error={formik.touched.coverageAreaKm && Boolean(formik.errors.coverageAreaKm)}
                        helperText={formik.touched.coverageAreaKm && formik.errors.coverageAreaKm}
                        placeholder="Select coverage area"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          sx: { height: '44px' },
                        }}
                      />
                    )}
                    sx={{
                      '& .MuiAutocomplete-inputRoot': {
                        height: '44px',
                      }
                    }}
                  />
                  {/* Adjusted layout to prevent text overlap */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.25 }}>
                    <Tooltip
                      title="Specify how far you're willing to provide your service from your selected location"
                      arrow
                      placement="top"
                    >
                      <InfoIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: '#70727F' }} />
                    </Tooltip>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Service area coverage
                    </Typography>
                  </Box>
                </StyledFormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
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
            <Box key={day.value} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {day.label.charAt(0) + day.label.slice(1).toLowerCase()}
              </Typography>
              
              {timeSlots && timeSlots.map((slot, index) => {
                const slotIndex = formik.values.availability.customSchedule.timeRanges.findIndex(
                  s => s === slot
                );
                
                return (
                  <Grid container spacing={2} key={index} sx={{ mb: 0.5 }}>
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
        <Box sx={{ mb: 2 }}>
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
          
          <Divider sx={{ my: 1.5 }} />
          
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
            <MonetizationOnIcon sx={{ mr: 1 }} /> Payment Options
          </Typography>
          
          <Box sx={{ mt: 1.5 }}>
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
      const newPricingTiers = [...formik.values.pricingTiers];
      if (newPricingTiers[tierIndex]) {
        newPricingTiers[tierIndex].features = [...(newPricingTiers[tierIndex].features || []), ''];
        formik.setFieldValue('pricingTiers', newPricingTiers);
      }
    };
    
    const removeFeature = (tierIndex: number, featureIndex: number) => {
      const newPricingTiers = [...formik.values.pricingTiers];
      if (newPricingTiers[tierIndex] && newPricingTiers[tierIndex].features) {
        newPricingTiers[tierIndex].features = newPricingTiers[tierIndex].features.filter((_, index) => index !== featureIndex);
        formik.setFieldValue('pricingTiers', newPricingTiers);
      }
    };

    // Helper to check if a field has an error
    const hasError = (field: string) => {
      return Boolean(
        formik.touched[field as keyof typeof formik.touched] && 
        formik.errors[field as keyof typeof formik.errors]
      );
    };

    // Helper to get error message for a field
    const getErrorMessage = (field: string) => {
      const error = formik.touched[field as keyof typeof formik.touched] ? 
        formik.errors[field as keyof typeof formik.errors] : '';
      
      // Convert the error to a string if it's not already
      return typeof error === 'string' ? error : '';
    };

    // Helper to check if a tier field has an error
    const hasTierError = (tierIndex: number, field: string) => {
      return Boolean(
        formik.touched.pricingTiers && 
        formik.touched.pricingTiers[tierIndex] && 
        // @ts-ignore - ignoring type checking for accessing dynamic properties
        formik.touched.pricingTiers[tierIndex][field] && 
        formik.errors.pricingTiers && 
        formik.errors.pricingTiers[tierIndex]
      );
    };

    // Helper to get error message for a tier field
    const getTierErrorMessage = (tierIndex: number, field: string) => {
      if (formik.touched.pricingTiers && 
          formik.touched.pricingTiers[tierIndex] && 
          // @ts-ignore - ignoring type checking for accessing dynamic properties
          formik.touched.pricingTiers[tierIndex][field] && 
          formik.errors.pricingTiers && 
          formik.errors.pricingTiers[tierIndex]) {
        // @ts-ignore - ignoring type checking for accessing dynamic properties
        const error = formik.errors.pricingTiers[tierIndex][field];
        return typeof error === 'string' ? error : '';
      }
      return '';
    };
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Set Your Pricing Options
          </Typography>
          
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend" sx={{ color: '#383A47', mb: 1 }}>Pricing Model</FormLabel>
            <RadioGroup
              name="pricingModel"
              value={formik.values.pricingModel}
              onChange={formik.handleChange}
              row
            >
              <FormControlLabel 
                value="flat" 
              control={<Radio sx={{ color: '#3D1560', '&.Mui-checked': { color: '#3D1560' } }} />} 
                label="Flat Rate" 
              />
              <FormControlLabel 
                value="tiered" 
              control={<Radio sx={{ color: '#3D1560', '&.Mui-checked': { color: '#3D1560' } }} />} 
                label="Tiered Packages" 
              />
            </RadioGroup>
          {hasError('pricingModel') && (
            <Typography color="error" variant="caption" sx={{ mt: 0.25 }}>
              {getErrorMessage('pricingModel')}
            </Typography>
          )}
          </FormControl>
          
          {formik.values.pricingModel === 'flat' ? (
          <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
              Flat Rate Price
              </Typography>
            <StyledTextField
                name="flatRatePrice"
              label="Service Price"
                type="number"
              placeholder="Enter price"
                value={formik.values.flatRatePrice}
                onChange={formik.handleChange}
              onBlur={formik.handleBlur}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              fullWidth
              error={hasError('flatRatePrice')}
              helperText={getErrorMessage('flatRatePrice')}
              />
            </Box>
          ) : (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 1.5 }}>
              Pricing Tiers
              </Typography>
              
                {formik.values.pricingTiers.map((tier, tierIndex) => (
              <Paper 
                key={tier.id} 
                      sx={{ 
                  p: 3, 
                  mb: 3, 
                  border: '1px solid #CDCED8',
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {tier.name || `Tier ${tierIndex + 1}`}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      name={`pricingTiers.${tierIndex}.name`}
                      label="Tier Name"
                      placeholder="e.g., Basic, Standard, Premium"
                          value={tier.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                          fullWidth
                      error={hasTierError(tierIndex, 'name')}
                      helperText={getTierErrorMessage(tierIndex, 'name')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      name={`pricingTiers.${tierIndex}.price`}
                          label="Price"
                          type="number"
                      placeholder="Enter price"
                          value={tier.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                      fullWidth
                      error={hasTierError(tierIndex, 'price')}
                      helperText={getTierErrorMessage(tierIndex, 'price')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      name={`pricingTiers.${tierIndex}.description`}
                          label="Description"
                          multiline
                          rows={2}
                      placeholder="Describe what's included in this tier"
                      value={tier.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      error={hasTierError(tierIndex, 'description')}
                      helperText={getTierErrorMessage(tierIndex, 'description')}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Features
                        </Typography>
                        
                  {tier.features && tier.features.map((feature, featureIndex) => (
                    <Box 
                      key={`${tier.id}-feature-${featureIndex}`} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <StyledTextField
                        name={`pricingTiers.${tierIndex}.features.${featureIndex}`}
                        placeholder="e.g., Free delivery, 24/7 support"
                        value={feature}
                        onChange={formik.handleChange}
                              size="small"
                              fullWidth
                        sx={{ mr: 1 }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => removeFeature(tierIndex, featureIndex)}
                        sx={{ color: '#F44336' }}
                            >
                        <DeleteOutlineIcon />
                            </IconButton>
                          </Box>
                        ))}
                        
                        <Button
                    variant="outlined"
                          size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addFeature(tierIndex)}
                          sx={{ 
                            mt: 1,
                            color: '#3D1560',
                      borderColor: '#3D1560',
                            '&:hover': {
                        borderColor: '#6D26AB',
                        color: '#6D26AB',
                      },
                          }}
                        >
                          Add Feature
                        </Button>
                </Box>
              </Paper>
                ))}
            </Box>
          )}
      </Box>
    );
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}> {/* Increased spacing for consistency */}
            <Accordion defaultExpanded sx={{ border: '1px solid #CDCED8', borderRadius: 1, boxShadow: 'none', '&:not(:last-child)': { mb: 0 } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#F8F8FA',
                  minHeight: 30,
                  maxHeight: 32,
                  '& .MuiAccordionSummary-content': { my: 0, py: 0, margin: 0 },
                  '& .MuiAccordionSummary-content.Mui-expanded': { margin: 0 }
                }}
              >
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
                  <InventoryIcon sx={{ mr: 1, color: '#3D1560' }} /> Images
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1.5 }}>
                {renderImageUpload()}
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded sx={{ border: '1px solid #CDCED8', borderRadius: 1, boxShadow: 'none', '&:not(:last-child)': { mb: 0 } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#F8F8FA',
                  minHeight: 30,
                  maxHeight: 32,
                  '& .MuiAccordionSummary-content': { my: 0, py: 0, margin: 0 },
                  '& .MuiAccordionSummary-content.Mui-expanded': { margin: 0 }
                }}
              >
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
                  <DescriptionIcon sx={{ mr: 1, color: '#3D1560' }} /> Basic Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1.5 }}>
                <Stack spacing={1.5}>
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
            <Accordion defaultExpanded sx={{ border: '1px solid #CDCED8', borderRadius: 1, boxShadow: 'none', '&:not(:last-child)': { mb: 0 } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#F8F8FA',
                  minHeight: 30,
                  maxHeight: 32,
                  '& .MuiAccordionSummary-content': { my: 0, py: 0, margin: 0 },
                  '& .MuiAccordionSummary-content.Mui-expanded': { margin: 0 }
                }}
              >
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#3D1560' }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#3D1560' }} /> Service Location
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 1.5 }}>
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

  const handleSellerInfoClose = () => {
    // When seller info dialog is closed
    setIsSellerInfoOpen(false);
    
    // Show success dialog instead of just a snackbar
    setShowListingSuccessDialog(true);
    
    // Log the new listing ID for verification
    console.log('New listing created with ID:', newListingId);
    console.log('mockServices length after adding:', mockServices.length);
    console.log('Current listings:', mockServices.filter(service => service.id === newListingId));
  };
  
  const handleSuccessDialogClose = () => {
    setShowListingSuccessDialog(false);
    
    // Show seller verification modal
    setShowVerificationModal(true);
  };

  const handleSellerInfoSubmit = () => {
    // Here you would typically save the seller info
    console.log('Seller info submitted:', sellerInfo);
    
    // Close the dialog and show success
    setIsSellerInfoOpen(false);
    setShowListingSuccessDialog(true);
  };

  const handleSellerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSellerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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

  // Handle seller verification modal close
  const handleVerificationModalClose = () => {
    setShowVerificationModal(false);
    
    // Navigate to seller dashboard
    setSnackbarMessage('Your listing will remain pending until you complete seller verification.');
    setSnackbarOpen(true);
    onBack(true);
  };

  // Handle completing verification now
  const handleCompleteVerificationNow = (type: 'individual' | 'business') => {
    setVerificationType(type);
    setShowVerificationModal(false);
    setShowVerificationFlow(true);
  };

  // Handle completing verification later
  const handleCompleteVerificationLater = () => {
    setShowVerificationModal(false);
    
    // Show a message about pending verification
    setSnackbarMessage('Your listing will remain pending until you complete seller verification.');
    setSnackbarOpen(true);
    
    // Navigate to seller dashboard
    onBack(true);
  };

  // Handle verification flow completion
  const handleVerificationComplete = () => {
    setShowVerificationFlow(false);
    
    // Show success message
    setSnackbarMessage('Verification submitted successfully. You will be notified when your verification is approved.');
    setSnackbarOpen(true);
    
    // Navigate to seller dashboard
    onBack(true);
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
              city: Array.isArray(formik.values.location)
                ? formik.values.location.join(', ')
                : formik.values.location,
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
                city: Array.isArray(formik.values.location)
                  ? formik.values.location.join(', ')
                  : formik.values.location,
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
      
      {/* Success message snackbar - make more prominent */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000} // Increased from 6000ms to 10000ms
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Changed from bottom to top for better visibility
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          sx={{ 
            width: '100%', 
            backgroundColor: '#EDD9FF', 
            color: '#3D1560',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Processing Dialog */}
      <Dialog open={isProcessing} aria-labelledby="processing-dialog-title">
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, minWidth: '300px' }}>
          <CircularProgress sx={{ color: '#3D1560', mb: 2 }} />
          <Typography variant="body1">Creating your listing...</Typography>
        </DialogContent>
      </Dialog>
      
      {/* Seller Information Dialog */}
      <Dialog 
        open={isSellerInfoOpen} 
        onClose={() => setIsSellerInfoOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="seller-info-dialog-title"
      >
        <DialogTitle id="seller-info-dialog-title" sx={{ bgcolor: '#F8F8FA', borderBottom: '1px solid #CDCED8', position: 'relative' }}>
          <Typography variant="h6" component="div" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
            Additional Seller Information
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setIsSellerInfoOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#70727F',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" paragraph sx={{ color: '#383A47', mb: 3 }}>
            Your listing has been created and is pending approval. While you wait, please provide some additional information about your shop and services.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B1C20' }}>
                Shop Policies
              </Typography>
              <TextField
                name="shopPolicies"
                multiline
                rows={3}
                placeholder="Describe your shop policies, including cancellations, rescheduling, etc."
                value={sellerInfo.shopPolicies}
                onChange={handleSellerInfoChange}
                fullWidth
                sx={{ mb: 1.5 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B1C20' }}>
                Returns Policy
              </Typography>
              <TextField
                name="returnsPolicy"
                multiline
                rows={2}
                placeholder="Describe your returns policy (if applicable)"
                value={sellerInfo.returnsPolicy}
                onChange={handleSellerInfoChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B1C20' }}>
                Shipping Information
              </Typography>
              <TextField
                name="shippingInfo"
                multiline
                rows={2}
                placeholder="If you ship products, provide details about shipping options (if applicable)"
                value={sellerInfo.shippingInfo}
                onChange={handleSellerInfoChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B1C20' }}>
                About You (Seller Bio)
              </Typography>
              <TextField
                name="sellerBio"
                multiline
                rows={3}
                placeholder="Tell customers about yourself, your experience, and why they should choose your services"
                value={sellerInfo.sellerBio}
                onChange={handleSellerInfoChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B1C20' }}>
                Customer Service Hours
              </Typography>
              <TextField
                name="customerServiceHours"
                placeholder="E.g., Mon-Fri: 9AM-5PM, Weekends: Closed"
                value={sellerInfo.customerServiceHours}
                onChange={handleSellerInfoChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#1B1C20' }}>
                Accepted Payment Methods
              </Typography>
              <FormGroup row>
                <FormControlLabel 
                  control={<Checkbox defaultChecked />} 
                  label="Credit Card" 
                  sx={{ '& .MuiCheckbox-root.Mui-checked': { color: '#3D1560' } }}
                />
                <FormControlLabel 
                  control={<Checkbox defaultChecked />} 
                  label="PayPal" 
                  sx={{ '& .MuiCheckbox-root.Mui-checked': { color: '#3D1560' } }}
                />
                <FormControlLabel 
                  control={<Checkbox />} 
                  label="Bank Transfer" 
                  sx={{ '& .MuiCheckbox-root.Mui-checked': { color: '#3D1560' } }}
                />
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #CDCED8', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setIsSellerInfoOpen(false)} 
            sx={{ color: '#70727F' }}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSellerInfoSubmit}
            variant="contained"
            sx={{ 
              bgcolor: '#3D1560', 
              color: 'white',
              '&:hover': { bgcolor: '#6D26AB' } 
            }}
          >
            Save Information
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Listing Success Dialog */}
      <Dialog
        open={showListingSuccessDialog}
        onClose={handleSuccessDialogClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="listing-success-dialog-title"
      >
        <DialogTitle id="listing-success-dialog-title" sx={{ bgcolor: '#F8F8FA', borderBottom: '1px solid #CDCED8' }}>
          <Typography variant="h6" component="div" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
            Listing Created Successfully
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckIcon sx={{ fontSize: 60, color: '#3D1560', bgcolor: '#EDD9FF', p: 1, borderRadius: '50%' }} />
            <Typography variant="h6" align="center" color="#3D1560">
              Your service listing has been submitted!
            </Typography>
            <Typography variant="body1" align="center" paragraph sx={{ mb: 2 }}>
              Your listing is now pending approval and will appear in your listings soon. 
              The approval process usually takes 24-48 hours.
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Listing ID: {newListingId}
            </Typography>
            
            {/* Display current pending listings */}
            <Box sx={{ mt: 2, width: '100%', bgcolor: '#F8F8FA', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Your Pending Listings:
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0, m: 0 }}>
                {mockServices
                  .filter(service => service.status === 'pending')
                  .map(service => (
                    <Box 
                      component="li" 
                      key={service.id}
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center', 
                        py: 1,
                        borderBottom: '1px solid #E8E9ED'
                      }}
                    >
                      <Typography variant="body2">
                        {service.name}
                      </Typography>
                      <Chip 
                        label="PENDING" 
                        size="small"
                        sx={{ 
                          bgcolor: '#FFF8DD', 
                          color: '#DAA520',
                          fontWeight: 'bold'
                        }} 
                      />
                    </Box>
                  ))
                }
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #CDCED8', display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleSuccessDialogClose}
            variant="contained"
            startIcon={<CheckIcon />}
            sx={{ 
              bgcolor: '#3D1560', 
              color: 'white',
              px: 4,
              '&:hover': { bgcolor: '#6D26AB' } 
            }}
          >
            View My Listings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Seller Verification Modal */}
      <SellerVerificationModal
        open={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          setSnackbarMessage('Your listing will remain pending until you complete seller verification.');
          setSnackbarOpen(true);
          onBack(true);
        }}
        onCompleteNow={handleCompleteVerificationNow}
        onCompleteLater={handleCompleteVerificationLater}
      />
      
      {/* Verification Flow Modal */}
      <VerificationFlowModal
        open={showVerificationFlow}
        onClose={() => setShowVerificationFlow(false)}
        onComplete={handleVerificationComplete}
        verificationType={verificationType}
      />
    </FormContainer>
  );
};

export default ServiceListingForm; 