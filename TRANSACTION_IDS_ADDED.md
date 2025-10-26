# Added Transaction IDs to Transaction Rows

## Change
Added transaction ID display to each transaction row in the Recent Transactions list.

## Location
Appears below the customer name and date line, in each transaction row.

## Display Format
```
ID: pi_r6lvmofx7k
```

### Styling:
- **Label**: "ID:" prefix for clarity
- **Font**: Monospace (`font-mono`) for technical ID
- **Size**: Extra small (`text-xs`)
- **Color**: Gray (`text-[#70727F]`)
- **Spacing**: Small margin below to separate from amount/status info

## Row Structure (Before → After)

### Before:
```
Professional Hair Cutting & Styling Services [completed]
David W. • Oct 19, 2025
$350.00 → $330.55 net    ✅ Available Now
```

### After:
```
Professional Hair Cutting & Styling Services [completed]
David W. • Oct 19, 2025
ID: pi_r6lvmofx7k
$350.00 → $330.55 net    ✅ Available Now
```

## Benefits
✅ Sellers can quickly reference transaction IDs  
✅ Useful for support inquiries  
✅ Helpful for reconciliation with payment processor  
✅ Matches payment gateway transaction IDs  
✅ Doesn't clutter the design (small, subtle)  

## Visual Hierarchy
1. Service name (largest, bold)
2. Customer & date (medium, gray)
3. **Transaction ID (smallest, monospace)** ← NEW
4. Amount & status (medium, prominent)

Perfect for tracking and support! 🎯

