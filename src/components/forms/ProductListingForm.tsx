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
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ListingPreview from '../ListingPreview';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';

const categories = [
  'Electronics',
  'Furniture',
  'Fashion',
  'Real Estate',
  'Books',
  'Sports & Outdoors',
  'Home & Garden',
  'Automotive',
  'Events & Entertainment',
  'Other'
];

const conditions = ['new', 'used', 'refurbished'] as const;
type Condition = typeof conditions[number];

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
  Electronics: [
    { name: 'brand', label: 'Brand', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'text', required: true },
    { name: 'warranty', label: 'Warranty', type: 'text', placeholder: 'e.g., 1-year manufacturer warranty' },
    { name: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g., 5.78 x 2.82 x 0.30 inches' },
    { name: 'weight', label: 'Weight', type: 'text', placeholder: 'e.g., 6.14 oz' },
    { name: 'specifications', label: 'Technical Specifications', type: 'textarea' },
    { name: 'includedItems', label: 'Included Items', type: 'textarea', placeholder: 'List items included in the package' }
  ],
  'Real Estate': [
    { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Apartment', 'House', 'Condo', 'Room'], required: true },
    { name: 'size', label: 'Size', type: 'number', unit: 'sq. ft.', required: true },
    { name: 'bedrooms', label: 'Bedrooms', type: 'number', required: true },
    { name: 'bathrooms', label: 'Bathrooms', type: 'number', required: true },
    { name: 'furnished', label: 'Furnished', type: 'boolean', required: true },
    { name: 'leaseTerm', label: 'Lease Term', type: 'select', options: ['Month-to-Month', '6-month lease', '12-month lease', 'Flexible'], required: true },
    { name: 'amenities', label: 'Amenities', type: 'multiselect', options: ['Parking', 'Pool', 'Gym', 'Laundry', 'Security'] },
    { name: 'utilities', label: 'Utilities Included', type: 'multiselect', options: ['Water', 'Electricity', 'Gas', 'Internet', 'Trash'] }
  ],
  'Events & Entertainment': [
    { name: 'eventType', label: 'Event Type', type: 'select', options: ['Party', 'Concert', 'Networking Event', 'Workshop', 'Exhibition'], required: true },
    { name: 'eventDateTime', label: 'Event Date & Time', type: 'datetime', required: true },
    { name: 'venue', label: 'Venue', type: 'text', required: true },
    { name: 'capacity', label: 'Total Capacity', type: 'number', required: true },
    { name: 'ticketTypes', label: 'Ticket Types', type: 'multiselect', options: ['General Admission', 'VIP', 'Early Bird', 'Group'] },
    { name: 'eventFeatures', label: 'Event Features', type: 'multiselect', options: ['DJ', 'Live Band', 'Open Bar', 'Food Included', 'Parking'] },
    { name: 'ageRestriction', label: 'Age Restriction', type: 'select', options: ['All Ages', '18+', '21+'] },
    { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 3 hours' }
  ],
  Furniture: [
    { name: 'material', label: 'Material', type: 'text', required: true },
    { name: 'dimensions', label: 'Dimensions', type: 'text', required: true },
    { name: 'weight', label: 'Weight', type: 'text' },
    { name: 'style', label: 'Style', type: 'select', options: ['Modern', 'Traditional', 'Contemporary', 'Industrial', 'Rustic'] },
    { name: 'colorOptions', label: 'Color Options', type: 'text' },
    { name: 'assembly', label: 'Assembly Required', type: 'boolean' }
  ],
  Books: [
    { name: 'author', label: 'Author', type: 'text', required: true },
    { name: 'isbn', label: 'ISBN', type: 'text', required: true },
    { name: 'publisher', label: 'Publisher', type: 'text', required: true },
    { name: 'edition', label: 'Edition', type: 'text' },
    { name: 'format', label: 'Format', type: 'select', options: ['Hardcover', 'Paperback', 'Digital'] },
    { name: 'language', label: 'Language', type: 'text' },
    { name: 'genre', label: 'Genre', type: 'select', options: ['Fiction', 'Non-Fiction', 'Academic', 'Children'] }
  ],
  Automotive: [
    { name: 'brand', label: 'Brand', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'text', required: true },
    { name: 'year', label: 'Year', type: 'number', required: true },
    { name: 'mileage', label: 'Mileage', type: 'number', unit: 'miles' },
    { name: 'transmission', label: 'Transmission', type: 'select', options: ['Automatic', 'Manual'] },
    { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'] },
    { name: 'color', label: 'Color', type: 'text' }
  ],
  Fashion: [
    { name: 'brand', label: 'Brand', type: 'text', required: true },
    { name: 'size', label: 'Size', type: 'text', required: true },
    { name: 'material', label: 'Material', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'text', required: true },
    { name: 'style', label: 'Style', type: 'text' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex', 'Kids'] },
    { name: 'season', label: 'Season', type: 'select', options: ['All Season', 'Summer', 'Winter', 'Spring', 'Fall'] }
  ],
  Other: [
    { name: 'brand', label: 'Brand', type: 'text' },
    { name: 'model', label: 'Model', type: 'text' },
    { name: 'dimensions', label: 'Dimensions', type: 'text' },
    { name: 'weight', label: 'Weight', type: 'text' },
    { name: 'specifications', label: 'Specifications', type: 'textarea' }
  ]
};

interface FormValues extends Record<string, any> {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  price: string;
  location: string;
  availableQuantity: number;
  images: File[];
  category: string;
  condition: Condition;
}

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

const ProductListingForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Details', 'Product Category', 'Specific Details'];

  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      location: '',
      availableQuantity: 1,
      images: [],
      category: '',
      condition: 'new',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      shortDescription: Yup.string().required('Short description is required'),
      detailedDescription: Yup.string().required('Detailed description is required'),
      price: Yup.string().required('Price is required'),
      location: Yup.string().required('Location is required'),
      availableQuantity: Yup.number().required('Quantity is required').min(1, 'Minimum quantity is 1'),
      category: Yup.string().required('Category is required'),
      condition: Yup.string().oneOf(conditions, 'Invalid condition').required('Condition is required'),
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
            <StyledTextField
              fullWidth
              name="availableQuantity"
              label="Available Quantity"
              type="number"
              value={formik.values.availableQuantity}
              onChange={formik.handleChange}
              error={formik.touched.availableQuantity && Boolean(formik.errors.availableQuantity)}
              helperText={formik.touched.availableQuantity && formik.errors.availableQuantity}
            />
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
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl fullWidth>
              <InputLabel>Condition</InputLabel>
              <Select
                name="condition"
                value={formik.values.condition}
                onChange={formik.handleChange}
                error={formik.touched.condition && Boolean(formik.errors.condition)}
              >
                {conditions.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition.charAt(0).toUpperCase() + condition.slice(1)}
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
              Create Product Listing
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
            type: 'product',
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
            condition: formik.values.condition,
            brand: formik.values.brand,
            model: formik.values.model,
            availableQuantity: formik.values.availableQuantity,
            features: [],
            specifications: {},
          }}
          type="product"
        />
      </PreviewSection>
    </FormContainer>
  );
};

export default ProductListingForm; 