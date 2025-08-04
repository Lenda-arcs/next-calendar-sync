# Enhanced Invoice Numbering System

## Overview

The enhanced invoice numbering system provides professional, readable invoice numbers that include smart entity abbreviations and year information while maintaining German compliance requirements.

## Features

- ✅ **Professional appearance** - No more single-digit numbers
- ✅ **Smart entity identification** - Intelligent abbreviations based on word structure
- ✅ **Year tracking** - Clear chronological organization
- ✅ **German compliance** - Still non-sequential per user
- ✅ **Scalable** - 3-digit sequence allows 999 invoices per year per entity
- ✅ **Flexible** - Supports custom prefixes

## Format

### Basic Format
```
[PREFIX]-[ENTITY]-[YEAR]-[SEQUENCE]
```

### Examples

**No Prefix:**
- `RY-2025-001` (Roots Yoga)
- `YS-2025-002` (Yoga Studio Berlin)
- `WE-2025-003` (Wellness)

**With Prefix:**
- `INV-RY-2025-001` (Invoice - Roots Yoga)
- `INV-YS-2025-002` (Invoice - Yoga Studio Berlin)

**Custom Prefix:**
- `BILL-WE-2025-001` (Bill - Wellness)
- `BILL-RY-2025-002` (Bill - Roots Yoga)

## Smart Entity Abbreviation Rules

The system intelligently creates abbreviations based on the entity name structure:

### **Two Words** → First letter of each word
- "Roots Yoga" → "RY"
- "Yoga Studio" → "YS"
- "Wellness Center" → "WC"

### **Three or More Words** → First letter of first two words
- "Yoga Studio Berlin" → "YS"
- "The Great Yoga Studio" → "TG"
- "Wellness Center Berlin" → "WC"

### **Single Word** → First two letters (if length ≥ 2)
- "Wellness" → "WE"
- "Studio" → "ST"
- "YO" → "YO"

### **Very Short Single Word** → First letter + "X"
- "A" → "AX"
- "I" → "IX"

### **Fallback**
- Empty/null names → "INV"

### Examples:
- "Roots Yoga" → "RY" ✅
- "Yoga Studio Berlin" → "YS" ✅
- "Wellness" → "WE" ✅
- "YO" → "YO" ✅
- "A" → "AX" ✅
- "The Great Yoga Studio" → "TG" ✅

## Database Function

### Signature
```sql
get_next_invoice_number(
  p_user_id UUID, 
  p_entity_name VARCHAR DEFAULT '',
  p_prefix VARCHAR DEFAULT ''
) RETURNS VARCHAR
```

### Parameters
- `p_user_id`: User ID for sequence tracking
- `p_entity_name`: Studio/entity name for smart abbreviation
- `p_prefix`: Optional custom prefix

### Returns
Formatted invoice number string

## TypeScript Integration

### Function Signature
```typescript
generateGermanCompliantInvoiceNumber(
  userId: string, 
  entityName?: string,
  userPrefix?: string
): Promise<string>
```

### Usage Example
```typescript
const invoiceNumber = await generateGermanCompliantInvoiceNumber(
  userId,
  'Roots Yoga',  // Entity name
  'INV'          // Optional prefix
)
// Returns: "INV-RY-2025-001"
```

## Migration

### Running the Migration
```bash
# Apply the enhanced invoice numbering migration
psql $DATABASE_URL -f sql/update_invoice_numbering.sql
```

### Testing
```bash
# Run the test script
./scripts/test-enhanced-invoice-numbers.sh
```

## Benefits

1. **Professional Appearance**: Invoice numbers now look business-ready
2. **Smart Identification**: Intelligent abbreviations that are easy to understand
3. **Year Organization**: Clear chronological grouping
4. **Scalability**: Supports up to 999 invoices per year per entity
5. **Compliance**: Maintains German non-sequential requirements
6. **Flexibility**: Supports custom prefixes for different use cases
7. **Intuitive**: Abbreviations follow natural language patterns

## Backward Compatibility

- Existing invoice numbers remain unchanged
- New invoices use the enhanced format
- Fallback to old format if database function fails
- Optional reset of sequences for users with few invoices

## Configuration

Users can set custom prefixes in their invoice settings:
- `invoice_number_prefix` field in `user_invoice_settings`
- Empty prefix uses entity-only format
- Custom prefix adds prefix-entity-year-sequence format 