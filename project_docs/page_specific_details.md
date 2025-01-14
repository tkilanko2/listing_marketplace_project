# Page-Specific Implementation Details

## Landing Page

### Hero Section
```typescript
interface HeroSection {
  position: 'top-0';
  height: 'h-[600px]';
  layout: 'grid grid-cols-2';
  components: {
    left: {
      title: string;
      subtitle: string;
      searchBar: {
        placeholder: string;
        suggestions: boolean;
        autoComplete: boolean;
      };
      categoryButtons: {
        display: 'flex flex-wrap gap-2';
        maxDisplay: number;
      };
    };
    right: {
      featuredImage: {
        type: 'carousel' | 'static';
        interval?: number;
      };
    };
  };
}
```

### Category Grid
```typescript
interface CategorySection {
  layout: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  gap: 'gap-4';
  items: {
    icon: string;
    name: string;
    count: number;
    link: string;
  }[];
  api: {
    endpoint: '/api/categories';
    method: 'GET';
    response: CategoryResponse;
  };
}
```

### Trending Section
```typescript
interface TrendingSection {
  position: 'relative';
  carousel: {
    slidesPerView: number;
    spaceBetween: number;
    navigation: boolean;
    pagination: boolean;
    autoplay: {
      delay: number;
      disableOnInteraction: boolean;
    };
  };
  api: {
    endpoint: '/api/listings/trending';
    method: 'GET';
    params: {
      limit: number;
      offset: number;
    };
  };
}
```

## Search Results Page

### Filter Sidebar
```typescript
interface FilterSidebar {
  position: 'sticky top-20';
  width: 'w-64';
  sections: {
    category: {
      type: 'tree' | 'list';
      maxDepth: number;
      multiSelect: boolean;
    };
    price: {
      type: 'range';
      min: number;
      max: number;
      step: number;
    };
    location: {
      type: 'select';
      api: '/api/locations';
      searchable: boolean;
    };
    rating: {
      type: 'stars';
      range: [1, 5];
    };
  };
  api: {
    endpoint: '/api/search';
    method: 'POST';
    debounce: 300;
  };
}
```

### Results Grid
```typescript
interface ResultsGrid {
  layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  gap: 'gap-6';
  card: {
    aspect: '3/4';
    hover: {
      scale: 1.02;
      shadow: 'lg';
    };
  };
  pagination: {
    position: 'bottom-0';
    type: 'infinite-scroll' | 'numbered';
    itemsPerPage: number;
  };
}
```

## Listing Detail Page

### Image Gallery
```typescript
interface ImageGallery {
  layout: {
    main: 'aspect-video';
    thumbnails: 'grid grid-cols-5 gap-2';
  };
  features: {
    zoom: boolean;
    fullscreen: boolean;
    share: boolean;
  };
  thumbnailNavigation: {
    scroll: boolean;
    arrows: boolean;
  };
}
```

### Product Information
```typescript
interface ProductInfo {
  layout: 'flex flex-col gap-6';
  sections: {
    header: {
      title: string;
      price: {
        format: string;
        currency: string;
      };
      rating: {
        stars: number;
        count: number;
      };
    };
    description: {
      short: string;
      long: string;
      expandable: boolean;
    };
    specifications: {
      layout: 'grid grid-cols-2';
      items: Record<string, string>;
    };
  };
  actions: {
    position: 'sticky top-20';
    buttons: {
      buy: {
        type: 'primary';
        action: () => void;
      };
      contact: {
        type: 'secondary';
        action: () => void;
      };
      save: {
        type: 'icon';
        action: () => void;
      };
    };
  };
}
```

### Provider Card
```typescript
interface ProviderCard {
  position: 'sticky top-20';
  layout: 'flex flex-col gap-4';
  components: {
    header: {
      avatar: string;
      name: string;
      rating: number;
      verified: boolean;
    };
    stats: {
      responseTime: string;
      completionRate: string;
      totalOrders: number;
    };
    contact: {
      message: {
        action: () => void;
        api: '/api/chat/initiate';
      };
      phone: {
        visible: boolean;
        requireAuth: boolean;
      };
    };
  };
}
```

## User Dashboard

### Navigation
```typescript
interface DashboardNav {
  position: 'sticky top-0';
  layout: 'flex flex-col md:flex-row';
  items: {
    profile: string;
    listings: string;
    orders: string;
    messages: string;
    settings: string;
  };
  mobile: {
    type: 'drawer' | 'dropdown';
    breakpoint: 'md';
  };
}
```

### Profile Section
```typescript
interface ProfileSection {
  layout: 'grid grid-cols-1 md:grid-cols-2 gap-6';
  forms: {
    personal: {
      fields: string[];
      validation: Record<string, any>;
      api: '/api/user/profile';
    };
    preferences: {
      fields: string[];
      api: '/api/user/preferences';
    };
    security: {
      fields: string[];
      api: '/api/user/security';
    };
  };
  imageUpload: {
    maxSize: number;
    formats: string[];
    api: '/api/user/avatar';
  };
}
```

## Provider Dashboard

### Analytics
```typescript
interface AnalyticsDashboard {
  layout: 'grid grid-cols-1 md:grid-cols-3 gap-6';
  charts: {
    revenue: {
      type: 'line';
      period: 'daily' | 'weekly' | 'monthly';
      api: '/api/provider/analytics/revenue';
    };
    orders: {
      type: 'bar';
      period: 'daily' | 'weekly' | 'monthly';
      api: '/api/provider/analytics/orders';
    };
    visitors: {
      type: 'area';
      period: 'daily' | 'weekly' | 'monthly';
      api: '/api/provider/analytics/visitors';
    };
  };
  realtime: {
    websocket: 'ws://api/provider/realtime';
    updateInterval: 5000;
  };
}
```

### Listing Management
```typescript
interface ListingManagement {
  layout: 'flex flex-col gap-6';
  table: {
    columns: string[];
    sortable: boolean;
    filterable: boolean;
    bulkActions: boolean;
  };
  forms: {
    create: {
      steps: string[];
      validation: Record<string, any>;
      api: '/api/listings';
    };
    edit: {
      validation: Record<string, any>;
      api: '/api/listings/:id';
    };
  };
  media: {
    upload: {
      maxFiles: number;
      maxSize: number;
      api: '/api/media/upload';
    };
    gallery: {
      layout: 'grid';
      api: '/api/media/gallery';
    };
  };
}
```

## API Routes and Connections

### Authentication
```typescript
const authRoutes = {
  login: {
    method: 'POST',
    url: '/api/auth/login',
    body: LoginCredentials,
    response: AuthResponse,
  },
  register: {
    method: 'POST',
    url: '/api/auth/register',
    body: RegistrationData,
    response: AuthResponse,
  },
  verify: {
    method: 'POST',
    url: '/api/auth/verify/:token',
    response: VerificationResponse,
  },
  resetPassword: {
    method: 'POST',
    url: '/api/auth/reset-password',
    body: ResetPasswordData,
    response: ResetResponse,
  },
};
```

### Listings
```typescript
const listingRoutes = {
  search: {
    method: 'POST',
    url: '/api/listings/search',
    body: SearchFilters,
    response: SearchResponse,
  },
  create: {
    method: 'POST',
    url: '/api/listings',
    body: ListingData,
    response: ListingResponse,
  },
  update: {
    method: 'PUT',
    url: '/api/listings/:id',
    body: ListingData,
    response: ListingResponse,
  },
  delete: {
    method: 'DELETE',
    url: '/api/listings/:id',
    response: void,
  },
};
```

### User Actions
```typescript
const userRoutes = {
  profile: {
    method: 'GET',
    url: '/api/user/profile',
    response: UserProfile,
  },
  updateProfile: {
    method: 'PUT',
    url: '/api/user/profile',
    body: ProfileData,
    response: UserProfile,
  },
  savedItems: {
    method: 'GET',
    url: '/api/user/saved',
    response: SavedItemsResponse,
  },
  toggleSave: {
    method: 'POST',
    url: '/api/user/saved/:id',
    response: SaveResponse,
  },
};
```

### Provider Actions
```typescript
const providerRoutes = {
  dashboard: {
    method: 'GET',
    url: '/api/provider/dashboard',
    response: DashboardData,
  },
  analytics: {
    method: 'GET',
    url: '/api/provider/analytics',
    params: AnalyticsParams,
    response: AnalyticsData,
  },
  earnings: {
    method: 'GET',
    url: '/api/provider/earnings',
    params: DateRange,
    response: EarningsData,
  },
};
```

### WebSocket Events
```typescript
interface WebSocketEvents {
  'chat.message': {
    data: ChatMessage;
    handlers: {
      onReceive: (msg: ChatMessage) => void;
      onRead: (msgId: string) => void;
    };
  };
  'notification': {
    data: Notification;
    handlers: {
      onReceive: (notification: Notification) => void;
    };
  };
  'order.update': {
    data: OrderUpdate;
    handlers: {
      onStatusChange: (update: OrderUpdate) => void;
    };
  };
}
``` 