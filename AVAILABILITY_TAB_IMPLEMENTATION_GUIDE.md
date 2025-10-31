# Availability Tab Implementation - In Progress

## Status
Working on replacing the "Attributes" tab with an editable "Availability & Service" tab in the Traditional Edit page.

## What's Been Completed ✅
1. ✅ Tab renamed from "Attributes" to "Availability & Service"
2. ✅ Removed duplicate standalone "Availability" tab
3. ✅ Updated formData state to include:
   - `availability` (rich object with weekly/date range schedules)
   - `serviceDeliveryModes` (array)
   - `serviceCities` (array)
   - `duration` (number)
4. ✅ Updated `handleSave()` to save all availability data
5. ✅ Updated button text in Quick Edit:
   - "Save Changes" in edit mode
   - "Submit Listing" in create mode
6. ✅ Updated dialog messages in Quick Edit

## What's Needed ⏳

### Complete Availability Tab UI
The tab should have (matching the image sent):

####  1. Weekly Schedule Section
- **Day Selection Buttons** (MON-SUN)
  - Purple buttons when selected  
  - Gray outline when not selected
  - Connected to `formData.availability.customSchedule[day]`
  
- **Time Range Inputs** (for each selected day)
  - "From" time input
  - "To" time input
  - Delete button (trash icon)
  - Add button (plus icon) for additional time slots
  - Connected to `formData.availability.customSchedule.timeRanges[]`

#### 2. Date Range Section
- Tab to switch between "WEEKLY SCHEDULE" and "SPECIFIC DATE RANGE"
- Date range cards with:
  - Start date picker
  - End date picker
  - Time slots (same as weekly)
  - Delete date range button

####  3. Service Attributes Section
Below availability, add:

- **Service Delivery Modes**
  - Checkboxes for: At Seller Location, At Buyer Location, Remote
  - Connected to `formData.serviceDeliveryModes[]`

- **Duration**
  - Number input + dropdown (Minutes/Hours/Days)
  - Connected to `formData.duration`

- **Service Type** (optional)
  - Dropdown: One-time, Recurring, Subscription

## Implementation Approach

Due to complexity, the availability tab should:
1. Reuse UI patterns from ServiceListingForm but simplified for Traditional Edit
2. Use standard Tailwind CSS (no MUI since Traditional Edit doesn't use it)
3. Connect all inputs to formData state
4. Save everything when "Save Changes" is clicked

## Key Code Sections

### FormData State (Already Added)
```typescript
const [formData, setFormData] = useState({
  // ... existing fields
  availability: {
    type: 'weekdays',
    scheduleType: 'weekly',
    customSchedule: {
      monday: true,
      // ... other days
      timeRanges: [{ startTime: '09:00', endTime: '17:00', days: [...] }]
    },
    dateRanges: []
  },
  serviceDeliveryModes: ['at_seller', 'at_buyer', 'remote'],
  serviceCities: [],
  duration: 60
});
```

### handleSave (Already Updated)
```typescript
const updatedListing = {
  ...mockServices[listingIndex],
  // ... basic fields
  availability: formData.availability,
  serviceDeliveryModes: formData.serviceDeliveryModes,
  serviceCities: formData.serviceCities,
  duration: formData.duration,
};
```

## Next Steps

1. Complete the availability tab UI replacement
2. Add helper functions for managing time slots
3. Test day selection toggle
4. Test time range add/remove
5. Test save functionality
6. Verify data persists correctly

## Files Being Modified
- `src/App.tsx` - Traditional Edit Page (EditListingPage component)

## Related
- ServiceListingForm.tsx (lines 1200-1523) - Reference for availability UI
- Image sent by user - Shows desired UI layout

