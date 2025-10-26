# View Booking Navigation Fix

## Problem
Clicking "View Booking" in Finance 2 transaction modal did nothing.

## Root Cause
Finance 2 was calling `handleViewSellerBookingDetails()` which doesn't exist in App.tsx.
The correct function is `handleSellerBookingDetails()`.

## Fix Applied
Changed in `App.tsx` line 3551:
```typescript
// Before:
handleViewSellerBookingDetails(bookingId);  // ❌ Function doesn't exist

// After:
handleSellerBookingDetails(bookingId);      // ✅ Correct function name
```

## What the Handler Does
```typescript
const handleSellerBookingDetails = (bookingId: string) => {
  // 1. Find booking from all orders
  const allBookings = getAllOrdersWithBookings();
  const booking = allBookings.find(o => o.id === bookingId && o.type === 'service');
  
  // 2. Set as selected booking
  setSelectedSellerBooking(bookingWithCustomer);
  
  // 3. Navigate to booking details page
  setCurrentPage('sellerBookingDetails');
};
```

## Test
1. Go to Finance 2 (Alt) page
2. Click any transaction's "Details" button
3. In modal, click "View Booking" button
4. Should navigate to Seller Booking Details page
5. Console should show:
   - "🔵 Finance 2: View booking clicked with ID: BKG-CS-XXX"
   - "🔍 handleSellerBookingDetails called with bookingId: BKG-CS-XXX"
   - "📋 All available bookings: [...]"
   - "🎯 Found booking: {...}"

## Status
✅ Fixed - Navigation should now work correctly

