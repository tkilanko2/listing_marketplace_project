# KYC Card Expanded Checklist Design

## Current KYC Card Structure

```tsx
<div className="bg-white rounded-lg shadow-lg border border-[#E8E9ED]">
  <div className="px-6 py-4 border-b border-[#E8E9ED]">
    <h2>KYC Verification</h2>
  </div>
  <div className="p-6">
    <div className="space-y-4">
      {/* Single Identity Verification Item */}
    </div>
  </div>
</div>
```

---

## Proposed Expanded Design

### Visual Layout

```
┌─────────────────────────────────────────────┐
│ 🛡️ KYC Verification                        │
├─────────────────────────────────────────────┤
│                                             │
│ Overall Status: [2/2 Complete]              │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│                                             │
│ ────────────────────────────────────────── │
│                                             │
│ ✓ Identity Verification                    │
│   Government-issued ID verification         │
│   [Verified Badge]                         │
│                                             │
│ ────────────────────────────────────────── │
│                                             │
│ ⏳ Proof of Address                        │
│   Upload utility bill or bank statement     │
│   [Pending Badge] [Upload Document]        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Implementation Details

### 1. Overall Status Indicator (New)
**Location:** Top of card body, before checklist items

```tsx
<div className="mb-4 pb-4 border-b border-[#E8E9ED]">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-[#383A47]">
      Overall Status
    </span>
    <span className="text-sm font-semibold text-[#3D1560]">
      1/2 Complete
    </span>
  </div>
  {/* Progress Bar */}
  <div className="w-full bg-[#E8E9ED] rounded-full h-2">
    <div 
      className="bg-[#3D1560] h-2 rounded-full transition-all"
      style={{ width: '50%' }}
    />
  </div>
</div>
```

### 2. Checklist Items Structure

Each item follows this pattern:

```tsx
<div className="space-y-4">
  {/* Item 1: Identity Verification */}
  <div>
    <div className="flex items-start gap-3 mb-3">
      {/* Status Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {status === 'verified' ? (
          <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
        ) : status === 'pending' ? (
          <Clock className="w-5 h-5 text-[#DAA520]" />
        ) : (
          <Circle className="w-5 h-5 text-[#CDCED8]" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-md font-medium text-[#383A47]">
            Identity Verification
          </h3>
          <span className="px-2 py-1 text-xs bg-[#E8F5E9] text-[#4CAF50] rounded-full">
            Verified
          </span>
        </div>
        <p className="text-sm text-[#70727F]">
          Government-issued ID verification
        </p>
      </div>
    </div>
  </div>

  {/* Divider */}
  <div className="border-t border-[#E8E9ED]"></div>

  {/* Item 2: Proof of Address */}
  <div>
    {/* Same structure as above */}
    {/* Show button when not verified */}
    {status !== 'verified' && (
      <button className="mt-3 px-3 py-1.5 text-xs bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] transition-all font-medium shadow-sm">
        Upload Proof of Address
      </button>
    )}
  </div>
</div>
```

---

## Status Icons & Badges

### Icons (from lucide-react)
- **Verified**: `CheckCircle` (green `#4CAF50`)
- **Pending**: `Clock` (yellow `#DAA520`)
- **Not Started**: `Circle` (gray `#CDCED8`)

### Badges
- **Verified**: `bg-[#E8F5E9] text-[#4CAF50]`
- **Pending**: `bg-[#FFF8DD] text-[#DAA520]`
- **Not Started**: `bg-[#FFE5ED] text-[#DF678C]`

---

## Compatibility with Current Design

### ✅ **Will Work Well Because:**

1. **Same Card Structure**
   - Uses existing white card with shadow
   - Same header styling
   - Same padding (`p-6`)

2. **Existing Spacing System**
   - `space-y-4` already supports multiple items
   - Dividers fit naturally between items
   - Consistent with other cards on page

3. **Reusable Styling Patterns**
   - Status badges use same color scheme
   - Buttons use same styling
   - Typography matches existing design

4. **Responsive Design**
   - Card already responsive
   - Grid layout (3 columns) won't break
   - Content stacks naturally on mobile

### ⚠️ **Considerations:**

1. **Card Height**
   - Card will be taller (2 items + progress bar)
   - Still fits within grid layout
   - May need to ensure other cards in row have similar height

2. **Progress Bar**
   - New element, but simple implementation
   - Uses existing color palette
   - Clear visual indicator

3. **Icon Integration**
   - Need to import `CheckCircle`, `Clock`, `Circle` from lucide-react
   - Icons match existing design system

---

## Final Structure

```tsx
<div className="bg-white rounded-lg shadow-lg border border-[#E8E9ED]">
  {/* Header - Unchanged */}
  <div className="px-6 py-4 border-b border-[#E8E9ED]">
    <h2 className="text-xl font-semibold text-[#1B1C20] flex items-center">
      <Shield className="h-5 w-5 mr-2 text-[#3D1560]" />
      KYC Verification
    </h2>
  </div>
  
  {/* Body - Expanded */}
  <div className="p-6">
    {/* Overall Status */}
    <div className="mb-4 pb-4 border-b border-[#E8E9ED]">
      {/* Progress indicator */}
    </div>
    
    {/* Checklist Items */}
    <div className="space-y-4">
      {/* Identity Verification Item */}
      {/* Divider */}
      {/* Proof of Address Item */}
    </div>
  </div>
</div>
```

---

## Conclusion

**✅ YES, this will work perfectly with the current design!**

The expanded checklist approach:
- ✅ Fits naturally into existing card structure
- ✅ Uses current design patterns and colors
- ✅ Maintains responsive layout
- ✅ Provides clear progress tracking
- ✅ No breaking changes to layout

The only additions needed:
- Progress bar component (simple div with width)
- Status icons (CheckCircle, Clock, Circle)
- Divider between items

All styling matches existing design system.
