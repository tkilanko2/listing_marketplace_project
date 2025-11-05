# Option 2 Variations: Small Solid Buttons

## Current State (For Reference)
```tsx
className="text-xs text-[#3D1560] hover:text-[#6D26AB] font-medium"
```
Small text link - very subtle

---

## Variation A: Compact Button (Smallest)
**Size:** Smallest footprint, minimal padding
**Best for:** Dense layouts, cards with limited space

```tsx
className="px-2.5 py-1 text-xs bg-[#3D1560] text-white rounded-md hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all font-medium"
```

**Characteristics:**
- Padding: `px-2.5 py-1` (compact)
- Text: `text-xs` (12px)
- Border radius: `rounded-md` (6px - subtle rounding)
- No shadow
- Minimal visual weight

**Visual:** `[Manage Shop]` (very compact button)

---

## Variation B: Standard Small Button (Recommended)
**Size:** Standard small button size
**Best for:** Most use cases, balanced visibility

```tsx
className="px-3 py-1.5 text-xs bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all font-medium shadow-sm"
```

**Characteristics:**
- Padding: `px-3 py-1.5` (standard small)
- Text: `text-xs` (12px)
- Border radius: `rounded-lg` (8px - more rounded)
- Light shadow: `shadow-sm` (subtle depth)
- Good balance of size and visibility

**Visual:** `[  Manage Shop  ]` (standard small button with subtle shadow)

---

## Variation C: Medium Button (More Prominent)
**Size:** Slightly larger, more prominent
**Best for:** Important actions, better mobile tap targets

```tsx
className="px-4 py-2 text-sm bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all font-medium shadow-sm hover:shadow-md"
```

**Characteristics:**
- Padding: `px-4 py-2` (medium)
- Text: `text-sm` (14px - slightly larger)
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-sm` with `hover:shadow-md` (more depth)
- Better for mobile/accessibility (larger tap target)

**Visual:** `[   Manage Shop   ]` (medium button with enhanced shadow)

---

## Variation D: Enhanced Button (Maximum Visibility)
**Size:** Larger with enhanced styling
**Best for:** Maximum visibility, premium feel

```tsx
className="px-4 py-2 text-sm bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all font-medium shadow-md border border-[#2A0F45] hover:border-[#5A1F8A]"
```

**Characteristics:**
- Padding: `px-4 py-2` (medium)
- Text: `text-sm` (14px)
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-md` (more pronounced)
- Dark border: `border border-[#2A0F45]` (adds depth/definition)
- Border hover effect: `hover:border-[#5A1F8A]`
- Premium, polished appearance

**Visual:** `[   Manage Shop   ]` (enhanced button with border and shadow)

---

## Side-by-Side Comparison

| Variation | Padding | Text Size | Shadow | Border | Visual Weight |
|-----------|---------|-----------|--------|--------|---------------|
| **A: Compact** | px-2.5 py-1 | xs (12px) | None | None | ⭐⭐ Light |
| **B: Standard** | px-3 py-1.5 | xs (12px) | sm | None | ⭐⭐⭐ Medium |
| **C: Medium** | px-4 py-2 | sm (14px) | sm→md | None | ⭐⭐⭐⭐ Medium-High |
| **D: Enhanced** | px-4 py-2 | sm (14px) | md | Yes | ⭐⭐⭐⭐⭐ High |

---

## Visual Preview

```
Current:     Manage Shop  (text link)

Variation A: [Manage Shop]           (compact, minimal)
Variation B: [  Manage Shop  ]       (standard, balanced)
Variation C: [   Manage Shop   ]     (medium, more prominent)
Variation D: [   Manage Shop   ]     (enhanced, premium feel)
             ↑ darker border + shadow
```

---

## Recommendations by Use Case

### **Variation A (Compact)**
- ✅ Good for: Dense cards, when space is limited
- ✅ Best for: Cards with lots of content
- ⚠️ Consider: May be too small for mobile

### **Variation B (Standard)** ⭐ **RECOMMENDED**
- ✅ Good for: Most settings pages
- ✅ Best for: Balanced visibility and space
- ✅ Works well: Desktop and mobile
- ✅ Professional appearance

### **Variation C (Medium)**
- ✅ Good for: Important actions
- ✅ Best for: Better mobile UX (larger tap targets)
- ✅ Works well: When you want more prominence

### **Variation D (Enhanced)**
- ✅ Good for: Maximum visibility
- ✅ Best for: Premium feel, important CTAs
- ✅ Works well: When buttons need to stand out
- ⚠️ Consider: May feel heavy in some contexts

---

## Implementation Notes

All variations will:
- ✅ Use the same purple color scheme (`#3D1560` → `#6D26AB` on hover)
- ✅ Have smooth transitions
- ✅ Be accessible (keyboard navigation, focus states)
- ✅ Work consistently across all CTAs on the page

**CTAs to update:**
1. "View" / "Configure" (Global Seller Policy)
2. "Manage Shop" (Shop Information)
3. "Verify Identity" (KYC)
4. "Verify Business" (KYB)
5. "Modify" (Bank Account)
6. "Change" (Payout Schedule)
7. "Configure" (Notifications)
8. "Manage" (Calendar)

---

## Next Steps

Please choose which variation (A, B, C, or D) you prefer, and I'll implement it across all CTAs on the Seller Settings page.

