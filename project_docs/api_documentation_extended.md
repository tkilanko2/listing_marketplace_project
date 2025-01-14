# Extended API Documentation

## Validation Rules

### Common Validation Rules
```typescript
const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    message: 'Must be a valid email address'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
  },
  phone: {
    pattern: /^\+?[\d\s-]{10,}$/,
    message: 'Must be a valid phone number'
  },
  price: {
    min: 0,
    max: 1000000,
    message: 'Must be between 0 and 1,000,000'
  }
};
```

## Detailed Error Scenarios

### Authentication Errors

#### Login Errors
```typescript
{
  // Invalid credentials
  error: {
    code: 'INVALID_CREDENTIALS',
    message: 'Email or password is incorrect',
    status: 401
  }
}

{
  // Account locked
  error: {
    code: 'ACCOUNT_LOCKED',
    message: 'Account locked due to multiple failed attempts',
    details: {
      remainingTime: 900, // seconds
      attempts: 5
    },
    status: 403
  }
}

{
  // Unverified email
  error: {
    code: 'UNVERIFIED_EMAIL',
    message: 'Please verify your email address',
    details: {
      verificationSent: true,
      email: 'ma***@example.com'
    },
    status: 403
  }
}
```

#### Registration Errors
```typescript
{
  // Email already exists
  error: {
    code: 'EMAIL_EXISTS',
    message: 'This email is already registered',
    status: 409
  }
}

{
  // Invalid password
  error: {
    code: 'INVALID_PASSWORD',
    message: 'Password does not meet requirements',
    details: {
      requirements: [
        'Minimum 8 characters',
        'At least one uppercase letter',
        'At least one number',
        'At least one special character'
      ]
    },
    status: 400
  }
}
```

### Listing Errors

#### Create Listing Errors
```typescript
{
  // Invalid images
  error: {
    code: 'INVALID_IMAGES',
    message: 'Invalid image uploads',
    details: {
      maxSize: '5MB',
      allowedTypes: ['image/jpeg', 'image/png'],
      invalidFiles: ['image1.pdf', 'image2.gif']
    },
    status: 400
  }
}

{
  // Category not found
  error: {
    code: 'INVALID_CATEGORY',
    message: 'Selected category does not exist',
    details: {
      availableCategories: ['Electronics', 'Fashion', 'Home']
    },
    status: 400
  }
}

{
  // Provider verification required
  error: {
    code: 'VERIFICATION_REQUIRED',
    message: 'Provider verification required to create listings',
    details: {
      verificationStatus: 'pending',
      requirements: ['Business license', 'ID verification']
    },
    status: 403
  }
}
```

### Order Errors

#### Create Order Errors
```typescript
{
  // Insufficient stock
  error: {
    code: 'INSUFFICIENT_STOCK',
    message: 'Requested quantity not available',
    details: {
      available: 5,
      requested: 10
    },
    status: 400
  }
}

{
  // Invalid schedule
  error: {
    code: 'INVALID_SCHEDULE',
    message: 'Selected time slot is not available',
    details: {
      availableSlots: [
        { date: '2024-01-20', slots: ['09:00', '14:00'] },
        { date: '2024-01-21', slots: ['10:00', '15:00'] }
      ]
    },
    status: 400
  }
}

{
  // Payment required
  error: {
    code: 'PAYMENT_REQUIRED',
    message: 'Payment is required to complete order',
    details: {
      amount: 199.99,
      currency: 'USD',
      paymentMethods: ['credit_card', 'paypal']
    },
    status: 402
  }
}
```

## Example Responses

### Successful Listing Creation
```typescript
{
  id: 'lst_123abc',
  status: 'active',
  message: 'Listing created successfully',
  listing: {
    id: 'lst_123abc',
    type: 'product',
    name: 'iPhone 13 Pro',
    description: 'Brand new, sealed in box',
    price: 999.99,
    images: [
      'https://api.marketplace.com/images/iphone13pro-1.jpg',
      'https://api.marketplace.com/images/iphone13pro-2.jpg'
    ],
    provider: {
      id: 'usr_456def',
      name: 'Tech Store',
      avatar: 'https://api.marketplace.com/avatars/techstore.jpg',
      rating: 4.8
    },
    category: 'Electronics',
    location: {
      city: 'San Francisco',
      country: 'USA',
      coordinates: [37.7749, -122.4194]
    },
    specifications: {
      'Storage': '256GB',
      'Color': 'Graphite',
      'Condition': 'New'
    },
    status: 'active',
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z'
  }
}
```

### Successful Order Creation
```typescript
{
  orderId: 'ord_789ghi',
  status: 'pending',
  paymentUrl: 'https://api.marketplace.com/payment/ord_789ghi',
  order: {
    id: 'ord_789ghi',
    userId: 'usr_123abc',
    listingId: 'lst_456def',
    status: 'pending',
    amount: 999.99,
    paymentStatus: 'pending',
    quantity: 1,
    scheduledDate: '2024-01-20T10:00:00Z',
    shippingAddress: {
      street: '123 Market St',
      city: 'San Francisco',
      country: 'USA',
      postalCode: '94105'
    },
    contactInfo: {
      email: 'john@example.com',
      phone: '+1234567890'
    },
    createdAt: '2024-01-14T12:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z'
  }
}
```

## Rate Limiting Details

### Rate Limit Headers
```typescript
{
  'X-RateLimit-Limit': '100',
  'X-RateLimit-Remaining': '95',
  'X-RateLimit-Reset': '1705238400'
}
```

### Rate Limit Error
```typescript
{
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests',
    details: {
      limit: 100,
      remaining: 0,
      resetTime: '2024-01-14T13:00:00Z',
      retryAfter: 300 // seconds
    },
    status: 429
  }
}
```

## WebSocket Event Examples

### Real-time Order Updates
```typescript
// Order status change
socket.on('order.update', {
  orderId: 'ord_789ghi',
  status: 'confirmed',
  timestamp: '2024-01-14T12:05:00Z',
  details: {
    previousStatus: 'pending',
    updatedBy: 'provider',
    notification: {
      title: 'Order Confirmed',
      message: 'Your order #789ghi has been confirmed'
    }
  }
});

// Payment received
socket.on('order.payment', {
  orderId: 'ord_789ghi',
  status: 'paid',
  timestamp: '2024-01-14T12:10:00Z',
  amount: 999.99,
  paymentMethod: 'credit_card'
});
```

### Chat Events
```typescript
// New message
socket.on('chat.message', {
  conversationId: 'conv_123abc',
  message: {
    id: 'msg_456def',
    content: 'Hello, is this still available?',
    sender: {
      id: 'usr_789ghi',
      name: 'John Doe',
      avatar: 'https://api.marketplace.com/avatars/johndoe.jpg'
    },
    timestamp: '2024-01-14T12:15:00Z',
    attachments: []
  }
});

// Typing indicator
socket.on('chat.typing', {
  conversationId: 'conv_123abc',
  user: {
    id: 'usr_789ghi',
    name: 'John Doe'
  },
  isTyping: true
});
```

## Security Headers

### Required Headers
```typescript
{
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-XSS-Protection': '1; mode=block'
}
```

## File Upload Specifications

### Image Upload Rules
```typescript
const ImageUploadRules = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  dimensions: {
    minWidth: 800,
    minHeight: 600,
    maxWidth: 4096,
    maxHeight: 4096
  },
  optimization: {
    quality: 0.8,
    format: 'webp',
    generateThumbnails: true,
    thumbnailSizes: [
      { width: 150, height: 150 },
      { width: 300, height: 300 }
    ]
  }
};
``` 