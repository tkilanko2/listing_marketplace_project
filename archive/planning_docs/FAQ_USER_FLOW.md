# FAQ/Help Center User Flow

## Complete User Journey

### Entry Points (How Users Reach FAQ)

#### 1. From Booking/Order Details Pages
```
User on Booking Details Page
  ↓
Clicks "Help Center" button
  ↓
Navigates to: /help (or 'help' page)
  ↓
FAQ Page Opens → General Tab (default)
```

#### 2. From Seller Pages (Booking/Order Details)
```
User on Seller Booking/Order Details Page
  ↓
Clicks "Seller Help Center" button
  ↓
Navigates to: /help?tab=seller (or 'help' with seller filter)
  ↓
FAQ Page Opens → Seller Tab (pre-selected)
  ↓
Shows only Seller-related categories
```

#### 3. From Contact Support Modal
```
User clicks "Help Center" in Contact Support Modal
  ↓
Modal closes, navigates to FAQ
  ↓
FAQ Page Opens → General Tab
```

#### 4. Direct Navigation (Future)
```
User types URL: /help
  ↓
Or clicks "Help" in footer/navbar
  ↓
FAQ Page Opens → General Tab
```

---

## Page Load Flow

### Initial State
```
1. Page loads
2. Shows search bar at top
3. Shows 3 tabs: [General] [Buyer] [Seller]
4. Default tab: General (or based on URL param)
5. Shows category cards grid for selected tab
6. No FAQ items shown yet (only categories)
```

### Tab Selection Flow
```
User clicks a tab (e.g., "Seller")
  ↓
1. Tab becomes active (highlighted)
2. Category grid updates to show only that tab's categories
3. Search bar remains visible
4. Any selected category is cleared
5. URL updates: ?tab=seller
```

---

## Category Selection Flow

### Step 1: User Sees Category Cards
```
Category Grid Display:
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Getting     │ │ Managing    │ │ Orders &    │
│ Started     │ │ Listings    │ │ Bookings  │
│             │ │             │ │             │
│ 5 FAQs      │ │ 12 FAQs     │ │ 8 FAQs      │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Step 2: User Clicks a Category
```
User clicks "Managing Listings" category
  ↓
1. Category card expands or highlights
2. Category grid may collapse/shrink
3. FAQ list appears below showing FAQs in that category
4. URL updates: ?tab=seller&category=managing-listings
5. Search bar remains at top
```

### Step 3: FAQ List Display
```
FAQ List Shows:
┌─────────────────────────────────────┐
│ Managing Listings                    │
│ ← Back to Categories                 │
├─────────────────────────────────────┤
│ ▼ How do I create a service listing?│
│   Answer text appears when expanded  │
├─────────────────────────────────────┤
│ ▼ How do I edit my listing?         │
│   Answer text...                     │
├─────────────────────────────────────┤
│ ▼ How do I set pricing tiers?      │
│   Answer text...                     │
└─────────────────────────────────────┘
```

---

## FAQ Item Interaction Flow

### Expanding an FAQ
```
User clicks on FAQ question
  ↓
1. FAQ item expands (smooth animation)
2. Answer text appears
3. "Helpful" / "Not Helpful" buttons appear
4. Related FAQs section may appear
5. Other FAQs remain in their current state
```

### Collapsing an FAQ
```
User clicks expanded FAQ question again
  ↓
1. FAQ item collapses
2. Answer text hides
3. Helpful buttons hide
```

### Helpful/Not Helpful Flow
```
User clicks "Helpful" or "Not Helpful"
  ↓
1. Button state changes (visual feedback)
2. Counter updates (if tracking)
3. Optionally: "Thank you for feedback" message
4. Button becomes disabled (can't change vote)
```

---

## Search Flow

### Step 1: User Types in Search
```
User types "refund" in search bar
  ↓
1. Real-time search results appear below search bar
2. Results show matching FAQs from all tabs
3. Results show: Question, Category, Tab indicator
4. Category grid may fade/hide
```

### Step 2: Search Results Display
```
Search Results:
┌─────────────────────────────────────┐
│ Search: "refund"                    │
│ 5 results found                     │
├─────────────────────────────────────┤
│ [Buyer] How do I request a refund? │
│ [Seller] Refund policy for sellers  │
│ [General] Refund processing time    │
│ ...                                 │
└─────────────────────────────────────┘
```

### Step 3: User Clicks Search Result
```
User clicks a search result
  ↓
1. FAQ item expands
2. Context shows: "Found in: [Category Name]"
3. "View all in [Category]" link appears
4. User can navigate to that category
```

### Step 4: Clear Search
```
User clears search or clicks "X"
  ↓
1. Search bar clears
2. Returns to category grid view
3. Active tab remains selected
```

---

## Combined Filtering Flow

### Search + Tab Filter
```
User on Seller tab
  ↓
Types "payout" in search
  ↓
Results show only Seller FAQs matching "payout"
  ↓
Results filtered by:
- Tab: Seller
- Search term: "payout"
```

### Category + Search
```
User selects "Payments & Earnings" category
  ↓
Types "schedule" in search
  ↓
Results show only FAQs in "Payments & Earnings" 
  that match "schedule"
```

---

## Navigation Flow

### Back Navigation
```
User viewing FAQs in a category
  ↓
Clicks "← Back to Categories"
  ↓
1. FAQ list hides
2. Category grid reappears
3. Selected category is cleared
4. Tab remains active
```

### Breadcrumb Navigation (Optional)
```
FAQ Page > Seller > Payments & Earnings > FAQ Item
  ↓
User clicks "Payments & Earnings" in breadcrumb
  ↓
Returns to category FAQ list
```

### Exit Flow
```
User clicks "Back" button or closes page
  ↓
1. Returns to previous page
2. Or navigates to landing/home
3. State is preserved (can use browser back)
```

---

## Complete Example Flow

### Scenario: Seller wants to know about payouts

```
1. Seller on Seller Booking Details Page
   ↓
2. Clicks "Seller Help Center" button
   ↓
3. FAQ Page opens → Seller tab selected
   ↓
4. Sees category cards:
   - Getting Started as a Seller
   - Managing Listings
   - Orders & Bookings
   - Payments & Earnings ← (relevant)
   - Seller Tools
   - Seller Policies
   ↓
5. Clicks "Payments & Earnings" category
   ↓
6. FAQ list appears:
   - How do payouts work?
   - When do I receive my earnings?
   - What are the payout fees?
   - How do I set up my bank account?
   ↓
7. Clicks "When do I receive my earnings?"
   ↓
8. FAQ expands, shows answer
   ↓
9. Clicks "Helpful" button
   ↓
10. Done! (or continues browsing)
```

### Alternative: Using Search

```
1. Seller on Seller Booking Details Page
   ↓
2. Clicks "Seller Help Center" button
   ↓
3. FAQ Page opens → Seller tab selected
   ↓
4. Types "payout" in search bar
   ↓
5. Search results appear:
   - [Seller] How do payouts work?
   - [Seller] Payout schedule
   - [Seller] Payout fees
   ↓
6. Clicks first result
   ↓
7. FAQ expands with answer
   ↓
8. Sees "View all in Payments & Earnings" link
   ↓
9. Clicks link → Goes to category view
```

---

## State Management Flow

### URL Parameters
```
/help                    → General tab, no category
/help?tab=buyer          → Buyer tab, no category
/help?tab=seller         → Seller tab, no category
/help?tab=seller&category=payments → Seller tab, Payments category
/help?search=refund      → Search for "refund" across all tabs
/help?tab=seller&search=payout → Seller tab, search "payout"
```

### Component State
```
- activeTab: 'general' | 'buyer' | 'seller'
- selectedCategory: string | null
- searchQuery: string
- expandedFAQ: string | null (FAQ ID)
- searchResults: FAQItem[]
- filteredCategories: FAQCategory[]
```

---

## Mobile Flow

### Mobile Layout
```
1. Search bar (full width)
2. Tabs (horizontal scroll if needed)
3. Category cards (2 columns on mobile)
4. FAQ list (full width, stacked)
5. Expanded FAQ (full width)
```

### Mobile Interactions
- Same flow as desktop
- Touch-friendly tap targets
- Swipe gestures (optional)
- Bottom sheet for FAQ details (optional)

---

## Error/Empty States

### No Search Results
```
User searches "xyz123"
  ↓
Shows: "No results found for 'xyz123'"
  ↓
Suggestions:
- Check spelling
- Try different keywords
- Browse categories
```

### Empty Category
```
Category has no FAQs
  ↓
Shows: "No FAQs in this category yet"
  ↓
Shows: "Contact Support" button
```

---

## Summary

**Key Flow Points:**
1. **Entry**: Multiple entry points (buttons, direct nav)
2. **Tab Selection**: Filter by user type (General/Buyer/Seller)
3. **Category Browse**: Visual category cards → FAQ list
4. **Search**: Real-time search across all FAQs
5. **FAQ View**: Expand/collapse individual FAQs
6. **Navigation**: Easy back/forward navigation
7. **State**: URL params maintain state for sharing/bookmarking

**User Goals:**
- Find answers quickly
- Browse by category
- Search when needed
- Get context-specific help (Seller/Buyer)
- Easy navigation back
