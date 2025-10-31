import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  FormHelperText
} from '@mui/material';
import { Save, X, AlertTriangle } from 'lucide-react';
import {
  CancellationPolicy,
  PolicyType,
  freeCancellationOptions,
  partialRefundOptions,
  noRefundOptions
} from './PolicyTypes';
import { validateCancellationPolicy } from './PolicyUtils';

interface PolicyConfigEditorProps {
  mode: 'full' | 'compact';
  policy: CancellationPolicy;
  onPolicyChange: (policy: CancellationPolicy) => void;
  onSave?: () => void;
  onCancel?: () => void;
  isEditing: boolean;
  policyType: PolicyType;
  showActions?: boolean;
  disabled?: boolean;
}

export const PolicyConfigEditor: React.FC<PolicyConfigEditorProps> = ({
  mode,
  policy,
  onPolicyChange,
  onSave,
  onCancel,
  isEditing,
  policyType,
  showActions = true,
  disabled = false
}) => {
  const [localPolicy, setLocalPolicy] = useState<CancellationPolicy>(policy);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalPolicy(policy);
  }, [policy]);

  const handleChange = (field: keyof CancellationPolicy, value: number) => {
    const updatedPolicy = { ...localPolicy, [field]: value };
    setLocalPolicy(updatedPolicy);
    onPolicyChange(updatedPolicy);

    // Validate on change
    const validation = validateCancellationPolicy(updatedPolicy);
    setValidationErrors(validation.errors);
  };

  const handleSave = () => {
    const validation = validateCancellationPolicy(localPolicy);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    onSave?.();
  };

  const handleCancel = () => {
    setLocalPolicy(policy);
    setValidationErrors([]);
    onCancel?.();
  };

  if (!isEditing) {
    return null;
  }

  const isCompact = mode === 'compact';

  return (
    <Box sx={{ 
      bgcolor: isCompact ? '#FFFFFF' : '#F8F8FA', 
      borderRadius: 2, 
      p: isCompact ? 2.5 : 4,
      border: isCompact ? 'none' : '2px solid #3D1560'
    }}>
      <Typography 
        variant={isCompact ? 'subtitle1' : 'h6'} 
        sx={{ 
          color: '#1B1C20', 
          fontWeight: 'bold',
          mb: isCompact ? 2 : 3
        }}
      >
        {isCompact ? 'Configure Cancellation Policy' : 'Customize Cancellation Policy'}
      </Typography>

      {policyType === 'platform' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Platform policy is read-only. Create a custom policy to make changes.
        </Alert>
      )}

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isCompact ? 2 : 3 
      }}>
        {/* Free Cancellation Period */}
        <FormControl 
          fullWidth 
          disabled={disabled || policyType === 'platform'}
          size={isCompact ? 'small' : 'medium'}
        >
          <InputLabel id="free-cancellation-label">Free Cancellation Period</InputLabel>
          <Select
            labelId="free-cancellation-label"
            value={localPolicy.freeCancellation}
            onChange={(e) => handleChange('freeCancellation', Number(e.target.value))}
            label="Free Cancellation Period"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#CDCED8',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D1560',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D1560',
              }
            }}
          >
            {freeCancellationOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Customers can cancel for free up to this time before the appointment
          </FormHelperText>
        </FormControl>

        {/* Partial Refund Period */}
        <FormControl 
          fullWidth 
          disabled={disabled || policyType === 'platform'}
          size={isCompact ? 'small' : 'medium'}
        >
          <InputLabel id="partial-refund-label">Partial Refund Period (50%)</InputLabel>
          <Select
            labelId="partial-refund-label"
            value={localPolicy.partialRefund}
            onChange={(e) => handleChange('partialRefund', Number(e.target.value))}
            label="Partial Refund Period (50%)"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#CDCED8',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D1560',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D1560',
              }
            }}
          >
            {partialRefundOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Customers receive 50% refund for cancellations during this period
          </FormHelperText>
        </FormControl>

        {/* No Refund Period */}
        <FormControl 
          fullWidth 
          disabled={disabled || policyType === 'platform'}
          size={isCompact ? 'small' : 'medium'}
        >
          <InputLabel id="no-refund-label">No Refund Threshold</InputLabel>
          <Select
            labelId="no-refund-label"
            value={localPolicy.noRefund}
            onChange={(e) => handleChange('noRefund', Number(e.target.value))}
            label="No Refund Threshold"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#CDCED8',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D1560',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3D1560',
              }
            }}
          >
            {noRefundOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            No refund for cancellations less than this time before appointment
          </FormHelperText>
        </FormControl>
      </Box>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" icon={<AlertTriangle className="w-5 h-5" />} sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Please fix the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {validationErrors.map((error, index) => (
              <li key={index}>
                <Typography variant="body2">{error}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Action Buttons */}
      {showActions && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          gap: 2,
          mt: isCompact ? 2.5 : 4,
          pt: isCompact ? 2 : 3,
          borderTop: '1px solid #E8E9ED'
        }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            startIcon={<X className="w-4 h-4" />}
            disabled={disabled}
            sx={{
              color: '#70727F',
              borderColor: '#CDCED8',
              '&:hover': {
                borderColor: '#70727F',
                bgcolor: '#E8E9ED'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<Save className="w-4 h-4" />}
            disabled={disabled || validationErrors.length > 0}
            sx={{
              bgcolor: '#3D1560',
              color: 'white',
              '&:hover': {
                bgcolor: '#6D26AB'
              },
              '&:disabled': {
                bgcolor: '#EDD9FF',
                color: '#CDCED8'
              }
            }}
          >
            Save Policy
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PolicyConfigEditor;

