/**
 * Utility functions for handling service data with backward compatibility
 */

import { Service } from '../types';

/**
 * Get service delivery modes with backward compatibility fallback
 * Converts old `serviceMode` to new `serviceDeliveryModes` if needed
 */
export function getServiceDeliveryModes(service: Service): ('at_buyer' | 'at_seller' | 'remote')[] {
  // If new field exists, use it
  if (service.serviceDeliveryModes && service.serviceDeliveryModes.length > 0) {
    return service.serviceDeliveryModes;
  }
  
  // Fallback to old field for backward compatibility
  if (service.serviceMode) {
    switch (service.serviceMode) {
      case 'both':
        return ['at_seller', 'at_buyer'];
      case 'onsite':
        return ['at_seller'];
      case 'remote':
        return ['remote'];
      default:
        return ['at_seller']; // Safe default
    }
  }
  
  // Ultimate fallback
  return ['at_seller'];
}

/**
 * Get availability display text with backward compatibility
 * Handles both rich availability object and simple string
 */
export function getAvailabilityText(service: Service): string {
  // If it's already a string, return it
  if (typeof service.availability === 'string') {
    return service.availability;
  }
  
  // If it's an object, convert to display text
  const avail = service.availability;
  if (!avail) return 'Available on request';
  
  if (avail.scheduleType === 'dateRange') {
    return 'Available on specific dates';
  }
  
  switch (avail.type) {
    case 'custom':
      return 'Custom schedule';
    case 'weekdays':
      return 'Monday to Friday, 9 AM - 5 PM';
    case 'weekends':
      return 'Weekends';
    case 'allWeek':
      return 'Every day';
    default:
      return 'Available on request';
  }
}

/**
 * Check if service is available at a specific delivery mode
 */
export function hasDeliveryMode(service: Service, mode: 'at_buyer' | 'at_seller' | 'remote'): boolean {
  const modes = getServiceDeliveryModes(service);
  return modes.includes(mode);
}

/**
 * Get human-readable delivery mode labels
 */
export function getDeliveryModeLabel(mode: 'at_buyer' | 'at_seller' | 'remote'): string {
  switch (mode) {
    case 'at_buyer':
      return 'At Your Location';
    case 'at_seller':
      return 'At Provider Location';
    case 'remote':
      return 'Remote/Online';
    default:
      return mode;
  }
}

/**
 * Get all delivery mode labels for a service
 */
export function getServiceDeliveryLabels(service: Service): string[] {
  const modes = getServiceDeliveryModes(service);
  return modes.map(getDeliveryModeLabel);
}



