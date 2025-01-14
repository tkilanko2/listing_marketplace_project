# Database Schema Documentation

## Overview

The database schema is designed to support a marketplace platform that handles both products and services. The schema uses MongoDB as the database system, taking advantage of its flexible document model for varying product and service attributes.

## Core Collections

### Users Collection
```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'provider' | 'admin';
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  status: 'active' | 'suspended' | 'inactive';
}
```

### Providers Collection
```typescript
interface Provider {
  _id: ObjectId;
  userId: ObjectId;  // Reference to User
  username: string;
  avatar: string;
  rating: number;
  totalBookings: number;
  joinedDate: Date;
  isOnline: boolean;
  location: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  reviews: Review[];
  responseTime: string;
  responseRate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
    }
  };
}

interface Review {
  _id: ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  customerName: string;
  customerId: ObjectId;  // Reference to User
}
```

### Listings Collection
```typescript
// Base interface for all listings
interface BaseListing {
  _id: ObjectId;
  type: 'product' | 'service';
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  views: number;
  saves: number;
  providerId: ObjectId;  // Reference to Provider
  category: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  trending: boolean;
  recommended: boolean;
}

// Product-specific fields
interface Product extends BaseListing {
  type: 'product';
  condition: 'new' | 'used' | 'refurbished';
  brand?: string;
  model?: string;
  availableQuantity: number;
  specifications: Record<string, string>;
  features: string[];
  shippingOptions?: {
    method: string;
    cost: number;
    estimatedDays: number;
  }[];
}

// Service-specific fields
interface Service extends BaseListing {
  type: 'service';
  duration: number;  // in minutes
  serviceType: string;
  serviceArea: string;
  availability: string;
  pricingStructure: string;
  languagesSpoken: string[];
  serviceMode: 'online' | 'in-person' | 'both';
  cancellationPolicy?: string;
  requirements?: string[];
}
```

### Categories Collection
```typescript
interface Category {
  _id: ObjectId;
  name: string;
  slug: string;
  parentId?: ObjectId;  // For subcategories
  description: string;
  icon: string;
  displayOrder: number;
  type: 'product' | 'service' | 'both';
  services?: {
    name: string;
    images: string[];
  }[];
  products?: {
    name: string;
    brand?: string;
    model?: string;
    images: string[];
    specifications: Record<string, string>;
  }[];
}
```

### Bookmarks Collection
```typescript
interface Bookmark {
  _id: ObjectId;
  userId: ObjectId;
  listingId: ObjectId;
  createdAt: Date;
  type: 'product' | 'service';
}
```

### Orders Collection
```typescript
interface Order {
  _id: ObjectId;
  userId: ObjectId;
  providerId: ObjectId;
  listingId: ObjectId;
  type: 'product' | 'service';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;  // For services
  quantity?: number;     // For products
  shippingAddress?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
}
```

## Indexes

### Primary Indexes
```javascript
// Users Collection
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

// Listings Collection
db.listings.createIndex({ "providerId": 1 });
db.listings.createIndex({ "category": 1 });
db.listings.createIndex({ "type": 1 });
db.listings.createIndex({ 
  "location.city": 1,
  "location.country": 1 
});

// Categories Collection
db.categories.createIndex({ "slug": 1 }, { unique: true });
db.categories.createIndex({ "parentId": 1 });

// Orders Collection
db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "providerId": 1 });
db.orders.createIndex({ "listingId": 1 });
```

### Search Indexes
```javascript
// Text search indexes
db.listings.createIndex({
  "name": "text",
  "description": "text",
  "shortDescription": "text",
  "longDescription": "text"
});

// Geospatial index for location-based queries
db.listings.createIndex({
  "location.coordinates": "2dsphere"
});
```

## Data Relationships

### One-to-Many Relationships
- User -> Orders
- Provider -> Listings
- Provider -> Reviews
- Category -> Subcategories

### Many-to-Many Relationships
- Users <-> Listings (through Bookmarks)
- Users <-> Providers (through Orders)

## Data Validation

### Listing Validation Rules
```javascript
{
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "name", "price", "providerId", "category"],
      properties: {
        price: {
          bsonType: "number",
          minimum: 0
        },
        type: {
          enum: ["product", "service"]
        },
        status: {
          enum: ["active", "inactive", "pending", "rejected"]
        }
      }
    }
  }
}
```

### Provider Validation Rules
```javascript
{
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "userId", "location"],
      properties: {
        rating: {
          bsonType: "number",
          minimum: 0,
          maximum: 5
        },
        verificationStatus: {
          enum: ["pending", "verified", "rejected"]
        }
      }
    }
  }
}
```

## Data Migration Considerations

### Version Control
```javascript
{
  schemaVersion: 1,
  migrations: {
    1: function(db) {
      // Add new fields with default values
      db.listings.updateMany({}, {
        $set: {
          trending: false,
          recommended: false
        }
      });
    }
  }
}
```

### Backup Strategy
```javascript
{
  backup: {
    frequency: "daily",
    retention: "30 days",
    type: "incremental",
    locations: ["primary", "secondary"]
  }
}
``` 