# FAQ Implementation Plan

## Overview
Create a Help Center/FAQ page with a design similar to Revolut's help center, featuring category-based organization and tabbed navigation.

## Design Reference
- **Revolut Help Center**: https://help.revolut.com/en-EE/help/
- **Key Features**:
  - Search bar at the top
  - Tab navigation (Personal/Business)
  - Category cards in grid layout
  - Clean, organized structure

## UI Structure

### Page Layout
```
┌─────────────────────────────────────────┐
│  Header: "Need Help?" / "Help Center"  │
│  Search Bar: "Search for help..."      │
│  Tabs: [General] [Buyer] [Seller]     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Category Cards Grid (3-4 columns)     │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ Cat1 │ │ Cat2 │ │ Cat3 │ │ Cat4 │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ │
└─────────────────────────────────────────┘
```

### Tab Structure
1. **General** - Platform-wide questions
2. **Buyer** - Buyer-specific questions
3. **Seller** - Seller-specific questions

## Category Structure

### General Tab Categories
1. **Getting Started**
   - Creating an account
   - Account verification
   - Profile setup
   - Platform overview

2. **Account & Security**
   - Password management
   - Two-factor authentication
   - Privacy settings
   - Account deletion

3. **Payments & Billing**
   - Payment methods
   - Refunds
   - Transaction history
   - Billing questions

4. **Platform Features**
   - Messaging system
   - Notifications
   - Search & filters
   - Saved items

5. **Safety & Trust**
   - Platform safety
   - Reporting issues
   - Dispute resolution
   - Terms of service

### Buyer Tab Categories
1. **Booking Services**
   - How to book a service
   - Service availability
   - Rescheduling/canceling
   - Service delivery modes

2. **Placing Orders**
   - Adding to cart
   - Checkout process
   - Shipping options
   - Order tracking

3. **Payments & Refunds**
   - Payment methods
   - Payment security
   - Refund process
   - Payment issues

4. **Reviews & Ratings**
   - Leaving reviews
   - Rating providers
   - Review guidelines
   - Editing reviews

5. **Communication**
   - Messaging sellers
   - Contacting support
   - Appointment coordination

### Seller Tab Categories
1. **Getting Started as a Seller**
   - Seller registration
   - Setting up shop
   - Creating listings
   - Seller verification

2. **Managing Listings**
   - Creating service listings
   - Creating product listings
   - Editing listings
   - Managing availability
   - Pricing & tiers

3. **Orders & Bookings**
   - Managing bookings
   - Accepting/declining
   - Order fulfillment
   - Shipping & tracking
   - Appointment scheduling

4. **Payments & Earnings**
   - Payment processing
   - Payout schedule
   - Transaction fees
   - Tax information
   - Financial dashboard

5. **Seller Tools**
   - Analytics & insights
   - Performance metrics
   - Customer management
   - Inventory management

6. **Seller Policies**
   - Seller terms
   - Return policies
   - Cancellation policies
   - Seller protection

## Data Structure

### FAQ Item Interface
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string;
  tags: string[];
  tab: 'general' | 'buyer' | 'seller';
  views?: number;
  helpful?: number;
  notHelpful?: number;
  related?: string[]; // FAQ IDs
}
```

### Category Interface
```typescript
interface FAQCategory {
  id: string;
  name: string;
  icon: string; // Icon name/component
  description: string;
  tab: 'general' | 'buyer' | 'seller';
  subcategories?: string[];
  faqCount: number;
}
```

## Navigation Flow

### From Contact Support
- "Help Center" button → Opens FAQ page (General tab)

### From Seller Pages
- "Seller Help Center" button → Opens FAQ page (Seller tab, filtered)

### Direct Navigation
- URL: `/help` or `help` page
- Query params: `?tab=seller` or `?tab=buyer` or `?tab=general`
- Category filter: `?category=payments`

## Component Structure

### Main Components
1. **HelpCenterPage** (Main page)
   - Search bar
   - Tab navigation
   - Category grid
   - FAQ list (when category selected)

2. **FAQSearchBar** (Search component)
   - Real-time search
   - Search suggestions
   - Recent searches

3. **FAQCategoryCard** (Category card)
   - Icon
   - Category name
   - Description
   - FAQ count
   - Click to expand

4. **FAQList** (FAQ items list)
   - Expandable FAQ items
   - Search results
   - Category filtered view

5. **FAQItem** (Individual FAQ)
   - Question (clickable)
   - Answer (expandable)
   - Helpful/Not helpful buttons
   - Related FAQs

## Implementation Steps

### Phase 1: Basic Structure
1. Create `HelpCenterPage.tsx`
2. Add tab navigation (General, Buyer, Seller)
3. Create category card grid layout
4. Add routing in App.tsx

### Phase 2: Data & Content
1. Create FAQ mock data structure
2. Add FAQ items for each category
3. Implement category filtering
4. Add tab filtering

### Phase 3: Search & Interaction
1. Implement search functionality
2. Add FAQ expand/collapse
3. Add helpful/not helpful feedback
4. Add related FAQs

### Phase 4: Integration
1. Update "Help Center" buttons to navigate to FAQ
2. Update "Seller Help Center" to navigate with seller filter
3. Add breadcrumbs/navigation
4. Add back button

## Design Specifications

### Colors (Using existing palette)
- Background: `#F8F8FA`
- Cards: `#FFFFFF`
- Primary: `#3D1560`
- Text: `#383A47`
- Secondary text: `#70727F`
- Borders: `#E8E9ED`

### Typography
- Page title: `text-3xl font-semibold text-[#1B1C20]`
- Category name: `text-lg font-semibold text-[#383A47]`
- FAQ question: `text-base font-medium text-[#383A47]`
- FAQ answer: `text-sm text-[#70727F]`

### Spacing
- Page padding: `px-4 md:px-6 lg:px-8 py-8`
- Card gap: `gap-4 md:gap-6`
- Card padding: `p-6`

## Mock Data Structure

### Example FAQ Items
```typescript
const mockFAQs: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'How do I create an account?',
    answer: 'To create an account, click on "Sign Up" in the top right corner...',
    category: 'Getting Started',
    tab: 'general',
    tags: ['account', 'signup', 'registration']
  },
  {
    id: 'faq-002',
    question: 'How do I book a service?',
    answer: 'To book a service, browse available services and click "Book Now"...',
    category: 'Booking Services',
    tab: 'buyer',
    tags: ['booking', 'services', 'appointments']
  },
  // ... more FAQs
];
```

## Next Steps
1. Review and approve this structure
2. Create the HelpCenterPage component
3. Add mock FAQ data
4. Implement search and filtering
5. Integrate with existing navigation
