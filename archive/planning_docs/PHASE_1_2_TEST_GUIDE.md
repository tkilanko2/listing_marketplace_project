# Phase 1 & 2 Testing Guide

## 🎯 What We're Testing

1. **Data Creation** - Complex listing saves all rich data
2. **Data Editing** - Both edit modes preserve data
3. **Data Persistence** - Data survives navigation and page changes
4. **Console Validation** - Logs show correct data structures

---

## 🧪 Test Scenarios

### Test 1: Create Complex Listing ✨

**Objective:** Verify all rich data saves correctly

**Steps:**
1. Go to **My Shop** → Click **"Create New Listing"**
2. Fill out **all** fields with complex data:

**Basic Information:**
- Title: "Professional Home Cleaning Service"
- Short Description: "Deep cleaning for your home"
- Detailed Description: Add some text
- Category: "Home Services"

**Availability (Step 2):**
- ⚠️ **IMPORTANT:** Set up CUSTOM schedule
- Select: **MON, WED, FRI** only
- Set different times for each day:
  - Monday: 09:00 - 12:00
  - Wednesday: 13:00 - 17:00  
  - Friday: 09:00 - 15:00
- Try clicking **"Specific Date Range"** tab
- Add a date range if you want

**Pricing (Step 3):**
- Choose **"Tiered Pricing"**
- Set up 2-3 tiers with different prices
- Fill in descriptions for each tier

3. **Click "Submit Listing"**

**Expected Console Output:**
```
=== PHASE 1 & 2 DATA VALIDATION ===
Mode: CREATE
Listing ID: service-xxxxx
Availability (should be object): {
  "type": "custom",
  "scheduleType": "weekly",
  "customSchedule": {
    "monday": true,
    "tuesday": false,
    "wednesday": true,
    ...
    "timeRanges": [
      {"startTime": "09:00", "endTime": "12:00", "days": ["monday"]},
      {"startTime": "13:00", "endTime": "17:00", "days": ["wednesday"]},
      ...
    ]
  }
}
Service Delivery Modes (should be array): ["at_seller", "at_buyer", "remote"]
Service Cities (if set): [...]
Pricing Tiers (if tiered): [
  {"id": "1", "name": "Basic", "price": 50, ...},
  {"id": "2", "name": "Standard", "price": 100, ...}
]
===========================
```

**✅ PASS if:**
- `availability` is an **object** (not a string like "Weekdays, 9-5")
- `serviceDeliveryModes` is an **array** 
- `tiers` array contains your tier data

**❌ FAIL if:**
- `availability` is a string
- Any field is undefined or null
- Build errors appear

---

### Test 2: Traditional Edit (Data Preservation) 🔧

**Objective:** Verify editing basic fields doesn't lose complex data

**Steps:**
1. Go to **My Shop**
2. Find the listing you just created
3. Click **⋮** → **"Edit"**
4. Go to **"Availability & Service"** tab
   - ✅ Verify your schedule shows correctly (MON, WED, FRI selected)
   - ✅ Verify time ranges display
   - Try modifying the schedule (add a day, change time)
   - Try changing duration to 90 minutes
5. Go to **"Basic Details"** tab
   - Change the name to "Professional Home Cleaning - EDITED"
6. Click **"Save Changes"** (bottom right)

**Expected Console Output:**
```
Listing updated via Edit page: service-xxxxx
Updated availability: {
  "type": "custom",
  "scheduleType": "weekly",
  "customSchedule": {
    ...your updated schedule...
  }
}
```

**✅ PASS if:**
- Name changed to "...EDITED"
- Availability changes saved
- Duration updated to 90
- Tiers still exist (not lost)

**❌ FAIL if:**
- Availability becomes a string
- Tiers disappear
- Service delivery modes reset

---

### Test 3: Quick Edit (Full Editing) ⚡

**Objective:** Verify comprehensive edit mode works

**Steps:**
1. Go to **My Shop**
2. Find the same listing
3. Click **⋮** → **"Quick Edit"**
4. **Verify all fields pre-populate:**
   - Step 1: Name, description should show
   - Step 2: Your custom schedule should be loaded
   - Step 3: Your tiers should appear
5. Make changes:
   - Add another tier
   - Change availability (add Saturday)
   - Modify a tier price
6. Look for button text: Should say **"Save Changes"** (not "Submit Listing")
7. Click **"Save Changes"**

**Expected Console Output:**
```
=== PHASE 1 & 2 DATA VALIDATION ===
Mode: EDIT
Listing ID: service-xxxxx (same as before)
Availability (should be object): {
  ...your updated schedule with Saturday added...
}
Pricing Tiers (if tiered): [
  ...your updated tiers...
]
===========================
```

**✅ PASS if:**
- All fields pre-populated correctly
- Button says "Save Changes"
- Success dialog says "Listing Updated Successfully"
- Changes saved
- Data still rich objects/arrays

**❌ FAIL if:**
- Fields are empty
- Button says "Submit Listing"
- New listing created instead of updating
- Data becomes strings

---

### Test 4: Edit → View → Edit Cycle 🔄

**Objective:** Verify data persists across multiple edits

**Steps:**
1. Edit listing with **Traditional Edit**
2. Save
3. Go back to **My Shop**
4. Open same listing with **Quick Edit**
5. Verify all changes from step 1 are there
6. Make new changes
7. Save
8. Open with **Traditional Edit** again
9. Go to Availability tab
10. Verify all changes from step 6 are there

**✅ PASS if:**
- Data survives multiple edit cycles
- Both edit modes see the same data
- No degradation (objects don't become strings)

**❌ FAIL if:**
- Data lost between edits
- Different edit modes show different data

---

## 📋 Quick Checklist

Use this while testing:

**Data Creation:**
- [ ] Complex availability schedule saved as object
- [ ] Service delivery modes saved as array
- [ ] Pricing tiers saved with all details
- [ ] Console shows rich data structures

**Traditional Edit:**
- [ ] Pre-populates basic fields
- [ ] Availability tab shows schedule
- [ ] Can modify availability
- [ ] Saves without losing tier data
- [ ] CTAs at bottom right
- [ ] Purple checkboxes and buttons

**Quick Edit:**
- [ ] Pre-populates ALL fields (all steps)
- [ ] Button says "Save Changes"
- [ ] Success dialog says "Updated"
- [ ] Saves all modifications
- [ ] No new listing created

**Design:**
- [ ] All inputs purple focus ring
- [ ] All checkboxes/radios purple
- [ ] Save button purple
- [ ] Compact spacing throughout
- [ ] Calendar icons grouped together

---

## 🔍 How to Check Console Logs

1. **Open Browser DevTools:**
   - Mac: `Cmd + Option + I`
   - Windows: `F12`

2. **Go to Console tab**

3. **Look for sections:**
   ```
   === PHASE 1 & 2 DATA VALIDATION ===
   ```

4. **Click to expand objects** - verify they're not strings

---

## 📸 What to Share

After testing, please share:

1. **Console output** from creating a listing
2. **Console output** from editing (both modes)
3. **Any errors** you see
4. **Screenshots** if something looks wrong

Or just tell me:
- ✅ "Everything works!" 
- ❌ "Issue with [specific thing]"

---

## Expected Results Summary

| Test | Expected Result |
|------|-----------------|
| **Create Listing** | Rich objects in console |
| **Traditional Edit** | Basic fields editable, complex data preserved |
| **Quick Edit** | Full fields editable, "Save Changes" button |
| **Multiple Edits** | Data survives all cycles |
| **Design** | Purple accents, compact layout |

---

**Ready to test!** Your dev server should be running on **http://localhost:5173**

Let me know what you find! 🧪

