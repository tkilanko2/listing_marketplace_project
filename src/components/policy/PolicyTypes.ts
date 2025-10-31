// Shared Policy Types and Interfaces

export interface CancellationPolicy {
  freeCancellation: number; // hours before appointment
  partialRefund: number; // hours before appointment
  noRefund: number; // hours before appointment
}

export type PolicyType = 'platform' | 'custom';

export interface SellerPolicyData {
  platformPolicy: CancellationPolicy;
  customPolicy: CancellationPolicy | null;
  activePolicy: PolicyType;
  hasCustomPolicy: boolean;
}

// Dropdown options for policy configuration
export const freeCancellationOptions = [
  { value: 0, label: 'No free cancellation' },
  { value: 1, label: '1 hour before' },
  { value: 2, label: '2 hours before' },
  { value: 4, label: '4 hours before' },
  { value: 6, label: '6 hours before' },
  { value: 12, label: '12 hours before' },
  { value: 24, label: '24 hours before' },
  { value: 48, label: '48 hours before (2 days)' }
];

export const partialRefundOptions = [
  { value: 1, label: '1 hour before' },
  { value: 2, label: '2 hours before' },
  { value: 3, label: '3 hours before' },
  { value: 4, label: '4 hours before' }
];

export const noRefundOptions = [
  { value: 1, label: '1 hour before' },
  { value: 2, label: '2 hours before' },
  { value: 4, label: '4 hours before' },
  { value: 6, label: '6 hours before' },
  { value: 12, label: '12 hours before' },
  { value: 24, label: '24 hours before' }
];

// Default platform policy
export const defaultPlatformPolicy: CancellationPolicy = {
  freeCancellation: 24, // 24 hours
  partialRefund: 4, // 4 hours
  noRefund: 4 // less than 4 hours
};

