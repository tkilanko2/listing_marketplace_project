# Work In Progress - Listing Data Alignment

## Current Focus: Issue #1 - Field Naming & Data Alignment

### Status: ✅ PHASE 1 COMPLETE - DATA LAYER FIXED

---

## Summary of Findings

### ✅ What's Already Working:
1. **ServiceListingForm → Service Interface mapping is CORRECT**
   - `title` → `name` ✅
   - `detailedDescription` → `longDescription` ✅
   - Submission code (lines 585-641) properly maps fields

2. **Display pages use correct fields**
   - All booking detail pages use `service.name` ✅
   - My Shop uses `item.name` ✅
   - No display issues found ✅

---

## 🚨 Critical Issues Found

### Priority 1: Data Loss on Creation
1. **Service Delivery Modes** - Form captures but saves to DEPRECATED `serviceMode` field instead of new `serviceDeliveryModes` array
2. **Availability Data** - Rich schedule converted to simple string (loses time ranges, date ranges)
3. **Service Coverage** - `serviceCities` array captured but NOT saved (no field in interface)
4. **Duration** - Not captured in form, hardcoded to 60 minutes

### Priority 2: Edit Functionality Broken
5. **EditListingPage** - Only edits 5 basic fields, LOSES all complex data:
   - ❌ Pricing tiers
   - ❌ Availability schedules
   - ❌ Service coverage
   - ❌ Payment options
6. **No Reverse Mapping** - ServiceListingForm can't load existing listings for editing

### Priority 3: Interface Gaps
7. **Service Interface incomplete** - Missing fields that form captures:
   - `serviceCities` array
   - Rich `availability` object structure
8. **Deprecated field in use** - `serviceMode` instead of `serviceDeliveryModes`

---

## 📊 Detailed Analysis

**See**: `LISTING_DATA_ALIGNMENT_ANALYSIS.md` for complete field-by-field breakdown, including:
- Data structure reference
- Component-by-component field usage
- Alignment matrix showing all mismatches
- Recommended fixes with code examples

---

## 🎯 Action Plan

### Phase 1: Fix Core Data Alignment ✅ COMPLETE
- [x] Update Service interface to support rich data structures
- [x] Fix ServiceListingForm submission to save all captured data
- [x] Save rich availability object (not string)
- [x] Save serviceCities coverage data
- [x] Save pricing tiers properly
- [x] Switch from `serviceMode` to `serviceDeliveryModes`
- [x] Create backward compatibility helper functions
- [ ] Add duration field to form (DEFERRED - requires UI changes)

### Phase 2: Enable Edit Functionality
- [ ] Add `existingListing` prop to ServiceListingForm
- [ ] Implement reverse field mapping (name → title, etc.)
- [ ] Replace EditListingPage with ServiceListingForm for editing
- [ ] Test full create → edit → save flow

### Phase 3: Display Enhancements
- [ ] Show service delivery modes in booking pages
- [ ] Display availability schedules
- [ ] Show payment options in booking flow
- [ ] Add tier selection UI

---

## 🔍 Testing Checklist

Once fixes are implemented:
- [ ] Create new service listing with all fields populated
- [ ] Verify all data saves to mockServices correctly
- [ ] Book the service and check booking details display
- [ ] Edit the listing and verify no data loss
- [ ] Check seller booking details page shows correct info
- [ ] Verify Top Performing Listings navigation works

---

## Notes
- Main field mapping is already correct (no changes needed there)
- Focus is on saving ALL form data and enabling proper editing
- Two separate edit implementations found (basic + form-based)
- Booking display pages are solid, just missing some new fields

---

**Last Updated**: Current Session
**Status**: Ready to implement Phase 1 fixes
