// Shared Policy Utility Functions

import { CancellationPolicy } from './PolicyTypes';

/**
 * Format time label for display
 */
export const formatTimeLabel = (
  hours: number, 
  type: 'free' | 'partial' | 'none' = 'free'
): string => {
  if (hours === 0 && type === 'free') return 'No free cancellation';
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} before`;
  const days = hours / 24;
  return `${days} day${days !== 1 ? 's' : ''} before`;
};

/**
 * Validate cancellation policy
 */
export const validateCancellationPolicy = (policy: CancellationPolicy): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  // Validate free cancellation is greater than partial refund
  if (policy.freeCancellation > 0 && policy.freeCancellation <= policy.partialRefund) {
    errors.push('Free cancellation period must be greater than partial refund period');
  }

  // Validate partial refund is greater than no refund
  if (policy.partialRefund <= policy.noRefund) {
    errors.push('Partial refund period must be greater than no refund period');
  }

  // Check reasonable limits
  if (policy.freeCancellation > 168) { // 7 days
    errors.push('Free cancellation period cannot exceed 7 days');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get policy description text
 */
export const getPolicyDescription = (policy: CancellationPolicy): string => {
  const parts: string[] = [];

  if (policy.freeCancellation > 0) {
    parts.push(`Free cancellation up to ${formatTimeLabel(policy.freeCancellation, 'free')}`);
  } else {
    parts.push('No free cancellation available');
  }

  if (policy.partialRefund > 0) {
    parts.push(`50% refund for cancellations ${formatTimeLabel(policy.partialRefund, 'partial')} to ${formatTimeLabel(policy.freeCancellation, 'free')}`);
  }

  parts.push(`No refund for cancellations less than ${formatTimeLabel(policy.noRefund, 'none')}`);

  return parts.join('. ');
};

/**
 * Compare two policies for equality
 */
export const policiesAreEqual = (
  policy1: CancellationPolicy | null, 
  policy2: CancellationPolicy | null
): boolean => {
  if (!policy1 && !policy2) return true;
  if (!policy1 || !policy2) return false;
  
  return (
    policy1.freeCancellation === policy2.freeCancellation &&
    policy1.partialRefund === policy2.partialRefund &&
    policy1.noRefund === policy2.noRefund
  );
};

/**
 * Get policy summary for display
 */
export const getPolicySummary = (policy: CancellationPolicy): {
  freeCancellation: string;
  partialRefund: string;
  noRefund: string;
} => {
  return {
    freeCancellation: policy.freeCancellation === 0 
      ? 'Not available' 
      : formatTimeLabel(policy.freeCancellation, 'free'),
    partialRefund: formatTimeLabel(policy.partialRefund, 'partial'),
    noRefund: formatTimeLabel(policy.noRefund, 'none')
  };
};

