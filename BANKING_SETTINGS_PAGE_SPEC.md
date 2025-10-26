# Banking Settings Page - Specification

## Page Purpose
Allow sellers to view and configure their bank account details, payout schedule, and verification status for receiving payments.

## Core Principles
- **Minimal Information**: Only show what's needed to receive payouts
- **Clear Actions**: Easy to update bank details or navigate to full settings
- **Verification Status**: Show if account is verified and ready for payouts
- **Simple Layout**: Focused, not overwhelming

---

## Page Structure

### 1. Page Header
```
┌─────────────────────────────────────────────────┐
│  ← Back          Banking & Payout Settings       │
│                        (Edit button)             │
└─────────────────────────────────────────────────┘
```

**Elements:**
- Back button (to Finance page)
- Page title: "Banking & Payout Settings"
- Edit button (only visible when editable)

---

### 2. Account Status Banner
**Purpose:** Show verification status at a glance

```
┌─────────────────────────────────────────────────┐
│  ✓ Bank Account Verified                        │
│  Your account is verified and ready for payouts  │
└─────────────────────────────────────────────────┘
```

**States:**
- ✅ **Verified** (green): "Bank Account Verified - Your account is verified and ready for payouts"
- ⚠️ **Pending** (orange): "Verification Pending - We're reviewing your bank details"
- ❌ **Not Verified** (red): "Verification Required - Please add your bank account to receive payouts"

**Actions:**
- CTA to "Start Verification" (if not verified)
- Link to verification status page (if pending/verified)

---

### 3. Primary Bank Account
**Purpose:** Show current bank details and allow updates

```
┌─────────────────────────────────────────────────┐
│  Primary Account                                 │
│  ───────────────────────────────────────────────│
│                                                  │
│  Account Name: John D.                          │
│  Bank Name: Chase Bank                          │
│  Account: ****1234                             │
│  Account Type: Checking                         │
│                                                  │
│  [Edit Account]                                 │
└─────────────────────────────────────────────────┘
```

**Information Displayed:**
- Account holder name (full or masked)
- Bank name
- Account last 4 digits (masked as ****1234)
- Account type (Checking/Savings/Business)
- Edit button

**What NOT to show:**
- Full account numbers
- Routing numbers
- Other sensitive details

---

### 4. Payout Configuration
**Purpose:** Default schedule-based payouts, with option to switch to threshold-based

```
┌─────────────────────────────────────────────────┐
│  Payout Configuration                           │
│  ───────────────────────────────────────────────│
│                                                  │
│  Payout Method:                                  │
│  ● Schedule Based (Default)                      │
│    Payouts occur on 1st & 15th of each month    │
│                                                  │
│  ○ Threshold Based                               │
│    Minimum: $10.00                              │
│    Maximum: No limit                            │
│    Payouts happen automatically when reached    │
│                                                  │
│  [Change Payout Method]                         │
└─────────────────────────────────────────────────┘
```

**Default: Schedule-Based Payouts**
- Bi-monthly (1st & 15th) or Monthly (1st of month)
- Fixed payout dates
- Seller receives accumulated balance on scheduled dates
- No minimum threshold (all available balance is paid)

**Option: Threshold-Based Payouts**
- Minimum Payout: $10.00 (fixed, required to trigger payout)
- Maximum Threshold: Optional
  - No maximum (default)
  - Set maximum: USD $1000, EUR €1000, GBP £1000
- Payouts triggered when balance reaches minimum or maximum
- Automatic processing (not tied to schedule)

**Payout Logic:**
- **Schedule-Based (Default):** Payouts on fixed dates (1st & 15th)
- **Threshold-Based (Optional):** Payouts when balance reaches configured threshold
- Sellers can switch between methods
- Schedule dates are informational and processing times when threshold-based is used

**Edit Modal for Changing Payout Method:**
```
┌─────────────────────────────────────────────────┐
│  Change Payout Method                       [X] │
│  ───────────────────────────────────────────────│
│                                                  │
│  Payout Method:                                  │
│  ○ Schedule Based (Recommended)                  │
│    Frequency: [Bi-monthly ▼]                     │
│    ● 1st & 15th of month                         │
│    ○ 1st of month only                            │
│    Automatic payouts regardless of amount        │
│                                                  │
│  ● Threshold Based                               │
│    Minimum Amount: $10.00 (required)             │
│    Maximum Amount:                               │
│    ○ No Maximum (Payout at minimum)              │
│    ○ Set Maximum: [1000] [USD ▼]                  │
│    Payouts happen when balance reaches threshold │
│                                                  │
│  [Cancel]  [Save Changes]                       │
└─────────────────────────────────────────────────┘
```

---

### 5. Recent Payouts (Optional - Collapsible)
**Purpose:** Quick reference to recent payouts

```
┌─────────────────────────────────────────────────┐
│  Recent Payouts ▼                                │
│  ───────────────────────────────────────────────│
│                                                  │
│  Jan 1, 2025          $1,250.00     Completed  │
│  Dec 15, 2024         $890.00       Completed  │
│                                                  │
│  [View Full Payout History →]                   │
└─────────────────────────────────────────────────┘
```

**Display:**
- Last 3-5 payouts
- Date, Amount, Status
- Link to full payout history (navigates to Finance > Reports tab)

---

### 6. Verification Details Link
**Purpose:** Navigate to full verification page if needed

```
┌─────────────────────────────────────────────────┐
│  Need to update verification?                   │
│  [Go to Verification Settings →]                │
└─────────────────────────────────────────────────┘
```

**Placement:** Bottom of page, subtle footer

---

## Modal for Editing Bank Account

When "Edit Account" is clicked:

```
┌─────────────────────────────────────────────────┐
│  Update Bank Account                        [X] │
│  ───────────────────────────────────────────────│
│                                                  │
│  Account Holder Name                            │
│  [John Doe                           ]          │
│                                                  │
│  Bank Name                                       │
│  [Chase Bank                         ]          │
│                                                  │
│  Account Number                                  │
│  [•••• •••• •••• 1234                ]          │
│                                                  │
│  Routing Number                                  │
│  [021000021                          ]          │
│                                                  │
│  Account Type                                    │
│  ○ Checking  ○ Savings  ● Business             │
│                                                  │
│  [Cancel]  [Save Changes]                        │
└─────────────────────────────────────────────────┘
```

**Validation:**
- Required fields
- Account number format validation
- Routing number validation
- Save triggers new verification

---

## Important Considerations

### What NOT to Include (Avoid Too Much Information):
❌ Full bank account numbers (only last 4 digits)  
❌ Tax information (belongs on tax settings)  
❌ Transaction history (belongs on Finance page)  
❌ Multiple bank accounts (not necessary for now)  
❌ Payout destination selection (only if multiple methods supported)  
❌ Detailed fee structure (belongs on finance page)  

### What TO Include (Essential Information):
✅ Current account details (masked)  
✅ Verification status  
✅ Next payout timing  
✅ Quick action to update  
✅ Link to full verification if needed  

---

## Navigation Flow

**Entry Points:**
1. Finance page → "Banking Settings" CTA
2. Seller Dashboard Settings → Banking section
3. Next Payout card → "Edit" button

**Exit Points:**
- Back button → Returns to Finance page
- "View Full Payout History" → Finance Reports tab
- "Go to Verification" → Verification page

---

## Design Principles

1. **Clean, focused layout** - One column, cards
2. **Platform colors** - Purple primary (#3D1560), green for verified, red for errors
3. **Clear CTAs** - Edit buttons are prominent
4. **Status badges** - Verification state is obvious
5. **Security mindset** - Never show full account numbers

---

## Technical Requirements

**Data Needed:**
- `bankAccount` object with:
  - `accountName`
  - `bankName`
  - `last4Digits`
  - `accountType`
  - `verificationStatus`
  - `routingNumber` (for editing only)
  
- `payoutConfiguration` object with:
  - `payoutMethod`: 'schedule' | 'threshold' (default: 'schedule')
  - `scheduleFrequency`: 'bi-monthly' | 'monthly' (1st & 15th OR 1st of month)
  - `thresholdMinimum`: number (10 when threshold-based)
  - `thresholdMaximum`: number | null (null = no limit, max 1000)
  - `thresholdCurrency`: string (USD/EUR/GBP)
  - `nextPayoutDate`: Date (calculated based on method)
  - `arrivalWindow`: Date[] (estimated arrival dates)

- `recentPayouts[]` (last 3-5 items)

**Actions:**
- `updateBankAccount()`
- `updatePayoutConfiguration(method, frequency, minimumThreshold, maximumThreshold, currency)`
- `refreshVerificationStatus()`

---

## Summary

**Best Approach:**
- Keep it simple and focused
- Only show essential information
- Make it easy to update
- Link to full settings/verification when needed
- Use platform colors consistently
- Don't overwhelm with details

**Result:**
A clean, actionable banking settings page that sellers can use to manage their payout account without information overload.

