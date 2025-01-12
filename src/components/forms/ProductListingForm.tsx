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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

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

const conditions = ['New', 'Used', 'Refurbished', 'For Parts'];

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

const ProductListingForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Details', 'Product Category', 'Specific Details'];

  const formik = useFormik({
    initialValues: {
      // Universal Fields (Step 1)
      title: '',
      shortDescription: '',
      detailedDescription: '',
      price: '',
      location: '',
      availableQuantity: 1,
      images: [],
      
      // Product Category Fields (Step 2)
      category: '',
      condition: '',
      
      // Category-specific Fields (Step 3)
      brand: '',
      model: '',
      sku: '',
      warranty: '',
      dimensions: '',
      material: '',
      weight: '',
      colorOptions: '',
      author: '',
      isbn: '',
      publisher: '',
      edition: '',
      year: '',
      mileage: '',
      specialFeatures: '',
    },
    validationSchema: Yup.object({
      // Step 1 validation
      ...(activeStep === 0 && {
        title: Yup.string().required('Title is required'),
        shortDescription: Yup.string().required('Short description is required'),
        detailedDescription: Yup.string().required('Detailed description is required'),
        price: Yup.number().required('Price is required').min(0, 'Price must be positive'),
        location: Yup.string().required('Location is required'),
        availableQuantity: Yup.number().required('Quantity is required').min(1, 'Minimum quantity is 1'),
      }),
      // Step 2 validation
      ...(activeStep === 1 && {
        category: Yup.string().required('Category is required'),
        condition: Yup.string().required('Condition is required'),
      }),
    }),
    onSubmit: (values) => {
      if (activeStep < 2) {
        handleNext();
      } else {
        console.log('Final form submission:', values);
        // Handle form submission
      }
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getRequiredFieldsForCategory = () => {
    return formik.values.category ? categorySpecificFields[formik.values.category as keyof typeof categorySpecificFields] : [];
  };

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
      case 'datetime':
        return (
          <TextField
            fullWidth
            type="datetime-local"
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
                Basic Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
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
                id="shortDescription"
                name="shortDescription"
                label="Short Description"
                value={formik.values.shortDescription}
                onChange={formik.handleChange}
                error={formik.touched.shortDescription && Boolean(formik.errors.shortDescription)}
                helperText={formik.touched.shortDescription && formik.errors.shortDescription}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="detailedDescription"
                name="detailedDescription"
                label="Detailed Description"
                value={formik.values.detailedDescription}
                onChange={formik.handleChange}
                error={formik.touched.detailedDescription && Boolean(formik.errors.detailedDescription)}
                helperText={formik.touched.detailedDescription && formik.errors.detailedDescription}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Price"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="availableQuantity"
                name="availableQuantity"
                label="Available Quantity"
                type="number"
                value={formik.values.availableQuantity}
                onChange={formik.handleChange}
                error={formik.touched.availableQuantity && Boolean(formik.errors.availableQuantity)}
                helperText={formik.touched.availableQuantity && formik.errors.availableQuantity}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Category
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  id="condition"
                  name="condition"
                  value={formik.values.condition}
                  onChange={formik.handleChange}
                  error={formik.touched.condition && Boolean(formik.errors.condition)}
                  label="Condition"
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition} value={condition}>
                      {condition}
                    </MenuItem>
                  ))}
                </Select>
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
            Create Product Listing
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
          {activeStep === 0 && "Start with the basic information about your product"}
          {activeStep === 1 && "Choose the category that best fits your product"}
          {activeStep === 2 && "Add specific details to help buyers understand your product better"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductListingForm; 