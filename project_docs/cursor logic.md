## SellerDashboardOverview - Technical Documentation

### Time Filter System
- **Implementation**: Uses React useState with type constraint `<'24h' | '7d' | '30d' | '90d'>` with default value '30d'
- **Data Management**: All time-dependent metrics maintain separate data arrays for each time period
- **Label Logic**: `getTimeLabels()` function dynamically returns appropriate time labels based on selected filter
- **Filter Impact**: Switching time filters updates all chart data and metrics simultaneously

### 1. Total Revenue Card

**Core Metric**: $23,695
- **Calculation**: Sum of all completed transactions within the selected time period (for Product or Services or Both)
- **Data Source**: Corresponds to the most recent value in the `revenueData[timeFilter]` array

**Growth Indicator**: +12%
- **Logic**: Percentage increase compared to the previous equivalent time period
- **Visual**: Green upward arrow indicates positive growth

**Progress Bar**: 78% of monthly target
- **Calculation**: (Current revenue / Monthly target) * 100
- **Target Logic**: Fixed monthly revenue targets that don't change with time filter
- **Persistence**: When viewing non-monthly time periods, still shows progress toward monthly target
- **Visual**: Width of the colored portion represents percentage completion (78% filled)

**Navigation**: Clicking card triggers `navigateTo('sellerDashboard_finance')`

### 2. Orders Card

**Core Metric**: 248 orders
- **Calculation**: Total count of all orders (regardless of status) within selected time period
- **Data Structure**: Not directly visible in code, but likely aggregated from order records

**Growth Indicator**: +15%
- **Logic**: Percentage increase compared to previous equivalent time period
- **Visual**: Pink upward arrow with percentage

**Status Breakdown**:
- **New Orders (42)**: Count of orders with 'new' status
- **Processing Orders (17)**: Count of orders with 'processing' status
- **Calculation**: Filtered count of orders by status
- **Visual**: Status badges use color-coding from `getStatusBadgeColor()` function:
  - New: `bg-[#F3E8F9] text-[#3D1560]`
  - Processing: `bg-[#F3E8F9] text-[#6D26AB]`

**Navigation**: Clicking card triggers `navigateTo('sellerDashboard_orders')`

### 3. Sales Card

**Core Metric**: 215 sales
- **Calculation**: Count of successfully completed transactions
- **Data Source**: Uses most recent value from `salesData[timeFilter]` array

**Growth Indicator**: +8%
- **Logic**: Percentage increase compared to previous equivalent time period
- **Visual**: Purple upward arrow indicates positive growth

**Category Breakdown**:
- **Products (177)**: Count of physical goods sold
- **Services (38)**: Count of service bookings completed
- **Calculation**: Sales are categorized by type and counted separately
- **Visual**: Color-coded indicators with inline labels:
  - Products: #3D1560 (deep purple) 
  - Services: #9B53D9 (lighter purple)

### 4. Appointments Card

**Core Metric**: 42 appointments
- **Calculation**: Total number of service appointments scheduled in selected time period
- **Data Source**: Aggregated from appointment records

**Growth Indicator**: +15%
- **Logic**: Percentage increase compared to previous equivalent time period
- **Visual**: Purple upward arrow with percentage

**Status Breakdown**:
- **Pending (12)**: Appointments awaiting confirmation
- **Confirmed (30)**: Appointments that have been confirmed
- **Calculation**: Filtered count of appointments by status
- **Visual**: Status badges use color-coding from `getStatusBadgeColor()` function:
  - Pending: `bg-[#FFE5ED] text-[#DF678C]`
  - Confirmed: `bg-[#EDD9FF] text-[#9B53D9]`

**Navigation**: Clicking card triggers `navigateTo('sellerDashboard_appointments')`

### 5. Pending Payout Card

**Core Metric**: $4,820
- **Calculation**: Sum of all completed transactions that haven't been paid out yet
- **Data Source**: Aggregated from transaction records with 'pending payout' status

**Time Indicator**: "2 days"
- **Logic**: Countdown to next scheduled payout
- **Visual**: Pink badge with time remaining

**Next Payout Date**: Apr 18
- **Calculation**: Fixed schedule determined by payment processing system
- **Visual**: Trending up icon indicates expected payout

### 6. Revenue Trends Chart

**Data Visualization**: Bar chart showing revenue over time
- **Data Source**: `revenueData` object with arrays for each time period:
  - 24h: Hourly revenue [1200, 950, 1350, 1100, 1450, 1320, 1580]
  - 7d: Daily revenue [5200, 4800, 5600, 6100, 5800, 6200, 6500]
  - 30d: Weekly revenue [18500, 19200, 17800, 21000, 22500, 21300, 23600]
  - 90d: Monthly revenue [52000, 56000, 49000, 61000, 68000, 72000, 79000]

**Time Scale Adjustment**:
- **Logic**: `getTimeLabels()` function returns appropriate labels based on selected time filter:
  - 24h: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM']
  - 7d: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  - 30d: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
  - 90d: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

**Visual Elements**:
- **Bar Height**: `style={{ height: ${value / 100}px }}` - Scales each value by dividing by 100
- **Bar Color**: Gradient from #3D1560 to #9B53D9
- **Hover State**: Changes gradient to start from #6D26AB
- **Data Labels**: Displays exact revenue values above each bar
- **Grid System**: Background grid rendered using absolute positioning and border styles

**Filter Control**:
- **Implementation**: Dropdown allows filtering chart data by listing type (All, Products, Services)
- **Note**: Filter control exists in UI but filtering logic is not implemented in the available code

### 7. Listing Views Metrics

**Core Metric**: 3,842 total views
- **Calculation**: Sum of all listing views within selected time period
- **Data Source**: Likely uses `viewsData[timeFilter]` array

**Growth Indicator**: +24%
- **Logic**: Percentage increase compared to the previous equivalent time period
- **Visual**: Green upward arrow indicates positive growth

**Category Breakdown**:
- **Products (2,516)**: 65% of total views
- **Services (1,326)**: 35% of total views
- **Calculation**: Views are categorized by listing type and calculated as percentages of total
- **Visual**: Progress bars with width corresponding to percentage:
  - Products: Blue gradient (65% width)
  - Services: Purple-pink gradient (35% width)

### 8. Conversion Rate Analysis

**Core Metric**: 5.8% overall conversion
- **Calculation**: (Number of sales / Number of views) * 100
- **Data Source**: Derived from sales and views data

**Growth Indicator**: +3.2%
- **Logic**: Percentage point increase compared to previous equivalent time period
- **Visual**: Amber colored arrow indicates positive growth

**Visual Representation**:
- **Circle Progress**: Circular progress indicator with 58% completion (5.8 out of 10)
- **Calculation**: Dashboard uses a 0-10% scale for conversion visualization

**Category Breakdown**:
- **Products (6.4%)**: Higher conversion rate for physical goods
- **Services (4.2%)**: Lower conversion rate for service offerings
- **Visual**: Color-coded boxes with percentage values:
  - Products: Blue background (#blue-50) with blue text (#blue-700)
  - Services: Purple background (#purple-50) with purple text (#purple-700)

**Trend Indicator**: "Up 0.8% from last period"
- **Calculation**: Difference between current overall rate and previous period
- **Visual**: Green upward trend icon with text description

### 9. Review Scores Analysis

**Core Metric**: 4.8 average rating
- **Calculation**: Weighted average of all review scores
- **Data Source**: "from 127 reviews" - Count of all reviews

**Visual Rating**: 5 filled stars
- **Logic**: Rounds average score to nearest visual representation

**Rating Distribution**:
- **5★**: 70% of reviews
- **4★**: 20% of reviews  
- **3★**: 7% of reviews
- **2★**: 2% of reviews
- **1★**: 1% of reviews
- **Visual**: Progress bars with width corresponding to percentage
- **Calculation**: (Count of reviews with specific rating / Total review count) * 100

**Recency Indicator**: "Recent review: 2 days ago"
- **Logic**: Timestamp of most recent review relative to current date

### 10. Status Badge System

**Implementation**: `getStatusBadgeColor()` function
- **Logic**: Maps status strings to tailwind CSS classes for consistent styling across dashboard
- **Status Mappings**:
  - 'pending': `bg-[#FFE5ED] text-[#DF678C]` (Pink)
  - 'processing': `bg-[#F3E8F9] text-[#6D26AB]` (Purple)
  - 'new': `bg-[#F3E8F9] text-[#3D1560]` (Deep Purple)
  - 'confirmed': `bg-[#EDD9FF] text-[#9B53D9]` (Light Purple)
  - default: `bg-[#E8E9ED] text-[#70727F]` (Gray)

### 11. Quick Access Cards Section

**Implementation**: Conditionally rendered when `isEditMode` is false

**Saved Items Card**:
- **Data Source**: First 3 items from `mockProducts` array
- **Visual Elements**: Product image, name, short description, price
- **Interaction**: "View Details" and "View All Saved Items" buttons

**Recently Viewed Card**:
- **Purpose**: Shows items the seller recently viewed
- **Note**: Placeholder with no implemented data source

**Ongoing Orders Card**:
- **Navigation**: Clicking triggers `handleNavigate('myOrders')`

**Appointments Card**:
- **Purpose**: Quick access to appointment management
- **Note**: Placeholder with no implemented data source

### Key Technical Implementation Notes

1. **Time Period Logic**:
   - All metrics adapt to the selected time filter
   - Historical comparisons (growth indicators) are calculated against the previous equivalent period
   - Some metrics (like monthly target) maintain their original time frame regardless of filter

2. **Navigation System**:
   - `navigateTo` function calls parent component's `handleNavigate` method
   - Each card links to a dedicated dashboard page for that metric

3. **Conditional Rendering**:
   - Button styles change based on selected time filter
   - Bottom cards only display when not in edit mode

4. **Responsive Design**:
   - Grid layouts use different column counts based on screen size
   - Button arrangement adapts from stacked to horizontal on larger screens
   - Card layouts use flexible spacing with gap utilities

## SellerDashboardMyShop - Technical Documentation

### Data Source System
- **Implementation**: Merges `mockServices` and `mockProducts` arrays to create a unified data source
- **Data Processing**: Maps service and product data to a standardized listing format with consistent fields
- **Aggregation Logic**: Calculates summary metrics by filtering and counting listings by various criteria
- **Default Values**: Applies sensible defaults for missing properties (`status || 'active'`, placeholder images, etc.)

### 1. Overview Cards Section

**Total Listings Card**:
- **Core Metric**: Sum of all listings (active + draft + inactive + pending)
- **Calculation**: `activeListings + draftListings + inactiveListings + pendingListings`
- **Data Source**: Combined counts from filtered `mockServices` and `mockProducts` arrays
- **Growth Indicator**: "+X new this month"
  - **Logic**: Shows new services added this month (`mockServices.length > 5 ? mockServices.length - 5 : 0`)
  - **Visual**: Purple text highlighting the growth number
- **Icon**: Store icon in purple (#3D1560) on light purple background (#EDD9FF)

**Active Listings Card**:
- **Core Metric**: Count of listings with 'active' status
- **Calculation**: `[...mockServices, ...mockProducts].filter(item => (item.status || 'active') === 'active').length`
- **Data Source**: Filtered count from combined listings
- **Category Breakdown**:
  - **Products**: `mockProducts.length` (count of all products)
  - **Services**: `mockServices.length` (count of all services)
  - **Visual**: Color-coded text with product count in purple (#3D1560) and service count in pink (#DF678C)
- **Icon**: CheckCircle icon in green (#4CAF50) on light green background (#E8F5E9)

**Revenue Card**:
- **Core Metric**: $12,495.75
- **Calculation**: Static value from `dashboardStats.revenue`
- **Data Source**: Hardcoded in `dashboardStats` object
- **Growth Indicator**: "↑ 12% vs last month"
  - **Logic**: Static comparison value
  - **Visual**: Green text (#4CAF50) with upward arrow
- **Formatting**: Uses `formatCurrency()` utility for consistent display
- **Icon**: DollarSign icon in green (#4CAF50) on light green background (#E8F5E9)

**Shop Visitors Card**:
- **Core Metric**: 1,248 visitors
- **Calculation**: Static value from `dashboardStats.visitorsThisMonth`
- **Data Source**: Hardcoded in `dashboardStats` object
- **Growth Indicator**: "↑ 8% vs last month"
  - **Logic**: Static comparison value
  - **Visual**: Green text (#4CAF50) with upward arrow
- **Icon**: Users icon in green (#4CAF50) on light green background (#E8F5E9)

### 2. Shop Information Section

**Basic View (Collapsed)**:
- **Implementation**: Toggle controlled by `showFullShopInfo` state
- **Fields Displayed**:
  - Shop Name: "Urban Style Studio"
  - Location: "Chicago, US"
  - Member Since: "March 2023"
  - Response Rate: "98%"
  - Specialization: Category tags with color-coding

**Expanded View**:
- **Implementation**: Conditionally renders when `showFullShopInfo` is true
- **Sections**:
  - **Basic Information**: Shop name, member since, response rate
  - **Contact & Location**: Full address, contact email, business hours
  - **Specialization & Description**: Category tags, detailed shop description
- **Visual Structure**: Each section uses consistent heading styles, grid layouts, and typography hierarchies

**Interaction Logic**:
- **Expand/Collapse**: Button toggles `showFullShopInfo` state
- **Edit Shop**: Button appears but functionality not implemented in the code sample

### 3. Status Distribution Section

**Listings by Status Card**:
- **Data Source**: Filtered counts from combined listings array
- **Status Types**:
  - **Live/Active**: Count and percentage of active listings
  - **Draft**: Count and percentage of draft listings
  - **Pending**: Count and percentage of pending listings
  - **Inactive**: Count and percentage of inactive listings
- **Visual Elements**:
  - **Color Coding**: Each status has a unique color (Green for Live, Purple for Draft, Yellow for Pending, Gray for Inactive)
  - **Progress Bar**: Horizontal stacked bar showing proportional distribution
  - **Calculation**: `(statusCount / totalListings) * 100` determines width percentage

**Listings by Type Card**:
- **Data Source**: Direct counts from `mockProducts.length` and `mockServices.length`
- **Visual Elements**:
  - **Color Coding**: Products in purple (#6D26AB), Services in pink (#DF678C)
  - **Donut Chart**: Shows proportional distribution
  - **Calculation**: 
    - Products segment: `(mockProducts.length / (mockProducts.length + mockServices.length)) * 100`
    - Services segment: `(mockServices.length / (mockProducts.length + mockServices.length)) * 100`
  - **Center Text**: Total count of all listings

**Quick Actions Card**:
- **Implementation**: Grid of action buttons
- **Actions**:
  - **New Listing**: Triggers `handleCreateListing()` which navigates to 'createListing' page
  - **Promote**: Placeholder (no implementation)
  - **Analytics**: Placeholder (no implementation)
  - **Settings**: Placeholder (no implementation)
- **Visual Elements**: Light purple buttons (#EDD9FF) with deep purple icons (#3D1560)
- **Hover State**: Changes background to darker purple (#9B53D9)

### 4. Listings Table Section

**Table Header**:
- **Search Implementation**: Input field with no attached handler (placeholder UI)
- **Tab System**:
  - **Implementation**: Controlled by `activeTab` state (`'all' | 'product' | 'service'`)
  - **Filter Logic**: `useMemo` hook filters listings based on active tab
  - **Visual**: Selected tab has purple background (#EDD9FF), purple text (#3D1560), and purple bottom border
- **Status Filter**: Dropdown with no attached handler (placeholder UI)

**Table Structure**:
- **Columns**: Listing, Type, Category, Price, Quantity, Status, Created, Performance, Actions
- **Data Source**: `filteredListings` array derived from `combinedListings` filtered by `activeTab`
- **Row Behavior**: 
  - Clicking a row triggers `handleViewListingDetails(listing)` which opens the details modal
  - Hover state changes background to light gray

**Listing Column**:
- **Elements**: Thumbnail image, name, ID
- **Image Source**: `listing.image` with fallback to placeholder
- **Truncation**: Name has `truncate max-w-xs` class to prevent overflow

**Type Column**:
- **Visual**: Colored dot (purple for products, pink for services) with capitalized type name
- **Implementation**: Conditional color based on `listing.type`

**Status Column**:
- **Implementation**: Uses `getStatusColor()` function to map status to visual styles
- **Display**: Capitalizes first letter and shows "Live" instead of "active"
- **Visual**: Rounded badge with status-specific background and text colors

**Performance Metrics**:
- **Views**: Shows view count with eye icon
- **Orders**: Shows order count with cart icon
- **Rating**: Conditionally shows star rating if rating > 0

**Actions Column**:
- **Edit Button**: Clicking triggers `handleEdit(listing.id)` which navigates to edit page
- **View Button**: Triggers `handleViewListingDetails(listing, e)` to open the modal
- **More Menu**:
  - **Implementation**: Controlled by `activeMenu` state
  - **Toggle Logic**: `toggleMenu(listing.id)` sets or clears the active menu
  - **Options**: Edit, Promote
  - **Click Behavior**: All buttons use `e.stopPropagation()` to prevent row click event

**Pagination**:
- **Implementation**: Static UI showing "1 to 6 of 13 results"
- **Controls**: Previous/Next buttons (Previous disabled)
- **Note**: Not functional in current implementation (UI only)

### 5. Listing Details Modal

**Implementation**:
- **Display Logic**: Shown when `showViewModal` is true and `selectedViewListing` has a value
- **Z-Index & Overlay**: Fixed position, black semi-transparent background, centered modal

**Modal Header**:
- **Display**: Title, status badge
- **Actions**: Edit button, View Live button, Close button
- **Navigation**: Edit button closes modal and calls `handleEdit(selectedViewListing.id)`

**Main Information Section**:
- **Image Display**: Large thumbnail with error fallback
- **Metadata**: Product ID, type, category
- **Details Grid**: Displays all listing properties in a responsive layout
- **Description**: Shows listing description with fallback text if none exists

**Performance Insights Section**:
- **Metric Cards**:
  - **Total Views**: Shows view count with growth indicator
  - **Saves/Wishlists**: Shows saves count with growth indicator
  - **Orders/Bookings**: Shows order count with growth indicator
  - **Revenue**: Calculated as `selectedViewListing.price * selectedViewListing.orders` with growth indicator
- **Revenue Chart**:
  - **Implementation**: Mock visualization with random heights
  - **Time Range**: Dropdown selector (non-functional)
  - **Summary**: Shows total revenue, average order value, best month

**Additional Details Section**:
- **Specifications**: Type, category, location, SKU/ID, publish date
- **Pricing & Inventory**: Base price, discount status, stock level, tax category
- **Low Stock Alert**: Conditionally shows warning if quantity < 10 and is not "Unlimited"

**Marketing & Promotion Section**:
- **Boost Card**: Gradient background with promotion message and action buttons
- **SEO Optimization**:
  - **Score**: "Good" or "Needs Improvement" based on view count
  - **Metrics**: Title optimization, description quality, images & media
  - **Progress Bars**: Width percentages based on content quality checks

**Modal Footer**:
- **Left Actions**: Activate/Deactivate button, Delete button
- **Right Actions**: Close button
- **Implementation**: Close button sets `showViewModal` to false

### 6. Status Color System

**Implementation**: `getStatusColor()` function that returns bar and badge colors
- **Mapping Logic**:
  - **'live'/'active'**: Green (#4CAF50) - Listing is visible to customers and available for purchase
  - **'draft'**: Purple (#C7A2E0) - Work in progress, not visible to customers
  - **'pending'**: Yellow (#FFD700) - Awaiting approval or moderation
  - **'inactive'**: Gray (#CDCED8) - Temporarily hidden from customers
- **Return Value**: Object with `{ bar: string, badge: string }` containing tailwind classes

### 7. Utility Functions

**formatDate()**:
- **Purpose**: Converts ISO date strings to localized, readable format
- **Implementation**: Uses `toLocaleDateString` with options
- **Format**: "Month Day, Year" (e.g., "Apr 15, 2023")

**formatCurrency()**:
- **Purpose**: Ensures consistent money formatting
- **Implementation**: Uses `Intl.NumberFormat` with USD currency configuration
- **Format**: "$X,XXX.XX" with appropriate thousand separators

### 8. Navigation & State Management

**Page Navigation**:
- **handleCreateListing()**: Navigates to 'createListing' page via `setCurrentPage`
- **handleViewListing()**: Navigates to 'editListing' page after setting `selectedListingForEdit`
- **handleEdit()**: Finds the listing by ID, sets `selectedListingForEdit`, then navigates to 'editListing'

**Modal State Management**:
- **showViewModal**: Boolean controlling modal visibility
- **selectedViewListing**: Stores the currently selected listing for the modal
- **toggleMenu()**: Toggles dropdown menus in the actions column
- **activeMenu**: Stores the ID of the currently open menu (or null)

**Tab State Management**:
- **activeTab**: Controls which tab is selected ('all', 'product', 'service')
- **Filter Effect**: Tab selection filters the listings displayed in the table

### 9. Shop Information Management

**Shop Expansion State**:
- **showFullShopInfo**: Boolean controlling whether expanded shop details are shown
- **Toggle**: Button toggles between expanded and collapsed views

### Key Business Insights

1. **Inventory Management**:
   - Status distribution provides quick insight into listing health
   - Type breakdown shows product vs service balance
   - Low stock alerts flag potential inventory issues

2. **Revenue Drivers**:
   - Performance metrics highlight which listings generate most views and sales
   - Revenue calculation ties directly to order volume and pricing
   - Historical trends show seasonal patterns or growth trajectories

3. **Marketing Effectiveness**:
   - SEO scores indicate listing visibility potential
   - View-to-order conversion rates show marketing effectiveness
   - Promotional recommendations target underperforming listings

4. **Shop Health**:
   - Overall metrics (visitors, revenue) indicate business trajectory
   - Month-over-month growth indicators show business momentum
   - Response rate and review metrics affect customer trust

5. **Actionable Intelligence**:
   - Quick action buttons prioritize common seller tasks
   - Status filters help focus on listings needing attention
   - Performance data guides which listings to promote or optimize
