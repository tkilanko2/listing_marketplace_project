# Account Status Card Removed & Bank Verified Added to Payout Card

## Changes Made

### 1. Removed Account Status Card
**Before:** Separate card showing:
- Bank Verified (Active)
- Identity Verified (Complete)

### 2. Added Bank Verified to Next Payout Card
**After:** "Bank Verified Active" now appears at the bottom of the Next Payout card as a compact status line

## Structure Now

```
Next Payout Card:
├── Payout Window Info (top)
├── Expected Arrival Dates
├── Banking Info (Chase Bank ****1234, Edit button)
└── Bank Verified Active (new - at bottom)
```

## Rationale

✅ **Less Redundant**: Verification details belong on verification page, not finance page  
✅ **More Relevant**: Bank verification status is relevant to payouts, so it makes sense within the payout card  
✅ **Cleaner UI**: Removed an entire card, reducing visual clutter  
✅ **Better Context**: Verification status appears right next to banking details  
✅ **Streamlined**: Finance page now focuses on financial metrics and actions

## What Was Removed

- Separate "Account Status" card
- "Identity Verified" line (less relevant to finance)
- Extra card spacing

## What Was Added

- Compact "Bank Verified Active" line at bottom of Next Payout card
- Subtle top border separator for visual hierarchy

## User Flow

- Users see bank verification status right where they need it (payout section)
- Detailed verification info remains on the verification page
- Finance page is more focused on financial operations

