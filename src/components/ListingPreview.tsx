import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Rating,
  Divider,
  Avatar,
  styled,
  IconButton,
  Badge,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import { Service, Product } from '../types';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, AnimatePresence } from 'framer-motion';

const PreviewCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const PlaceholderImage = styled(Box)(({ theme }) => ({
  height: 250,
  backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

const PreviewBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
  backgroundColor: '#3D1560',
  color: theme.palette.primary.contrastText,
  fontWeight: 'bold',
}));

const StatsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'space-around',
  borderRadius: theme.shape.borderRadius,
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const HighlightChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#6D26AB',
  color: theme.palette.secondary.contrastText,
  fontWeight: 'bold',
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

interface ListingPreviewProps {
  formData: Partial<Service | Product>;
  type: 'service' | 'product';
}

const ListingPreview: React.FC<ListingPreviewProps> = ({ formData, type }) => {
  const theme = useTheme();
  const previewImage = formData.images?.[0] || '';
  const [isHovered, setIsHovered] = useState(false);
  
  const renderStats = () => (
    <StatsContainer elevation={2}>
      <StatItem>
        <Typography variant="caption" color="text.secondary">Views</Typography>
        <Typography variant="subtitle2">{formData.views || 0}</Typography>
      </StatItem>
      <Divider orientation="vertical" flexItem />
      <StatItem>
        <Typography variant="caption" color="text.secondary">Saves</Typography>
        <Typography variant="subtitle2">{formData.saves || 0}</Typography>
      </StatItem>
      <Divider orientation="vertical" flexItem />
      <StatItem>
        <Typography variant="caption" color="text.secondary">
          {type === 'service' ? 'Duration' : 'Stock'}
        </Typography>
        <Typography variant="subtitle2">
          {type === 'service' 
            ? `${(formData as Service).duration || 0} mins`
            : `${(formData as Product).availableQuantity || 0} left`}
        </Typography>
      </StatItem>
    </StatsContainer>
  );

  return (
    <AnimatePresence>
      <PreviewCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ position: 'relative' }}>
          <PreviewBadge 
            label="PREVIEW" 
            size="small"
            icon={<VerifiedIcon />}
          />
          {previewImage ? (
            <CardMedia
              component="img"
              height="250"
              image={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)}
              alt={formData.name || 'Listing preview'}
              sx={{ 
                borderRadius: 1,
                filter: isHovered ? 'brightness(0.9)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ) : (
            <PlaceholderImage>
              <InventoryIcon sx={{ fontSize: 48, opacity: 0.5 }} />
              <Typography variant="body2" color="inherit" sx={{ mt: 1 }}>
                Add images to enhance your listing
              </Typography>
            </PlaceholderImage>
          )}
          {renderStats()}
        </Box>
        
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: 56,
                  }}
                >
                  {formData.name || 'Your Listing Title'}
                </Typography>
                <Tooltip title="View Details">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      opacity: isHovered ? 1 : 0,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Typography variant="h5" color="#3D1560" fontWeight="bold">
                ${formData.price?.toLocaleString() || '0'}
                {type === 'service' && (
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' '}/service
                  </Typography>
                )}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                icon={<LocationOnIcon />}
                label={`${formData.location?.city || 'Location'}, ${formData.location?.country || 'Country'}`}
                size="small"
                variant="outlined"
              />
              <HighlightChip
                label={formData.category || 'Category'}
                size="small"
              />
              {type === 'product' && (formData as Product).condition && (
                <Chip
                  icon={<LocalOfferIcon />}
                  label={(formData as Product).condition}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}
            </Stack>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                minHeight: 60,
              }}
            >
              {formData.shortDescription || 'A brief description of your listing will appear here...'}
            </Typography>

            <Divider />

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                src={formData.provider?.avatar} 
                alt={formData.provider?.username || 'Provider'}
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: `2px solid #3D1560`,
                }}
              />
              <Box flex={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2">
                    {formData.provider?.username || 'Your Name'}
                  </Typography>
                  {formData.provider?.isOnline && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.success.main,
                      }}
                    />
                  )}
                </Stack>
                <Rating
                  value={formData.provider?.rating || 0}
                  readOnly
                  size="small"
                  precision={0.5}
                />
              </Box>
              <Badge 
                badgeContent={formData.provider?.totalBookings || 0} 
                color="primary"
                max={999}
              >
                <Typography variant="caption" color="text.secondary">
                  Bookings
                </Typography>
              </Badge>
            </Stack>
          </Stack>
        </CardContent>
      </PreviewCard>
    </AnimatePresence>
  );
};

export default ListingPreview; 