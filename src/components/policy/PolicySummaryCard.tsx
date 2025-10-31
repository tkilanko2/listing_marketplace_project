import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Shield, Calendar, CheckCircle } from 'lucide-react';
import { CancellationPolicy, PolicyType } from './PolicyTypes';
import { formatTimeLabel, getPolicySummary } from './PolicyUtils';

interface PolicySummaryCardProps {
  policy: CancellationPolicy;
  policyType: PolicyType;
  isActive?: boolean;
  compact?: boolean;
}

export const PolicySummaryCard: React.FC<PolicySummaryCardProps> = ({
  policy,
  policyType,
  isActive = true,
  compact = false
}) => {
  const summary = getPolicySummary(policy);

  if (compact) {
    return (
      <Box sx={{ 
        bgcolor: '#EDD9FF', 
        border: '1px solid #3D1560',
        borderRadius: 2, 
        p: 2,
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Shield className="w-5 h-5 text-[#3D1560]" />
            <Typography variant="subtitle1" sx={{ color: '#3D1560', fontWeight: 'bold' }}>
              Current Policy
            </Typography>
          </Box>
          <Chip 
            label={policyType === 'platform' ? 'Platform' : 'Custom'}
            size="small"
            sx={{ 
              bgcolor: '#3D1560', 
              color: 'white',
              fontWeight: 'medium',
              fontSize: '0.75rem'
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: '#3D1560', fontSize: '0.85rem' }}>
          <strong>Free cancellation:</strong> {summary.freeCancellation}
          {' • '}
          <strong>Partial refund:</strong> {summary.partialRefund}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: 'linear-gradient(to right, #EDD9FF, #F3E8FF)',
      borderRadius: 2, 
      p: 3,
      border: '1px solid #E8E9ED',
      mb: 3
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Shield className="w-5 h-5 text-[#3D1560]" />
          <Typography variant="h6" sx={{ color: '#1B1C20', fontWeight: 'bold' }}>
            Policy Summary
          </Typography>
        </Box>
        <Chip 
          label={policyType === 'platform' ? 'Platform' : 'Custom'}
          size="small"
          sx={{ 
            bgcolor: 'white', 
            color: '#3D1560',
            fontWeight: 'semibold',
            border: '1px solid #3D1560'
          }}
        />
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 2
      }}>
        {/* Cancellation Settings */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2, 
          p: 2.5,
          border: '1px solid rgba(255,255,255,0.4)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Calendar className="w-4 h-4 text-[#3D1560]" />
            <Typography variant="caption" sx={{ color: '#70727F', fontWeight: 'medium' }}>
              Cancellation Terms
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#1B1C20', fontWeight: 'semibold' }}>
            {policy.freeCancellation === 0 
              ? 'No free cancellation'
              : `Free: ${formatTimeLabel(policy.freeCancellation, 'free')}`
            }
          </Typography>
          <Typography variant="caption" sx={{ color: '#70727F', mt: 0.5, display: 'block' }}>
            50% refund: {formatTimeLabel(policy.partialRefund, 'partial')}
          </Typography>
        </Box>

        {/* Status */}
        <Box sx={{ 
          bgcolor: 'white', 
          borderRadius: 2, 
          p: 2.5,
          border: '1px solid rgba(255,255,255,0.4)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
            <Typography variant="caption" sx={{ color: '#70727F', fontWeight: 'medium' }}>
              Status
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#1B1C20', fontWeight: 'semibold' }}>
            {isActive ? (policyType === 'platform' ? 'Platform Active' : 'Custom Active') : 'Inactive'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#70727F', mt: 0.5, display: 'block' }}>
            Applied to all listings
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PolicySummaryCard;

