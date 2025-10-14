import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HandymanIcon from '@mui/icons-material/Handyman';
import { FadeInOnScroll } from '../components/animations/FadeInOnScroll';
import ProductListingForm from '../components/forms/ProductListingForm';
import ServiceListingForm from '../components/forms/ServiceListingForm';

type ListingType = 'product' | 'service' | null;

const CreateListingPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ListingType>(null);
  const theme = useTheme();

  const handleBack = (fromFormSubmission?: boolean) => {
    if (fromFormSubmission) {
      const navigateEvent = new CustomEvent('navigate', { 
        detail: { page: 'sellerDashboard_myShop' } 
      });
      window.dispatchEvent(navigateEvent);
    } else {
      setSelectedType(null);
    }
  };

  const OptionBox = ({ type, icon, title, description, color }: {
    type: ListingType;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        sx={{
          p: 2,
          minHeight: '120px',
          maxWidth: '300px',
          aspectRatio: '1',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 3,
          border: selectedType === type ? `3px solid ${color}` : '3px solid transparent',
          transition: 'all 0.3s ease',
          background: `linear-gradient(145deg, ${color}15, ${color}05)`,
          '&:hover': {
            boxShadow: `0 8px 32px ${color}30`,
            background: `linear-gradient(145deg, ${color}25, ${color}10)`,
          },
          mx: 'auto',
        }}
        onClick={() => setSelectedType(type)}
        elevation={selectedType === type ? 8 : 2}
      >
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '16px',
            p: 2,
            mb: 2,
            transform: 'rotate(-5deg)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(0deg)',
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            sx: { fontSize: 32, color: color } 
          })}
        </Box>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          fontWeight="bold"
          sx={{ 
            color: theme.palette.text.primary,
            fontSize: '1rem'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary,
            maxWidth: '90%',
            mx: 'auto',
            fontSize: '0.875rem'
          }}
        >
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );

  const renderForm = () => {
    switch (selectedType) {
      case 'product':
        return <ProductListingForm onBack={handleBack} />;
      case 'service':
        return <ServiceListingForm onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {!selectedType ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Create a New Listing
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Choose the type of listing you want to create. We'll guide you through the process step by step.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mt: 2, px: { xs: 1, md: 3 }, justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <OptionBox
                type="product"
                icon={<ShoppingBagIcon />}
                title="List a Product"
                description="Sell physical items like electronics, furniture, clothing, or any other tangible goods. Perfect for one-time sales."
                color="#2563eb"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <OptionBox
                type="service"
                icon={<HandymanIcon />}
                title="Offer a Service"
                description="Provide professional services like photography, tutoring, home repairs, or any other expertise you want to share."
                color="#16a34a"
              />
            </Grid>
          </Grid>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderForm()}
        </motion.div>
      )}
    </Container>
  );
};

export default CreateListingPage; 