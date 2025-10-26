# Payout Threshold Logic - Updated Specification

## Key Changes

### 1. Automatic Payouts Based on Thresholds (Not Fixed Schedule)

**Previous Understanding:**
- Payouts happen on fixed dates (1st & 15th, or 1st of month)

**Updated Understanding:**
- Payouts happen **automatically** when threshold conditions are met
- Processing dates are **informational only**

---

## Payout Threshold Rules

### Minimum Threshold (Fixed)
- **Amount:** $10.00 (or equivalent in seller's currency: €10, £10)
- **Purpose:** Prevent too many small payouts
- **Not configurable** by seller
- Payout **must** reach this minimum before being processed

### Maximum Threshold (Optional)
- **Purpose:** Allow sellers to cap accumulation
- **Default:** No maximum (recommended)
- **Option:** Seller can set maximum:
  - USD: Up to $1000
  - EUR: Up to €1000
  - GBP: Up to £1000
- **Based on seller's currency** (not platform default)

---

## Payout Trigger Logic

```
IF (balance >= minimum_threshold) {
  IF (maximum_threshold == null) {
    // No limit set - payout immediately
    trigger_payout();
  } ELSE IF (balance >= maximum_threshold) {
    // Maximum reached - payout immediately
    trigger_payout();
  } ELSE {
    // Between min and max - wait for more accumulation or max to be reached
    // OR process on next batch processing date
    process_on_next_batch_date(); // Typically 1st & 15th
  }
}
```

### Scenarios:

**Scenario 1: Seller sets NO maximum**
- Balance reaches $10 → Payout triggered
- Balance reaches $50 → Payout triggered
- Balance reaches $200 → Payout triggered
- Payout happens **automatically** when minimum ($10) is met

**Scenario 2: Seller sets maximum of $500**
- Balance at $10 → Payout triggered (meets minimum)
- Balance at $450 → No payout yet (below maximum)
- Balance at $500 → Payout triggered (reached maximum)

**Scenario 3: Balance between min and max (waiting for accumulation)**
- Balance at $50 (min=$10, max=$500)
- System waits for balance to grow more
- On next batch processing date (e.g., 1st & 15th), balance is checked
- If still below max, may wait for more or process per seller preference

---

## Display on Banking Settings Page

### Current Status Display
```
Payout Threshold Settings
────────────────────────
Minimum Payout: $10.00 ✅
(This amount must be available before payout)

Maximum Accumulation:
● No Maximum (Automatic payouts)
○ Maximum Threshold: $1000 [Edit]

────────────────────────
Current Balance: $450.00
Next Payout: $50.00 to reach minimum
(Will process automatically on next batch date: Jan 15)
```

### When Balance is Below Minimum
```
Current Balance: $8.50
Status: Waiting for $1.50 more to reach $10.00 minimum
Expected Time: ~2 days based on recent activity
```

### When Balance is Between Min and Max
```
Current Balance: $450.00
Status: Accumulating toward $1000 maximum
Next Payout: When balance reaches $1000 or on Jan 15 (whichever comes first)
```

---

## Seller Options

### 1. No Maximum Threshold (Recommended - Default)
- Payout happens as soon as balance reaches $10
- No accumulation cap
- Best for cash flow needs

### 2. Maximum Threshold Set
- Example: $1000 maximum
- Balance accumulates until either:
  - Minimum ($10) is met on batch processing date
  - Maximum ($1000) is reached (triggers immediate payout)
- Best for sellers who want to minimize transaction counts

---

## Implementation Notes

### Data Model
```typescript
interface PayoutThresholds {
  minimumAmount: 10; // Fixed
  minimumCurrency: 'USD' | 'EUR' | 'GBP'; // Based on seller
  maximumAmount: number | null; // null = no limit
  maximumCurrency: 'USD' | 'EUR' | 'GBP';
  sellerPrimaryCurrency: 'USD' | 'EUR' | 'GBP';
}

interface BankAccount {
  // ... bank details
  payoutThresholds: PayoutThresholds;
}
```

### Backend Logic
- Check balance daily/hourly
- Compare against thresholds
- Trigger payout when:
  1. Balance >= minimum AND has waited reasonable time
  2. Balance >= maximum (immediate trigger)
  3. Next batch processing date (1st & 15th) if balance between thresholds

---

## UI/UX Considerations

- **Show current balance** prominently
- **Show progress** toward next threshold
- **Explain timing** clearly (automatic vs. batch processing)
- **Make it easy** to adjust maximum threshold
- **Don't confuse** with scheduled dates (those are informational processing times)

---

## Summary

✅ Payouts are **threshold-based**, not schedule-based  
✅ Minimum is **$10** (fixed, required)  
✅ Maximum is **optional** (up to 1000 in seller's currency)  
✅ Frequency shown is **informational only** (1st & 15th processing days)  
✅ Seller can configure **maximum** but not minimum  
✅ Currency matters (USD/EUR/GBP based on seller's primary)

