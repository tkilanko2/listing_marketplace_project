# CSV Export - Updated to Net Earnings

## Change Made

### Column Header & Data
**Before:**
- Header: "Amount"
- Data: `transaction.amount` (gross revenue - what customer paid)

**After:**
- Header: "Net Earnings"
- Data: `transaction.netToSeller` (net after all fees - what seller receives)

## Why This Makes Sense

Sellers care most about what they actually earn, not what the customer paid. The CSV now shows:
- **Net Earnings** = Gross - Platform Fee - Payment Processing Fee - Transaction Fee

## Example Output

```csv
"Transaction ID","Booking ID","Listing/Service Name","Date","Net Earnings"
"pi_r6lvmofx7k","BKG-CS-004","Professional Hair Cutting & Styling Services","10/19/2025","330.55"
"pi_abc123xyz","BKG-CS-007","Professional Photography Services","10/16/2025","377.85"
"pi_def456uvw","BKG-CS-001","Career Guidance Consultation","10/17/2025","117.70"
```

## Reconciliation

Sellers can:
- Sum the "Net Earnings" column
- Match against their available balance
- Use for accounting records
- Know exactly what they received

## Modal Preview Updated

The info box now shows:
```
Export includes:
• Transaction ID
• Booking ID
• Listing/Service Name
• Date
• Net Earnings (after fees)  ← Updated
```

✅ CSV export now shows seller's actual earnings!

