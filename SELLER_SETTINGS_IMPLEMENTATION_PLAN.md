# Seller Settings Implementation Plan

## Based on User Feedback

### Key Decisions:
✅ Main Settings page has 2FA (don't duplicate)
✅ Business Hours editable in My Shop page (not in Settings)
✅ Notifications: Email + In-App only
❌ Communication section: Not required
✅ Keep simple and not overwhelming

---

## Final Seller Settings Structure

```
SELLER SETTINGS PAGE

1. 🔔 Notifications
   ├── Email Notifications (with toggles)
   └── In-App Notifications (with toggles)
   
2. ⚙️ Operational Preferences
   └── Auto-Confirm Bookings (keep as-is)
   
3. 📋 Policies & Terms
   └── Cancellation Policy (link to SellerPolicyPage)
   
4. 💳 Payment & Banking
   ├── Bank Account [Modify] → Banking Settings
   ├── Payout Schedule [Change] → Finance Page
   └── Tax Information [Complete] → Banking Settings
   
5. 🏢 Business Profile & Verification ⭐ KEEP
   ├── Business Information (Business details, tax info, legal structure)
   ├── Business Address
   └── KYC/KYB Verification (Identity & Business verification)
   
6. 🔗 Integrations
   └── Calendar Sync (Google Calendar) - Connected ✓
   
7. 🔒 Privacy & Visibility
   ├── Profile Visibility Settings
   └── Contact Preferences
```

**Note:** Business Hours moved to My Shop → Shop Information (make editable)

---

## Implementation Tasks

### PHASE 1: Cleanup & Fixes

#### Task 1.1: Remove Unnecessary Sections
**Files to modify:** `src/App.tsx` (SellerDashboardSettings component)

**Remove:**
- ❌ Auto-Confirm Orders toggle (lines ~3564-3577)
- ❌ AI Features integration (lines ~3686-3702)
- ❌ Shipping integration (lines ~3722-3738)
- ❌ Accounting integration (lines ~3740-3757)

**Keep:**
- ✅ Auto-Confirm Bookings toggle
- ✅ Business Profile card (lines ~3605-3638) ⭐ REQUIRED FOR KYB
- ✅ KYC Verification card (lines ~3640-3673) ⭐ REQUIRED FOR COMPLIANCE
- ✅ Calendar integration card
- ✅ Payment & Payouts section

**Update:**
- 🔧 Business Profile: Make CTAs functional (remove "Coming Soon" alerts)
- 🔧 KYC Verification: Make CTAs functional (remove "Coming Soon" alerts)

---

#### Task 1.2: Fix Payment & Banking CTAs
**Current state:** Buttons show alerts "Coming Soon"
**New behavior:**

```typescript
// Bank Account - Modify button
onClick={() => handleNavigate('bankingSettings')}

// Payout Schedule - Change button  
onClick={() => handleNavigate('sellerDashboard_finance')} 
// Note: Finance page should auto-scroll to Banking tab

// Tax Information - Complete button
onClick={() => handleNavigate('bankingSettings')}
```

---

### PHASE 1.3: Make Business Profile & KYC Functional

**Current state:** Shows status badges but CTAs say "Coming Soon"

**Business Profile Card:**
```typescript
// Current sections with status:
1. Business Information (Status: Incomplete)
   - Company name, business type (LLC, Corp, Sole Proprietor)
   - Tax ID (EIN/SSN)
   - Legal structure details
   
2. Business Address (Status: Complete ✓)
   - Physical business location
   - Mailing address if different
```

**What CTAs should do:**
```typescript
// "Manage Profile" button
onClick={() => {
  // Option A: Navigate to dedicated Business Profile page
  handleNavigate('businessProfile');
  
  // Option B: Open modal with form
  setShowBusinessProfileModal(true);
}}
```

**KYC Verification Card:**
```typescript
// Current sections with status:
1. Identity Verification (Status: Verified ✓)
   - Government-issued ID uploaded
   - Identity confirmed
   
2. Business Verification (Status: Pending ⏳)
   - Business license
   - Articles of incorporation
   - Operating agreement
```

**What CTAs should do:**
```typescript
// "Complete Verification" button
onClick={() => {
  // Option A: Navigate to KYC flow page
  handleNavigate('kycVerification');
  
  // Option B: Open modal with document upload
  setShowKYCModal(true);
}}
```

**Questions for Implementation:**
1. Should Business Profile & KYC be:
   - **A.** Full separate pages with multi-step forms?
   - **B.** Modal overlays with simple forms?
   - **C.** Just link to external KYC service (Stripe, Plaid, etc.)?

2. What's the KYC/KYB verification process flow?
   - Document upload → Manual review → Status update?
   - API integration with verification service?
   - For now, just UI mockup?

3. Is Business Profile separate from the Shop Information in My Shop?
   - Shop Info = Public-facing store details
   - Business Profile = Private legal/tax entity details?

**For MVP, we could:**
- Keep status indicators as-is
- Make buttons open modal saying "Upload documents via email: kyc@platform.com"
- Or create simple upload form UI (non-functional for now)

---

### PHASE 2: Add Notifications Section (PRIORITY 1)

#### Design Concept: Simple & Not Overwhelming

```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notifications                                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Control how you receive updates about your business │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Email Notifications                             │ │
│ │                                                 │ │
│ │ [ ] New Orders                                  │ │
│ │     Get notified when customers place orders   │ │
│ │                                                 │ │
│ │ [ ] New Bookings                                │ │
│ │     Get notified when customers book services  │ │
│ │                                                 │ │
│ │ [ ] Customer Messages                           │ │
│ │     Get notified about new messages            │ │
│ │                                                 │ │
│ │ [ ] Reviews                                     │ │
│ │     Get notified when customers leave reviews  │ │
│ │                                                 │ │
│ │ [ ] Payment Received                            │ │
│ │     Get notified when payments are processed   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ In-App Notifications                            │ │
│ │                                                 │ │
│ │ [ ] Order Updates                               │ │
│ │     Show notifications in dashboard            │ │
│ │                                                 │ │
│ │ [ ] Booking Updates                             │ │
│ │     Show notifications in dashboard            │ │
│ │                                                 │ │
│ │ [ ] Messages                                    │ │
│ │     Show notification badge for unread messages│ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ 💡 Tip: Keep all notifications enabled to stay     │
│    responsive to your customers                     │
└─────────────────────────────────────────────────────┘
```

**Implementation:**
- Simple toggle switches
- Two subsections: Email vs In-App
- Brief description under each toggle
- All toggles default to ON
- Store in mock state for now (add to mockData or App state)

**Notification Types:**
1. **Email Notifications:**
   - New Orders
   - New Bookings
   - Customer Messages
   - Reviews
   - Payment Received

2. **In-App Notifications:**
   - Order Updates (show badge/alert in Orders section)
   - Booking Updates (show badge/alert in Bookings section)
   - Messages (show unread count badge)

---

### PHASE 3: Add Privacy & Visibility Section

#### Design Concept:

```
┌─────────────────────────────────────────────────────┐
│ 🔒 Privacy & Visibility                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Profile Visibility                              │ │
│ │                                                 │ │
│ │ ⚪ Show Full Name                               │ │
│ │ ⚫ Show Display Name Only                       │ │
│ │                                                 │ │
│ │ [ ] Show Phone Number on Profile                │ │
│ │ [ ] Show Email Address on Profile               │ │
│ │ [ ] Show Business Address                       │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Contact Preferences                             │ │
│ │                                                 │ │
│ │ Who can send you messages:                      │ │
│ │ [Dropdown: Anyone / Buyers Only / No One]       │ │
│ │                                                 │ │
│ │ [ ] Display "Online Now" Status                 │ │
│ │     Show when you're actively using the platform│ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Settings:**
1. **Profile Visibility:**
   - Radio: Full Name vs Display Name
   - Toggle: Show phone number
   - Toggle: Show email
   - Toggle: Show business address

2. **Contact Preferences:**
   - Dropdown: Who can message (Anyone/Buyers Only/No One)
   - Toggle: Display online status

---

### PHASE 4: Make My Shop → Shop Information Editable

**Current state:** Shop Information section is read-only with "Edit Shop" button that does nothing

**What to make editable:**

```
Shop Information (Editable Fields):
├── Shop Name (text input)
├── Shop Description (textarea)
├── Location (text input or dropdown)
├── Specialization Tags (multi-select chips)
├── Business Hours (time picker for each day)
│   ├── Monday: [9:00 AM] to [5:00 PM] [✓ Closed]
│   ├── Tuesday: [9:00 AM] to [5:00 PM] [✓ Closed]
│   └── ... (for each day)
├── Response Rate (read-only, calculated)
└── Member Since (read-only, from account data)
```

**Implementation:**
- Click "Edit Shop" → Opens inline editor or modal
- Form with all editable fields
- Save/Cancel buttons
- Update mockData or App state
- Show success message on save

---

## Question 1: Business Hours in Settings or My Shop?

**Your feedback suggests:** Make it editable in My Shop, not Settings

**My recommendation:** ✅ **Only in My Shop**

**Rationale:**
- Shop Information is the natural place for business hours
- Avoids duplication and confusion
- Settings should be for preferences/toggles, not business details
- Keeps Settings page focused and less cluttered

**However, if you want quick access from Settings:**
We could add a link/shortcut in Settings that says:
```
⏰ Business Hours & Availability
   Managed in Shop Information → [Edit Shop Info]
```

**What do you prefer?**
A. Business Hours only in My Shop (recommended)
B. Add link/shortcut in Settings to My Shop
C. Full editor in both places

---

## Question 2: Availability Settings Display

You asked: "Availability settings (how will this be displayed?)"

### Option A: In My Shop → Business Hours Editor (Recommended)

```
┌─────────────────────────────────────────────────────┐
│ Business Hours & Availability                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Regular Business Hours:                             │
│                                                      │
│ Monday    [9:00 AM ▼] to [5:00 PM ▼]  [ ] Closed   │
│ Tuesday   [9:00 AM ▼] to [5:00 PM ▼]  [ ] Closed   │
│ Wednesday [9:00 AM ▼] to [5:00 PM ▼]  [ ] Closed   │
│ Thursday  [9:00 AM ▼] to [5:00 PM ▼]  [ ] Closed   │
│ Friday    [9:00 AM ▼] to [5:00 PM ▼]  [ ] Closed   │
│ Saturday  [10:00 AM ▼] to [3:00 PM ▼] [ ] Closed   │
│ Sunday    [ Closed ✓ ]                              │
│                                                      │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ Booking Preferences (For Services):                 │
│                                                      │
│ Lead Time Required:                                 │
│ [24 hours ▼] (Customers must book X hours ahead)   │
│                                                      │
│ Maximum Advance Booking:                            │
│ [90 days ▼] (Customers can book up to X days ahead)│
│                                                      │
│ Buffer Between Bookings:                            │
│ [15 minutes ▼] (Break time between appointments)   │
│                                                      │
│ [ ] Allow Same-Day Bookings                         │
│                                                      │
│ ─────────────────────────────────────────────────── │
│                                                      │
│ Special Closures:                                   │
│                                                      │
│ [ ] Vacation Mode (Pause all bookings)             │
│                                                      │
│ Custom Closed Dates:                                │
│ + Add Holiday / Closed Date                         │
│   [Dec 25, 2024] - Christmas Day        [Remove]   │
│   [Jan 1, 2025] - New Year's Day        [Remove]   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Option B: Separate Availability Modal/Page

Create a dedicated "Manage Availability" page/modal with tabs:
- Tab 1: Business Hours
- Tab 2: Booking Rules
- Tab 3: Closed Dates

**Which display approach do you prefer?**

---

## Question 3: In-App Notifications Display

You want "something easy to follow not too overwhelming"

### Proposed Implementation:

**In the Navbar (where notification bell would be):**
```
[🔔 3]  ← Badge with count
```

**Click bell → Dropdown shows:**
```
┌─────────────────────────────────────────┐
│ Notifications                    Mark all read │
├─────────────────────────────────────────┤
│                                          │
│ 🛒 New Order #ORD-1234                  │
│    Customer ordered Premium Service     │
│    2 minutes ago                         │
│                                          │
│ 📅 New Booking for Hair Styling         │
│    Tomorrow at 2:00 PM                   │
│    15 minutes ago                        │
│                                          │
│ 💬 New Message from Sarah                │
│    "Is this still available?"            │
│    1 hour ago                            │
│                                          │
├─────────────────────────────────────────┤
│ View All Notifications →                 │
└─────────────────────────────────────────┘
```

**Notification Badge on Sidebar Menu Items:**
```
Sidebar:
  📊 Overview
  🏪 My Shop
  📦 Orders [2]  ← Badge shows 2 new orders
  📅 Bookings [1]  ← Badge shows 1 new booking
  💰 Finance
  ⚙️ Settings
```

**Keep it simple:**
- Badge count on bell icon
- Badge count on relevant sidebar items
- Simple dropdown list
- No complex categories or filtering (to start)
- Mark as read when clicked
- "View All" link to dedicated notifications page (if needed later)

**Does this approach work for you?**

---

## Implementation Timeline

### Week 1: Cleanup & Foundation
- [ ] Remove unnecessary Settings sections (AI, Shipping, Accounting integrations)
- [ ] Remove Auto-Confirm Orders toggle
- [ ] Fix Payment & Banking CTAs to link to Finance/Banking pages
- [ ] Keep and update Business Profile & KYC sections (make CTAs functional)
- [ ] Test navigation flow

### Week 2: Notifications
- [ ] Design Notifications section UI
- [ ] Add Email Notifications toggles (5 types)
- [ ] Add In-App Notifications toggles (3 types)
- [ ] Store preferences in mockData
- [ ] Add visual feedback (save confirmation)

### Week 3: Privacy & Editable Shop Info
- [ ] Add Privacy & Visibility section in Settings
- [ ] Make My Shop → Shop Information editable
- [ ] Add Business Hours time pickers
- [ ] Add Booking Preferences (if applicable)
- [ ] Add Save/Cancel functionality

### Week 4: Polish & Testing
- [ ] Add validation and error handling
- [ ] Test all navigation flows
- [ ] Ensure consistent styling with design system
- [ ] Add loading states where needed

---

## My Questions for You:

### 0. **KYC/KYB Implementation** ⭐ NEW QUESTION

Since these sections are required, I need to know:

**A. What should happen when seller clicks "Manage Profile" or "Complete Verification"?**
   - Option 1: Open a modal with forms/upload
   - Option 2: Navigate to dedicated pages (BusinessProfilePage, KYCVerificationPage)
   - Option 3: Just show "Contact support" message for now
   - Option 4: Link to external verification service

**B. What's the scope for MVP?**
   - Full functional verification flow with document upload?
   - Just UI mockup with status indicators?
   - Integration with 3rd party (Stripe Identity, Persona, etc.)?

**C. Is Business Profile different from Shop Information?**
   - Business Profile = Legal entity details (EIN, business structure) - PRIVATE
   - Shop Information (in My Shop) = Public storefront details - PUBLIC
   - Should these be separate or combined?

**D. What documents/info are needed for KYC/KYB?**
   - Personal: Government ID, SSN, Address proof
   - Business: EIN, Business license, Articles of incorporation
   - Bank verification documents?

**My recommendation for MVP:**
- Keep status badges as-is (shows verification state)
- Make buttons functional to navigate to placeholder pages
- Show "Verification in progress" or "Submit via email" message
- Build full verification flow in Phase 2

---

1. **Business Hours Location:**
   - A. Only in My Shop (clean, recommended) ✓
   - B. Link in Settings pointing to My Shop
   - C. Full editor in both places

2. **Availability Display:**
   - A. Single long form in My Shop editor (easier)
   - B. Separate modal/page with tabs (more organized)
   - C. Just basic business hours, skip advanced booking rules for now

3. **In-App Notifications:**
   - Does the bell icon + dropdown + sidebar badges approach work?
   - Should we build a full "Notifications Page" or just the dropdown?

4. **Privacy Settings:**
   - Are the proposed visibility/contact settings sufficient?
   - Any other privacy controls needed?

5. **Priority:**
   - Should I start with Phase 1 (cleanup) immediately?
   - Do you want to see mockups/designs first?

Let me know your preferences and I'll proceed with implementation! 🚀

