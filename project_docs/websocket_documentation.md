# WebSocket Documentation

## Connection Setup

### Initial Connection
```typescript
import { io } from 'socket.io-client';

const socket = io('wss://api.marketplace.com', {
  auth: {
    token: 'Bearer <jwt_token>'
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
```

### Connection Events
```typescript
// Connection successful
socket.on('connect', () => {
  console.log('Connected with socket ID:', socket.id);
});

// Connection error
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
});

// Disconnection
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Reconnection attempts
socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('Reconnection attempt:', attemptNumber);
});
```

## Event Categories

### Presence Events
```typescript
// User online status
socket.on('presence.update', {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
});

// User typing status
socket.on('presence.typing', {
  userId: string;
  conversationId: string;
  isTyping: boolean;
  timestamp: Date;
});

// User activity
socket.on('presence.activity', {
  userId: string;
  activity: 'viewing' | 'messaging' | 'ordering';
  metadata?: {
    listingId?: string;
    conversationId?: string;
  };
});
```

### Chat Events
```typescript
// Send message
socket.emit('chat.send', {
  conversationId: string;
  content: string;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name?: string;
    size?: number;
  }>;
});

// Receive message
socket.on('chat.message', {
  id: string;
  conversationId: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  attachments: Array<{
    type: string;
    url: string;
    name?: string;
    size?: number;
  }>;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
});

// Message status updates
socket.on('chat.status', {
  messageId: string;
  conversationId: string;
  status: 'delivered' | 'read';
  timestamp: Date;
});

// Conversation updates
socket.on('chat.conversation.update', {
  conversationId: string;
  type: 'new' | 'archived' | 'deleted';
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
});
```

### Order Events
```typescript
// Order status changes
socket.on('order.status', {
  orderId: string;
  status: OrderStatus;
  previousStatus: OrderStatus;
  timestamp: Date;
  updatedBy: {
    id: string;
    role: 'system' | 'provider' | 'user';
  };
  metadata?: {
    reason?: string;
    estimatedDelivery?: Date;
    trackingNumber?: string;
  };
});

// Payment updates
socket.on('order.payment', {
  orderId: string;
  status: 'processing' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp: Date;
  transactionId?: string;
});

// Shipping updates
socket.on('order.shipping', {
  orderId: string;
  status: 'preparing' | 'shipped' | 'delivered' | 'returned';
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  location?: {
    city: string;
    country: string;
    status: string;
  };
});
```

### Listing Events
```typescript
// Listing updates
socket.on('listing.update', {
  listingId: string;
  type: 'price' | 'availability' | 'status';
  changes: {
    previous: any;
    current: any;
  };
  timestamp: Date;
});

// Stock updates
socket.on('listing.stock', {
  listingId: string;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  threshold?: number;
});

// View count updates
socket.on('listing.views', {
  listingId: string;
  views: number;
  uniqueViews: number;
  period: '24h' | '7d' | '30d';
});
```

### Notification Events
```typescript
// System notifications
socket.on('notification.system', {
  id: string;
  type: 'maintenance' | 'announcement' | 'alert';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  action?: {
    type: 'link' | 'button';
    label: string;
    url?: string;
  };
  expiry?: Date;
});

// User notifications
socket.on('notification.user', {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'promotion' | 'reminder';
  title: string;
  message: string;
  metadata: {
    orderId?: string;
    conversationId?: string;
    listingId?: string;
  };
  read: boolean;
  timestamp: Date;
});
```

## Error Handling

### Connection Errors
```typescript
socket.on('error', (error) => {
  switch (error.code) {
    case 'AUTH_FAILED':
      // Handle authentication failure
      break;
    case 'RATE_LIMIT':
      // Handle rate limiting
      break;
    case 'INVALID_PAYLOAD':
      // Handle invalid message format
      break;
    default:
      // Handle unknown errors
  }
});
```

### Event Errors
```typescript
// Event-specific error handling
socket.on('chat.error', {
  code: string;
  message: string;
  conversationId?: string;
  messageId?: string;
  timestamp: Date;
});

socket.on('order.error', {
  code: string;
  message: string;
  orderId: string;
  operation: string;
  timestamp: Date;
});
```

## Connection Management

### Heartbeat
```typescript
// Server heartbeat
socket.on('ping', () => {
  socket.emit('pong', { timestamp: Date.now() });
});

// Connection health check
setInterval(() => {
  if (socket.connected) {
    socket.emit('health.check');
  }
}, 30000);
```

### Reconnection Strategy
```typescript
const reconnectionConfig = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  
  // Custom reconnection handler
  reconnectionStrategy: (attemptNumber) => {
    if (attemptNumber > 3) {
      // Switch to long-polling
      return {
        transport: ['polling'],
        timeout: 10000
      };
    }
    return {
      transport: ['websocket'],
      timeout: 5000
    };
  }
};
```

## Performance Optimization

### Message Batching
```typescript
// Batch message sending
const messageBatch = [];
let batchTimeout;

const sendMessageBatch = () => {
  if (messageBatch.length > 0) {
    socket.emit('chat.batch', messageBatch);
    messageBatch.length = 0;
  }
};

const queueMessage = (message) => {
  messageBatch.push(message);
  if (messageBatch.length >= 10) {
    sendMessageBatch();
  } else if (!batchTimeout) {
    batchTimeout = setTimeout(sendMessageBatch, 100);
  }
};
```

### Connection State Management
```typescript
const connectionState = {
  isConnected: false,
  lastConnected: null,
  reconnectAttempts: 0,
  queuedMessages: [],
  
  handleConnect: () => {
    connectionState.isConnected = true;
    connectionState.lastConnected = Date.now();
    connectionState.reconnectAttempts = 0;
    // Process queued messages
    while (connectionState.queuedMessages.length > 0) {
      const [event, data] = connectionState.queuedMessages.shift();
      socket.emit(event, data);
    }
  },
  
  handleDisconnect: () => {
    connectionState.isConnected = false;
  },
  
  queueMessage: (event, data) => {
    if (!connectionState.isConnected) {
      connectionState.queuedMessages.push([event, data]);
    } else {
      socket.emit(event, data);
    }
  }
};
``` 