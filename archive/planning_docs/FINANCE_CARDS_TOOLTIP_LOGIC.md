# Finance Page Cards - Logic & Tooltip Documentation

## Overview
This document outlines the logic for each card on the Seller Finance Page and proposes hover tooltip display options.

## ⚠️ CLARIFICATION NEEDED

**Time Period Logic for Quick Stats Cards:**
Currently, Total Revenue, Net Earnings, and Transactions are calculated based on the selected time filter (All Time / 30 days / 7 days / 24 hours). However, we need to confirm the desired behavior:

**Question:** Should these metrics be:
1. **All-time totals** (regardless of time filter)
2. **Most recent payout period** (since last payout)
3. **Current month only** (reset each month)
4. **Based on selected time filter** (current implementation)

**Current Implementation:**
- These metrics use the `timeFilter` state from the transaction list dropdown
- The filter affects: Total Revenue, Net Earnings, Transactions count
- Available Balance and Pending Balance are always all-time (not filtered)
- Projected Earnings is always all-time (shows all confirmed bookings)

**Payout Schedule:**
- Payouts occur on the **1st and 15th** of each month (not 15th and 30th)
- All funds in Available Balance are included in the payout
- Funds are sent to seller's bank account automatically

---

## 📊 BIG CARDS (Hero Cards)

### 1. **Available to Withdraw (Earnings Card)**
**Location:** Left side, 2/3 width (md:col-span-2)

#### Logic:
```typescript
// Calculates available balance from completed transactions past hold period
getAvailableBalance(transactions: FinancialTransaction[]): number
```

**Calculation Steps:**
1. Filters transactions where:
   - `status === 'completed'`
   - `availableDate` exists
   - `availableDate <= now` (past 7-day hold period)
2. Sums `netToSeller` (net earnings after all fees) for filtered transactions

**Display Values:**
- **Main Value:** `availableBalance` - Amount ready to withdraw
- **Sub-info:** Count of completed bookings ready for payout
- **Breakdown:** Shows `totalEarnings` (from `financialSummary.netEarnings`)
- **Hold Period:** Shows `pendingBalance` if any transactions are in the 7-day hold
- **Next Payout:** Shows automatic payout schedule (1st/15th of month)

**Tooltip Logic Description:**
> "This is the amount you can withdraw right now. It includes all completed bookings that have passed the 7-day hold period. The hold period ensures service quality and protects against disputes. Funds are automatically paid out on the 1st and 15th of each month."

---

### 2. **Upcoming Earnings (Projected Earnings Card)**
**Location:** Right side, 1/3 width

#### Logic:
```typescript
// Calculates projected earnings from confirmed bookings not yet delivered
getProjectedEarnings(sellerId: string): { 
  amount: number; 
  count: number; 
  earliestDate?: Date; 
  latestDate?: Date 
}
```

**Calculation Steps:**
1. Filters bookings where:
   - `type === 'service'`
   - `status === 'confirmed'`
   - `paymentStatus === 'paid'`
   - `provider.id === sellerId`
2. For each booking, calculates net earnings:
   - Platform Fee: 2.5% of total amount
   - Payment Processing: 2.9% + $0.30
   - Transaction Fee: $0.25
   - Net = Total - (Platform Fee + Payment Processing + Transaction Fee)
3. Sums all net earnings and counts bookings
4. Returns earliest and latest booking dates

**Display Values:**
- **Main Value:** `projectedEarnings.amount` - Expected earnings from confirmed bookings
- **Count:** Number of confirmed bookings
- **Date Range:** Earliest and latest appointment dates

**Tooltip Logic Description:**
> "This shows your expected earnings from confirmed bookings that haven't been delivered yet. These are bookings where the customer has paid, but the service hasn't been completed. Once you complete the service and it's marked as completed, the funds will enter a 7-day hold period before becoming available for withdrawal."

---

## 📈 SMALL CARDS (Quick Stats Row)

### 3. **Total Revenue**
**Location:** Top row, first card

#### Logic:
```typescript
// From calculateFinancialSummary()
totalRevenue = earningTransactions.reduce((sum, t) => sum + t.amount, 0)
```

**Calculation Steps:**
1. Filters transactions by time filter (default: 30 days)
2. Excludes refunds (`type !== 'refund'`)
3. Sums all `amount` values (gross revenue before fees)

**Display Values:**
- **Main Value:** `financialSummary.totalRevenue` - Gross revenue
- **Trend:** Shows growth percentage vs last period
- **Time Period:** Based on selected filter (All Time / 30d / 7d / 24h)

**Tooltip Logic Description:**
> "This is your total gross revenue (before fees) for the selected time period. It includes all completed bookings and product sales. Revenue growth is calculated by comparing this period to the previous period. This number does not account for platform fees, payment processing, or transaction fees."

---

### 4. **Net Earnings**
**Location:** Top row, second card

#### Logic:
```typescript
// From calculateFinancialSummary()
netEarnings = completedTransactions.reduce((sum, t) => sum + t.netToSeller, 0)
```

**Calculation Steps:**
1. Filters transactions by time filter
2. Includes all completed transactions (including refunds, which are negative)
3. Sums `netToSeller` values (amount after all fees deducted)

**Display Values:**
- **Main Value:** `financialSummary.netEarnings` - Net after fees
- **Margin:** Percentage of net earnings vs total revenue
- **Time Period:** Based on selected filter

**Tooltip Logic Description:**
> "This is your net earnings after all fees are deducted. It includes: Platform Fee (2.5%), Payment Processing (2.9% + $0.30), and Transaction Fee ($0.25 per transaction). Refunds are automatically deducted from this amount. The margin percentage shows how much of your revenue you keep after fees."

---

### 5. **Transactions**
**Location:** Top row, third card

#### Logic:
```typescript
// From calculateFinancialSummary()
completedTransactions = earningTransactions.length
// (excludes refunds from count)
averageOrderValue = totalRevenue / earningTransactions.length
```

**Calculation Steps:**
1. Counts completed transactions (excluding refunds)
2. Calculates average order value: Total Revenue / Transaction Count

**Display Values:**
- **Main Value:** `financialSummary.completedTransactions` - Count of transactions
- **Sub-value:** Average order value

**Tooltip Logic Description:**
> "This shows the total number of completed transactions (bookings and product sales) in the selected time period. Refunds are not counted. The average order value helps you understand your typical transaction size and can guide pricing strategies."

---

### 6. **Disputes**
**Location:** Top row, fourth card

#### Logic:
```typescript
// Counts transactions with disputes or cancelled status
disputeCount = transactions.filter(t => 
  t.status === 'cancelled' || t.dispute
).length
disputeAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
```

**Calculation Steps:**
1. Filters transactions where:
   - `status === 'cancelled'` OR
   - `dispute === true`
2. Counts filtered transactions
3. Sums `amount` values for disputed transactions

**Display Values:**
- **Main Value:** Count of disputes/cancellations
- **Sub-value:** Total amount in dispute

**Tooltip Logic Description:**
> "This shows the number of transactions that have been cancelled or are in dispute. The amount shown represents the total value of funds currently in dispute. Disputed funds are held until the dispute is resolved. You can view individual transaction details to see dispute status and resolution."

---

## 🎨 TOOLTIP DISPLAY DESIGN

### **Purple-Themed Tooltip** (Selected)
**Appearance:** Light purple background with purple border, matching Upcoming Earnings card styling

**Color Scheme:**
- Background: `#F8F8FA` (light gray) or `#FFFFFF` (white) with purple accent
- Border: `#3D1560` (primary purple) - 2px solid
- Text Primary: `#1B1C20` (header text)
- Text Secondary: `#383A47` (body text)
- Text Tertiary: `#70727F` (secondary text)
- Accent: `#3D1560` (purple) for icons and highlights
- Icon Background: `#EDD9FF` (light purple)

**Features:**
- Clean, modern design that matches the card aesthetic
- Not too dark, easy on the eyes
- Consistent with the Upcoming Earnings card color palette
- Smooth fade-in/fade-out transitions
- Position: Top or bottom of card (avoids edge cut-off)
- Responsive: Adjusts position based on viewport

**Visual Example:**
```
[Card]
┌─────────────────┐
│ Total Revenue   │
│ $12,345.67      │
│ ↑ +12.5%        │
└─────────────────┘
         ↓ (hover)
┌─────────────────────────────────────┐
│ ╔═════════════════════════════════╗ │ ← Purple border (#3D1560)
│ ║ ℹ️ Total Revenue                ║ │
│ ║ ─────────────────────────────── ║ │
│ ║ The total amount you've earned  ║ │
│ ║ from all completed bookings     ║ │
│ ║ within the selected time period.║ │
│ ║                                 ║ │
│ ║ • Excludes refunds              ║ │
│ ║ • Includes all completed sales  ║ │
│ ╚═════════════════════════════════╝ │
└─────────────────────────────────────┘
```

**Technical Implementation:**
- Use React `onMouseEnter/onMouseLeave` handlers
- Position tooltips using absolute positioning relative to card
- Add smooth fade-in/fade-out transitions (200-300ms)
- Ensure tooltips don't overflow viewport (auto-position)
- Make tooltips accessible (keyboard navigation, ARIA labels)
- Z-index: 50 to appear above cards

---

## 📝 TOOLTIP CONTENT BY CARD (User-Friendly Descriptions)

### Available to Withdraw (Earnings Card)
**Tooltip Title:** Available to Withdraw

**Description:**
```
This is the money you can withdraw right now. 

When you complete a booking, its earnings are added to your Total Earnings. 
After a short holding period (to ensure service quality), those earnings 
become available here.

Payouts happen automatically twice a month (on the 1st and 15th of each 
month). When a payout runs, all money in your Available Balance will be 
sent to your bank account.
```

**Additional Info (if space allows):**
- Shows: [X] completed bookings ready for payout
- Total Earnings: $X,XXX.XX (all-time)
- Next payout: [Date]

---

### Upcoming Earnings (Projected Earnings Card)
**Tooltip Title:** Upcoming Earnings

**Description:**
```
This shows money you'll earn from bookings that are confirmed but not 
yet completed.

These are bookings where the customer has already paid, but you haven't 
delivered the service yet. Once you complete the service and mark it as 
done, the earnings will move to your Total Earnings and then become 
available after the holding period.
```

**Additional Info (if space allows):**
- [X] confirmed bookings
- Expected delivery: [Date range]

---

### Total Earnings (if shown separately)
**Tooltip Title:** Total Earnings

**Description:**
```
This shows how much you've earned from all completed bookings (all-time).

When a booking is completed, its amount is added to Total Earnings. The 
number shown here is the total number of completed bookings you've had.
```

**Additional Info:**
- [X] completed bookings (all-time)

---

### Holding Period (if shown as separate metric)
**Tooltip Title:** Holding Period

**Description:**
```
After you complete a booking, the earnings go through a holding period 
before becoming available for withdrawal.

This period ensures service quality and protects against disputes. Once 
the holding period ends, the money moves from "Holding" to your 
"Available Balance" and will be included in the next automatic payout.
```

**Additional Info:**
- Duration: 7 days after service completion

---

### Total Revenue (Quick Stats)
**Tooltip Title:** Total Revenue

**Description:**
```
The total amount you've earned from all completed bookings and sales 
within the selected time period.

This is the gross amount (before any fees are taken out). Revenue growth 
shows how much more (or less) you earned compared to the previous period.
```

**Note:** ⚠️ **CLARIFICATION NEEDED:** Should this be:
- All-time total (current implementation uses time filter)
- Most recent payout period
- Current month only

**Additional Info:**
- Time period: [Selected filter]
- Excludes: Refunds

---

### Net Earnings (Quick Stats)
**Tooltip Title:** Net Earnings

**Description:**
```
This is how much you actually keep after all fees are deducted from 
your revenue.

Fees include:
• Platform Fee: 2.5%
• Payment Processing: 2.9% + $0.30 per transaction
• Transaction Fee: $0.25 per transaction

The margin percentage shows what portion of your revenue you keep 
after fees.
```

**Note:** ⚠️ **CLARIFICATION NEEDED:** Should this be:
- All-time total (current implementation uses time filter)
- Most recent payout period
- Current month only

**Additional Info:**
- Time period: [Selected filter]
- Includes: Refunds (deducted from total)

---

### Transactions (Quick Stats)
**Tooltip Title:** Transactions

**Description:**
```
The total number of completed bookings and sales you've had within the 
selected time period.

This counts each successful transaction. Refunds are not included in 
this count. The average order value shows your typical transaction size.
```

**Note:** ⚠️ **CLARIFICATION NEEDED:** Should this be:
- All-time total (current implementation uses time filter)
- Most recent payout period
- Current month only

**Additional Info:**
- Time period: [Selected filter]
- Average order: $X,XXX.XX

---

### Disputes (Quick Stats)
**Tooltip Title:** Disputes

**Description:**
```
The number of bookings or orders that have been cancelled or are 
currently in dispute.

The amount shown is the total value of funds that are currently being 
held due to disputes. These funds will remain on hold until the dispute 
is resolved. You can view individual transaction details to see the 
status of each dispute.
```

**Additional Info:**
- Total in dispute: $X,XXX.XX
- Status: Active disputes

