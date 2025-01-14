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
  serviceMode: 'onsite' | 'remote' | 'both';
}

export interface Product extends BaseItem {
  type: 'product';
  condition: 'new' | 'used' | 'refurbished';
  brand?: string;
  model?: string;
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
}

export type ListingItem = Service | Product;

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
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