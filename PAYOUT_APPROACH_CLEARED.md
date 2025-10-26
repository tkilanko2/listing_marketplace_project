# Payout Approach - Clarified

## Final Understanding

### Default: Schedule-Based Payouts
- **How it works:** Fixed payout dates (1st & 15th of month, or 1st of month)
- **Frequency:** Seller can choose bi-monthly or monthly
- **Amount:** All accumulated balance is paid out (no minimum threshold required)
- **Benefit:** Predictable, scheduled income for seller

### Alternative: Threshold-Based Payouts
- **How it works:** Payouts triggered when balance reaches a threshold
- **Minimum:** $10.00 (required to trigger payout)
- **Maximum:** Optional, up to 1000 in seller's currency
- **Amount:** Only paid when threshold is met
- **Benefit:** More flexible, automatic when conditions are met

## Key Points

✅ **Schedule is the DEFAULT** - most sellers use this  
✅ **Threshold is OPTIONAL** - seller can choose to switch  
✅ **Sellers can change methods** - not locked into one approach  
✅ **Threshold-based = minimum $10** - prevents tiny payouts  
✅ **Schedule-based = no minimum** - all available balance is paid  

## What This Means for UI

### For Schedule-Based (Default)
```
Payout Configuration
────────────────────
Method: Schedule Based (Active)

Frequency: Bi-monthly (1st & 15th)
OR Monthly (1st of month)

Next Payout: Jan 15, 2025
Estimated Arrival: Jan 18-22, 2025

All available balance will be paid on this date.
No minimum threshold required.

[Change to Threshold-Based] ← Optional override
```

### For Threshold-Based (Optional Override)
```
Payout Configuration
────────────────────
Method: Threshold Based (Active)

Minimum: $10.00
Maximum: No limit (or set custom amount)

Next Payout: When balance reaches $10.00
(Currently: $8.50 - waiting for $1.50 more)

[Change to Schedule-Based] ← Switch back to default
```

## User Choice Flow

1. **Default:** Seller starts with schedule-based payouts
2. **Option:** Seller can choose to switch to threshold-based
3. **Switch back:** Seller can always revert to schedule-based
4. **Configuration:** Seller sets frequency (when schedule-based) or thresholds (when threshold-based)

## Implementation Logic

```typescript
interface PayoutConfiguration {
  method: 'schedule' | 'threshold'; // Default: 'schedule'
  
  // For schedule-based
  scheduleFrequency?: 'bi-monthly' | 'monthly';
  
  // For threshold-based
  minimumThreshold?: number; // Default: 10
  maximumThreshold?: number | null; // null = no limit
  currency?: 'USD' | 'EUR' | 'GBP';
}

// Default for new sellers
const defaultPayoutConfig = {
  method: 'schedule',
  scheduleFrequency: 'bi-monthly'
};
```

## Summary

- **Schedule = DEFAULT** (most sellers)
- **Threshold = OPTION** (sellers can enable)
- **Clean UI** to show which method is active and allow switching
- **Both methods coexist** - seller chooses preferred approach

✅ Clarified: Schedule-based is default, threshold-based is an optional alternative!

