import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  FormControl,
  InputAdornment,
  Paper,
  IconButton,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Switch,
  Chip,
  Checkbox,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PaymentIcon from '@mui/icons-material/Payment';

const StyledTextField = TextField;

interface PricingTier {
  id: string;
  name: string;
  price: string;
  duration: string;
  durationUnit: 'minutes' | 'hours' | 'days';
  description: string;
  features: string[];
  tierImage: File | null;
}

interface TierPricingEditorProps {
  pricingModel: 'flat' | 'tiered';
  flatRatePrice: string;
  pricingTiers: PricingTier[];
  paymentOptions: {
    onlinePayment: boolean;
    payAtService: boolean;
  };
  acceptSellerPolicy?: boolean;
  onPricingModelChange: (model: 'flat' | 'tiered') => void;
  onFlatPriceChange: (price: string) => void;
  onTiersChange: (tiers: PricingTier[]) => void;
  onPaymentOptionsChange: (options: { onlinePayment: boolean; payAtService: boolean }) => void;
  onAcceptSellerPolicyChange?: (accepted: boolean) => void;
  onOpenSellerPolicy?: () => void;
  errors?: {
    flatRatePrice?: string;
    pricingTiers?: Array<{
      name?: string;
      price?: string;
      duration?: string;
      durationUnit?: string;
      description?: string;
    }>;
  };
  touched?: {
    flatRatePrice?: boolean;
    pricingTiers?: Array<{
      name?: boolean;
      price?: boolean;
      duration?: boolean;
      durationUnit?: boolean;
      description?: boolean;
    }>;
  };
}

export const TierPricingEditor: React.FC<TierPricingEditorProps> = ({
  pricingModel,
  flatRatePrice,
  pricingTiers,
  paymentOptions,
  acceptSellerPolicy,
  onPricingModelChange,
  onFlatPriceChange,
  onTiersChange,
  onPaymentOptionsChange,
  onAcceptSellerPolicyChange,
  onOpenSellerPolicy,
  errors = {},
  touched = {}
}) => {

  const addFeature = (tierIndex: number) => {
    const newTiers = [...pricingTiers];
    if (newTiers[tierIndex]) {
      newTiers[tierIndex].features = [...(newTiers[tierIndex].features || []), ''];
      onTiersChange(newTiers);
    }
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    const newTiers = [...pricingTiers];
    if (newTiers[tierIndex] && newTiers[tierIndex].features) {
      newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, index) => index !== featureIndex);
      onTiersChange(newTiers);
    }
  };

  const updateTierField = (tierIndex: number, field: keyof PricingTier, value: any) => {
    const newTiers = [...pricingTiers];
    newTiers[tierIndex] = { ...newTiers[tierIndex], [field]: value };
    onTiersChange(newTiers);
  };

  const addTier = () => {
    if (pricingTiers.length >= 10) return;
    const newTier: PricingTier = {
      id: `tier-${Date.now()}`,
      name: `Tier ${pricingTiers.length + 1}`,
      price: '',
      duration: '',
      durationUnit: 'minutes',
      description: '',
      features: [],
      tierImage: null
    };
    onTiersChange([...pricingTiers, newTier]);
  };

  const removeTier = (tierIndex: number) => {
    if (pricingTiers.length <= 2 || tierIndex < 2) return;
    const newTiers = pricingTiers.filter((_, index) => index !== tierIndex);
    onTiersChange(newTiers);
  };

  const hasTierError = (tierIndex: number, field: string) => {
    return Boolean(
      touched.pricingTiers?.[tierIndex]?.[field as keyof typeof touched.pricingTiers[number]] &&
      errors.pricingTiers?.[tierIndex]?.[field as keyof typeof errors.pricingTiers[number]]
    );
  };

  const getTierErrorMessage = (tierIndex: number, field: string) => {
    if (touched.pricingTiers?.[tierIndex]?.[field as keyof typeof touched.pricingTiers[number]] &&
        errors.pricingTiers?.[tierIndex]) {
      const error = errors.pricingTiers[tierIndex][field as keyof typeof errors.pricingTiers[number]];
      return typeof error === 'string' ? error : '';
    }
    return '';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#1B1C20', fontWeight: 600 }}>
        <PaymentIcon sx={{ mr: 1, color: '#3D1560' }} /> Pricing & Payment Options
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend" sx={{ color: '#383A47', mb: 1, fontSize: '0.9rem', fontWeight: 500 }}>
          Pricing Model
        </FormLabel>
        <RadioGroup
          value={pricingModel}
          onChange={(e) => onPricingModelChange(e.target.value as 'flat' | 'tiered')}
          row
        >
          <FormControlLabel 
            value="flat" 
            control={<Radio sx={{ color: '#3D1560', '&.Mui-checked': { color: '#3D1560' } }} />} 
            label={<span style={{ color: '#383A47' }}>Flat Rate</span>}
          />
          <FormControlLabel 
            value="tiered" 
            control={<Radio sx={{ color: '#3D1560', '&.Mui-checked': { color: '#3D1560' } }} />} 
            label={<span style={{ color: '#383A47' }}>Tiered Packages</span>}
          />
        </RadioGroup>
      </FormControl>
      
      {pricingModel === 'flat' ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1, color: '#383A47', fontWeight: 500 }}>
            Flat Rate Price
          </Typography>
          <StyledTextField
            label={
              <span>
                Service Price <span style={{ color: '#000', fontSize: '1.2em', fontWeight: 'bold' }}>*</span>
              </span>
            }
            type="number"
            placeholder="Enter price"
            value={flatRatePrice}
            onChange={(e) => onFlatPriceChange(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            fullWidth
            error={Boolean(touched.flatRatePrice && errors.flatRatePrice && flatRatePrice !== '')}
            helperText={touched.flatRatePrice && flatRatePrice !== '' ? errors.flatRatePrice : ''}
          />
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1, color: '#383A47', fontWeight: 500 }}>
            Pricing Tiers
          </Typography>
          
          {pricingTiers.map((tier, tierIndex) => (
            <Paper 
              key={tier.id} 
              sx={{ 
                p: 2, 
                mb: 2, 
                border: '1px solid #CDCED8',
                borderRadius: 2,
                boxShadow: 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1B1C20' }}>
                    {tier.name || `Tier ${tierIndex + 1}`}
                  </Typography>
                  {tierIndex === 0 && (
                    <Chip 
                      label="Default" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#EDD9FF', 
                        color: '#3D1560', 
                        fontSize: '0.7rem',
                        height: '20px',
                        fontWeight: 500
                      }} 
                    />
                  )}
                </Box>
                {tierIndex >= 2 && (
                  <IconButton
                    size="small"
                    onClick={() => removeTier(tierIndex)}
                    sx={{
                      color: '#DF678C',
                      '&:hover': {
                        bgcolor: '#FFE5ED'
                      }
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '18px' }} />
                  </IconButton>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label={
                      <span style={{ color: '#383A47' }}>
                        Tier Name <span style={{ color: '#000', fontSize: '1.2em', fontWeight: 'bold' }}>*</span>
                      </span>
                    }
                    placeholder="e.g., Basic, Standard, Premium"
                    value={tier.name}
                    onChange={(e) => updateTierField(tierIndex, 'name', e.target.value)}
                    fullWidth
                    error={hasTierError(tierIndex, 'name') && tier.name !== ''}
                    helperText={hasTierError(tierIndex, 'name') && tier.name !== '' ? getTierErrorMessage(tierIndex, 'name') : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label={
                      <span style={{ color: '#383A47' }}>
                        Price <span style={{ color: '#000', fontSize: '1.2em', fontWeight: 'bold' }}>*</span>
                      </span>
                    }
                    type="number"
                    placeholder="Enter price"
                    value={tier.price}
                    onChange={(e) => updateTierField(tierIndex, 'price', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    fullWidth
                    error={hasTierError(tierIndex, 'price') && tier.price !== ''}
                    helperText={hasTierError(tierIndex, 'price') && tier.price !== '' ? getTierErrorMessage(tierIndex, 'price') : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 0.5, 
                        color: '#383A47',
                        fontSize: '0.875rem',
                        fontWeight: 400
                      }}
                    >
                      Duration <span style={{ color: '#000', fontSize: '1.2em', fontWeight: 'bold' }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start' }}>
                      <TextField
                        placeholder="e.g., 60"
                        value={tier.duration}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          updateTierField(tierIndex, 'duration', value);
                        }}
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            '& input[type=number]': {
                              MozAppearance: 'textfield',
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                            '& input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          },
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                        error={hasTierError(tierIndex, 'duration') && tier.duration !== ''}
                        helperText={hasTierError(tierIndex, 'duration') && tier.duration !== '' ? getTierErrorMessage(tierIndex, 'duration') : ''}
                      />
                      <FormControl 
                        sx={{ 
                          minWidth: 100,
                          '& .MuiOutlinedInput-root': {
                            height: '56px',
                          }
                        }}
                        error={hasTierError(tierIndex, 'duration') && tier.duration !== ''}
                      >
                        <Select
                          value={tier.durationUnit || 'minutes'}
                          onChange={(e) => updateTierField(tierIndex, 'durationUnit', e.target.value)}
                          sx={{
                            '& .MuiSelect-select': {
                              py: 1.5,
                            }
                          }}
                        >
                          <MenuItem value="minutes">Mins</MenuItem>
                          <MenuItem value="hours">Hours</MenuItem>
                          <MenuItem value="days">Days</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label={
                      <span style={{ color: '#383A47' }}>
                        Description <span style={{ color: '#000', fontSize: '1.2em', fontWeight: 'bold' }}>*</span>
                      </span>
                    }
                    multiline
                    rows={2}
                    placeholder="Describe what's included in this tier"
                    value={tier.description}
                    onChange={(e) => updateTierField(tierIndex, 'description', e.target.value)}
                    fullWidth
                    error={hasTierError(tierIndex, 'description') && tier.description !== ''}
                    helperText={hasTierError(tierIndex, 'description') && tier.description !== '' ? getTierErrorMessage(tierIndex, 'description') : ''}
                  />
                </Grid>
                
                {/* Tier Image Upload */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, color: '#383A47' }}>
                    Tier Image (Optional)
                  </Typography>
                  <Box
                    sx={{
                      position: 'relative',
                      width: tier.tierImage ? '150px' : '100px',
                      height: tier.tierImage ? '150px' : '80px',
                      border: '2px dashed #CDCED8',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: '#F8F8FA',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#3D1560',
                        bgcolor: '#EDD9FF'
                      }
                    }}
                    onClick={() => {
                      const input = document.getElementById(`tier-image-${tierIndex}`);
                      input?.click();
                    }}
                  >
                    {tier.tierImage ? (
                      <>
                        <img
                          src={URL.createObjectURL(tier.tierImage)}
                          alt={`Tier ${tierIndex + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTierField(tierIndex, 'tierImage', null);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 1)',
                            },
                            width: '28px',
                            height: '28px'
                          }}
                        >
                          <CloseIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <AddIcon sx={{ fontSize: '24px', color: '#70727F', mb: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#70727F', display: 'block', fontSize: '0.7rem' }}>
                          Add image
                        </Typography>
                      </Box>
                    )}
                    <input
                      id={`tier-image-${tierIndex}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateTierField(tierIndex, 'tierImage', file);
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, color: '#383A47' }}>
                  Key Features (Optional)
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
                      placeholder="e.g., Free delivery, 24/7 support"
                      value={feature}
                      onChange={(e) => {
                        const newTiers = [...pricingTiers];
                        newTiers[tierIndex].features[featureIndex] = e.target.value;
                        onTiersChange(newTiers);
                      }}
                      size="small"
                      fullWidth
                      sx={{ mr: 1 }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => removeFeature(tierIndex, featureIndex)}
                      sx={{ color: '#DF678C', '&:hover': { bgcolor: '#FFE5ED' } }}
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
                    mt: 0.5,
                    color: '#3D1560',
                    borderColor: '#3D1560',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#6D26AB',
                      color: '#6D26AB',
                      bgcolor: '#F8F8FA'
                    },
                  }}
                >
                  Add Feature
                </Button>
              </Box>
            </Paper>
          ))}
          
          {/* Add Another Tier Button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addTier}
            disabled={pricingTiers.length >= 10}
            sx={{
              mt: 1,
              color: '#3D1560',
              borderColor: '#3D1560',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#6D26AB',
                bgcolor: '#EDD9FF'
              },
              '&:disabled': {
                borderColor: '#CDCED8',
                color: '#70727F'
              }
            }}
          >
            Add Another Tier ({pricingTiers.length}/10)
          </Button>
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      {/* Payment Options Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 2, color: '#383A47' }}>
          Payment Options
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Switch 
                checked={paymentOptions.onlinePayment}
                onChange={(e) => onPaymentOptionsChange({
                  ...paymentOptions,
                  onlinePayment: e.target.checked
                })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#3D1560',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#3D1560',
                  },
                }}
              />
            }
            label={<span style={{ color: '#383A47' }}>Online Payment</span>}
          />
          <FormControlLabel
            control={
              <Switch 
                checked={paymentOptions.payAtService}
                onChange={(e) => onPaymentOptionsChange({
                  ...paymentOptions,
                  payAtService: e.target.checked
                })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#3D1560',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#3D1560',
                  },
                }}
              />
            }
            label={<span style={{ color: '#383A47' }}>Pay at Service</span>}
          />
        </Box>
      </Box>
      
      {/* Seller Policy Acceptance - Only show if handlers provided */}
      {onAcceptSellerPolicyChange && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptSellerPolicy || false}
                  onChange={(e) => onAcceptSellerPolicyChange?.(e.target.checked)}
                  sx={{
                    color: '#3D1560',
                    '&.Mui-checked': {
                      color: '#3D1560',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#383A47' }}>
                  I agree to the{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    onClick={() => onOpenSellerPolicy?.()}
                    sx={{
                      color: '#3D1560',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: '#6D26AB',
                      },
                    }}
                  >
                    Seller Terms & Policies
                  </Typography>
                  {' '}
                  <Typography
                    component="span"
                    sx={{
                      color: '#000',
                      fontSize: '1.2em',
                      fontWeight: 'bold',
                    }}
                  >
                    *
                  </Typography>
                </Typography>
              }
            />
          </Box>
        </>
      )}
    </Box>
  );
};

