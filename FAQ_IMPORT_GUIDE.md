# FAQ Content Import Guide

This guide explains how to use the CSV templates to plan and import FAQ content.

## CSV Files

### 1. FAQ_CATEGORIES_TEMPLATE.csv
Use this file to define FAQ categories and their structure.

**Columns:**
- `id` - Unique identifier (lowercase, hyphens) - e.g., "getting-started"
- `name` - Display name - e.g., "Getting Started"
- `icon` - Icon name from lucide-react - e.g., "Rocket", "Shield", "Calendar"
- `description` - Brief description shown on category cards
- `tab` - Which tab this belongs to: "general" or "seller"
- `faqCount` - Number of FAQs in this category (will be auto-calculated on import)
- `hasSubcategories` - "true" or "false"
- `subcategories` - Comma-separated list if hasSubcategories is true, e.g., "Payment Methods,Refunds"

**Available Icons:**
- Rocket, Shield, CreditCard, Settings, ShieldCheck
- Calendar, ShoppingBag, Star, MessageCircle
- Store, FileText, Package, DollarSign, BarChart3, FileCheck

### 2. FAQ_ITEMS_TEMPLATE.csv
Use this file to define individual FAQ items.

**Columns:**
- `id` - Unique identifier - e.g., "faq-gen-001", "faq-buyer-001", "faq-seller-001"
- `question` - The FAQ question (use double quotes for commas in text)
- `answer` - The FAQ answer (use double quotes for commas/newlines in text)
- `category` - Must match a category name from categories CSV
- `subcategory` - Optional, must match a subcategory from the category
- `tab` - "general" or "seller"
- `tags` - Comma-separated tags for search - e.g., "booking,service,how-to"
- `views` - Optional, number of views (default: 0)
- `helpful` - Optional, helpful count (default: 0)
- `notHelpful` - Optional, not helpful count (default: 0)

## CSV Formatting Rules

1. **Text with commas**: Wrap in double quotes
   ```
   "This is a question, with commas, in it"
   ```

2. **Text with quotes**: Use double quotes and escape internal quotes
   ```
   "Click ""Sign Up"" in the top right"
   ```

3. **Multi-line text**: Use double quotes and \n for newlines
   ```
   "Line 1\nLine 2\nLine 3"
   ```

4. **Empty fields**: Leave empty or use empty string
   ```
   ,,,
   ```

5. **Boolean values**: Use "true" or "false" (lowercase)

6. **Comma-separated lists**: Separate with commas, no spaces
   ```
   "tag1,tag2,tag3"
   ```

## Example Workflow

1. **Plan Categories**: Fill out `FAQ_CATEGORIES_TEMPLATE.csv` with all categories
2. **Plan FAQs**: Fill out `FAQ_ITEMS_TEMPLATE.csv` with all FAQ items
3. **Review**: Check that category names match between files
4. **Import**: Use a script to parse CSV and generate TypeScript code

## Import Script Structure

The import script should:
1. Parse both CSV files
2. Validate category names match
3. Count FAQs per category automatically
4. Generate TypeScript code in the format:
   ```typescript
   export const faqCategories: FAQCategory[] = [
     // ... parsed from CSV
   ];
   
   export const mockFAQs: FAQItem[] = [
     // ... parsed from CSV
   ];
   ```

## Validation Rules

- Category IDs must be unique
- FAQ IDs must be unique
- Category names in FAQ items must exist in categories CSV
- Subcategory names must match those defined in the category
- Tab values must be "general" or "seller"
- Icon names must be valid lucide-react icon names

## Tips

- Use consistent naming: `faq-{tab}-{number}` for FAQ IDs
- Group related FAQs under the same category
- Use descriptive tags for better search results
- Keep answers concise but complete
- Test search functionality with your tags
