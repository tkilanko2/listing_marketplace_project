import { Service, Product, ListingItem, Order, OrderActionType, PaymentStatus, ProductSeller } from './types';

// Helper function to generate provider usernames (real names)
function generateProviderUsername(): string {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jessica', 'William', 'Ashley', 'Christopher', 'Amanda', 'Daniel'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Helper function to generate provider IDs (CM + random characters)
function generateProviderId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'CM';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Auto-generate realistic service addresses
function generateServiceAddress(serviceMode: 'at_seller' | 'at_buyer' | 'remote', city: string, serviceType?: string): string {
  if (serviceMode === 'remote') {
    return 'Remote';
  }

  const businessTypes: Record<string, string[]> = {
    'Beauty & Wellness': ['Salon', 'Spa', 'Studio', 'Wellness Center', 'Beauty Studio'],
    'Home Services': ['Service Center', 'Office', 'Headquarters', 'Solutions'],
    'Education': ['Learning Center', 'Academy', 'Institute', 'Studio'],
    'Tech Support': ['Tech Center', 'Solutions', 'Repair Shop', 'Office'],
    'Transportation': ['Terminal', 'Services', 'Hub', 'Center']
  };

  const streetNames = [
    'Main Street', 'Oak Avenue', 'Pine Street', 'Maple Drive', 'Cedar Lane',
    'Park Avenue', 'Broadway', 'First Street', 'Second Avenue', 'Third Street',
    'Market Street', 'Washington Avenue', 'Lincoln Drive', 'Jefferson Street',
    'Madison Avenue', 'Franklin Street', 'State Street', 'Center Street'
  ];

  const businessNames = [
    'Premium', 'Professional', 'Elite', 'Modern', 'Classic', 'Downtown', 
    'Uptown', 'Central', 'Metropolitan', 'Urban', 'Luxury', 'Executive'
  ];

  if (serviceMode === 'at_seller') {
    const businessType = serviceType ? (businessTypes[serviceType] || ['Center', 'Studio', 'Office']) : ['Center', 'Studio'];
    const businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
    const type = businessType[Math.floor(Math.random() * businessType.length)];
    const streetNumber = Math.floor(Math.random() * 9999) + 100;
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const suite = Math.random() > 0.6 ? `, Suite ${Math.floor(Math.random() * 500) + 100}` : '';
    
    return `Seller Provided: ${businessName} ${type} - ${streetNumber} ${streetName}${suite}`;
  } else {
    // at_buyer - residential address
    const streetNumber = Math.floor(Math.random() * 9999) + 100;
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const apt = Math.random() > 0.5 ? `, Apartment ${Math.floor(Math.random() * 50) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}` : '';
    
    return `Buyer Provided: ${streetNumber} ${streetName}${apt}`;
  }
}

// Helper function to generate reviews
function generateReviews() {
  const reviewComments = [
    'Excellent service! Very professional and punctual.',
    'Great experience, would definitely recommend!',
    'The service exceeded my expectations.',
    'Very skilled and friendly provider.',
    'Good service but room for improvement.',
    'Amazing attention to detail!',
    'Prompt and efficient service delivery.',
    'Very satisfied with the quality of work.'
  ];

  const customerNames = [
    'John D.', 'Sarah M.', 'Michael R.', 'Emma W.',
    'David L.', 'Lisa K.', 'Robert P.', 'Anna S.'
  ];

  return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, index) => ({
    id: Math.random().toString(36).substr(2, 9),
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
    // Add new required fields
    reviewerId: `customer-${index}-${Math.random().toString(36).substr(2, 6)}`,
    revieweeId: `provider-${Math.random().toString(36).substr(2, 6)}`, 
    reviewType: 'service_provider' as 'service_provider' | 'customer'
  }));
}

// Generate provider data
export const providers = Array.from({ length: 15 }, (_, index) => ({
  id: generateProviderId(),
  username: generateProviderUsername(),
  // Using professional headshots for provider avatars
  avatar: [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  ][index % 5] + '?auto=format&fit=crop&w=150&h=150&q=80',
  rating: Number((4 + Math.random()).toFixed(1)),
  totalBookings: Math.floor(Math.random() * 2000) + 500,
  joinedDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
  isOnline: Math.random() > 0.5,
  location: {
    city: ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 5)],
    country: ['USA', 'UK', 'France', 'Japan', 'Australia'][Math.floor(Math.random() * 5)]
  },
  reviews: generateReviews(),
  responseTime: 'Within 2h',
  responseRate: '98%',
  importantNotes: Math.random() > 0.5 ? [
    'Please arrive 5 minutes early. Bring a hair tie for long hair. We use only cruelty-free, vegan products.',
    'Parking is available behind the building. Please mention any allergies or sensitivities beforehand.',
    'Service includes complimentary consultation. Please bring reference photos if you have specific requirements.',
    'We provide all necessary equipment. Please ensure someone is present during the entire service duration.',
    'Payment is due upon completion. We accept cash, cards, and digital payments. Cancellation policy: 24 hours notice required.'
  ][Math.floor(Math.random() * 5)] : undefined
}));

// Service categories with their respective curated image IDs
const serviceCategories = [
  {
    category: 'Beauty & Wellness',
    services: [
      { 
        name: 'Premium Haircut & Styling',
        images: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1',
          'https://images.unsplash.com/photo-1562322140-8baeececf3df'
        ],
        onlinePayment: false
      },
      { 
        name: 'Spa Massage Therapy',
        images: [
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
          'https://images.unsplash.com/photo-1600334129128-685c5582fd35',
          'https://images.unsplash.com/photo-1519823551278-64ac92734fb1'
        ],
        onlinePayment: true
      },
      { 
        name: 'Professional Makeup Service',
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
          'https://images.unsplash.com/photo-1549236177-f9b0031756eb',
          'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2'
        ],
        onlinePayment: true
      }
    ]
  },
  {
    category: 'Home Services',
    services: [
      { 
        name: 'Moving Service',
        images: [
          'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
          'https://images.unsplash.com/photo-1603796846097-bee99e4a601f',
          'https://images.unsplash.com/photo-1527554677374-236d3bc88a34'
        ],
        onlinePayment: false
      },
      { 
        name: 'Interior Painting',
        images: [
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
          'https://images.unsplash.com/photo-1562259949-e8e7689d7828',
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2'
        ],
        onlinePayment: false
      },
      { 
        name: 'Home Cleaning Service',
        images: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac',
          'https://images.unsplash.com/photo-1556911220-bda9f33a8b1f'
        ],
        onlinePayment: true
      }
    ]
  },
  {
    category: 'Education',
    services: [
      { 
        name: 'Art & Craft Workshop',
        images: [
          'https://images.unsplash.com/photo-1499892477393-f675706cbe6e',
          'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
          'https://images.unsplash.com/photo-1513364776144-60967b0f800f'
        ],
        onlinePayment: false
      },
      { 
        name: 'Coding Bootcamp',
        images: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
        ],
        onlinePayment: true
      },
      { 
        name: 'Language Tutoring',
        images: [
          'https://images.unsplash.com/photo-1544654803-b69140b285a1',
          'https://images.unsplash.com/photo-1561089489-f13d5e730d72',
          'https://images.unsplash.com/photo-1587918536598-d1c4a600a6d6'
        ],
        onlinePayment: true
      }
    ]
  },
  {
    category: 'Tech Support',
    services: [
      { 
        name: 'Computer Repair',
        images: [
          'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b',
          'https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae',
          'https://images.unsplash.com/photo-1563770660941-20978e870e26'
        ],
        onlinePayment: false
      },
      { 
        name: 'Website Development',
        images: [
          'https://images.unsplash.com/photo-1547658719-da2b51169166',
          'https://images.unsplash.com/photo-1494599948593-3dafe8338d71',
          'https://images.unsplash.com/photo-1559028012-481c04fa702d'
        ],
        onlinePayment: true
      }
    ]
  },
  {
    category: 'Transportation',
    services: [
      { 
        name: 'Chauffeur Service',
        images: [
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'
        ],
        onlinePayment: false
      },
      { 
        name: 'Airport Transfer',
        images: [
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
          'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
          'https://images.unsplash.com/photo-1566121933407-3c7ccdd26763'
        ],
        onlinePayment: true
      }
    ]
  }
];

interface ProductTemplate {
  name: string;
  brand?: string;
  model?: string;
  images: string[];
  condition?: 'new' | 'used' | 'refurbished';
  specifications: Record<string, string>;
}

const productCategories: { category: string; products: ProductTemplate[] }[] = [
  {
    category: 'Event Spaces',
    products: [
      {
        name: 'Luxury Rooftop Venue',
        brand: 'Urban Events',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 200 guests',
          'Square Footage': '3,000 sq ft',
          'Features': 'Panoramic city views, Built-in bar, Sound system',
          'Availability': 'Daily rentals',
          'Amenities': 'Catering kitchen, Restrooms, Elevator access'
        }
      },
      {
        name: 'Garden Party Venue',
        brand: 'Green Events',
        images: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 150 guests',
          'Area': '5,000 sq ft garden',
          'Features': 'Landscaped gardens, Gazebo, String lights',
          'Availability': 'Seasonal (Spring-Fall)',
          'Amenities': 'Outdoor kitchen, Restrooms, Parking'
        }
      }
    ]
  },
  {
    category: 'Rental Properties',
    products: [
      {
        name: 'Modern Downtown Apartment',
        brand: 'Luxury Living',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Bedrooms': '2',
          'Bathrooms': '2',
          'Square Footage': '1,200 sq ft',
          'Floor': '15th',
          'Amenities': 'Gym, Pool, Parking',
          'Lease Terms': '12 months minimum'
        }
      },
      {
        name: 'Cozy Studio Loft',
        brand: 'Urban Living',
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Studio',
          'Square Footage': '600 sq ft',
          'Floor': '3rd',
          'Amenities': 'Rooftop access, Laundry, Bike storage',
          'Lease Terms': '6-12 months'
        }
      }
    ]
  },
  {
    category: 'Electronics',
    products: [
      {
        name: 'iPhone 13 Pro',
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Screen Size': '6.1 inches',
          'Storage': '256GB',
          'Color': 'Graphite'
        }
      }
    ]
  },
  {
    category: 'Smart Home',
    products: [
      {
        name: 'Smart Thermostat',
        brand: 'Nest',
        model: 'Learning Thermostat',
        images: [
          'https://images.unsplash.com/photo-1599873188517-20c573540b5e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1621265040771-2c6addf937bf?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Compatibility': 'Most HVAC systems',
          'Connectivity': 'Wi-Fi',
          'Color': 'Stainless Steel'
        }
      }
    ]
  },
  {
    category: 'Gaming',
    products: [
      {
        name: 'PlayStation 5',
        brand: 'Sony',
        model: 'PS5 Digital Edition',
        images: [
          'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Storage': '825GB SSD',
          'Resolution': '4K',
          'Color': 'White'
        }
      }
    ]
  },
  {
    category: 'Cameras',
    products: [
      {
        name: 'Mirrorless Camera',
        brand: 'Sony',
        model: 'A7 III',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Sensor': 'Full Frame',
          'Resolution': '24.2MP',
          'Type': 'Mirrorless'
        }
      }
    ]
  },
  {
    category: 'Audio',
    products: [
      {
        name: 'Wireless Headphones',
        brand: 'Sony',
        model: 'WH-1000XM4',
        images: [
          'https://images.unsplash.com/photo-1583394838336-acd977736f90'
        ],
        condition: 'new',
        specifications: {
          'Battery Life': '30 hours',
          'Noise Cancelling': 'Yes',
          'Color': 'Black'
        }
      }
    ]
  },
  {
    category: 'Furniture',
    products: [
      {
        name: 'Ergonomic Office Chair',
        brand: 'Herman Miller',
        model: 'Aeron',
        images: [
          'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1589401655657-4862723721c0?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Material': 'Mesh',
          'Color': 'Black',
          'Weight Capacity': '300 lbs'
        }
      }
    ]
  },
  {
    category: 'Kitchen Appliances',
    products: [
      {
        name: 'Smart Coffee Maker',
        brand: 'Philips',
        model: 'Smart Brew 3000',
        images: [
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'
        ],
        condition: 'new',
        specifications: {
          'Capacity': '12 cups',
          'Smart Features': 'App Control',
          'Color': 'Stainless Steel'
        }
      }
    ]
  },
  {
    category: 'Fitness Equipment',
    products: [
      {
        name: 'Smart Treadmill',
        brand: 'Peloton',
        model: 'Tread+',
        images: [
          'https://images.unsplash.com/photo-1576678927484-cc907957088c'
        ],
        condition: 'new',
        specifications: {
          'Max Speed': '12.5 mph',
          'Display': '23.8" HD',
          'Dimensions': '68" L x 33" W'
        }
      }
    ]
  },
  {
    category: 'Outdoor',
    products: [
      {
        name: 'Electric Grill',
        brand: 'Weber',
        model: 'Pulse 2000',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'
        ],
        condition: 'new',
        specifications: {
          'Cooking Area': '278 sq in',
          'Power': '2200W',
          'Material': 'Stainless Steel'
        }
      }
    ]
  },
  {
    category: 'Fashion',
    products: [
      {
        name: 'Designer Handbag',
        brand: 'Gucci',
        model: 'GG Marmont',
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3'
        ],
        condition: 'new',
        specifications: {
          'Material': 'Leather',
          'Size': 'Medium',
          'Color': 'Black'
        }
      }
    ]
  },
  {
    category: 'Jewelry',
    products: [
      {
        name: 'Diamond Ring',
        brand: 'Tiffany & Co.',
        model: 'Solitaire',
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e'
        ],
        condition: 'new',
        specifications: {
          'Diamond': '1 carat',
          'Metal': '18K Gold',
          'Cut': 'Round Brilliant'
        }
      }
    ]
  },
  {
    category: 'Automotive',
    products: [
      {
        name: 'Electric Car',
        brand: 'Tesla',
        model: 'Model 3',
        images: [
          'https://images.unsplash.com/photo-1560958089-b8a1929cea89'
        ],
        condition: 'new',
        specifications: {
          'Range': '358 miles',
          'Acceleration': '3.1s 0-60',
          'Color': 'Red'
        }
      }
    ]
  },
  {
    category: 'Musical Instruments',
    products: [
      {
        name: 'Electric Guitar',
        brand: 'Fender',
        model: 'Stratocaster',
        images: [
          'https://images.unsplash.com/photo-1550985616-10810253b84d'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Electric',
          'Material': 'Alder',
          'Color': 'Sunburst'
        }
      }
    ]
  },
  {
    category: 'Art & Collectibles',
    products: [
      {
        name: 'Limited Edition Print',
        brand: 'Artist Name',
        images: [
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5'
        ],
        condition: 'new',
        specifications: {
          'Medium': 'Digital Print',
          'Size': '24" x 36"',
          'Edition': 'Limited 100'
        }
      }
    ]
  },
  {
    category: 'Books & Media',
    products: [
      {
        name: 'Collector Edition Book',
        brand: 'Penguin Classics',
        images: [
          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'
        ],
        condition: 'new',
        specifications: {
          'Format': 'Hardcover',
          'Pages': '500',
          'Edition': 'Limited'
        }
      }
    ]
  },
  {
    category: 'Home Decor',
    products: [
      {
        name: 'Modern Wall Art',
        brand: 'Design House',
        images: [
          'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Size': '40" x 60"',
          'Material': 'Canvas',
          'Style': 'Modern'
        }
      }
    ]
  },
  {
    category: 'Garden & Outdoor',
    products: [
      {
        name: 'Smart Sprinkler System',
        brand: 'Rachio',
        model: 'Gen 3',
        images: [
          'https://images.unsplash.com/photo-1589923188900-85dae523342b'
        ],
        condition: 'new',
        specifications: {
          'Zones': '8',
          'Smart Features': 'Weather Intelligence',
          'Control': 'App-based'
        }
      }
    ]
  },
  {
    category: 'Pet Supplies',
    products: [
      {
        name: 'Smart Pet Feeder',
        brand: 'PetSafe',
        model: 'Smart Feed',
        images: [
          'https://images.unsplash.com/photo-1601758228041-f3b2795255f1'
        ],
        condition: 'new',
        specifications: {
          'Capacity': '24 cups',
          'Schedule': 'Programmable',
          'Control': 'App-enabled'
        }
      }
    ]
  },
  {
    category: 'Baby & Kids',
    products: [
      {
        name: 'Smart Baby Monitor',
        brand: 'Nanit',
        model: 'Pro',
        images: [
          'https://images.unsplash.com/photo-1595347097560-69238724e7bd'
        ],
        condition: 'new',
        specifications: {
          'Resolution': '1080p HD',
          'Features': 'Sleep Tracking',
          'Connectivity': 'Wi-Fi'
        }
      }
    ]
  },
  {
    category: 'Sports Equipment',
    products: [
      {
        name: 'Smart Golf Club',
        brand: 'Callaway',
        model: 'Epic Speed',
        images: [
          'https://images.unsplash.com/photo-1535131749006-b7f58c99034b'
        ],
        condition: 'new',
        specifications: {
          'Club Type': 'Driver',
          'Material': 'Titanium',
          'Length': '45.5 inches'
        }
      }
    ]
  },
  {
    category: 'Watches',
    products: [
      {
        name: 'Luxury Smartwatch',
        brand: 'Tag Heuer',
        model: 'Connected',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
        ],
        condition: 'new',
        specifications: {
          'Display': 'OLED',
          'Battery': '24 hours',
          'Material': 'Stainless Steel'
        }
      }
    ]
  },
  {
    category: 'Office Supplies',
    products: [
      {
        name: 'Smart Notebook',
        brand: 'Rocketbook',
        model: 'Fusion',
        images: [
          'https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91'
        ],
        condition: 'new',
        specifications: {
          'Pages': '42',
          'Type': 'Reusable',
          'Size': 'Letter'
        }
      }
    ]
  },
  {
    category: 'Beauty & Personal Care',
    products: [
      {
        name: 'Smart Mirror',
        brand: 'HiMirror',
        model: 'Plus+',
        images: [
          'https://images.unsplash.com/photo-1522338242992-e1a54906a8da'
        ],
        condition: 'new',
        specifications: {
          'Display': 'HD',
          'Features': 'Skin Analysis',
          'Lighting': 'LED'
        }
      }
    ]
  },
  {
    category: 'Tools & Hardware',
    products: [
      {
        name: 'Smart Level',
        brand: 'DeWalt',
        model: 'DW079LR',
        images: [
          'https://images.unsplash.com/photo-1572981779307-38b8cabb2407'
        ],
        condition: 'new',
        specifications: {
          'Range': '250ft',
          'Accuracy': '1/8 inch',
          'Battery': 'Rechargeable'
        }
      }
    ]
  },
  {
    category: 'Luggage & Bags',
    products: [
      {
        name: 'Smart Suitcase',
        brand: 'Away',
        model: 'The Bigger Carry-On',
        images: [
          'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87'
        ],
        condition: 'new',
        specifications: {
          'Capacity': '47.9L',
          'Battery': 'USB Charging',
          'Material': 'Polycarbonate'
        }
      }
    ]
  },
  {
    category: 'Toys & Games',
    products: [
      {
        name: 'Educational Robot',
        brand: 'Sphero',
        model: 'BOLT',
        images: [
          'https://images.unsplash.com/photo-1589254065878-42c9da997008'
        ],
        condition: 'new',
        specifications: {
          'Runtime': '2 hours',
          'Features': 'Programmable',
          'Connectivity': 'Bluetooth'
        }
      }
    ]
  },
  {
    category: 'Real Estate',
    products: [
      {
        name: '2-Bedroom Luxury Apartment For Rent - Downtown',
        brand: 'Premium Properties',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Apartment For Rent',
          'Bedrooms': '2',
          'Bathrooms': '2',
          'Square Footage': '1,500 sq ft',
          'Floor': '15th',
          'Furnished': 'Yes',
          'Lease Term': '12-month lease',
          'Amenities': 'Gym, Pool, Parking, Doorman',
          'Available From': 'Immediate'
        }
      },
      {
        name: 'Modern Studio Apartment For Rent - City Center',
        brand: 'City Living',
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Studio For Rent',
          'Bedrooms': 'Studio',
          'Bathrooms': '1',
          'Square Footage': '500 sq ft',
          'Floor': '5th',
          'Furnished': 'No',
          'Lease Term': '6-12 month lease',
          'Amenities': 'Laundry, Bike Storage',
          'Available From': 'Next Month'
        }
      },
      {
        name: '3-Bedroom Luxury Condo For Rent - Uptown',
        brand: 'Luxury Homes',
        images: [
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Condo For Rent',
          'Bedrooms': '3',
          'Bathrooms': '2.5',
          'Square Footage': '2,000 sq ft',
          'Floor': '10th',
          'Furnished': 'Optional',
          'Lease Term': '12-24 month lease',
          'Amenities': 'Concierge, Gym, Pool, Parking',
          'Available From': 'Next Month'
        }
      },
      {
        name: 'Premium Office Space For Rent - Business District',
        brand: 'Commercial Real Estate',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Commercial Space For Rent',
          'Square Footage': '1,200 sq ft',
          'Floor': '12th',
          'Furnished': 'Yes',
          'Lease Term': '24-36 month lease',
          'Amenities': 'Reception, Meeting Rooms, Kitchen',
          'Available From': 'Next Quarter'
        }
      },
      {
        name: 'Luxury 4-Bedroom Penthouse For Rent - Panoramic Views',
        brand: 'Elite Properties',
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687644-aac76f0b2bf8?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Type': 'Penthouse For Rent',
          'Bedrooms': '4',
          'Bathrooms': '3.5',
          'Square Footage': '3,000 sq ft',
          'Floor': 'Top Floor',
          'Furnished': 'Yes',
          'Lease Term': '12-month lease',
          'Amenities': 'Private Terrace, Wine Cellar, Smart Home',
          'Available From': 'Next Month'
        }
      }
    ]
  },
  {
    category: 'Event Spaces',
    products: [
      {
        name: 'Luxury Rooftop Venue',
        brand: 'Urban Events',
        images: [
          'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1561912774-79769a0a0a7a?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 200 guests',
          'Square Footage': '3,000 sq ft',
          'Features': 'Panoramic views, Built-in bar, Sound system',
          'Event Types': 'Parties, Corporate Events, Weddings',
          'Amenities': 'Catering Kitchen, Restrooms, Elevator',
          'Availability': 'Daily rentals'
        }
      },
      {
        name: 'Garden Party Venue',
        brand: 'Green Events',
        images: [
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 150 guests',
          'Area': '5,000 sq ft garden',
          'Features': 'Landscaped gardens, Gazebo, String lights',
          'Event Types': 'Weddings, Garden Parties, Photoshoots',
          'Amenities': 'Outdoor Kitchen, Restrooms, Parking',
          'Availability': 'Seasonal (Spring-Fall)'
        }
      },
      {
        name: 'Industrial Loft Space',
        brand: 'Creative Venues',
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522771730189-72a0c133c7c8?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 100 guests',
          'Square Footage': '2,500 sq ft',
          'Features': 'High ceilings, Exposed brick, Natural light',
          'Event Types': 'Art Shows, Pop-ups, Corporate Events',
          'Amenities': 'Loading dock, WiFi, Sound system',
          'Availability': 'Flexible booking'
        }
      },
      {
        name: 'Intimate Concert Venue',
        brand: 'Music Hall',
        images: [
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 80 guests',
          'Square Footage': '1,800 sq ft',
          'Features': 'Stage, Professional sound system, Lighting',
          'Event Types': 'Concerts, Comedy Shows, Private Events',
          'Amenities': 'Green room, Bar, Sound booth',
          'Availability': 'Evening rentals'
        }
      },
      {
        name: 'Conference Center',
        brand: 'Business Venues',
        images: [
          'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'
        ],
        condition: 'new',
        specifications: {
          'Capacity': 'Up to 300 guests',
          'Square Footage': '4,000 sq ft',
          'Features': 'Multiple rooms, AV equipment, Stage',
          'Event Types': 'Conferences, Seminars, Trade Shows',
          'Amenities': 'Business center, Catering, Parking',
          'Availability': 'Flexible booking'
        }
      }
    ]
  }
];

// Mock Sellers for Products
const productSellers: ProductSeller[] = [
  {
    id: 'SELLER001',
    name: 'TechWorld Electronics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 4.8,
    totalSales: 2450,
    joinedDate: new Date('2020-03-15'),
    isOnline: true,
    location: 'San Francisco, CA',
    reviews: [
      { id: '1', rating: 5, comment: 'Excellent products and fast shipping!', createdAt: new Date(), customerName: 'John Doe', reviewerId: 'customer-001', revieweeId: 'seller-001', reviewType: 'service_provider' as 'service_provider' | 'customer' },
      { id: '2', rating: 4, comment: 'Good quality electronics', createdAt: new Date(), customerName: 'Jane Smith', reviewerId: 'customer-002', revieweeId: 'seller-001', reviewType: 'service_provider' as 'service_provider' | 'customer' }
    ],
    responseTime: '2 hours',
    responseRate: '98%'
  },
  {
    id: 'SELLER002',
    name: 'HomeStyle Furniture Co.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 4.6,
    totalSales: 1350,
    joinedDate: new Date('2019-08-22'),
    isOnline: false,
    location: 'Austin, TX',
    reviews: [
      { id: '3', rating: 5, comment: 'Beautiful furniture, exactly as described', createdAt: new Date(), customerName: 'Mike Johnson', reviewerId: 'customer-003', revieweeId: 'seller-002', reviewType: 'service_provider' as 'service_provider' | 'customer' }
    ],
    responseTime: '4 hours',
    responseRate: '95%'
  },
  {
    id: 'SELLER003',
    name: 'Premium Audio Store',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 4.9,
    totalSales: 980,
    joinedDate: new Date('2021-01-10'),
    isOnline: true,
    location: 'Los Angeles, CA',
    reviews: [
      { id: '4', rating: 5, comment: 'Top-notch audio equipment!', createdAt: new Date(), customerName: 'Sarah Wilson', reviewerId: 'customer-004', revieweeId: 'seller-003', reviewType: 'service_provider' as 'service_provider' | 'customer' }
    ],
    responseTime: '1 hour',
    responseRate: '99%'
  },
  {
    id: 'SELLER004',
    name: 'Fashion Forward Boutique',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 4.7,
    totalSales: 1890,
    joinedDate: new Date('2020-06-05'),
    isOnline: true,
    location: 'New York, NY',
    reviews: [
      { id: '5', rating: 4, comment: 'Stylish and high-quality fashion items', createdAt: new Date(), customerName: 'Emily Davis', reviewerId: 'customer-005', revieweeId: 'seller-004', reviewType: 'service_provider' as 'service_provider' | 'customer' }
    ],
    responseTime: '3 hours',
    responseRate: '96%'
  },
  {
    id: 'SELLER005',
    name: 'Sports & Fitness Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 4.5,
    totalSales: 750,
    joinedDate: new Date('2021-09-12'),
    isOnline: true,
    location: 'Denver, CO',
    reviews: [
      { id: '6', rating: 5, comment: 'Great fitness equipment, fast delivery', createdAt: new Date(), customerName: 'Alex Thompson', reviewerId: 'customer-006', revieweeId: 'seller-005', reviewType: 'service_provider' as 'service_provider' | 'customer' }
    ],
    responseTime: '2 hours',
    responseRate: '97%'
  }
];

// Generate products with curated images
const mockProducts: Product[] = productCategories.flatMap((category, categoryIndex) =>
  category.products.map((product, productIndex) => {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const seller = productSellers[Math.floor(Math.random() * productSellers.length)];
    const price = Math.floor(Math.random() * 1000) + 100;
    
    // Generate predictable listing IDs: LISTING_PROD_001, LISTING_PROD_002, etc.
    const globalProductIndex = productCategories.slice(0, categoryIndex).reduce((sum, cat) => sum + cat.products.length, 0) + productIndex + 1;
    const listingId = `LISTING_PROD_${globalProductIndex.toString().padStart(3, '0')}`;
    
    return {
      id: listingId,
      type: 'product' as const,
      name: product.name,
      price,
      description: `High-quality ${product.name.toLowerCase()} available for purchase`,
      shortDescription: `Premium ${product.name.toLowerCase()} from ${seller.name}`,
      longDescription: `Experience the premium quality of this ${product.name.toLowerCase()}. Features include ${Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join(', ')}. Available for immediate purchase from ${seller.name}.`,
      images: product.images.map(url => `${url}?auto=format&fit=crop&w=800&h=600&q=80`),
      views: Math.floor(Math.random() * 1000) + 100,
      saves: Math.floor(Math.random() * 500) + 50,
      provider,
      seller,
      category: category.category,
      location: provider.location,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      trending: Math.random() > 0.7,
      recommended: Math.random() > 0.7,
      condition: product.condition || 'new',
      brand: product.brand,
      model: product.model,
      availableQuantity: Math.floor(Math.random() * 10) + 1,
      specifications: product.specifications,
      features: Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`)
    };
  })
);

// Update service generation to include new service-specific fields
const mockServices: Service[] = serviceCategories.flatMap((category, categoryIndex) =>
  category.services.map((service, serviceIndex) => {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const price = Math.floor(Math.random() * 150) + 50;
    const duration = [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)];
    
    // Generate predictable listing IDs: LISTING_SERV_001, LISTING_SERV_002, etc.
    const globalServiceIndex = serviceCategories.slice(0, categoryIndex).reduce((sum, cat) => sum + cat.services.length, 0) + serviceIndex + 1;
    const listingId = `LISTING_SERV_${globalServiceIndex.toString().padStart(3, '0')}`;
    
    // Define service delivery modes based on service type
    const getServiceDeliveryModes = (categoryName: string, serviceName: string): ('at_buyer' | 'at_seller' | 'remote')[] => {
      if (serviceName.includes('Website') || serviceName.includes('Coding') || serviceName.includes('Language')) {
        return ['remote', 'at_seller']; // Can be done remotely or at provider's location
      } else if (serviceName.includes('Moving') || serviceName.includes('Cleaning') || serviceName.includes('Painting')) {
        return ['at_buyer']; // Must be done at customer's location
      } else if (serviceName.includes('Haircut') || serviceName.includes('Massage') || serviceName.includes('Makeup')) {
        return ['at_seller', 'at_buyer']; // Salon or home visits
      } else if (categoryName === 'Education' && !serviceName.includes('Language')) {
        return ['at_seller', 'remote']; // Workshop can be in-person or online
      } else if (categoryName === 'Tech Support') {
        return ['at_buyer', 'remote']; // Computer repair at customer's or remote support
      } else if (categoryName === 'Transportation') {
        return ['at_buyer']; // Always pick up customer
      }
      return ['at_seller', 'at_buyer']; // Default: flexible location
    };

    // Define service coverage based on service type and provider location
    const getServiceCoverage = (categoryName: string, serviceName: string): 'local' | 'citywide' | 'regional' | 'nationwide' | 'global' => {
      if (serviceName.includes('Website') || serviceName.includes('Coding') || serviceName.includes('Language')) {
        return 'global'; // Digital services can be delivered globally
      } else if (serviceName.includes('Moving') || serviceName.includes('Transportation')) {
        return 'regional'; // Moving/transport services cover wider area
      } else if (categoryName === 'Education' && serviceName.includes('remote')) {
        return 'nationwide'; // Online education can reach nationwide
      }
      return 'citywide'; // Most physical services are citywide
    };

    const serviceDeliveryModes = getServiceDeliveryModes(category.category, service.name);
    const serviceCoverage = getServiceCoverage(category.category, service.name);
    
    return {
      id: listingId,
      type: 'service' as const,
      name: service.name,
      duration,
      price,
      description: `Professional ${service.name.toLowerCase()} service tailored to your needs`,
      shortDescription: `Expert ${service.name.toLowerCase()} service in ${provider.location.city}`,
      longDescription: `Experience premium ${service.name.toLowerCase()} service from one of ${provider.location.city}'s top-rated providers. Our service includes comprehensive consultation, professional execution, and satisfaction guarantee. Available for ${serviceDeliveryModes.map(mode => 
        mode === 'at_buyer' ? 'home visits' : 
        mode === 'at_seller' ? 'provider location' : 'remote delivery'
      ).join(' and ')}.`,
      images: service.images.map(url => `${url}?auto=format&fit=crop&w=800&h=600&q=80`),
      views: Math.floor(Math.random() * 1000) + 100,
      saves: Math.floor(Math.random() * 500) + 50,
      provider,
      category: category.category,
      location: provider.location,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      trending: Math.random() > 0.7,
      recommended: Math.random() > 0.7,
      serviceType: category.category,
      serviceArea: serviceCoverage === 'global' ? 'Global' : 
                  serviceCoverage === 'nationwide' ? 'Nationwide' :
                  serviceCoverage === 'regional' ? `${provider.location.city} Region` :
                  `${provider.location.city} Area`,
      availability: 'Monday to Friday, 9 AM - 6 PM',
      pricingStructure: 'per service',
      languagesSpoken: ['English'],
      serviceMode: serviceDeliveryModes.includes('remote') ? 'both' : 'onsite', // Backward compatibility
      serviceDeliveryModes, // New field
      serviceCoverage, // New field
      paymentOptions: {
        payAtService: true,
        onlinePayment: 'onlinePayment' in service ? service.onlinePayment : false
      }
    };
  })
);

export const mockListings: ListingItem[] = [...mockProducts, ...mockServices];
export { mockServices, mockProducts };

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'BKG001',
    listingId: mockServices[0].id, // Reference to the parent service listing
    userId: 'USER001',
    items: [],
    type: 'service',
    service: { ...mockServices[0], provider: providers[0] }, // Assign to first provider
    appointmentDate: new Date('2024-01-20'),
    status: 'completed', // Changed to completed since it's a past date
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date('2024-01-10'),
    totalAmount: 120.00,
    location: 'Tech Hub Downtown, 123 Main Street, Suite 400', // Backward compatibility
    serviceLocation: {
      address: 'Tech Hub Downtown, 123 Main Street, Suite 400',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel', handler: () => console.log('Cancel booking BKG001'), type: 'cancel' },
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG001'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG001'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG001'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD002',
    listingId: mockProducts[0].id, // Reference to the parent product listing
    userId: 'USER001',
    items: [{ id: 'ITEM002', product: mockProducts[0], quantity: 1, price: 45.99 }],
    type: 'product',
    status: 'shipped',
    paymentStatus: 'completed' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    totalAmount: 45.99,
    trackingInfo: { 
      carrier: 'DHL', 
      trackingNumber: 'DHL54321', 
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 2))
    },
    actions: [
      { label: 'Track', handler: () => console.log('Track order ORD002'), type: 'track' },
      { label: 'View Details', handler: () => console.log('View details of order ORD002'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // Additional product orders for SELLER001
  {
    id: 'ORD015',
    listingId: mockProducts[0].id, // Reference to the parent product listing
    userId: 'USER002',
    items: [{ id: 'ITEM015', product: {...mockProducts[0], seller: productSellers[0]}, quantity: 2, price: 299.99 }],
    type: 'product',
    status: 'pending',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 599.98,
    shippingAddress: {
      name: 'John Smith',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    actions: [
      { label: 'Accept', handler: () => console.log('Accept order ORD015'), type: 'accept' },
      { label: 'Decline', handler: () => console.log('Decline order ORD015'), type: 'decline' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD016',
    listingId: mockProducts[1].id, // Reference to the parent product listing
    userId: 'USER003',
    items: [{ id: 'ITEM016', product: {...mockProducts[1], seller: productSellers[0]}, quantity: 1, price: 89.99 }],
    type: 'product',
    status: 'processing',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    totalAmount: 89.99,
    shippingAddress: {
      name: 'Sarah Johnson',
      street: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    actions: [
      { label: 'Add Tracking', handler: () => console.log('Add tracking for order ORD016'), type: 'add_tracking' },
      { label: 'Mark Shipped', handler: () => console.log('Mark shipped order ORD016'), type: 'mark_shipped' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD017',
    listingId: mockProducts[2].id, // Reference to the parent product listing
    userId: 'USER004',
    items: [{ id: 'ITEM017', product: {...mockProducts[2], seller: productSellers[0]}, quantity: 1, price: 149.99 }],
    type: 'product',
    status: 'shipped',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    totalAmount: 149.99,
    trackingInfo: {
      carrier: 'FedEx',
      trackingNumber: 'FDX789012345',
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 1))
    },
    shippingAddress: {
      name: 'Michael Brown',
      street: '789 Pine Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    actions: [
      { label: 'Mark Delivered', handler: () => console.log('Mark delivered order ORD017'), type: 'mark_delivered' },
      { label: 'View Tracking', handler: () => console.log('View tracking for order ORD017'), type: 'view_tracking' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD018',
    listingId: mockProducts[3].id, // Reference to the parent product listing
    userId: 'USER005',
    items: [{ id: 'ITEM018', product: {...mockProducts[3], seller: productSellers[0]}, quantity: 3, price: 25.99 }],
    type: 'product',
    status: 'delivered',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    totalAmount: 77.97,
    trackingInfo: {
      carrier: 'UPS',
      trackingNumber: 'UPS123456789',
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() - 2))
    },
    shippingAddress: {
      name: 'Emma Davis',
      street: '321 Elm Drive',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    actions: [
      { label: 'Contact Customer', handler: () => console.log('Contact customer for order ORD018'), type: 'contact_customer' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD019',
    listingId: mockProducts[4].id, // Reference to the parent product listing
    userId: 'USER006',
    items: [{ id: 'ITEM019', product: {...mockProducts[4], seller: productSellers[0]}, quantity: 1, price: 199.99 }],
    type: 'product',
    status: 'returned',
    paymentStatus: 'refunded' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 21)),
    totalAmount: 199.99,
    shippingAddress: {
      name: 'Robert Wilson',
      street: '654 Maple Lane',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202',
      country: 'USA'
    },
    actions: [
      { label: 'Process Return', handler: () => console.log('Process return for order ORD019'), type: 'process_return' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD020',
    listingId: mockProducts[5].id, // Reference to the parent product listing
    userId: 'USER007',
    items: [{ id: 'ITEM020', product: {...mockProducts[5], seller: productSellers[0]}, quantity: 2, price: 59.99 }],
    type: 'product',
    status: 'cancelled',
    paymentStatus: 'refunded' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 119.98,
    shippingAddress: {
      name: 'Lisa Anderson',
      street: '987 Cedar Court',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    actions: [
      { label: 'View Cancellation', handler: () => console.log('View cancellation for order ORD020'), type: 'view_cancellation' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG003',
    listingId: mockServices[1].id, // Reference to the parent service listing
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[1],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'scheduled',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 80.00,
    location: 'Client\'s Home - 456 Elm Street, Apartment 2B', // Backward compatibility
    serviceLocation: {
      address: '456 Elm Street, Apartment 2B',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      zipCode: '94102',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'San Francisco'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG003'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG003'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG003'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD004',
    listingId: mockProducts[1].id, // Reference to the parent product listing
    userId: 'USER002',
    items: [{ id: 'ITEM004', product: mockProducts[1], quantity: 1, price: 25.50 }],
    type: 'product',
    status: 'processing',
    paymentStatus: 'completed' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 25.50,
    actions: [
      { label: 'View Details', handler: () => console.log('View details of order ORD004'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG005',
    listingId: mockServices[2].id, // Reference to the parent service listing
    userId: 'USER003',
    items: [],
    type: 'service',
    service: mockServices[2],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    totalAmount: 150.00,
    location: 'Business Center - 789 Corporate Plaza, Conference Room A',
    serviceLocation: {
      address: 'Business Center - 789 Corporate Plaza, Conference Room A',
      city: 'Chicago',
      state: 'IL',
      country: 'United States',
      zipCode: '60601',
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'Chicago', 'Home Services'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel', handler: () => console.log('Cancel booking BKG005'), type: 'cancel' },
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG005'), type: 'reschedule' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG005'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD006',
    listingId: mockProducts[2].id, // Reference to the parent product listing
    userId: 'USER004',
    items: [{ id: 'ITEM006', product: mockProducts[2], quantity: 2, price: 99.99 }],
    type: 'product',
    status: 'pending',
    paymentStatus: 'pending' as PaymentStatus,
    orderDate: new Date('2023-11-01'),
    totalAmount: 199.98,
    actions: [
      { label: 'Cancel', handler: () => console.log('Cancel order ORD006'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of order ORD006'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD007',
    listingId: mockProducts[3].id, // Reference to the parent product listing
    userId: 'USER005',
    items: [{ id: 'ITEM007', product: mockProducts[3], quantity: 1, price: 149.99 }],
    type: 'product',
    status: 'processing',
    paymentStatus: 'completed' as PaymentStatus,
    orderDate: new Date('2023-10-25'),
    totalAmount: 149.99,
    actions: [
      { label: 'View Details', handler: () => console.log('View details of order ORD007'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD008',
    listingId: mockProducts[4].id, // Reference to the parent product listing
    userId: 'USER006',
    items: [{ id: 'ITEM008', product: mockProducts[4], quantity: 1, price: 79.99 }],
    type: 'product',
    status: 'shipped',
    paymentStatus: 'completed' as PaymentStatus,
    orderDate: new Date('2023-10-15'),
    totalAmount: 79.99,
    trackingInfo: {
      carrier: 'UPS',
      trackingNumber: 'UPS987654321',
      estimatedDelivery: new Date('2024-01-18')
    },
    actions: [
      { label: 'Track', handler: () => console.log('Track order ORD008'), type: 'track' },
      { label: 'View Details', handler: () => console.log('View details of order ORD008'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD009',
    listingId: mockProducts[5].id, // Reference to the parent product listing
    userId: 'USER007',
    items: [{ id: 'ITEM009', product: mockProducts[5], quantity: 3, price: 29.99 }],
    type: 'product',
    status: 'delivered',
    paymentStatus: 'completed' as PaymentStatus,
    orderDate: new Date('2023-09-10'),
    totalAmount: 89.97,
    actions: [
      { label: 'Review', handler: () => console.log('Review order ORD009'), type: 'review' },
      { label: 'Buy Again', handler: () => console.log('Buy again order ORD009'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of order ORD009'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD010',
    listingId: mockProducts[6].id, // Reference to the parent product listing
    userId: 'USER008',
    items: [{ id: 'ITEM010', product: mockProducts[6], quantity: 1, price: 199.99 }],
    type: 'product',
    status: 'delivered',
    paymentStatus: 'completed' as PaymentStatus,
    orderDate: new Date('2023-08-20'),
    totalAmount: 199.99,
    actions: [
      { label: 'Buy Again', handler: () => console.log('Buy again order ORD010'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of order ORD010'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // Additional service orders with diverse statuses
  {
    id: 'BKG011',
    listingId: mockServices[3].id, // Reference to the parent service listing
    userId: 'USER009',
    items: [],
    type: 'service',
    service: mockServices[3],
    appointmentDate: new Date(new Date().setHours(new Date().getHours() - 1)), // Started 1 hour ago (currently in progress)
    status: 'in_progress',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 90.00,
    location: 'Online via Zoom - Meeting ID will be shared',
    serviceAddress: generateServiceAddress('remote', ''),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'View Progress', handler: () => console.log('View progress for booking BKG011'), type: 'view' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG011'), type: 'message' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG012',
    listingId: mockServices[4].id, // Reference to the parent service listing
    userId: 'USER010',
    items: [],
    type: 'service',
    service: mockServices[4],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    totalAmount: 180.00,
    serviceLocation: {
      address: 'Luxury Spa Center - 321 Wellness Boulevard',
      city: 'Miami',
      state: 'FL',
      country: 'United States',
      zipCode: '33101',
      coordinates: { lat: 25.7617, lng: -80.1918 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'Miami', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Review Service', handler: () => console.log('Review service for booking BKG012'), type: 'review' },
      { label: 'Book Again', handler: () => console.log('Book again booking BKG012'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG012'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG013',
    listingId: mockServices[5].id, // Reference to the parent service listing
    userId: 'USER011',
    items: [],
    type: 'service',
    service: mockServices[5],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'requested',
    paymentStatus: 'pending' as PaymentStatus,
    orderDate: new Date(),
    totalAmount: 120.00,
    serviceLocation: {
      address: '987 Pine Street, Unit 12B',
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      zipCode: '78701',
      coordinates: { lat: 30.2672, lng: -97.7431 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'Austin'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel Request', handler: () => console.log('Cancel request for booking BKG013'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG013'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG014',
    listingId: mockServices[6].id, // Reference to the parent service listing
    userId: 'USER012',
    items: [],
    type: 'service',
    service: mockServices[6],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: 'no_show',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    totalAmount: 80.00,
    serviceLocation: {
      address: '654 Maple Avenue, Apartment 3A',
      city: 'Denver',
      state: 'CO',
      country: 'United States',
      zipCode: '80202',
      coordinates: { lat: 39.7392, lng: -104.9903 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'Denver'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule after no-show booking BKG014'), type: 'reschedule' },
      { label: 'Request Refund', handler: () => console.log('Request refund for booking BKG014'), type: 'refund' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG014'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG015',
    listingId: mockServices[7].id, // Reference to the parent service listing
    userId: 'USER013',
    items: [],
    type: 'service',
    service: mockServices[7],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'rescheduled',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    totalAmount: 150.00,
    serviceAddress: generateServiceAddress('remote', ''),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'View New Schedule', handler: () => console.log('View new schedule for booking BKG015'), type: 'view' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG015'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG015'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG016',
    listingId: mockServices[8].id, // Reference to the parent service listing
    userId: 'USER014',
    items: [],
    type: 'service',
    service: mockServices[8],
    appointmentDate: new Date(new Date().setHours(new Date().getHours() + 3)), // 3 hours from now - should show "Soon"
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 85.00,
    location: 'Downtown Salon - 456 Style Street',
    serviceLocation: {
      address: 'Downtown Salon - 456 Style Street',
      city: 'Seattle',
      state: 'WA',
      country: 'United States',
      zipCode: '98101',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'Seattle', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG016'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG016'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG016'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // Additional bookings for the first provider (current seller)
  {
    id: 'BKG-SELLER-001',
    listingId: mockServices[0].id,
    userId: 'USER-SELLER-001',
    items: [],
    type: 'service',
    service: { ...mockServices[0], provider: providers[0] },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 120.00,
    serviceLocation: {
      address: '123 First Avenue',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10001',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-SELLER-001'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-SELLER-001'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-SELLER-001'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-SELLER-002',
    listingId: mockServices[0].id,
    userId: 'USER-SELLER-002',
    items: [],
    type: 'service',
    service: { ...mockServices[0], provider: providers[0] },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    status: 'pending',
    paymentStatus: 'unpaid' as PaymentStatus,
    orderDate: new Date(),
    totalAmount: 120.00,
    serviceLocation: {
      address: '456 Second Street, Apt 3B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10002',
      coordinates: { lat: 40.7489, lng: -73.9680 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'New York'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Confirm Booking', handler: () => console.log('Confirm booking BKG-SELLER-002'), type: 'confirm' },
      { label: 'Decline', handler: () => console.log('Decline booking BKG-SELLER-002'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-SELLER-002'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-SELLER-003',
    listingId: mockServices[0].id,
    userId: 'USER-SELLER-003',
    items: [],
    type: 'service',
    service: { ...mockServices[0], provider: providers[0] },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    totalAmount: 120.00,
    serviceLocation: {
      address: '789 Third Plaza',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10003',
      coordinates: { lat: 40.7282, lng: -73.9942 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-SELLER-003'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-SELLER-003'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD001',
    listingId: mockServices[0].id, // Reference to the parent service listing
    userId: 'USER001',
    items: [],
    type: 'service',
    service: { ...mockServices[0], provider: providers[0] }, // Assign to first provider
    appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (recent completed)
    status: 'completed', // Changed to completed since it's a past date
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    totalAmount: 120.00,
    location: 'Tech Hub Downtown, 123 Main Street, Suite 400', // Backward compatibility
    serviceLocation: {
      address: 'Tech Hub Downtown, 123 Main Street, Suite 400',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel', handler: () => console.log('Cancel booking BKG001'), type: 'cancel' },
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG001'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG001'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG001'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  }
];

// Mock Service Orders - Placeholder for future implementation
export const mockServiceOrders = [
  {
    id: 'BKG-1234-5678',
    userId: 'usr-123',
    type: 'service' as const,
    status: 'confirmed' as const,
    paymentStatus: 'paid' as const,
    orderDate: new Date(2024, 3, 5), // April 5, 2024
    totalAmount: 120.00,
    service: mockServices[0],
    appointmentDate: new Date(2024, 3, 15, 10, 0), // April 15, 2024, 10:00 AM
    location: 'Service Provider Location',
    actions: ['reschedule', 'cancel']
  }
];

// Current seller simulation - for demo purposes, this would be the logged-in seller
export const CURRENT_SELLER_ID = providers[0].id; // Using the first provider as the current seller

// Additional mock service orders for the current seller
const currentSellerMockOrders = [
  {
    id: 'BKG-CS-001',
    listingId: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID)?.id || mockServices[0].id,
    userId: 'USER-CS-001',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID) || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 150.00,
    serviceLocation: {
      address: '123 Main Street, Suite 100',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10001',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-CS-001'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-CS-001'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-001'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-002',
    listingId: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID)?.id || mockServices[0].id,
    userId: 'USER-CS-002',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID) || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    status: 'pending',
    paymentStatus: 'unpaid' as PaymentStatus,
    orderDate: new Date(),
    totalAmount: 150.00,
    serviceLocation: {
      address: '456 Oak Avenue, Apartment 2B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10002',
      coordinates: { lat: 40.7489, lng: -73.9680 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'New York'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-002',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 987-6543',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    actions: [
      { label: 'Confirm Booking', handler: () => console.log('Confirm booking BKG-CS-002'), type: 'confirm' },
      { label: 'Decline', handler: () => console.log('Decline booking BKG-CS-002'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-002'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-003',
    listingId: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID)?.id || mockServices[0].id,
    userId: 'USER-CS-003',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID) || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    totalAmount: 150.00,
    serviceLocation: {
      address: '789 Pine Street',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10003',
      coordinates: { lat: 40.7282, lng: -73.9942 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '(555) 456-7890',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-CS-003'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-CS-003'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-003'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-004',
    listingId: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID)?.id || mockServices[0].id,
    userId: 'USER-CS-004',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.provider.id === CURRENT_SELLER_ID) || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    totalAmount: 150.00,
    serviceLocation: {
      address: '321 Elm Street, Suite 5',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10004',
      coordinates: { lat: 40.7074, lng: -74.0113 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Beauty & Wellness'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-004',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '(555) 234-5678',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-004'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-004'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  }
];

// Bookings Data Store - Real bookings created when users complete payments
export const mockBookings: any[] = [
  // This will be populated when users complete booking payments
  // Each booking represents a confirmed service appointment
];

// Helper function to generate unique booking ID
export function generateBookingId(): string {
  return 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Helper function to create a new booking
export function createBooking(data: {
  service: any;
  customerName: string;
  customerEmail: string;
  selectedSlot: any;
  paymentData?: any;
  notes?: string;
}): any {
  const bookingId = generateBookingId();
  
  const newBooking = {
    id: bookingId,
    service: data.service,
    provider: data.service.provider,
    customer: {
      id: 'current-customer', // In real app, this would be the logged-in user's ID
      name: data.customerName,
      email: data.customerEmail,
      phone: '', // Could be collected in booking form if needed
      avatar: '' // Could be user's avatar if logged in
    },
    start: data.selectedSlot.start.toISOString(),
    end: data.selectedSlot.end.toISOString(),
    status: 'requested' as 'pending' | 'requested' | 'confirmed' | 'completed' | 'canceled',
    paymentStatus: 'authorized' as 'paid' | 'unpaid' | 'authorized' | 'refunded',
    price: data.service.price,
    notes: data.notes || '',
    location: data.service.location?.city || 'Service location to be confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to bookings array
  mockBookings.push(newBooking);
  
  console.log('New booking created:', newBooking);
  console.log('Total bookings:', mockBookings.length);
  
  return newBooking;
}

// Helper function to get bookings for a specific provider
export function getBookingsForProvider(providerId: string): any[] {
  return mockBookings.filter(booking => booking.service.provider.id === providerId);
}

// Helper function to get bookings for a specific customer
export function getBookingsForCustomer(customerEmail: string): any[] {
  return mockBookings.filter(booking => booking.customer.email === customerEmail);
}

// Helper function to convert mockBookings to Order format
export function convertBookingToOrder(booking: any): any {
  return {
    id: booking.id,
    userId: booking.customer.id || 'current-user',
    items: [],
    type: 'service' as const,
    service: booking.service,
    appointmentDate: new Date(booking.start),
    status: booking.status,
    paymentStatus: booking.paymentStatus === 'authorized' ? 'pending' : booking.paymentStatus,
    orderDate: new Date(booking.createdAt),
    totalAmount: booking.price,
    location: booking.location,
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel Request', handler: () => console.log(`Cancel booking ${booking.id}`), type: 'cancel' },
      { label: 'View Details', handler: () => console.log(`View details of booking ${booking.id}`), type: 'reorder' }
    ]
  };
}

// Helper function to get all orders including real bookings
export function getAllOrdersWithBookings(): any[] {
  // Convert bookings to order format
  const convertedBookings = mockBookings.map(convertBookingToOrder);
  
  // Combine with existing mock orders and sort by orderDate (newest first)
  const allOrders = [...mockOrders, ...convertedBookings];
  
  return allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
}

// Helper function to get orders for a specific seller
export function getOrdersForSeller(sellerId: string): any[] {
  const allOrders = getAllOrdersWithBookings();
  return allOrders.filter(order => 
    order.type === 'product' && 
    order.items && 
    order.items.some((item: any) => item.product.seller.id === sellerId)
  );
}

// Helper function to get service bookings for a specific provider/seller
export function getServiceBookingsForSeller(providerId: string): any[] {
  const allOrders = getAllOrdersWithBookings();
  return allOrders.filter(order => 
    order.type === 'service' && 
    order.service && 
    order.service.provider.id === providerId
  );
}

// ========================================
// FINANCIAL DATA STRUCTURES & EXPORTS
// ========================================

// Financial Transaction Interface
export interface FinancialTransaction {
  id: string;
  transactionId: string;
  bookingId?: string;
  orderId?: string;
  type: 'booking_payment' | 'order_payment' | 'refund' | 'payout' | 'fee' | 'adjustment';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  customerPaidAmount: number;
  platformFee: number;
  paymentProcessingFee: number;
  transactionFee: number;
  netToSeller: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'apple_pay' | 'google_pay';
  customerName: string;
  description: string;
  date: Date;
  settledDate?: Date;
  taxAmount?: number;
  taxRate?: number;
  region: 'US' | 'EU' | 'UK' | 'CA' | 'AU';
  category: 'service_booking' | 'product_order' | 'refund' | 'withdrawal' | 'fee' | 'other';
}

// Payout Record Interface
export interface PayoutRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  method: 'bank_transfer' | 'paypal' | 'stripe_express';
  accountDetails: {
    type: 'bank' | 'paypal' | 'stripe';
    last4?: string;
    bankName?: string;
    email?: string;
  };
  initiatedDate: Date;
  completedDate?: Date;
  fee: number;
  netAmount: number;
  transactionIds: string[];
  description: string;
}

// Financial Summary Interface
export interface FinancialSummary {
  totalRevenue: number;
  netEarnings: number;
  pendingEarnings: number;
  availableForWithdrawal: number;
  totalFees: number;
  totalTaxes: number;
  completedTransactions: number;
  pendingTransactions: number;
  revenueGrowth: number;
  transactionVolume30d: number;
  averageOrderValue: number;
  refundRate: number;
  categoryBreakdown: { [key: string]: number };
  monthlyRevenue: { month: string; amount: number }[];
  topPerformingServices: { name: string; revenue: number; bookings: number }[];
  monthlyTarget: number;
}

// Generate mock financial transactions
export const allFinancialTransactions: FinancialTransaction[] = [
  // Service Bookings
  {
    id: 'TXN-BKG-CS-001',
    transactionId: 'pi_3MtwBwLkdIwHu7ix28a3tqPa',
    bookingId: 'BKG-CS-001',
    type: 'booking_payment',
    status: 'completed',
    amount: 120.00,
    currency: 'USD',
    customerPaidAmount: 120.00,
    platformFee: 3.00,     // 2.5%
    paymentProcessingFee: 3.78, // 2.9% + $0.30
    transactionFee: 0.25,
    netToSeller: 112.97,   // 120 - 3 - 3.78 - 0.25
    paymentMethod: 'credit_card',
    customerName: 'Sarah Johnson',
    description: 'Personal Training Session - 1 Hour',
    date: new Date('2024-04-01T10:30:00Z'),
    settledDate: new Date('2024-04-03T10:30:00Z'),
    taxAmount: 9.60,       // 8% sales tax
    taxRate: 0.08,
    region: 'US',
    category: 'service_booking'
  },
  {
    id: 'TXN-BKG-CS-002',
    transactionId: 'pi_3MtwBwLkdIwHu7ix28a3tqPb',
    bookingId: 'BKG-CS-002',
    type: 'booking_payment',
    status: 'completed',
    amount: 85.00,
    currency: 'USD',
    customerPaidAmount: 85.00,
    platformFee: 2.13,     // 2.5%
    paymentProcessingFee: 2.77, // 2.9% + $0.30
    transactionFee: 0.25,
    netToSeller: 79.85,
    paymentMethod: 'debit_card',
    customerName: 'Michael Chen',
    description: 'Hair Styling Service',
    date: new Date('2024-04-02T14:15:00Z'),
    settledDate: new Date('2024-04-04T14:15:00Z'),
    taxAmount: 6.80,
    taxRate: 0.08,
    region: 'US',
    category: 'service_booking'
  },
  {
    id: 'TXN-BKG-CS-003',
    transactionId: 'pi_3MtwBwLkdIwHu7ix28a3tqPc',
    bookingId: 'BKG-CS-003',
    type: 'booking_payment',
    status: 'completed',
    amount: 150.00,
    currency: 'USD',
    customerPaidAmount: 150.00,
    platformFee: 3.75,     // 2.5%
    paymentProcessingFee: 4.65, // 2.9% + $0.30
    transactionFee: 0.25,
    netToSeller: 141.35,
    paymentMethod: 'apple_pay',
    customerName: 'Emily Rodriguez',
    description: 'Massage Therapy - Deep Tissue',
    date: new Date('2024-04-03T16:00:00Z'),
    settledDate: new Date('2024-04-05T16:00:00Z'),
    taxAmount: 12.00,
    taxRate: 0.08,
    region: 'US',
    category: 'service_booking'
  },
  // Product Orders
  {
    id: 'TXN-ORD-P-045',
    transactionId: 'pi_3MtwBwLkdIwHu7ix28a3tqPd',
    orderId: 'ORD-P-045',
    type: 'order_payment',
    status: 'completed',
    amount: 299.99,
    currency: 'USD',
    customerPaidAmount: 299.99,
    platformFee: 12.00,    // 4% for products
    paymentProcessingFee: 9.00, // 2.9% + $0.30
    transactionFee: 0.25,
    netToSeller: 278.74,
    paymentMethod: 'credit_card',
    customerName: 'David Wilson',
    description: 'Wireless Bluetooth Headphones',
    date: new Date('2024-04-04T09:22:00Z'),
    settledDate: new Date('2024-04-06T09:22:00Z'),
    taxAmount: 24.00,
    taxRate: 0.08,
    region: 'US',
    category: 'product_order'
  },
  {
    id: 'TXN-ORD-P-046',
    transactionId: 'pi_3MtwBwLkdIwHu7ix28a3tqPe',
    orderId: 'ORD-P-046',
    type: 'order_payment',
    status: 'completed',
    amount: 49.99,
    currency: 'USD',
    customerPaidAmount: 49.99,
    platformFee: 2.00,     // 4% for products
    paymentProcessingFee: 1.75, // 2.9% + $0.30
    transactionFee: 0.25,
    netToSeller: 45.99,
    paymentMethod: 'paypal',
    customerName: 'Jessica Martinez',
    description: 'Organic Skincare Set',
    date: new Date('2024-04-05T11:45:00Z'),
    settledDate: new Date('2024-04-07T11:45:00Z'),
    taxAmount: 4.00,
    taxRate: 0.08,
    region: 'US',
    category: 'product_order'
  },
  // More transactions for the past 30 days
  ...Array.from({ length: 50 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const amount = Math.random() * 200 + 25; // $25-$225
    const isService = Math.random() > 0.4;
    const platformFeeRate = isService ? 0.025 : 0.04;
    const platformFee = amount * platformFeeRate;
    const paymentProcessingFee = amount * 0.029 + 0.30;
    const transactionFee = 0.25;
    const netToSeller = amount - platformFee - paymentProcessingFee - transactionFee;
    
    return {
      id: `TXN-${isService ? 'BKG' : 'ORD'}-${String(i + 100).padStart(3, '0')}`,
      transactionId: `pi_3MtwBwLkdIwHu7ix28a3tq${String.fromCharCode(65 + i)}`,
      bookingId: isService ? `BKG-${String(i + 100).padStart(3, '0')}` : undefined,
      orderId: !isService ? `ORD-${String(i + 100).padStart(3, '0')}` : undefined,
      type: isService ? 'booking_payment' : 'order_payment' as const,
      status: Math.random() > 0.05 ? 'completed' : 'pending' as const,
      amount: Math.round(amount * 100) / 100,
      currency: 'USD',
      customerPaidAmount: Math.round(amount * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
      paymentProcessingFee: Math.round(paymentProcessingFee * 100) / 100,
      transactionFee,
      netToSeller: Math.round(netToSeller * 100) / 100,
      paymentMethod: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'][Math.floor(Math.random() * 5)] as any,
      customerName: [
        'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Brown', 'Emma Wilson',
        'Frank Miller', 'Grace Lee', 'Henry Taylor', 'Ivy Chang', 'Jack White'
      ][Math.floor(Math.random() * 10)],
      description: isService 
        ? ['Personal Training', 'Hair Styling', 'Massage Therapy', 'Photography', 'Consulting'][Math.floor(Math.random() * 5)]
        : ['Electronics', 'Fashion', 'Home & Garden', 'Sports & Fitness', 'Beauty'][Math.floor(Math.random() * 5)],
      date,
      settledDate: new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      taxAmount: Math.round(amount * 0.08 * 100) / 100,
      taxRate: 0.08,
      region: 'US',
      category: isService ? 'service_booking' : 'product_order'
    } as FinancialTransaction;
  })
];

// Generate mock payout records
export const mockPayoutRecords: PayoutRecord[] = [
  {
    id: 'PAY-OUT-789012',
    amount: 1250.75,
    currency: 'USD',
    status: 'completed',
    method: 'bank_transfer',
    accountDetails: {
      type: 'bank',
      last4: '4321',
      bankName: 'Chase Bank'
    },
    initiatedDate: new Date('2024-03-28T10:00:00Z'),
    completedDate: new Date('2024-03-30T15:30:00Z'),
    fee: 2.50,
    netAmount: 1248.25,
    transactionIds: ['TXN-BKG-CS-001', 'TXN-BKG-CS-002', 'TXN-ORD-P-045'],
    description: 'Weekly payout for Mar 21-28, 2024'
  },
  {
    id: 'PAY-OUT-789013',
    amount: 890.40,
    currency: 'USD',
    status: 'processing',
    method: 'paypal',
    accountDetails: {
      type: 'paypal',
      email: 'seller@email.com'
    },
    initiatedDate: new Date('2024-04-04T10:00:00Z'),
    fee: 1.75,
    netAmount: 888.65,
    transactionIds: ['TXN-BKG-CS-003', 'TXN-ORD-P-046'],
    description: 'Weekly payout for Mar 28-Apr 4, 2024'
  },
  // Historical payouts
  ...Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(1); // First of month
    const amount = Math.random() * 2000 + 500; // $500-$2500
    const fee = amount < 1000 ? 2.50 : amount * 0.0025; // $2.50 or 0.25%
    
    return {
      id: `PAY-OUT-${789000 + i}`,
      amount: Math.round(amount * 100) / 100,
      currency: 'USD',
      status: i === 0 ? 'processing' : 'completed' as const,
      method: Math.random() > 0.5 ? 'bank_transfer' : 'paypal' as const,
      accountDetails: {
        type: Math.random() > 0.5 ? 'bank' : 'paypal' as const,
        last4: Math.random() > 0.5 ? '4321' : undefined,
        bankName: Math.random() > 0.5 ? 'Chase Bank' : undefined,
        email: Math.random() > 0.5 ? undefined : 'seller@email.com'
      },
      initiatedDate: date,
      completedDate: i === 0 ? undefined : new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000),
      fee: Math.round(fee * 100) / 100,
      netAmount: Math.round((amount - fee) * 100) / 100,
      transactionIds: [`TXN-BKG-CS-${i}01`, `TXN-ORD-P-${i}02`],
      description: `Monthly payout for ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    } as PayoutRecord;
  })
];

// Calculate financial summary
export function calculateFinancialSummary(
  transactions: FinancialTransaction[] = allFinancialTransactions,
  timeFilter: 'all' | '30d' | '7d' | '24h' = 'all'
): FinancialSummary {
  const now = new Date();
  let filteredTransactions = transactions;
  
  // Apply time filter
  if (timeFilter !== 'all') {
    const days = timeFilter === '30d' ? 30 : timeFilter === '7d' ? 7 : 1;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    filteredTransactions = transactions.filter(t => t.date >= cutoffDate);
  }
  
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed');
  const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending');
  
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = completedTransactions.reduce((sum, t) => 
    sum + t.platformFee + t.paymentProcessingFee + t.transactionFee, 0);
  const totalTaxes = completedTransactions.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
  const netEarnings = completedTransactions.reduce((sum, t) => sum + t.netToSeller, 0);
  const pendingEarnings = pendingTransactions.reduce((sum, t) => sum + t.netToSeller, 0);
  
  // Calculate available for withdrawal (settled transactions minus already paid out)
  const settledTransactions = completedTransactions.filter(t => 
    t.settledDate && t.settledDate <= now
  );
  const settledEarnings = settledTransactions.reduce((sum, t) => sum + t.netToSeller, 0);
  const totalPayouts = mockPayoutRecords
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const availableForWithdrawal = Math.max(0, settledEarnings - totalPayouts);
  
  // Category breakdown
  const categoryBreakdown: { [key: string]: number } = {};
  completedTransactions.forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
  });
  
  // Monthly revenue for last 12 months
  const monthlyRevenue: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthTransactions = completedTransactions.filter(t => 
      t.date >= month && t.date <= monthEnd
    );
    const monthAmount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    monthlyRevenue.push({
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: monthAmount
    });
  }
  
  // Calculate growth (comparing current period to previous period)
  let revenueGrowth = 0;
  if (timeFilter !== 'all') {
    const days = timeFilter === '30d' ? 30 : timeFilter === '7d' ? 7 : 1;
    const previousPeriodStart = new Date(now.getTime() - 2 * days * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    const previousTransactions = transactions.filter(t => 
      t.date >= previousPeriodStart && t.date < previousPeriodEnd && t.status === 'completed'
    );
    const previousRevenue = previousTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    if (previousRevenue > 0) {
      revenueGrowth = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
    }
  }
  
  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    netEarnings: Math.round(netEarnings * 100) / 100,
    pendingEarnings: Math.round(pendingEarnings * 100) / 100,
    availableForWithdrawal: Math.round(availableForWithdrawal * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    totalTaxes: Math.round(totalTaxes * 100) / 100,
    completedTransactions: completedTransactions.length,
    pendingTransactions: pendingTransactions.length,
    revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    transactionVolume30d: filteredTransactions.length,
    averageOrderValue: completedTransactions.length > 0 
      ? Math.round((totalRevenue / completedTransactions.length) * 100) / 100 
      : 0,
    refundRate: 0, // Could be calculated if refund transactions exist
    categoryBreakdown,
    monthlyRevenue,
    topPerformingServices: [
      { name: 'Personal Training', revenue: 2450.50, bookings: 18 },
      { name: 'Hair Styling', revenue: 1890.25, bookings: 22 },
      { name: 'Massage Therapy', revenue: 1675.00, bookings: 12 }
    ],
    monthlyTarget: 15000
  };
}

