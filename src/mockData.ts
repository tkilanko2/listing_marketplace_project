import { Service, Product, ListingItem, Order, OrderActionType, PaymentStatus } from './types';

// Helper function to generate provider usernames
function generateProviderUsername(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'CM';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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

  return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, () => ({
    id: Math.random().toString(36).substr(2, 9),
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    customerName: customerNames[Math.floor(Math.random() * customerNames.length)]
  }));
}

// Generate provider data
const providers = Array.from({ length: 15 }, (_, index) => ({
  id: `p${index + 1}`,
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
  responseRate: '98%'
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

// Generate products with curated images
const mockProducts: Product[] = productCategories.flatMap(category =>
  category.products.map((product) => {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const price = Math.floor(Math.random() * 1000) + 100;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'product' as const,
      name: product.name,
      price,
      description: `High-quality ${product.name.toLowerCase()} available for purchase`,
      shortDescription: `Premium ${product.name.toLowerCase()} in ${provider.location.city}`,
      longDescription: `Experience the premium quality of this ${product.name.toLowerCase()}. Features include ${Object.entries(product.specifications).map(([key, value]) => `${key}: ${value}`).join(', ')}. Available for immediate purchase.`,
      images: product.images.map(url => `${url}?auto=format&fit=crop&w=800&h=600&q=80`),
      views: Math.floor(Math.random() * 1000) + 100,
      saves: Math.floor(Math.random() * 500) + 50,
      provider,
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
const mockServices: Service[] = serviceCategories.flatMap(category =>
  category.services.map((service) => {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const price = Math.floor(Math.random() * 150) + 50;
    const duration = [30, 45, 60, 90, 120][Math.floor(Math.random() * 5)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: 'service' as const,
      name: service.name,
      duration,
      price,
      description: `Professional ${service.name.toLowerCase()} service tailored to your needs`,
      shortDescription: `Expert ${service.name.toLowerCase()} service in ${provider.location.city}`,
      longDescription: `Experience premium ${service.name.toLowerCase()} service from one of ${provider.location.city}'s top-rated providers. Our service includes comprehensive consultation, professional execution, and satisfaction guarantee. Available for both home visits and at provider's location based on your preference.`,
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
      serviceArea: `Within ${provider.location.city}`,
      availability: 'Monday to Friday, 9 AM - 6 PM',
      pricingStructure: 'per service',
      languagesSpoken: ['English'],
      serviceMode: 'both' as const,
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
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[0],
    appointmentDate: new Date('2024-01-20'),
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date('2024-01-10'),
    totalAmount: 120.00,
    location: 'Tech Hub Downtown, 123 Main Street, Suite 400',
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
  {
    id: 'BKG003',
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[1],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'scheduled',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 80.00,
    location: 'Client\'s Home - 456 Elm Street, Apartment 2B',
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG003'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG003'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG003'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD004',
    userId: 'USER001',
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
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[2],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    totalAmount: 150.00,
    location: 'Business Center - 789 Corporate Plaza, Conference Room A',
    actions: [
      { label: 'Cancel', handler: () => console.log('Cancel booking BKG005'), type: 'cancel' },
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG005'), type: 'reschedule' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG005'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'ORD006',
    userId: 'USER001',
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
    userId: 'USER001',
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
    userId: 'USER001',
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
    userId: 'USER001',
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
    userId: 'USER001',
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
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[3],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'in_progress',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 90.00,
    location: 'Online via Zoom - Meeting ID will be shared',
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'View Progress', handler: () => console.log('View progress for booking BKG011'), type: 'view' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG011'), type: 'message' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG012',
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[4],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    totalAmount: 180.00,
    actions: [
      { label: 'Review Service', handler: () => console.log('Review service for booking BKG012'), type: 'review' },
      { label: 'Book Again', handler: () => console.log('Book again booking BKG012'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG012'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG013',
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'requested',
    paymentStatus: 'pending' as PaymentStatus,
    orderDate: new Date(),
    totalAmount: 120.00,
    actions: [
      { label: 'Cancel Request', handler: () => console.log('Cancel request for booking BKG013'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG013'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG014',
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[1],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: 'no_show',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    totalAmount: 80.00,
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule after no-show booking BKG014'), type: 'reschedule' },
      { label: 'Request Refund', handler: () => console.log('Request refund for booking BKG014'), type: 'refund' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG014'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG015',
    userId: 'USER001',
    items: [],
    type: 'service',
    service: mockServices[2],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'rescheduled',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    totalAmount: 150.00,
    actions: [
      { label: 'View New Schedule', handler: () => console.log('View new schedule for booking BKG015'), type: 'view' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG015'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG015'), type: 'reorder' }
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