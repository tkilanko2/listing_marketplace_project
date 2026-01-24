# Seller Settings - Final Implementation Plan

## Summary of Requirements

Based on your feedback:
1. ✅ **Shop Profile** = My Shop Information (already editable in My Shop page)
2. ✅ **KYB** = Business information form (at end of listing submission)
3. ✅ **KYC** = External verification via `https://verify.expats.com` (QR code on mobile, new tab on PC)
4. ✅ Keep current layout as much as possible
5. ✅ Remove irrelevant sections only
6. ✅ Keep KYC and KYB sections as-is
7. ✅ Make Payment & Payouts CTAs functional

---

## Final Seller Settings Structure

```
SELLER SETTINGS PAGE

┌─────────────────────────────────────────────────────┐
│ SECTION 1: Account Management                       │
├─────────────────────────────────────────────────────┤
│ ✅ Auto-Confirm Bookings (toggle) - KEEP AS-IS      │
│ ✅ Auto-Confirm Orders (toggle) - KEEP AS-IS ⚠️     │
│ ✅ Global Seller Policy - KEEP (View/Configure)     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECTION 2: Business Profile & Verification          │
├─────────────────────────────────────────────────────┤
│ ✅ Business Profile Card - UPDATE CTA               │
│    - Business Information (Incomplete)              │
│    - Business Address (Complete)                    │
│    - [Manage Profile] → Opens KYB form (legal/tax) │
│    Note: Shop info is in My Shop page (separate)   │
│                                                      │
│ ✅ KYC Verification Card - UPDATE CTA               │
│    - Identity: Not Started → [Verify Now]          │
│    - After redirect → Status: Pending               │
│    - Once approved → Status: Verified ✓             │
│    - Button redirects to verify.expats.com          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECTION 3: Integrations                             │
├─────────────────────────────────────────────────────┤
│ ✅ Calendar (Connected) - KEEP                      │
│ ❌ AI Features - REMOVE                             │
│ ❌ Shipping - REMOVE                                │
│ ❌ Accounting - REMOVE                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECTION 4: Payment & Banking                        │
├─────────────────────────────────────────────────────┤
│ ✅ Bank Account - KEEP, UPDATE CTA                  │
│    [Modify] → navigate('bankingSettings')          │
│ ✅ Payout Schedule - KEEP, UPDATE CTA               │
│    [Change] → navigate('sellerDashboard_finance')  │
│ ✅ Tax Information - KEEP, UPDATE CTA               │
│    [Complete] → navigate('bankingSettings')        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECTION 5: NEW - Notifications ⭐                   │
├─────────────────────────────────────────────────────┤
│ Email Notifications (5 toggles)                     │
│ In-App Notifications (3 toggles)                    │
│ Display: Inline in Settings page (not modal)        │
│ Functionality: UI only (auto-save on toggle)        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SECTION 6: NEW - Privacy & Visibility ⭐            │
├─────────────────────────────────────────────────────┤
│ Profile Visibility Settings                         │
│ Contact Preferences                                 │
└─────────────────────────────────────────────────────┘
```

---

## Detailed Implementation Specs

### PHASE 1: Cleanup & Update Existing Sections

#### 1.1 Keep Auto-Confirm Orders (NO CHANGES)
**Location:** `src/App.tsx` line ~3564-3577

**Action:** KEEP AS-IS - User confirmed this is still needed

---

#### 1.2 Remove Integration Cards (AI, Shipping, Accounting)
**Location:** `src/App.tsx` line ~3686-3757

**REMOVE these 3 cards:**
- AI Features (lines ~3686-3702)
- Shipping (lines ~3722-3738)
- Accounting (lines ~3740-3757)

**KEEP:**
- Calendar integration card (lines ~3704-3720)

**Result:** Integrations section will have ONLY Calendar card

---

#### 1.3 Update Business Profile CTA
**Location:** `src/App.tsx` line ~3630-3635

**IMPORTANT CLARIFICATION:**
- **"Manage Profile"** button = KYB form (legal/tax business info)
- **Shop Information** (in My Shop page) = Shop profile, description, hours (separate)

**Current code:**
```typescript
<button
  onClick={() => alert('Manage Business Profile (Coming Soon)')}
  className="w-full text-sm text-white bg-[#3D1560] hover:bg-[#6D26AB] py-2 px-4 rounded-lg transition-colors"
>
  Manage Profile
</button>
```

**NEW code:**
```typescript
<button
  onClick={() => {
    // Open KYB form - business verification (legal/tax info)
    // For now, show modal or navigate to KYB form page
    // This is the BusinessVerificationFlow component
    setShowBusinessVerificationModal(true);
  }}
  className="w-full text-sm text-white bg-[#3D1560] hover:bg-[#6D26AB] py-2 px-4 rounded-lg transition-colors"
>
  Manage Profile
</button>
```

**Additional state needed:**
```typescript
const [showBusinessVerificationModal, setShowBusinessVerificationModal] = useState(false);
```

**Modal component to add:**
```typescript
{/* Business Verification Modal */}
{showBusinessVerificationModal && (
  <VerificationFlowModal
    open={showBusinessVerificationModal}
    onClose={() => setShowBusinessVerificationModal(false)}
    onComplete={() => {
      setShowBusinessVerificationModal(false);
      alert('Business information updated successfully!');
    }}
    verificationType="business"
  />
)}
```

---

#### 1.4 Update KYC Verification CTA
**Location:** `src/App.tsx` line ~3664-3669

**Status Logic:**
- Initial: Status = "Not Started", Button = "Verify Now"
- After clicking: Status changes to "Pending", Button disabled or shows "Pending"
- After approval: Status = "Verified ✓"

**Current code:**
```typescript
<button
  onClick={() => alert('Complete KYC Verification (Coming Soon)')}
  className="w-full text-sm text-white bg-[#3D1560] hover:bg-[#6D26AB] py-2 px-4 rounded-lg transition-colors"
>
  Complete Verification
</button>
```

**NEW code:**
```typescript
{/* Dynamic status display */}
<div className="flex items-center justify-between">
  <div>
    <h3 className="text-md font-medium text-[#383A47]">Identity Verification</h3>
    <p className="text-sm text-[#70727F]">Government-issued ID verification</p>
  </div>
  <span className={`px-2 py-1 text-xs ${
    kycStatus === 'verified' ? 'bg-[#E8F5E9] text-[#4CAF50]' :
    kycStatus === 'pending' ? 'bg-[#FFF8DD] text-[#DAA520]' :
    'bg-[#FFE5ED] text-[#DF678C]'
  } rounded-full`}>
    {kycStatus === 'verified' ? 'Verified ✓' :
     kycStatus === 'pending' ? 'Pending ⏳' :
     'Not Started'}
  </span>
</div>

{/* Button logic */}
<button
  onClick={() => {
    // Check if mobile or desktop
    const isMobile = window.innerWidth < 768;
    
    // Update status to pending immediately
    setKycStatus('pending');
    
    if (isMobile) {
      // Show QR code modal
      setShowKYCQRModal(true);
    } else {
      // Open external verification in new tab
      window.open('https://verify.expats.com', '_blank');
    }
  }}
  disabled={kycStatus === 'verified' || kycStatus === 'pending'}
  className={`w-full text-sm py-2 px-4 rounded-lg transition-colors ${
    kycStatus === 'verified' || kycStatus === 'pending'
      ? 'bg-[#E8E9ED] text-[#70727F] cursor-not-allowed'
      : 'bg-[#3D1560] text-white hover:bg-[#6D26AB]'
  }`}
>
  {kycStatus === 'verified' ? 'Verified' :
   kycStatus === 'pending' ? 'Verification Pending' :
   'Verify Now'}
</button>
```

**Additional state needed in App.tsx:**
```typescript
const [showKYCQRModal, setShowKYCQRModal] = useState(false);
const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'verified'>('not_started');
const [showBusinessVerificationModal, setShowBusinessVerificationModal] = useState(false);
```

**QR Code Modal Component:**
```typescript
// Add this near other modals in App.tsx
{showKYCQRModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
      <h2 className="text-2xl font-bold text-[#1B1C20] mb-4">Scan QR Code</h2>
      <p className="text-[#70727F] mb-6">
        Scan this QR code with your mobile device to complete identity verification
      </p>
      
      {/* QR Code placeholder - in production, generate actual QR code */}
      <div className="bg-[#F8F8FA] border-2 border-[#CDCED8] rounded-lg p-8 mb-6 flex items-center justify-center">
        <div className="w-48 h-48 bg-white border-2 border-[#3D1560] rounded-lg flex items-center justify-center">
          <span className="text-[#3D1560] text-sm text-center">
            QR Code<br />
            https://verify.expats.com
          </span>
        </div>
      </div>
      
      <p className="text-xs text-[#70727F] mb-6">
        Or visit: <a href="https://verify.expats.com" target="_blank" rel="noopener noreferrer" className="text-[#3D1560] underline">https://verify.expats.com</a>
      </p>
      
      <button
        onClick={() => setShowKYCQRModal(false)}
        className="w-full bg-[#3D1560] text-white py-3 px-6 rounded-lg hover:bg-[#6D26AB] transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)}
```

---

#### 1.5 Update Payment & Banking CTAs
**Location:** `src/App.tsx` lines ~3772-3806

**Update all 3 buttons:**

```typescript
// 1. Bank Account - Modify button (line ~3785-3790)
<button 
  onClick={() => handleNavigate('bankingSettings')}
  className="text-xs text-[#3D1560] hover:text-[#6D26AB] font-medium"
>
  Modify
</button>

// 2. Payout Schedule - Change button (line ~3785-3790)
<button 
  onClick={() => handleNavigate('sellerDashboard_finance')}
  className="text-xs text-[#3D1560] hover:text-[#6D26AB] font-medium"
>
  Change
</button>

// 3. Tax Information - Complete button (line ~3798-3803)
<button 
  onClick={() => handleNavigate('bankingSettings')}
  className="text-xs text-[#3D1560] hover:text-[#6D26AB] font-medium"
>
  Complete
</button>
```

**Replace all `alert('... (Coming Soon)')` with actual `handleNavigate()` calls**

---

### PHASE 2: Add Notifications Section

**Location:** After Account Management section, before Business Profile

**Complete code to add:**

```typescript
{/* Notifications Section */}
<div className="bg-white rounded-lg shadow-lg border border-[#E8E9ED]">
  <div className="px-6 py-4 border-b border-[#E8E9ED]">
    <h2 className="text-xl font-semibold text-[#1B1C20] flex items-center">
      <Bell className="h-5 w-5 mr-2 text-[#3D1560]" />
      Notifications
    </h2>
    <p className="text-sm text-[#70727F] mt-1">Control how you receive updates about your business</p>
  </div>
  <div className="p-6">
    {/* Email Notifications */}
    <div className="mb-6">
      <h3 className="text-md font-semibold text-[#383A47] mb-4">Email Notifications</h3>
      <div className="space-y-3">
        {[
          { id: 'email_orders', label: 'New Orders', description: 'Get notified when customers place orders' },
          { id: 'email_bookings', label: 'New Bookings', description: 'Get notified when customers book services' },
          { id: 'email_messages', label: 'Customer Messages', description: 'Get notified about new messages' },
          { id: 'email_reviews', label: 'Reviews', description: 'Get notified when customers leave reviews' },
          { id: 'email_payments', label: 'Payment Received', description: 'Get notified when payments are processed' }
        ].map((notification) => (
          <div key={notification.id} className="flex items-center justify-between p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
            <div>
              <h4 className="text-sm font-medium text-[#383A47]">{notification.label}</h4>
              <p className="text-xs text-[#70727F]">{notification.description}</p>
            </div>
            <label htmlFor={notification.id} className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id={notification.id}
                  defaultChecked 
                  className="sr-only peer" 
                />
                <div className="block bg-[#E8E9ED] w-12 h-6 rounded-full peer-checked:bg-[#3D1560]"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-full"></div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* In-App Notifications */}
    <div className="border-t border-[#E8E9ED] pt-6">
      <h3 className="text-md font-semibold text-[#383A47] mb-4">In-App Notifications</h3>
      <div className="space-y-3">
        {[
          { id: 'app_orders', label: 'Order Updates', description: 'Show notifications in dashboard' },
          { id: 'app_bookings', label: 'Booking Updates', description: 'Show notifications in dashboard' },
          { id: 'app_messages', label: 'Messages', description: 'Show notification badge for unread messages' }
        ].map((notification) => (
          <div key={notification.id} className="flex items-center justify-between p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
            <div>
              <h4 className="text-sm font-medium text-[#383A47]">{notification.label}</h4>
              <p className="text-xs text-[#70727F]">{notification.description}</p>
            </div>
            <label htmlFor={notification.id} className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id={notification.id}
                  defaultChecked 
                  className="sr-only peer" 
                />
                <div className="block bg-[#E8E9ED] w-12 h-6 rounded-full peer-checked:bg-[#3D1560]"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-full"></div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Info Tip */}
    <div className="mt-6 p-4 bg-[#EDD9FF] rounded-lg flex items-start">
      <Info className="h-5 w-5 text-[#3D1560] mr-3 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-[#3D1560]">
        <strong>Tip:</strong> Keep all notifications enabled to stay responsive to your customers and maintain good customer service ratings.
      </p>
    </div>
  </div>
</div>
```

**Note:** Need to add `Bell` and `Info` to imports at top of file

---

### PHASE 3: Add Privacy & Visibility Section

**Location:** After Integrations section, before or after Payment & Banking

**Complete code to add:**

```typescript
{/* Privacy & Visibility Section */}
<div className="bg-white rounded-lg shadow-lg border border-[#E8E9ED]">
  <div className="px-6 py-4 border-b border-[#E8E9ED]">
    <h2 className="text-xl font-semibold text-[#1B1C20] flex items-center">
      <Shield className="h-5 w-5 mr-2 text-[#3D1560]" />
      Privacy & Visibility
    </h2>
    <p className="text-sm text-[#70727F] mt-1">Control what information is visible to customers</p>
  </div>
  <div className="p-6">
    {/* Profile Visibility */}
    <div className="mb-6">
      <h3 className="text-md font-semibold text-[#383A47] mb-4">Profile Visibility</h3>
      
      {/* Display Name vs Full Name */}
      <div className="p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED] mb-3">
        <h4 className="text-sm font-medium text-[#383A47] mb-3">Display Name</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="displayName" 
              value="full" 
              defaultChecked
              className="w-4 h-4 text-[#3D1560] focus:ring-[#3D1560]" 
            />
            <span className="ml-3 text-sm text-[#383A47]">Show Full Name</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="displayName" 
              value="display"
              className="w-4 h-4 text-[#3D1560] focus:ring-[#3D1560]" 
            />
            <span className="ml-3 text-sm text-[#383A47]">Show Display Name Only</span>
          </label>
        </div>
      </div>

      {/* Contact Information Toggles */}
      <div className="space-y-3">
        {[
          { id: 'show_phone', label: 'Show Phone Number on Profile' },
          { id: 'show_email', label: 'Show Email Address on Profile' },
          { id: 'show_address', label: 'Show Business Address' }
        ].map((setting) => (
          <div key={setting.id} className="flex items-center justify-between p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
            <h4 className="text-sm font-medium text-[#383A47]">{setting.label}</h4>
            <label htmlFor={setting.id} className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  id={setting.id}
                  defaultChecked={setting.id === 'show_address'} 
                  className="sr-only peer" 
                />
                <div className="block bg-[#E8E9ED] w-12 h-6 rounded-full peer-checked:bg-[#3D1560]"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-full"></div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Contact Preferences */}
    <div className="border-t border-[#E8E9ED] pt-6">
      <h3 className="text-md font-semibold text-[#383A47] mb-4">Contact Preferences</h3>
      
      {/* Who can message */}
      <div className="p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED] mb-3">
        <h4 className="text-sm font-medium text-[#383A47] mb-3">Who can send you messages</h4>
        <select className="w-full p-2 border border-[#CDCED8] rounded-lg text-sm focus:ring-2 focus:ring-[#EDD9FF] focus:border-[#3D1560]">
          <option value="anyone">Anyone</option>
          <option value="buyers">Buyers Only</option>
          <option value="none">No One</option>
        </select>
      </div>

      {/* Online Status */}
      <div className="flex items-center justify-between p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
        <div>
          <h4 className="text-sm font-medium text-[#383A47]">Display "Online Now" Status</h4>
          <p className="text-xs text-[#70727F]">Show when you're actively using the platform</p>
        </div>
        <label htmlFor="online_status" className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              id="online_status"
              defaultChecked 
              className="sr-only peer" 
            />
            <div className="block bg-[#E8E9ED] w-12 h-6 rounded-full peer-checked:bg-[#3D1560]"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-full"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</div>
```

---

## Implementation Checklist

### Phase 1: Cleanup (Priority: High)
- [ ] Remove Auto-Confirm Orders toggle
- [ ] Remove AI Features integration card
- [ ] Remove Shipping integration card
- [ ] Remove Accounting integration card
- [ ] Keep Calendar integration card only
- [ ] Update Business Profile "Manage Profile" button
- [ ] Update KYC Verification "Complete Verification" button (with mobile QR code support)
- [ ] Add KYC QR code modal state and component
- [ ] Update Payment & Banking 3 CTAs (Modify, Change, Complete)
- [ ] Test all navigation flows

### Phase 2: Add Notifications (Priority: High)
- [ ] Add Bell and Info icons to imports
- [ ] Insert Notifications section after Account Management
- [ ] Add 5 email notification toggles
- [ ] Add 3 in-app notification toggles
- [ ] Add info tip box
- [ ] Test toggle functionality

### Phase 3: Add Privacy (Priority: Medium)
- [ ] Insert Privacy & Visibility section
- [ ] Add Display Name radio buttons
- [ ] Add 3 contact information toggles
- [ ] Add "Who can message" dropdown
- [ ] Add "Online Status" toggle
- [ ] Test all settings

### Phase 4: Polish (Priority: Low)
- [ ] Ensure consistent styling
- [ ] Add save functionality (store settings in state/mockData)
- [ ] Add loading states
- [ ] Add success messages
- [ ] Test responsiveness on mobile

---

## ✅ CONFIRMED Requirements

### Q1: Business Profile "Manage Profile" CTA ✅
**ANSWER:** Opens KYB form (BusinessVerificationFlow modal) - handles legal/tax business information
**Note:** Shop profile/info is managed separately in My Shop page

### Q2: KYC Status Variations ✅
**ANSWER:** Keep simple with 3 states:
- **Not Started** → Button: "Verify Now"
- **Pending** → Button: "Verification Pending" (disabled)
- **Verified** → Button: "Verified" (disabled)

After clicking "Verify Now", immediately change status to "Pending"

### Q3: Notification Settings Storage ✅
**ANSWER:** UI only (no functionality for now), auto-save on toggle
**Display:** Inline in Settings page (not separate page/modal)

### Q4: Save Button ✅
**ANSWER:** Auto-save on every toggle (no explicit save button needed)

### Q5: Seller Policy ✅
**CONFIRM:** Configure and View buttons still exist and work? YES - keep as-is

---

## Files to Modify

1. **src/App.tsx** - Main file with SellerDashboardSettings component
   - Lines ~3535-3811 (entire SellerDashboardSettings section)
   - Add imports: `Bell`, `Info` icons
   - Add state: `showKYCQRModal`
   - Add QR code modal component

---

## Estimated Lines of Code

- **Remove:** ~150 lines (Auto-Confirm Orders, AI/Shipping/Accounting cards)
- **Update:** ~50 lines (CTAs for Business Profile, KYC, Payment & Banking)
- **Add:** ~300 lines (Notifications section, Privacy section, QR modal)
- **Net change:** +200 lines approximately

---

## Ready to Proceed?

Please confirm:
1. ✅ Approach for Business Profile "Manage Profile" button (Q1)?
2. ✅ KYC status variations to handle (Q2)?
3. ✅ Notification settings storage approach (Q3)?
4. ✅ Save button preference (Q4)?

Once you confirm, I'll proceed with implementation! 🚀

