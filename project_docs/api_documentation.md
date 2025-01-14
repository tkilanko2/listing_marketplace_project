# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.marketplace.com/api
```

## Authentication

### Headers
```typescript
{
  'Authorization': 'Bearer <jwt_token>',
  'Content-Type': 'application/json'
}
```

### Rate Limiting
- 100 requests per 15-minute window per IP
- 1000 requests per hour per authenticated user

## Endpoints

### Authentication

#### Login
```typescript
POST /auth/login
Request:
{
  email: string;
  password: string;
  rememberMe?: boolean;
}

Response:
{
  token: string;
  user: {
    id: string;
    email: string;
    role: 'user' | 'provider' | 'admin';
    name: string;
    avatar?: string;
  };
  expiresIn: number;
}

Error Response:
{
  error: 'INVALID_CREDENTIALS' | 'ACCOUNT_DISABLED' | 'UNVERIFIED_EMAIL';
  message: string;
}
```

#### Register
```typescript
POST /auth/register
Request:
{
  email: string;
  password: string;
  name: string;
  role: 'user' | 'provider';
  acceptTerms: boolean;
}

Response:
{
  user: {
    id: string;
    email: string;
    role: string;
    verificationStatus: 'pending';
  };
  message: string;
}
```

#### Verify Email
```typescript
POST /auth/verify/:token
Response:
{
  verified: boolean;
  message: string;
}
```

### Listings

#### Search Listings
```typescript
POST /listings/search
Request:
{
  query?: string;
  filters: {
    category?: string[];
    priceRange?: [number, number];
    location?: {
      city?: string;
      country?: string;
      radius?: number;
      coordinates?: [number, number];
    };
    type?: 'product' | 'service';
    rating?: number;
    availability?: boolean;
    sortBy?: 'price' | 'rating' | 'date';
    sortOrder?: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
  };
}

Response:
{
  items: ListingItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
```

#### Get Listing Details
```typescript
GET /listings/:id
Response:
{
  listing: ListingItem;
  provider: ProviderProfile;
  related: ListingItem[];
}
```

#### Create Listing
```typescript
POST /listings
Authentication: Required
Role: Provider
Request:
{
  type: 'product' | 'service';
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specifications?: Record<string, string>;
  availability?: {
    schedule?: {
      [day: string]: {
        start: string;
        end: string;
      };
    };
    quantity?: number;
  };
}

Response:
{
  id: string;
  status: 'pending' | 'active';
  message: string;
}
```

### Orders

#### Create Order
```typescript
POST /orders
Authentication: Required
Request:
{
  listingId: string;
  quantity?: number;
  scheduledDate?: Date;
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

Response:
{
  orderId: string;
  status: 'pending';
  paymentUrl: string;
}
```

#### Get Order Status
```typescript
GET /orders/:id
Authentication: Required
Response:
{
  order: {
    id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    listing: ListingItem;
    provider: ProviderProfile;
    scheduledDate?: Date;
    quantity?: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  };
}
```

### User Actions

#### Save Item
```typescript
POST /user/saved/:listingId
Authentication: Required
Response:
{
  saved: boolean;
  savedCount: number;
}
```

#### Get Saved Items
```typescript
GET /user/saved
Authentication: Required
Response:
{
  items: {
    products: ListingItem[];
    services: ListingItem[];
  };
  total: number;
}
```

#### Update Profile
```typescript
PUT /user/profile
Authentication: Required
Request:
{
  name?: string;
  avatar?: string;
  phone?: string;
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    currency?: string;
    language?: string;
  };
}

Response:
{
  user: UserProfile;
  updated: string[];
}
```

### Provider Actions

#### Provider Dashboard
```typescript
GET /provider/dashboard
Authentication: Required
Role: Provider
Response:
{
  analytics: {
    revenue: {
      total: number;
      trend: number;
      chart: {
        labels: string[];
        data: number[];
      };
    };
    orders: {
      total: number;
      pending: number;
      completed: number;
      chart: {
        labels: string[];
        data: number[];
      };
    };
    visitors: {
      total: number;
      unique: number;
      chart: {
        labels: string[];
        data: number[];
      };
    };
  };
  recentOrders: Order[];
  popularListings: ListingItem[];
}
```

#### Provider Settings
```typescript
PUT /provider/settings
Authentication: Required
Role: Provider
Request:
{
  business: {
    name?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  };
  serviceAreas?: {
    cities: string[];
    radius?: number;
    coordinates?: [number, number];
  };
  businessHours?: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
  payment?: {
    methods: string[];
    bankAccount?: {
      name: string;
      number: string;
      routingNumber: string;
    };
  };
}

Response:
{
  settings: ProviderSettings;
  updated: string[];
}
```

### Media

#### Upload Image
```typescript
POST /media/upload
Authentication: Required
Content-Type: multipart/form-data
Request:
FormData {
  file: File;
  type: 'avatar' | 'listing' | 'business';
}

Response:
{
  url: string;
  thumbnail: string;
  size: number;
}
```

### Categories

#### Get Categories
```typescript
GET /categories
Response:
{
  categories: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    parentId?: string;
    children?: Category[];
    count: {
      products: number;
      services: number;
    };
  }[];
}
```

### Reviews

#### Submit Review
```typescript
POST /reviews
Authentication: Required
Request:
{
  listingId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: string[];
}

Response:
{
  review: Review;
  newRating: number;
}
```

### Messages

#### Get Conversations
```typescript
GET /messages/conversations
Authentication: Required
Response:
{
  conversations: {
    id: string;
    participant: UserProfile;
    lastMessage: {
      content: string;
      timestamp: Date;
      read: boolean;
    };
    unreadCount: number;
  }[];
}
```

#### Send Message
```typescript
POST /messages
Authentication: Required
Request:
{
  conversationId?: string;
  recipientId: string;
  content: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
  }[];
}

Response:
{
  message: Message;
  conversation: Conversation;
}
```

## WebSocket Events

### Connection
```typescript
// Connect with authentication
socket.connect({
  auth: {
    token: 'Bearer <jwt_token>'
  }
});
```

### Events

#### Chat Messages
```typescript
// Listen for new messages
socket.on('chat.message', (data: {
  conversationId: string;
  message: Message;
}) => void);

// Message read status
socket.on('chat.read', (data: {
  conversationId: string;
  messageIds: string[];
}) => void);
```

#### Notifications
```typescript
// Real-time notifications
socket.on('notification', (data: {
  type: 'order' | 'message' | 'system';
  title: string;
  message: string;
  data?: any;
}) => void);
```

#### Order Updates
```typescript
// Order status changes
socket.on('order.update', (data: {
  orderId: string;
  status: OrderStatus;
  timestamp: Date;
}) => void);
```

## Error Handling

### Error Response Format
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}
```

### Common Error Codes
```typescript
const ErrorCodes = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Permission denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Invalid input data',
  RATE_LIMIT_EXCEEDED: 'Too many requests',
  INTERNAL_ERROR: 'Internal server error'
};
```

## Data Models

### ListingItem
```typescript
interface ListingItem {
  id: string;
  type: 'product' | 'service';
  name: string;
  description: string;
  price: number;
  images: string[];
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  category: string;
  location: {
    city: string;
    country: string;
    coordinates?: [number, number];
  };
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  listingId: string;
  status: OrderStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  scheduledDate?: Date;
  quantity?: number;
  shippingAddress?: Address;
  contactInfo: ContactInfo;
  createdAt: Date;
  updatedAt: Date;
}
``` 