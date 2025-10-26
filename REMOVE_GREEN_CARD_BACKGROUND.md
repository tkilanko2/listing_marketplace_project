# Removed Green Background from "Available to Withdraw" Card

## What Changed

### Card Background
**Before:** Green gradient background (`from-[#4CAF50] to-[#45A049]`)  
**After:** Plain white background with subtle border

### Text Colors (adjusted for white background)
- **"Available to Withdraw" label**: Changed to gray (`text-[#70727F]`)
- **Amount ($1263.24)**: Changed to dark (`text-[#1B1C20]`)
- **Subtext**: Changed to gray (`text-[#70727F]`)
- **Wallet icon**: Changed to green accent (`text-[#4CAF50]`)
- **Payout info**: Changed to gray/dark tones

### Button Style
**Before:** Transparent with white outline (for green background)  
**After:** Solid green button (`bg-[#4CAF50]`) with white text

## Result
- ✅ Clean white card (no overwhelming green)
- ✅ Green used as accent (icon and button only)
- ✅ Consistent with other dashboard cards
- ✅ Better readability
- ✅ More professional appearance

## Card Structure Now:
```
┌─────────────────────────────────────┐
│ WHITE CARD with border              │
│                                     │
│ Available to Withdraw (gray)       │
│ $1263.24 (black)          🟢 icon   │
│ 8 completed bookings (gray)        │
│                                     │
│ [🟢 Withdraw Now]  Next payout info│
└─────────────────────────────────────┘
```

Much cleaner and less overwhelming! ✅

