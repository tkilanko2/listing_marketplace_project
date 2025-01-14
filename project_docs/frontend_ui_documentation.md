# Frontend UI Documentation

## Layout Structure

### Navigation
- Top navigation bar with logo, search, and user controls
  - Profile Icon Behavior:
    - Default state: UserCircle icon with neutral gray color
    - Hover state: Background transitions to light blue (bg-blue-50)
    - Click state: Opens dropdown with user options
    - For logged-in users: Shows avatar instead of default icon
  
  - Language Icon Behavior:
    - Default state: Globe icon with current language code
    - Hover state: Background lightens with smooth transition
    - Click state: Opens language selection dropdown
    - Shows available languages with native names

### Location Selection
- Country Selector Component:
  - Default state: Shows 'Global' on initial page load
  - Position: Top-right corner after search filters
  - Behavior:
    - Supports up to 5 city selections
    - Real-time city search with suggestions
    - Persists selected locations across sessions
    - Shows location icon (MapPin) with selected city/country

### Listing Card Icons
- View Count Icon:
  - Position: Top-right corner
  - Icon: Eye
  - Shows real-time view count
  - Backdrop blur effect on hover

- Listing Type Indicator:
  - Position: Adjacent to view count
  - Icons:
    - Package2 for products
    - Wrench for services
  - Semi-transparent background with border

- Bookmark Icon:
  - Position: Bottom-right of card
  - Shows save count
  - Interactive: Toggles saved state
  - Color transition on hover/active states

- Rating Display:
  - Shows up to 5 star icons
  - Filled stars for rating value
  - Gray stars for remaining
  - Shows total review count in parentheses

- Status Indicators:
  - Trending badge: Red background with white text
  - Condition/Duration: Bottom-right with appropriate icon
  - Price: Prominent display with currency symbol

### Pages

#### Landing Page
- Hero section with featured listings
- Category grid with icons
- Trending listings carousel
- Recommended listings section
- Recently viewed items (if available)

#### Search Results Page
- Left sidebar with filters
  - Category filter
  - Price range
  - Location filter
  - Rating filter
  - Type filter (Products/Services)
- Main content area with grid/list view toggle
- Sort options (Price, Rating, Date)
- Pagination controls

#### Listing Detail Page
- Image gallery with thumbnails
- Product/Service information section
  - Title
  - Price
  - Description
  - Specifications
  - Features
- Provider information card
  - Profile picture
  - Rating
  - Location
  - Response time
- Related listings section
- Reviews section

#### Provider Profile Page
- Provider header with cover image
- Profile information section
- Active listings grid
- Reviews and ratings section
- Contact information

## Component Library

### Common Components

#### ListingCard
```typescript
interface ListingCardProps {
  image: string;
  title: string;
  price: number;
  rating: number;
  location: string;
  provider: {
    name: string;
    avatar: string;
  };
  type: 'product' | 'service';
}
```

#### ReviewCard
```typescript
interface ReviewCardProps {
  rating: number;
  comment: string;
  customerName: string;
  date: Date;
}
```

#### FilterSection
```typescript
interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}
```

### UI States

#### Loading States
- Skeleton loaders for listing cards
- Progressive image loading
- Infinite scroll loading indicator

#### Empty States
- No results found
- Empty wishlist
- No reviews yet

#### Error States
- Network error message
- Invalid search query
- Failed to load content

## Styling Guidelines

### Color Palette
```css
:root {
  --primary: #2563eb;
  --secondary: #4f46e5;
  --accent: #f59e0b;
  --background: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --error: #ef4444;
  --success: #22c55e;
}
```

### Typography
```css
:root {
  --font-primary: 'Inter', sans-serif;
  --font-heading: 'Poppins', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
}
```

### Spacing
```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
```

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Responsive Design

### Mobile First Approach
- Base styles for mobile devices
- Progressive enhancement for larger screens
- Fluid typography and spacing
- Flexible grid systems

### Grid System
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}
```

### Media Queries
```css
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
```

## Accessibility

### ARIA Labels
- All interactive elements have appropriate ARIA labels
- Form inputs have associated labels
- Images have alt text
- Proper heading hierarchy

### Keyboard Navigation
- Focus indicators
- Tab order
- Skip links
- Keyboard shortcuts

### Color Contrast
- All text meets WCAG 2.1 contrast requirements
- Interactive elements have sufficient contrast
- Focus indicators are visible

## Performance Optimization

### Image Optimization
- Lazy loading for images
- Responsive images with srcset
- Image compression
- Next-gen image formats (WebP)

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Caching Strategy
- Static asset caching
- API response caching
- Service worker implementation 

### Navigation Components

#### Top Navigation Bar
- Logo and branding
- Search bar with icon
- Action buttons:
  - Sell Now button (primary CTA)
  - Notification bell with count badge
  - Shopping cart with count badge
  - Language selector
  - Profile menu

#### Navigation Icons
- **Notification Icon**:
  - Icon: Bell
  - Badge: Shows unread count
  - Red background for badge
  - Hover: Light gray background

- **Shopping Cart Icon**:
  - Icon: ShoppingCart
  - Badge: Shows item count
  - Blue background for badge
  - Hover: Light gray background

- **Mobile Menu Icons**:
  - Menu icon for collapsed state
  - X icon for expanded state
  - Smooth transition between states

#### Profile Dropdown Menu
- **Menu Items**:
  - Profile (`<User />` with blue background)
  - Orders (`<ShoppingBag />` with purple background)
  - Seller Dashboard (`<LayoutDashboard />` with green background)
  - Invite Friends (`<UserPlus />` with yellow background)
  - Settings (`<Settings />` with gray background)
  - Logout (`<LogOut />` with red background)
- Each item has:
  - Icon with colored background
  - Hover state with lighter background
  - Group hover effects

### Search and Filter Components

#### Search Bar
- Search icon with gray color
- Expandable input field
- Debounced search functionality
- Clear button (X icon) when input has value

#### Filter Section
- **Category Filter**:
  - Tag icon for category selection
  - Dropdown with category list
  - Selected state with blue highlight

- **Additional Filters**:
  - Filter icon for toggle
  - Expandable panel with options
  - Price range inputs
  - Location selection with MapPin icon
  - Custom filters based on category

### Review Components

#### Review Filters
- **Filter Buttons**:
  - Photos filter (`<Camera />`)
  - Verified purchases (`<CheckCircle />`)
  - Recent/Helpful toggle (`<Calendar />` / `<ThumbsUp />`)
  - All buttons have active/inactive states

#### Rating Distribution
- Star icons for each rating level (1-5)
- Progress bar showing distribution
- Interactive bars for filtering
- Percentage and count display

### Sidebar Navigation

#### Desktop Sidebar
- Fixed position on left side
- Menu items:
  - Home (`<Home />`)
  - Profile (`<User />`)
  - Bookings (`<Calendar />`)
- Back button with arrow icon
- Active state with blue highlight
- Hover states for all items

#### Mobile Sidebar
- Drawer navigation on mobile
- Same icons as desktop
- Slide-in animation
- Backdrop overlay

### Image Upload Components
- Drag and drop zone
- Upload button with icon
- Image preview with overlay
- Delete button on hover
- Progress indicator
- Error states 

## Interactions & Animations

### Hover Effects

#### Button Interactions
- **Primary Buttons**:
  ```css
  transition-all duration-200
  hover:bg-blue-700
  hover:shadow-md
  ```
  - Background color darkens
  - Shadow increases
  - 200ms smooth transition

- **Icon Buttons**:
  ```css
  transition-colors duration-200
  hover:bg-gray-100
  ```
  - Light background appears
  - 200ms color transition

#### Card Interactions
- **Listing Cards**:
  ```css
  transition-all duration-300
  hover:border-blue-100
  hover:shadow-[0_8px_40px_rgb(59,130,246,0.15)]
  hover:-translate-y-1
  ```
  - Slight upward movement
  - Border color changes
  - Shadow expands
  - 300ms smooth transition

- **Image Hover**:
  ```css
  group-hover:scale-105
  group-hover:opacity-100
  ```
  - Image scales up to 105%
  - Description overlay fades in

### Transition Effects

#### Menu Transitions
- **Mobile Menu**:
  ```css
  transition-transform duration-300 ease-in-out
  transform: translateX(0)
  ```
  - Slides in from left
  - 300ms smooth transition
  - Ease-in-out timing

- **Dropdown Menus**:
  ```css
  transition-all duration-200
  transform origin-top-right
  enter: opacity-100 scale-100
  leave: opacity-0 scale-95
  ```
  - Scales and fades in from top-right
  - 200ms transition duration

#### Filter Panel
- **Expansion Animation**:
  ```css
  transition-all duration-300 ease-in-out
  max-h-[500px]
  opacity-100
  ```
  - Smooth height expansion
  - Fade in effect
  - 300ms transition

### Loading Animations

#### Skeleton Loading
- **Listing Card Skeleton**:
  ```css
  animate-pulse
  bg-gray-200
  ```
  - Pulsing opacity animation
  - Gray placeholder background

#### Progress Indicators
- **Upload Progress**:
  ```css
  transition-width duration-300 ease-linear
  ```
  - Smooth width animation
  - Linear timing function
  - Real-time progress updates

### Feedback Animations

#### Button States
- **Click Feedback**:
  ```css
  active:scale-95
  transition-transform duration-100
  ```
  - Quick scale down on click
  - 100ms transition

- **Loading State**:
  ```css
  animate-spin
  duration-1000
  ```
  - Spinning loading indicator
  - Continuous 1-second rotation

#### Form Feedback
- **Input Focus**:
  ```css
  focus:ring-2
  focus:ring-blue-500
  transition-shadow duration-200
  ```
  - Blue ring appears
  - 200ms shadow transition

- **Validation States**:
  ```css
  invalid:border-red-500
  valid:border-green-500
  transition-colors duration-200
  ```
  - Color transitions for validation
  - 200ms color change

### Page Transitions

#### Route Changes
- **Page Exit**:
  ```css
  exit-active: opacity-0
  transition-opacity duration-200
  ```
  - Fade out effect
  - 200ms transition

- **Page Enter**:
  ```css
  enter-active: opacity-100
  transition-opacity duration-300
  ```
  - Fade in effect
  - 300ms transition

### Scroll Animations

#### Infinite Scroll
- **Loading Trigger**:
  ```css
  animate-bounce
  duration-1000
  ```
  - Bouncing loading indicator
  - 1-second animation cycle

#### Smooth Scroll
- **Category Navigation**:
  ```css
  scroll-behavior: smooth
  scroll-padding-top: 2rem
  ```
  - Smooth scrolling to sections
  - Accounts for fixed header

### Modal Animations

#### Dialog Windows
- **Open Animation**:
  ```css
  enter: ease-out duration-300
  enterFrom: opacity-0 scale-95
  enterTo: opacity-100 scale-100
  ```
  - Scale up and fade in
  - 300ms ease-out timing

- **Close Animation**:
  ```css
  leave: ease-in duration-200
  leaveFrom: opacity-100 scale-100
  leaveTo: opacity-0 scale-95
  ```
  - Scale down and fade out
  - 200ms ease-in timing

#### Backdrop
- **Fade Effect**:
  ```css
  enter: ease-out duration-300
  enterFrom: opacity-0
  enterTo: opacity-100
  ```
  - Background blur effect
  - Fade in/out with modal 