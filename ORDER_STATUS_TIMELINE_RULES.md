# Order Status Timeline - Uniform Rules & Logic

## Overview

The `OrderStatusTimeline` component provides a consistent visual representation of order progress across both product orders and service bookings. This document outlines the uniform rules applied to ensure consistency.

## Color Scheme & Status Mapping

### Status Types
- **`completed`** - Steps that have been successfully finished
- **`current`** - The step currently in progress
- **`future`** - Steps that haven't started yet
- **`skipped`** - Steps that were bypassed due to cancellation or other issues

### Color Rules

| Status | Icon/Border | Background | Text | Connecting Line | Usage |
|--------|-------------|------------|------|-----------------|-------|
| `completed` | Green `#4CAF50` | Light Green `#E8F5E9` | Dark `#1B1C20` | Green `#4CAF50` | Successfully finished steps |
| `current` | Purple `#3D1560` | Light Purple `#EDD9FF` | Purple `#3D1560` | Gray `#CDCED8` | Currently active step |
| `future` | Gray `#70727F` | Light Gray `#F8F8FA` | Gray `#70727F` | Gray `#E8E9ED` | Upcoming steps |
| `skipped` | Pink `#DF678C` | Light Pink `#FFE5ED` | Pink `#DF678C` | Pink `#DF678C` | Cancelled/bypassed steps |

## Timeline Flow Logic

### Product Orders
**Normal Flow**: `pending` → `processing` → `shipped` → `delivered`

#### Status Mapping:
- **First step always completed**: "Order Placed" is always marked as completed
- **Linear progression**: Each status maps to its corresponding step as `current`
- **Previous steps**: All steps before current are marked as `completed` (green)
- **Future steps**: All steps after current are marked as `future` (gray)

#### Special Cases:
- **`cancelled`**: Mark subsequent steps as `skipped`, add "Cancelled" step as `current`
- **`returned`**: Mark "Delivered" as `completed`, add "Returned" step as `current`

### Service Bookings
**Normal Flow**: `requested` → `confirmed` → `scheduled` → `in_progress` → `completed`

#### Status Mapping:
- **First step always completed**: "Booking Requested" is always marked as completed
- **Linear progression**: Each status maps to its corresponding step as `current`
- **Previous steps**: All steps before current are marked as `completed` (green)
- **Future steps**: All steps after current are marked as `future` (gray)

#### Special Cases:
- **`cancelled`**: Mark subsequent steps as `skipped`, add "Cancelled" step as `current`
- **`no_show`**: Mark steps up to "Scheduled" as `completed`, rest as `skipped`, add "No Show" as `current`
- **`rescheduled`**: Mark steps up to "Confirmed" as `completed`, rest as `future`, add "Rescheduled" as `current`

## Connecting Line Rules

### Uniform Logic (Both Desktop & Mobile):
1. **Completed steps** → Green connecting line `#4CAF50`
2. **Current steps** → Gray connecting line `#CDCED8` 
3. **Future steps** → Gray connecting line `#E8E9ED`
4. **Skipped steps** → Pink connecting line `#DF678C`

### Visual Progression:
- Green lines create a clear "path of progress" showing what's been accomplished
- Gray lines show remaining journey or neutral states
- Pink lines indicate disrupted flow due to cancellations

## Responsive Design

### Desktop (Horizontal Timeline):
- Icons: 28×28px (w-7 h-7)
- Circles: 56×56px (w-14 h-14)
- Connecting lines: Horizontal, 2px height

### Mobile (Vertical Timeline):
- Icons: 20×20px (w-5 h-5)  
- Circles: 44×44px (w-11 h-11)
- Connecting lines: Vertical, 2px width

## Implementation Notes

### Consistency Guarantees:
1. **First step always completed** - Orders/bookings that exist have been "placed/requested"
2. **Linear status progression** - No status can be "current" without previous steps being "completed"
3. **Special status handling** - Cancellations and edge cases are handled uniformly
4. **Color inheritance** - Connecting lines match the status of the step they originate from

### Error Prevention:
- Unknown statuses default to `future` state
- Missing status values are handled gracefully
- Invalid progression is corrected automatically

## Usage Examples

### Product Order - "shipped" status:
- ✅ Order Placed (completed, green)
- ✅ Processing (completed, green) 
- ✅ Shipped (current, purple)
- ⏳ Delivered (future, gray)

### Service Booking - "in_progress" status:
- ✅ Booking Requested (completed, green)
- ✅ Confirmed (completed, green)
- ✅ Scheduled (completed, green)
- 🔄 In Progress (current, purple)
- ⏳ Completed (future, gray)

### Cancelled Order:
- ✅ Order Placed (completed, green)
- ✅ Processing (completed, green)
- ❌ Shipped (skipped, pink)
- ❌ Delivered (skipped, pink)
- ❌ Cancelled (current, pink)

This uniform approach ensures users have a consistent experience regardless of whether they're viewing product orders or service bookings, while providing clear visual feedback about progress and any issues. 