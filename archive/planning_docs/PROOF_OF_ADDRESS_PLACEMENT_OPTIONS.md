# Proof of Address Indicator & CTA - Placement Options

## Current Seller Settings Page Structure

The Seller Settings page currently has these sections:

1. **Account Management** (2 cards: Auto-Confirm Bookings, Global Seller Policy)
2. **Shop Information & Verification** (3 cards: Shop Information, KYC Verification, KYB Verification)
3. **Payment & Payouts** (3 cards: Bank Account, Payout Schedule, Tax Information)
4. **Integrations & Notifications** (3 cards: Notifications, Calendar, AI Features)

---

## Placement Options for Proof of Address

### **Option 1: Within KYC Verification Card** ⭐ RECOMMENDED
**Location:** Inside the existing KYC Verification card, as a second verification item

**Pros:**
- ✅ Logically grouped with identity verification (KYC typically requires both ID and proof of address)
- ✅ Keeps verification items together
- ✅ No layout changes needed
- ✅ Follows standard KYC flow (ID → Address → Complete)

**Cons:**
- ⚠️ Card might become slightly taller
- ⚠️ Less prominent if user has already completed ID verification

**Visual Structure:**
```
┌─────────────────────────────────────┐
│ KYC Verification                    │
├─────────────────────────────────────┤
│ Identity Verification               │
│ [Status Badge] [Verify Button]      │
│                                     │
│ ─────────────────────────────────  │
│                                     │
│ Proof of Address                    │
│ [Status Badge] [Upload Button]      │
└─────────────────────────────────────┘
```

**Implementation:**
- Add a second item in the `space-y-4` div within KYC card
- Show status badge (Not Started / Pending / Verified)
- Show CTA button when not verified
- Can use same styling pattern as Identity Verification

---

### **Option 2: Within KYB Verification Card**
**Location:** Inside the existing KYB Verification card

**Pros:**
- ✅ Business address verification is part of KYB
- ✅ Makes sense for business entities
- ✅ Keeps business verification items together

**Cons:**
- ⚠️ Not ideal for individual sellers (KYC only)
- ⚠️ Less visible if KYB is already complete
- ⚠️ Confusing if seller only needs KYC

**Best For:** Business entities that need KYB verification

---

### **Option 3: Separate Card in Verification Section**
**Location:** Add a 4th card to the "Shop Information & Verification" grid

**Pros:**
- ✅ Very prominent and visible
- ✅ Clear separation of concerns
- ✅ Easy to track status independently
- ✅ Can be highlighted if incomplete

**Cons:**
- ⚠️ Changes grid layout (3 columns → 4 columns, might need responsive adjustment)
- ⚠️ Takes up more space
- ⚠️ Might feel redundant if part of KYC

**Visual Structure:**
```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Shop     │ │ KYC      │ │ KYB      │ │ Address  │
│ Info     │ │ Verify   │ │ Verify   │ │ Verify   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Implementation:**
- Change grid from `md:grid-cols-3` to `md:grid-cols-4` or `md:grid-cols-2 lg:grid-cols-4`
- Add new card with same styling as KYC/KYB cards
- Use MapPin icon for address verification

---

### **Option 4: Within Payment & Payouts Section**
**Location:** Add as a 4th card in Payment & Payouts section

**Pros:**
- ✅ Banking often requires proof of address
- ✅ Related to financial verification
- ✅ Makes sense for payout setup

**Cons:**
- ⚠️ Less intuitive (address verification is typically part of KYC, not banking)
- ⚠️ Might be missed if user thinks it's only for banking
- ⚠️ Separated from other verification items

**Best For:** If proof of address is specifically for banking/payout verification only

---

### **Option 5: Top Banner/Alert (Critical Requirement)**
**Location:** Above all sections, as a prominent banner

**Pros:**
- ✅ Maximum visibility
- ✅ Can't be missed
- ✅ Good for critical/compliance requirements
- ✅ Can be dismissed once complete

**Cons:**
- ⚠️ Takes up valuable screen space
- ⚠️ Might feel intrusive
- ⚠️ Should only be used if it's blocking seller activity

**Visual Structure:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ Proof of Address Required               │
│ Complete address verification to continue   │
│ [Upload Proof of Address] [Dismiss]        │
└─────────────────────────────────────────────┘

[Rest of settings page...]
```

**Best For:** If proof of address is a blocker for seller operations

---

### **Option 6: Expand KYC Card to Show Multiple Items**
**Location:** Transform KYC card to show a list of verification requirements

**Pros:**
- ✅ Shows complete KYC checklist
- ✅ Clear progress tracking
- ✅ Professional verification flow
- ✅ Can show overall KYC status

**Cons:**
- ⚠️ Requires more significant UI changes
- ⚠️ Card becomes more complex

**Visual Structure:**
```
┌─────────────────────────────────────┐
│ KYC Verification                    │
├─────────────────────────────────────┤
│ Overall Status: [2/3 Complete]      │
│                                     │
│ ✓ Identity Verification (Complete) │
│ ⏳ Proof of Address (Pending)       │
│   [Upload Document]                 │
│ ○ Phone Verification (Not Started) │
└─────────────────────────────────────┘
```

---

## Recommendation

**Option 1 (Within KYC Card)** is recommended because:
1. ✅ Proof of address is a standard KYC requirement
2. ✅ Keeps verification items logically grouped
3. ✅ Minimal layout changes
4. ✅ Follows industry-standard KYC flow
5. ✅ Easy to implement

**Alternative:** If proof of address is separate from KYC (e.g., for banking only), then **Option 3 (Separate Card)** would be better for visibility.

---

## Implementation Notes

### Status Indicators
- **Not Started**: Red/Pink badge (`bg-[#FFE5ED] text-[#DF678C]`)
- **Pending Review**: Yellow badge (`bg-[#FFF8DD] text-[#DAA520]`)
- **Verified**: Green badge (`bg-[#E8F5E9] text-[#4CAF50]`)

### CTA Button States
- Show button when status is "Not Started" or "Pending"
- Hide button when "Verified"
- Button text: "Upload Proof of Address" or "Verify Address"

### Document Upload
- Should open a modal or navigate to upload page
- Accept common formats: PDF, JPG, PNG
- Show upload progress and confirmation

---

## Questions to Consider

1. **Is proof of address part of KYC or separate?**
   - If part of KYC → Option 1
   - If separate → Option 3

2. **Is it a blocker for seller operations?**
   - If yes → Option 5 (Banner)
   - If no → Options 1, 3, or 6

3. **Is it required for all sellers or only certain types?**
   - All sellers → More prominent placement
   - Certain types → Can be in specific section

4. **What's the verification flow?**
   - Upload → Review → Verify
   - Or external verification link?
