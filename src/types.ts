export interface ServiceProvider {
  id: string;
  username: string;
  avatar: string;
  rating: number;
  totalBookings: number;
  joinedDate: Date;
  isOnline: boolean;
  location: {
    city: string;
    country: string;
  };
  reviews: Review[];
  responseTime?: string;
  responseRate?: string;
  importantNotes?: string; // Provider-defined important notes for customers
}

export interface ProductSeller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  joinedDate: Date;
  isOnline: boolean;
  location: string; // Can be a string for general location
  reviews: Review[];
  responseTime?: string;
  responseRate?: string;
}

export interface BaseItem {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  views: number;
  saves: number;
  shortDescription: string;
  longDescription: string;
  category: string;
  location: {
    city: string;
    country: string;
  };
  createdAt: Date;
  trending: boolean;
  recommended: boolean;
  provider: ServiceProvider;
  rating?: number;
  reviewCount?: number;
}

export interface Service extends BaseItem {
  type: 'service';
  duration: number;
  serviceType: string;
  serviceArea: string;
  availability: string;
  pricingStructure: string;
  experience?: string;
  certifications?: string[];
  materialsProvided?: string[];
  specialRequirements?: string[];
  languagesSpoken: string[];
  serviceMode: 'onsite' | 'remote' | 'both'; // Deprecated: kept for compatibility
  serviceDeliveryModes: ('at_buyer' | 'at_seller' | 'remote')[]; // New: can support multiple delivery modes
  serviceCoverage: 'local' | 'citywide' | 'regional' | 'nationwide' | 'global'; // For visibility logic
  paymentOptions: {
    onlinePayment: boolean;
    payAtService: boolean;
  };
  status?: 'pending' | 'active' | 'draft' | 'inactive';
}

export interface Product extends BaseItem {
  type: 'product';
  condition: 'new' | 'used' | 'refurbished';
  seller: ProductSeller;
  sku?: string;
  warranty?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  size?: string;
  material?: string[];
  weight?: {
    value: number;
    unit: string;
  };
  colors?: string[];
  availableQuantity: number;
  features?: string[];
  specifications?: Record<string, string>;
  dateSaved?: string;
  status?: 'pending' | 'active' | 'draft' | 'inactive';
}

export type ListingItem = Service | Product;

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface Appointment {
  id: string;
  service: Service;
  provider: ServiceProvider;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  start: string;       // ISO datetime
  end: string;         // ISO datetime
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  price: number;
  notes?: string;
  location?: string;
  createdAt: string;   // ISO datetime
  updatedAt?: string;  // ISO datetime
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  customerName: string;
}

export interface CategoryFilters {
  [key: string]: FilterOption[];
}

export interface FilterOption {
  id: string;
  type: 'select' | 'range' | 'multiselect';
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

export const categorySpecificFilters: Record<string, FilterOption[]> = {
  'Real Estate': [
    {
      id: 'propertyType',
      type: 'select',
      label: 'Property Type',
      options: ['Apartment', 'Condo', 'House', 'Office Space', 'Studio']
    },
    {
      id: 'bedrooms',
      type: 'select',
      label: 'Bedrooms',
      options: ['Studio', '1', '2', '3', '4+']
    },
    {
      id: 'bathrooms',
      type: 'select',
      label: 'Bathrooms',
      options: ['1', '1.5', '2', '2.5', '3+']
    },
    {
      id: 'squareFootage',
      type: 'range',
      label: 'Square Footage',
      min: 0,
      max: 10000,
      unit: 'sq ft'
    },
    {
      id: 'furnished',
      type: 'select',
      label: 'Furnished',
      options: ['Yes', 'No', 'Partially']
    },
    {
      id: 'leaseTerm',
      type: 'select',
      label: 'Lease Term',
      options: ['Month-to-Month', '3 Months', '6 Months', '1 Year', '2 Years']
    }
  ],
  'Event Spaces': [
    {
      id: 'capacity',
      type: 'range',
      label: 'Capacity',
      min: 0,
      max: 1000,
      unit: 'people'
    },
    {
      id: 'eventTypes',
      type: 'multiselect',
      label: 'Event Types',
      options: ['Wedding', 'Corporate', 'Birthday', 'Concert', 'Conference', 'Exhibition']
    },
    {
      id: 'features',
      type: 'multiselect',
      label: 'Features',
      options: ['Catering Kitchen', 'AV Equipment', 'Stage', 'Dance Floor', 'Outdoor Space', 'Parking']
    },
    {
      id: 'availability',
      type: 'multiselect',
      label: 'Availability',
      options: ['Weekdays', 'Weekends', 'Evenings', 'Holidays']
    }
  ],
  'Electronics': [
    {
      id: 'brand',
      type: 'select',
      label: 'Brand',
      options: ['Apple', 'Samsung', 'Sony', 'LG', 'Google', 'Microsoft']
    },
    {
      id: 'condition',
      type: 'select',
      label: 'Condition',
      options: ['New', 'Like New', 'Good', 'Fair']
    },
    {
      id: 'storage',
      type: 'select',
      label: 'Storage',
      options: ['64GB', '128GB', '256GB', '512GB', '1TB']
    }
  ],
  'Beauty & Wellness': [
    {
      id: 'serviceType',
      type: 'select',
      label: 'Service Type',
      options: ['Hair', 'Nails', 'Massage', 'Facial', 'Makeup', 'Spa']
    },
    {
      id: 'duration',
      type: 'select',
      label: 'Duration',
      options: ['30 mins', '60 mins', '90 mins', '120 mins']
    },
    {
      id: 'gender',
      type: 'select',
      label: 'Service For',
      options: ['All', 'Women', 'Men']
    }
  ]
};

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: Date;
}

// Define separate status types for Products and Services
export type ProductStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
// NOTE: Backend stores a single status field for service bookings. Frontend maps 'confirmed'/'scheduled' based on user role (buyer/seller) for display.
export type ServiceStatus =
  | 'requested'       // Initial booking request
  | 'confirmed'       // Provider confirmed, payment processed
  | 'scheduled'       // Upcoming appointment
  | 'in_progress'     // Service currently happening
  | 'completed'       // Service finished successfully
  | 'cancelled'       // Cancelled by either party
  | 'no_show'         // Customer didn't show up
  | 'rescheduled';    // Moved to different time

export type OrderStatus = ProductStatus | ServiceStatus; // Union type for Order.status

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type OrderActionType = 'track' | 'cancel' | 'return' | 'review' | 'reorder' | 'reschedule';

export interface ActivityLogEntry {
  timestamp: string; // ISO Date string
  type: 'created' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'note' | 'payment';
  title: string;
  description: string;
  icon?: React.ComponentType<any>; // Optional: specific icon for this entry type
  actor?: 'user' | 'provider' | 'system';
}

export interface ServiceLocation {
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Order {
  id: string;
  listingId: string; // Reference to the parent listing that was ordered/booked
  userId: string;
  type: 'product' | 'service';
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderDate: Date;
  deliveryDate?: Date;
  cancelDate?: Date;
  totalAmount: number;
  items?: OrderItem[];
  service?: Service;
  appointmentDate?: Date;
  location?: string; // Deprecated: Keep for backward compatibility
  serviceLocation?: ServiceLocation; // New structured location for services
  serviceAddress?: string; // New: Service delivery address (seller/buyer provided or "Remote")
  selectedServiceMode?: 'at_seller' | 'at_buyer' | 'remote';
  shippingAddress?: ShippingAddress;
  trackingInfo?: TrackingInfo;
  paymentDetails?: {
    last4?: string;
    cardType?: string;
    transactionId?: string;
  };
  activityLog?: ActivityLogEntry[];
  cancelReason?: string;
  actions: OrderActionType[];
}