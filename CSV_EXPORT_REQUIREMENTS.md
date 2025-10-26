# CSV Export - Requirements & Questions

## 📋 Information I Need from You

### 1. Export Scope
**Question:** What should be exported when seller clicks "Export Reports"?

**Options:**
- A) All transactions (entire history)
- B) Filtered transactions (based on current view/date filter)
- C) Let seller choose (modal with options)

**My Recommendation:** Option C - Give seller choice via modal

---

### 2. Export Format & Columns

**Proposed Columns for Transaction Export:**

#### Basic Info:
1. Transaction ID
2. Booking/Order ID
3. Date
4. Service/Product Name
5. Customer Name (formatted)

#### Financial Details:
6. Gross Amount
7. Platform Fee (2.5%)
8. Payment Processing Fee
9. Transaction Fee
10. Net to Seller
11. Currency

#### Status & Timeline:
12. Status (completed, pending, etc.)
13. Payment Method
14. Completion Date
15. Available Date
16. Settlement Date

#### Additional:
17. Category (service/product)
18. Tax Amount
19. Tax Rate
20. Region

**Question:** Should I include ALL these columns or a subset?

---

### 3. File Naming Convention

**Proposed Format:**
```
transactions_export_YYYY-MM-DD.csv
earnings_report_Oct_2025.csv
financial_report_2025_Q4.csv
```

**Question:** Which naming format do you prefer?

---

### 4. Date Range Options

**Should sellers be able to export by:**
- [ ] All time
- [ ] This month
- [ ] Last month
- [ ] This quarter
- [ ] This year
- [ ] Custom date range

**Question:** Which date range options should be available?

---

### 5. Multiple Export Types

**Should we offer different export templates?**

A) **Transaction Export** (detailed)
- Every transaction with all fields
- For detailed reconciliation

B) **Tax Summary Export** (by period)
- Aggregated by month/quarter
- Tax collected by region
- For tax filing

C) **Payout Summary Export**
- Grouped by payout batch
- Shows what was paid when
- For bank reconciliation

D) **Listing Performance Export**
- Revenue per listing
- Booking counts
- Average prices
- For business analysis

**Question:** Should I implement all 4 types, or start with Transaction Export only?

---

### 6. Export Trigger Location

**Where should export be available?**
- [x] Quick Actions sidebar (current button)
- [ ] Transaction list header (inline button)
- [ ] Top of page (toolbar)
- [ ] Multiple locations (convenience)

**Question:** Should export be available in multiple places?

---

### 7. User Feedback

**After export, what should happen?**

A) Silent download (just downloads file)
B) Toast notification ("Report exported successfully!")
C) Modal confirmation with options
D) Download + show preview

**Question:** What feedback should seller receive?

---

## 💡 My Recommendations (Default Implementation)

### If you want me to proceed without further input, I'll implement:

**Export Scope:**
- Modal asking seller to choose:
  - All transactions
  - Current filtered view (last 30 days by default)
  - Custom date range

**Columns Included:**
- Transaction ID, Date, Service Name
- Customer Name, Gross Amount, Net Amount
- Platform Fee, Processing Fee, Transaction Fee
- Status, Payment Method, Available Date

**File Name:**
```
transactions_YYYY-MM-DD.csv
```

**Export Types:**
- Start with Transaction Export only
- Can add others later

**User Experience:**
1. Click "Export Reports"
2. Modal opens with date range options
3. Click "Download"
4. CSV downloads
5. Toast: "✅ Report exported successfully!"

**Location:**
- Quick Actions sidebar (current button)

---

## ❓ Your Input Needed

Please confirm or adjust:

1. **Export what?** All transactions vs filtered vs let user choose?
2. **Which columns?** All 20 columns vs essential subset?
3. **File naming?** Preference on format?
4. **Export types?** Just transactions or multiple report types?
5. **Any specific requirements** for your accounting software?

Once you confirm, I can implement immediately! 🚀

