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
function generateReviews(listingId: string, listingTitle: string, providerId: string) {
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

  const reviewTitles = [
    'Outstanding professional service!',
    'Highly recommend this provider',
    'Exceeded my expectations',
    'Very skilled and reliable',
    'Good value for money',
    'Excellent attention to detail',
    'Quick and efficient work',
    'Professional and courteous'
  ];

  const usernames = [
    'HappyBuyer23', 'ServiceSeeker88', 'QualityFirst', 'ReviewerPro',
    'CustomerABC', 'BookingMaster', 'ServiceUser99', 'ProfessionalBuyer'
  ];

  const avatarUrls = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b68b51c2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  ];

  const reviewImages = [
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop'
  ];

  return Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, index) => ({
    id: Math.random().toString(36).substr(2, 9),
    listingId,
    listingTitle,
    providerId,
    reviewerId: `customer-${index}-${Math.random().toString(36).substr(2, 6)}`,
    reviewerName: usernames[Math.floor(Math.random() * usernames.length)],
    reviewerAvatar: avatarUrls[Math.floor(Math.random() * avatarUrls.length)],
    reviewTitle: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
    comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    criterias: [], // Remove sub-ratings to match what the review form collects
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    helpfulCount: Math.floor(Math.random() * 15),
    notHelpfulCount: Math.floor(Math.random() * 3),
    images: Math.random() > 0.7 ? [reviewImages[Math.floor(Math.random() * reviewImages.length)]] : []
  }));
}

// Generate provider data
export const providers = Array.from({ length: 15 }, (_, index) => {
  const firstNames = ['Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Robert', 'Anna', 'John', 'Maria', 'William', 'Jennifer', 'Christopher', 'Amanda', 'Daniel'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const displayName = `${firstName} ${lastName.charAt(0)}.`;
  
  return {
  id: generateProviderId(),
  username: generateProviderUsername(),
    name: displayName, // Add display name with first name and initial
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
  reviews: [], // Provider-level reviews will be generated separately
  responseTime: 'Within 2h',
  responseRate: '98%',
  importantNotes: Math.random() > 0.5 ? [
    'Please arrive 5 minutes early. Bring a hair tie for long hair. We use only cruelty-free, vegan products.',
    'Parking is available behind the building. Please mention any allergies or sensitivities beforehand.',
    'Service includes complimentary consultation. Please bring reference photos if you have specific requirements.',
    'We provide all necessary equipment. Please ensure someone is present during the entire service duration.',
    'Payment is due upon completion. We accept cash, cards, and digital payments. Cancellation policy: 24 hours notice required.'
  ][Math.floor(Math.random() * 5)] : undefined
  };
});

// Service categories with their respective curated image IDs
const serviceCategories = [
  {
    category: 'Professional Business & Career Consultation Services',
    serviceType: 'consultation',
    services: [
      { 
        name: 'Career Guidance & Professional Development Consultation',
        tiers: [
          {
            id: 'basic',
            name: 'Basic',
            description: 'Essential consultation session with standard advice and basic recommendations for career growth and professional development.',
            duration: 30,
            price: 45,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard',
            description: 'Comprehensive consultation with detailed analysis, professional recommendations, and follow-up notes for business growth.',
            duration: 60,
            price: 85,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium',
            description: 'In-depth consultation with expert analysis, customized action plan, priority support, and 30-day follow-up for senior executives.',
            duration: 90,
            price: 125,
            onlinePayment: true
          },
          {
            id: 'executive',
            name: 'Executive',
            description: 'VIP consultation experience with senior expert, comprehensive strategy development, implementation roadmap, and 60-day support.',
            duration: 120,
            price: 185,
            onlinePayment: true
          },
          {
            id: 'platinum',
            name: 'Platinum',
            description: 'Ultimate consultation package with top-tier expert, complete strategic planning, dedicated support team, and 90-day implementation assistance.',
            duration: 150,
            price: 245,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1',
          'https://images.unsplash.com/photo-1562322140-8baeececf3df'
        ]
      },
      { 
        name: 'Business Strategy & Market Analysis Consultation',
        tiers: [
          {
            id: 'basic',
            name: 'Basic',
            description: 'Essential market analysis with basic business strategy recommendations.',
            duration: 45,
            price: 65,
        onlinePayment: false
      },
      { 
            id: 'standard',
            name: 'Standard',
            description: 'Comprehensive market analysis with detailed strategy development and implementation guidance.',
            duration: 90,
            price: 125,
        onlinePayment: true
      },
      { 
            id: 'premium',
            name: 'Premium',
            description: 'Expert-level market analysis with comprehensive strategy, competitive analysis, and ongoing support.',
            duration: 120,
            price: 185,
        onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1',
          'https://images.unsplash.com/photo-1562322140-8baeececf3df'
        ]
      }
    ]
  },
  {
    category: 'Professional Hair Styling & Barber Services',
    serviceType: 'beauty',
    services: [
      { 
        name: 'Afro Hair Barbing & Styling Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Cut',
            description: 'Standard haircut with basic styling and beard trim.',
            duration: 30,
            price: 25,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard Package',
            description: 'Complete haircut with styling, beard trim, and basic grooming.',
            duration: 45,
            price: 45,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Styling',
            description: 'Premium haircut with advanced styling, beard sculpting, and hair treatment.',
            duration: 60,
            price: 65,
            onlinePayment: true
          },
          {
            id: 'deluxe',
            name: 'Deluxe Experience',
            description: 'Complete grooming experience with haircut, styling, beard work, and premium treatments.',
            duration: 90,
            price: 85,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
          'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
          'https://images.unsplash.com/photo-1622286346003-c519a7853a63'
        ]
      },
      { 
        name: 'Professional Hair Cutting & Styling Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Cut',
            description: 'Standard haircut with basic styling.',
            duration: 30,
            price: 35,
        onlinePayment: false
      },
      { 
            id: 'standard',
            name: 'Standard Styling',
            description: 'Haircut with professional styling and basic treatments.',
            duration: 45,
            price: 55,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Package',
            description: 'Advanced haircut with premium styling, treatments, and consultation.',
            duration: 75,
            price: 85,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
          'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
          'https://images.unsplash.com/photo-1622286346003-c519a7853a63'
        ]
      }
    ]
  },
  {
    category: 'Luxury Garden Design & Landscaping Services',
    serviceType: 'home_services',
    services: [
      { 
        name: 'Garden Design & Landscaping Services',
        tiers: [
          {
            id: 'consultation',
            name: 'Consultation',
            description: 'Garden design consultation with basic recommendations and layout suggestions.',
            duration: 60,
            price: 75,
            onlinePayment: false
          },
          {
            id: 'design',
            name: 'Design Package',
            description: 'Complete garden design with detailed plans, plant selection, and implementation guide.',
            duration: 120,
            price: 145,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Design',
            description: 'Premium garden design with 3D visualization, custom features, and project management.',
            duration: 180,
            price: 225,
            onlinePayment: true
          },
          {
            id: 'luxury',
            name: 'Luxury Package',
            description: 'Luxury garden design with complete project management, premium materials, and ongoing maintenance.',
            duration: 240,
            price: 345,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
          'https://images.unsplash.com/photo-1565011523534-747a8601f9a7',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13'
        ]
      },
      { 
        name: 'Landscape Architecture & Planning Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Planning',
            description: 'Basic landscape planning with site analysis and design recommendations.',
            duration: 90,
            price: 95,
        onlinePayment: false
      },
      { 
            id: 'standard',
            name: 'Standard Architecture',
            description: 'Comprehensive landscape architecture with detailed plans and material specifications.',
            duration: 150,
            price: 175,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Architecture',
            description: 'Advanced landscape architecture with 3D modeling, sustainability planning, and project oversight.',
            duration: 210,
            price: 275,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
          'https://images.unsplash.com/photo-1565011523534-747a8601f9a7',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13'
        ]
      }
    ]
  },
  {
    category: 'Professional Photography & Video Production Services',
    serviceType: 'creative',
    services: [
      { 
        name: 'Professional Photography Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Session',
            description: 'Basic photography session with standard editing and digital delivery.',
            duration: 60,
            price: 85,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard Package',
            description: 'Professional photography with advanced editing, multiple outfits, and print options.',
            duration: 120,
            price: 145,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Session',
            description: 'Premium photography with professional lighting, extensive editing, and luxury presentation.',
            duration: 180,
            price: 225,
            onlinePayment: true
          },
          {
            id: 'luxury',
            name: 'Luxury Experience',
            description: 'Luxury photography experience with makeup artist, styling consultation, and premium albums.',
            duration: 240,
            price: 345,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1606721977440-2b36fccf1f5a',
          'https://images.unsplash.com/photo-1554048612-b6a482b224ce',
          'https://images.unsplash.com/photo-1542038784456-1ea8e689d8b5'
        ]
      },
      { 
        name: 'Video Production & Editing Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Edit',
            description: 'Basic video editing with standard cuts, transitions, and color correction.',
            duration: 120,
            price: 125,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard Production',
            description: 'Professional video editing with advanced effects, music, and graphics.',
            duration: 180,
            price: 185,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Production',
            description: 'Premium video production with cinematic editing, custom graphics, and sound design.',
            duration: 240,
            price: 275,
        onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1606721977440-2b36fccf1f5a',
          'https://images.unsplash.com/photo-1554048612-b6a482b224ce',
          'https://images.unsplash.com/photo-1542038784456-1ea8e689d8b5'
        ]
      }
    ]
  },
  {
    category: 'Premium Fitness & Personal Training Services',
    serviceType: 'fitness',
    services: [
      { 
        name: 'Personal Training & Fitness Coaching Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Training',
            description: 'Basic personal training session with standard workout routine.',
            duration: 45,
            price: 55,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard Package',
            description: 'Comprehensive personal training with customized workout plan and nutrition guidance.',
            duration: 60,
            price: 75,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Training',
            description: 'Premium personal training with advanced techniques, meal planning, and progress tracking.',
            duration: 90,
            price: 105,
            onlinePayment: true
          },
          {
            id: 'elite',
            name: 'Elite Package',
            description: 'Elite training experience with specialized equipment, advanced nutrition, and lifestyle coaching.',
            duration: 120,
            price: 145,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'
        ]
      }
    ]
  },
  {
    category: 'Professional Tutoring & Educational Services',
    serviceType: 'education',
    services: [
      { 
        name: 'Mathematics & Science Tutoring Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Tutoring',
            description: 'Basic tutoring session with standard curriculum support.',
            duration: 45,
            price: 35,
        onlinePayment: false
      },
      { 
            id: 'standard',
            name: 'Standard Package',
            description: 'Comprehensive tutoring with customized learning plan and progress tracking.',
            duration: 60,
            price: 55,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Tutoring',
            description: 'Premium tutoring with advanced techniques, exam preparation, and homework support.',
            duration: 90,
            price: 85,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          'https://images.unsplash.com/photo-1472173148041-00294f0814a2'
        ]
      },
      { 
        name: 'Language Learning & Conversation Practice Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Lessons',
            description: 'Basic language lessons with standard conversation practice.',
            duration: 45,
            price: 30,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard Package',
            description: 'Comprehensive language learning with customized curriculum and cultural context.',
            duration: 60,
            price: 45,
        onlinePayment: true
      },
      { 
            id: 'premium',
            name: 'Premium Immersion',
            description: 'Premium language immersion with native speaker practice and advanced techniques.',
            duration: 90,
            price: 75,
        onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7',
          'https://images.unsplash.com/photo-1472173148041-00294f0814a2'
        ]
      }
    ]
  },
  {
    category: 'Professional Cleaning & Maintenance Services',
    serviceType: 'home_services',
    services: [
      { 
        name: 'House Cleaning & Deep Cleaning Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Cleaning',
            description: 'Basic house cleaning with standard sanitization and organization.',
            duration: 90,
            price: 65,
        onlinePayment: false
      },
      { 
            id: 'standard',
            name: 'Standard Package',
            description: 'Comprehensive cleaning with deep sanitization and detailed attention to all areas.',
            duration: 150,
            price: 95,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Cleaning',
            description: 'Premium cleaning service with eco-friendly products, appliance cleaning, and organization.',
            duration: 210,
            price: 135,
            onlinePayment: true
          },
          {
            id: 'luxury',
            name: 'Luxury Package',
            description: 'Luxury cleaning experience with premium products, detailed service, and maintenance tips.',
            duration: 270,
            price: 185,
        onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1585421514738-01798e348b17',
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13',
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
        ]
      }
    ]
  },
  {
    category: 'Professional Tech Support & Computer Services',
    serviceType: 'tech_support',
    services: [
      { 
        name: 'Computer Repair & Technical Support Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Support',
            description: 'Basic computer troubleshooting and software support.',
            duration: 60,
            price: 45,
        onlinePayment: false
      },
      { 
            id: 'standard',
            name: 'Standard Repair',
            description: 'Comprehensive computer repair with hardware diagnosis and optimization.',
            duration: 90,
            price: 75,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Service',
            description: 'Premium tech support with advanced repairs, data recovery, and system optimization.',
            duration: 120,
            price: 105,
            onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          'https://images.unsplash.com/photo-1559028006-448665bd7c7f',
          'https://images.unsplash.com/photo-1483058712412-4245e9b90334'
        ]
      }
    ]
  },
  {
    category: 'Professional Event Planning & Management Services',
    serviceType: 'event_planning',
    services: [
      { 
        name: 'Event Planning & Coordination Services',
        tiers: [
          {
            id: 'basic',
            name: 'Basic Planning',
            description: 'Basic event planning with venue suggestions and basic coordination.',
            duration: 120,
            price: 125,
            onlinePayment: false
          },
          {
            id: 'standard',
            name: 'Standard Package',
            description: 'Comprehensive event planning with vendor coordination and day-of management.',
            duration: 180,
            price: 185,
            onlinePayment: true
          },
          {
            id: 'premium',
            name: 'Premium Planning',
            description: 'Premium event planning with custom design, full coordination, and luxury touches.',
            duration: 240,
            price: 275,
            onlinePayment: true
          },
          {
            id: 'luxury',
            name: 'Luxury Experience',
            description: 'Luxury event planning with exclusive venues, premium vendors, and white-glove service.',
            duration: 300,
            price: 425,
        onlinePayment: true
          }
        ],
        images: [
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
          'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
          'https://images.unsplash.com/photo-1505236858219-8359eb29e329'
        ]
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
      // Product reviews temporarily disabled - will be updated in future phase
      // { id: '1', rating: 5, comment: 'Excellent products and fast shipping!', date: new Date().toISOString(), reviewerName: 'TechBuyer1', reviewerId: 'customer-001', providerId: 'seller-001' },
      // { id: '2', rating: 4, comment: 'Good quality electronics', date: new Date().toISOString(), reviewerName: 'ElectronicsFan', reviewerId: 'customer-002', providerId: 'seller-001' }
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
      // Product reviews temporarily disabled - will be updated in future phase
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
      // Product reviews temporarily disabled - will be updated in future phase
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
      // Product reviews temporarily disabled - will be updated in future phase
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
      // Product reviews temporarily disabled - will be updated in future phase
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
    // Use the same provider for all services within the same category
    const provider = providers[categoryIndex % providers.length];
    
    // Use the default/standard tier for the main service properties
    const defaultTier = service.tiers.find(tier => tier.name === 'Standard') || service.tiers[0];
    
    // Generate sequential IDs for each service: career-guidance-001, garden-design-001, etc.
    const serviceNumber = (serviceIndex + 1).toString().padStart(3, '0');
    const serviceNameSlug = service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const listingId = `${serviceNameSlug}-${serviceNumber}`;
    
    // Define service delivery modes based on service type
    const getServiceDeliveryModes = (serviceType: string, serviceName: string): ('at_buyer' | 'at_seller' | 'remote')[] => {
      if (serviceType === 'consultation' || serviceName.includes('Consultation')) {
        return ['at_seller', 'remote']; // Office or online
      } else if (serviceType === 'beauty' || serviceName.includes('Hair') || serviceName.includes('Styling')) {
        return ['at_seller']; // Beauty services typically at salon/location
      } else if (serviceType === 'home_services' || serviceName.includes('Garden') || serviceName.includes('Cleaning')) {
        return ['at_buyer']; // Home services at customer location
      } else if (serviceType === 'creative' || serviceName.includes('Photography') || serviceName.includes('Video')) {
        return ['at_seller', 'at_buyer']; // Studio or on-location
      } else if (serviceType === 'fitness' || serviceName.includes('Training') || serviceName.includes('Fitness')) {
        return ['at_seller', 'at_buyer']; // Gym or home visits
      } else if (serviceType === 'education' || serviceName.includes('Tutoring') || serviceName.includes('Learning')) {
        return ['at_seller', 'at_buyer', 'remote']; // In-person or online
      } else if (serviceType === 'tech_support' || serviceName.includes('Computer') || serviceName.includes('Tech')) {
        return ['at_seller', 'at_buyer', 'remote']; // Shop, home visits, or remote
      } else if (serviceType === 'event_planning' || serviceName.includes('Event') || serviceName.includes('Planning')) {
        return ['at_seller', 'at_buyer']; // Office or venue planning
      }
      return ['at_seller', 'at_buyer']; // Default: flexible location
    };

    // Define service coverage based on service type and provider location
    const getServiceCoverage = (serviceType: string, serviceName: string): 'local' | 'citywide' | 'regional' | 'nationwide' | 'global' => {
      if (serviceType === 'consultation' || serviceName.includes('Consultation')) {
        return 'global'; // Digital services can be delivered globally
      } else if (serviceType === 'education' || serviceName.includes('Tutoring') || serviceName.includes('Learning')) {
        return 'nationwide'; // Online tutoring can reach nationwide
      } else if (serviceType === 'tech_support' && serviceName.includes('Computer')) {
        return 'citywide'; // Tech support is typically citywide
      } else if (serviceType === 'creative' || serviceName.includes('Photography') || serviceName.includes('Video')) {
        return 'regional'; // Creative services can be regional
      } else if (serviceType === 'fitness' || serviceName.includes('Training') || serviceName.includes('Fitness')) {
        return 'citywide'; // Fitness services are typically citywide
      } else if (serviceType === 'home_services' || serviceName.includes('Garden') || serviceName.includes('Cleaning')) {
        return 'citywide'; // Home services are citywide
      } else if (serviceType === 'event_planning' || serviceName.includes('Event') || serviceName.includes('Planning')) {
        return 'regional'; // Event planning can be regional
      }
      return 'citywide'; // Most physical services are citywide
    };

    const serviceDeliveryModes = getServiceDeliveryModes(category.serviceType, service.name);
    const serviceCoverage = getServiceCoverage(category.serviceType, service.name);
    
    return {
      id: listingId,
      type: 'service' as const,
      name: service.name,
      duration: defaultTier.duration,
      price: defaultTier.price,
      description: defaultTier.description,
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
      serviceType: category.serviceType, // Use the serviceType field
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
        onlinePayment: defaultTier.onlinePayment
      },
      // Add tier support
      tiers: service.tiers,
      defaultTier: defaultTier.id,
      // Add reviews for each service
      reviews: generateReviews(listingId, service.name, provider.id)
    };
  })
);

export const mockListings: ListingItem[] = [...mockProducts, ...mockServices];
export { mockServices, mockProducts };

// Helper function to get all services for landing page display
export const getAllServices = (): Service[] => {
  return mockServices;
};

// Function to get all tiers for a specific service
export const getServiceTiers = (serviceId: string): Service['tiers'] => {
  const service = mockServices.find(s => s.id === serviceId);
  return service?.tiers || [];
};

// Helper function to get all listings (products + all services)
export const getAllListings = (): ListingItem[] => {
  return [...mockProducts, ...mockServices];
};

// Function to get a specific tier details for a service
export const getServiceTierDetails = (serviceId: string, tierId: string) => {
  const service = mockServices.find(s => s.id === serviceId);
  return service?.tiers?.find(tier => tier.id === tierId);
};

// Function to get service with a specific tier applied
export const getServiceWithTier = (serviceId: string, tierId: string): Service | null => {
  const service = mockServices.find(s => s.id === serviceId);
  if (!service) return null;
  
  const tier = service.tiers?.find(t => t.id === tierId);
  if (!tier) return service; // Return original service if tier not found
  
  // Return service with tier details applied
  return {
    ...service,
    price: tier.price,
    duration: tier.duration,
    description: tier.description,
    paymentOptions: {
      ...service.paymentOptions,
      onlinePayment: tier.onlinePayment
    }
  };
};

// Legacy function for backward compatibility (returns grouped services)
export const getGroupedServices = (): Service[] => {
  const serviceGroups = new Map<string, Service[]>();
  
  // Group services by serviceType
  mockServices.forEach(service => {
    if (!serviceGroups.has(service.serviceType)) {
      serviceGroups.set(service.serviceType, []);
    }
    serviceGroups.get(service.serviceType)!.push(service);
  });
  
  // Return one service from each group as the representative
  const representativeServices: Service[] = [];
  serviceGroups.forEach((services, serviceType) => {
    // Return the first service from each group
    representativeServices.push(services[0]);
  });
  
  return representativeServices;
};

// Legacy function for backward compatibility
export const getGroupedListings = (): ListingItem[] => {
  const groupedServices = getGroupedServices();
  return [...mockProducts, ...groupedServices];
};

// Create comprehensive mock orders array with buyer-side service bookings
export const mockOrders: Order[] = [
  // === Buyer's Service Bookings from Different Providers ===
  {
    id: 'BKG-BUY-001',
    listingId: 'web-design-002', // Standard Web Design
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'web-design-002') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 1500.00,
    serviceAddress: generateServiceAddress('remote', 'New York'),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-BUY-001'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG-BUY-001'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-001'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-002',
    listingId: 'photography-003', // Premium Photography
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'photography-003') || mockServices[1],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
    status: 'pending',
    paymentStatus: 'unpaid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 650.00,
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Photography'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel Request', handler: () => console.log('Cancel booking BKG-BUY-002'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-002'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-003',
    listingId: 'tutoring-002', // Standard Tutoring
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'tutoring-002') || mockServices[2],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 4)),
    totalAmount: 75.00,
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Tutoring'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-BUY-003'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG-BUY-003'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-003'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-004',
    listingId: 'fitness-training-001', // Basic Fitness Training
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'fitness-training-001') || mockServices[3],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 9)),
    totalAmount: 60.00,
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Fitness Training'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Leave Review', handler: () => console.log('Leave review for booking BKG-BUY-004'), type: 'review' },
      { label: 'Book Again', handler: () => console.log('Book again for booking BKG-BUY-004'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-004'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-005',
    listingId: 'professional-consultation-002', // Standard Consultation
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'professional-consultation-002') || mockServices[4],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    totalAmount: 125.00,
    serviceAddress: generateServiceAddress('remote', 'New York'),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Join Video Call', handler: () => console.log('Join video call for booking BKG-BUY-005'), type: 'reorder' },
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-BUY-005'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG-BUY-005'), type: 'message' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-006',
    listingId: 'photography-001', // Quick Photography
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'photography-001') || mockServices[5],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 12)),
    totalAmount: 200.00,
    serviceAddress: generateServiceAddress('at_buyer', 'New York'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Download Photos', handler: () => console.log('Download photos for booking BKG-BUY-006'), type: 'reorder' },
      { label: 'Leave Review', handler: () => console.log('Leave review for booking BKG-BUY-006'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-006'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-007',
    listingId: 'web-design-004', // Enterprise Web Design
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'web-design-004') || mockServices[6],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks from now
    status: 'pending',
    paymentStatus: 'unpaid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 4500.00,
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Web Design'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Cancel Request', handler: () => console.log('Cancel booking BKG-BUY-007'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-007'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-008',
    listingId: 'fitness-training-003', // Premium Fitness Training
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'fitness-training-003') || mockServices[7],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 4)), // 4 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 120.00,
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Fitness Training'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-BUY-008'), type: 'reschedule' },
      { label: 'Message Provider', handler: () => console.log('Message provider for booking BKG-BUY-008'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-008'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-009',
    listingId: 'tutoring-003', // Advanced Tutoring
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'tutoring-003') || mockServices[8],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 8)),
    totalAmount: 100.00,
    serviceAddress: generateServiceAddress('remote', 'New York'),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Leave Review', handler: () => console.log('Leave review for booking BKG-BUY-009'), type: 'review' },
      { label: 'Book Again', handler: () => console.log('Book again for booking BKG-BUY-009'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-009'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-BUY-010',
    listingId: 'professional-consultation-001', // Basic Consultation
    userId: 'current-user',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'professional-consultation-001') || mockServices[9],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 week ago
    status: 'cancelled',
    paymentStatus: 'refunded' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    totalAmount: 75.00,
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    actions: [
      { label: 'Book Again', handler: () => console.log('Book again for booking BKG-BUY-010'), type: 'reorder' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-BUY-010'), type: 'reorder' }
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
// Enhanced mock bookings for current seller with variety in services, dates, and statuses
const currentSellerMockOrders = [
  // === Professional Consultation Bookings ===
  {
    id: 'BKG-CS-001',
    listingId: 'professional-consultation-001', // Basic Consultation
    userId: 'USER-CS-001',
    items: [],
    type: 'service',
    service: {
      ...(mockServices.find(s => s.id === 'professional-consultation-001') || mockServices[0]),
      provider: providers[0] // Ensure this booking uses current seller as provider
    },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 75.00,
    serviceLocation: {
      address: '123 Main Street, Suite 100',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10001',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
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
    listingId: 'professional-consultation-003', // Premium Consultation
    userId: 'USER-CS-002',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'professional-consultation-003') || mockServices[1],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
    status: 'pending',
    paymentStatus: 'unpaid' as PaymentStatus,
    orderDate: new Date(),
    totalAmount: 200.00,
    serviceLocation: {
      address: '456 Oak Avenue, Apartment 2B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10002',
      coordinates: { lat: 40.7489, lng: -73.9680 }
    },
    serviceAddress: generateServiceAddress('remote', 'New York'),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
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
    listingId: 'professional-consultation-002', // Standard Consultation
    userId: 'USER-CS-003',
    items: [],
    type: 'service',
    service: {
      ...(mockServices.find(s => s.id === 'professional-consultation-002') || mockServices[2]),
      provider: providers[0] // Ensure this booking uses current seller as provider
    },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    totalAmount: 125.00,
    serviceLocation: {
      address: '789 Pine Street',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10003',
      coordinates: { lat: 40.7282, lng: -73.9942 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
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
    listingId: 'professional-consultation-004', // Executive Consultation
    userId: 'USER-CS-004',
    items: [],
    type: 'service',
    service: {
      ...(mockServices.find(s => s.id === 'professional-consultation-004') || mockServices[3]),
      provider: providers[0] // Ensure this booking uses current seller as provider
    },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago - past 7-day hold period!
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    totalAmount: 350.00,
    serviceLocation: {
      address: '321 Elm Street, Suite 5',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10004',
      coordinates: { lat: 40.7074, lng: -74.0113 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
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
  },
  // === Web Design Bookings ===
  {
    id: 'BKG-CS-005',
    listingId: 'web-design-001', // Basic Web Design
    userId: 'USER-CS-005',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'web-design-001') || mockServices[4],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 800.00,
    serviceLocation: {
      address: '456 Broadway, Floor 12',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10013',
      coordinates: { lat: 40.7209, lng: -74.0007 }
    },
    serviceAddress: generateServiceAddress('remote', 'New York'),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-005',
      name: 'Jessica Martinez',
      email: 'jessica.martinez@email.com',
      phone: '(555) 345-6789',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg'
    },
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-CS-005'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-CS-005'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-005'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-006',
    listingId: 'web-design-003', // Premium Web Design
    userId: 'USER-CS-006',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'web-design-003') || mockServices[5],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
    status: 'pending',
    paymentStatus: 'unpaid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 2200.00,
    serviceLocation: {
      address: '123 Technology Drive, Suite 300',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10016',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Web Design'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-006',
      name: 'Robert Thompson',
      email: 'robert.thompson@email.com',
      phone: '(555) 678-9012',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    actions: [
      { label: 'Confirm Booking', handler: () => console.log('Confirm booking BKG-CS-006'), type: 'confirm' },
      { label: 'Decline', handler: () => console.log('Decline booking BKG-CS-006'), type: 'cancel' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-006'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // === Photography Bookings ===
  {
    id: 'BKG-CS-007',
    listingId: 'photography-002', // Standard Photography
    userId: 'USER-CS-007',
    items: [],
    type: 'service',
    service: {
      ...(mockServices.find(s => s.id === 'photography-002') || mockServices[6]),
      provider: providers[0] // Ensure this booking uses current seller as provider
    },
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago - past 7-day hold period!
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    totalAmount: 400.00,
    serviceLocation: {
      address: '789 Studio Lane, Unit 5',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10011',
      coordinates: { lat: 40.7414, lng: -74.0055 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Photography'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-007',
      name: 'Amanda Davis',
      email: 'amanda.davis@email.com',
      phone: '(555) 789-0123',
      avatar: 'https://randomuser.me/api/portraits/women/91.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-007'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-007'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-008',
    listingId: 'photography-004', // Event Photography
    userId: 'USER-CS-008',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'photography-004') || mockServices[7],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    totalAmount: 800.00,
    serviceLocation: {
      address: '555 Event Plaza, Ballroom A',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10019',
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'New York'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-008',
      name: 'James Wilson',
      email: 'james.wilson@email.com',
      phone: '(555) 890-1234',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    },
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-CS-008'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-CS-008'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-008'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // === Tutoring Bookings ===
  {
    id: 'BKG-CS-009',
    listingId: 'tutoring-001', // Basic Tutoring
    userId: 'USER-CS-009',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'tutoring-001') || mockServices[8],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    totalAmount: 50.00,
    serviceLocation: {
      address: '123 Learning Center, Room 201',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10025',
      coordinates: { lat: 40.7969, lng: -73.9707 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Tutoring'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-009',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '(555) 901-2345',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg'
    },
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-CS-009'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-CS-009'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-009'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // === Fitness Training Bookings ===
  {
    id: 'BKG-CS-010',
    listingId: 'fitness-training-002', // Personal Fitness Training
    userId: 'USER-CS-010',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'fitness-training-002') || mockServices[9],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 4)), // 4 days from now
    status: 'confirmed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    totalAmount: 90.00,
    serviceLocation: {
      address: '987 Fitness Avenue, Studio 3',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10014',
      coordinates: { lat: 40.7359, lng: -74.0014 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Fitness Training'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-010',
      name: 'Mark Johnson',
      email: 'mark.johnson@email.com',
      phone: '(555) 012-3456',
      avatar: 'https://randomuser.me/api/portraits/men/88.jpg'
    },
    actions: [
      { label: 'Reschedule', handler: () => console.log('Reschedule booking BKG-CS-010'), type: 'reschedule' },
      { label: 'Message Customer', handler: () => console.log('Message customer for booking BKG-CS-010'), type: 'message' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-010'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // === Cancelled Booking ===
  {
    id: 'BKG-CS-011',
    listingId: 'professional-consultation-001', // Basic Consultation
    userId: 'USER-CS-011',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'professional-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
    status: 'cancelled',
    paymentStatus: 'refunded' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 12)),
    totalAmount: 75.00,
    serviceLocation: {
      address: '456 Business Park, Suite 200',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10017',
      coordinates: { lat: 40.7545, lng: -73.9756 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-011',
      name: 'Karen White',
      email: 'karen.white@email.com',
      phone: '(555) 123-4567',
      avatar: 'https://randomuser.me/api/portraits/women/77.jpg'
    },
    actions: [
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-011'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  // === MORE COMPLETED APPOINTMENTS FOR SELLER RATINGS TESTING ===
  {
    id: 'BKG-CS-012',
    listingId: 'career-guidance-professional-development-consultation-001',
    userId: 'USER-CS-012',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'career-guidance-professional-development-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 3)), // 3 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    totalAmount: 85.00,
    serviceLocation: {
      address: '123 Beauty Avenue, Suite 4',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10005',
      coordinates: { lat: 40.7074, lng: -74.0113 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-012',
      name: 'Jennifer Smith',
      email: 'jennifer.smith@email.com',
      phone: '(555) 678-9012',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-012'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-012'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-013',
    listingId: 'business-strategy-market-analysis-consultation-001',
    userId: 'USER-CS-013',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'business-strategy-market-analysis-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 12)),
    totalAmount: 125.00,
    serviceLocation: {
      address: '456 Barber Street, Unit 2',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10006',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Professional Consultation'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-013',
      name: 'Marcus Johnson',
      email: 'marcus.johnson@email.com',
      phone: '(555) 789-0123',
      avatar: 'https://randomuser.me/api/portraits/men/35.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-013'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-013'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-014',
    listingId: 'career-guidance-professional-development-consultation-001',
    userId: 'USER-CS-014',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'career-guidance-professional-development-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 7)), // 1 week ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 14)),
    totalAmount: 85.00,
    serviceLocation: {
      address: '789 Fitness Plaza, Gym Floor 3',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10007',
      coordinates: { lat: 40.7282, lng: -73.9942 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Fitness Training'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-014',
      name: 'Rachel Williams',
      email: 'rachel.williams@email.com',
      phone: '(555) 890-1234',
      avatar: 'https://randomuser.me/api/portraits/women/78.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-014'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-014'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-015',
    listingId: 'business-strategy-market-analysis-consultation-001',
    userId: 'USER-CS-015',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'business-strategy-market-analysis-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 9)),
    totalAmount: 125.00,
    serviceLocation: {
      address: '321 Education Center, Room 102',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10008',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Tutoring'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-015',
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      phone: '(555) 901-2345',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-015'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-015'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-016',
    listingId: 'career-guidance-professional-development-consultation-001',
    userId: 'USER-CS-016',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'career-guidance-professional-development-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 6)), // 6 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 13)),
    totalAmount: 85.00,
    serviceLocation: {
      address: '654 Language Institute, Floor 2',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10009',
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    serviceAddress: generateServiceAddress('remote', 'New York'),
    selectedServiceMode: 'remote' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-016',
      name: 'Sofia Rodriguez',
      email: 'sofia.rodriguez@email.com',
      phone: '(555) 012-3456',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-016'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-016'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-017',
    listingId: 'business-strategy-market-analysis-consultation-001',
    userId: 'USER-CS-017',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'business-strategy-market-analysis-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 4)), // 4 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 11)),
    totalAmount: 125.00,
    serviceLocation: {
      address: '987 Residential Street, Apartment 3A',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10010',
      coordinates: { lat: 40.7359, lng: -74.0014 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'New York'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-017',
      name: 'Maria Gonzalez',
      email: 'maria.gonzalez@email.com',
      phone: '(555) 123-4567',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-017'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-017'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-018',
    listingId: 'career-guidance-professional-development-consultation-001',
    userId: 'USER-CS-018',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'career-guidance-professional-development-consultation-001') || mockServices[0],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 8)), // 8 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 15)),
    totalAmount: 85.00,
    serviceLocation: {
      address: '123 Tech Support Center, Unit 5',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10011',
      coordinates: { lat: 40.7414, lng: -74.0055 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Tech Support'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-018',
      name: 'Kevin Brown',
      email: 'kevin.brown@email.com',
      phone: '(555) 234-5678',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-018'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-018'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-019',
    listingId: 'event-planning-coordination-services-001',
    userId: 'USER-CS-019',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'event-planning-coordination-services-001') || mockServices[7],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 21)),
    totalAmount: 185.00,
    serviceLocation: {
      address: '456 Event Plaza, Conference Room A',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10012',
      coordinates: { lat: 40.7282, lng: -73.9942 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Event Planning'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-019',
      name: 'Lauren Davis',
      email: 'lauren.davis@email.com',
      phone: '(555) 345-6789',
      avatar: 'https://randomuser.me/api/portraits/women/83.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-019'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-019'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-020',
    listingId: 'professional-photography-services-001',
    userId: 'USER-CS-020',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'professional-photography-services-001') || mockServices[8],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 8)),
    totalAmount: 145.00,
    serviceLocation: {
      address: '789 Photography Studio, Floor 4',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10013',
      coordinates: { lat: 40.7209, lng: -74.0007 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Photography'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-020',
      name: 'Thomas Wilson',
      email: 'thomas.wilson@email.com',
      phone: '(555) 456-7890',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-020'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-020'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-021',
    listingId: 'video-production-editing-services-001',
    userId: 'USER-CS-021',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'video-production-editing-services-001') || mockServices[9],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 9)), // 9 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 16)),
    totalAmount: 185.00,
    serviceLocation: {
      address: '321 Media Center, Studio B',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10014',
      coordinates: { lat: 40.7359, lng: -74.0014 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Video Production'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-021',
      name: 'Patricia Miller',
      email: 'patricia.miller@email.com',
      phone: '(555) 567-8901',
      avatar: 'https://randomuser.me/api/portraits/women/95.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-021'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-021'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-022',
    listingId: 'garden-design-landscaping-services-001',
    userId: 'USER-CS-022',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'garden-design-landscaping-services-001') || mockServices[10],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 12)), // 12 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 19)),
    totalAmount: 145.00,
    serviceLocation: {
      address: '654 Garden Avenue, Backyard',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10015',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    serviceAddress: generateServiceAddress('at_buyer', 'New York'),
    selectedServiceMode: 'at_buyer' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-022',
      name: 'Daniel Lee',
      email: 'daniel.lee@email.com',
      phone: '(555) 678-9012',
      avatar: 'https://randomuser.me/api/portraits/men/19.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-022'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-022'), type: 'reorder' }
    ] as unknown as OrderActionType[]
  },
  {
    id: 'BKG-CS-023',
    listingId: 'landscape-architecture-planning-services-001',
    userId: 'USER-CS-023',
    items: [],
    type: 'service',
    service: mockServices.find(s => s.id === 'landscape-architecture-planning-services-001') || mockServices[11],
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 14)), // 14 days ago
    status: 'completed',
    paymentStatus: 'paid' as PaymentStatus,
    orderDate: new Date(new Date().setDate(new Date().getDate() - 21)),
    totalAmount: 175.00,
    serviceLocation: {
      address: '987 Architecture Office, Suite 300',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10016',
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    serviceAddress: generateServiceAddress('at_seller', 'New York', 'Landscape Architecture'),
    selectedServiceMode: 'at_seller' as 'at_seller' | 'at_buyer' | 'remote',
    customer: {
      id: 'cust-cs-023',
      name: 'Catherine Taylor',
      email: 'catherine.taylor@email.com',
      phone: '(555) 789-0123',
      avatar: 'https://randomuser.me/api/portraits/women/48.jpg'
    },
    actions: [
      { label: 'Request Review', handler: () => console.log('Request review for booking BKG-CS-023'), type: 'review' },
      { label: 'View Details', handler: () => console.log('View details of booking BKG-CS-023'), type: 'reorder' }
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
  selectedTier?: string;
}): any {
  const bookingId = generateBookingId();
  
  // Get the selected tier details if tier is specified
  let servicePrice = data.service.price;
  let serviceDuration = data.service.duration;
  let serviceDescription = data.service.description;
  
  if (data.selectedTier) {
    const tierDetails = getServiceTierDetails(data.service.id, data.selectedTier);
    if (tierDetails) {
      servicePrice = tierDetails.price;
      serviceDuration = tierDetails.duration;
      serviceDescription = tierDetails.description;
    }
  }
  
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
    price: servicePrice,
    duration: serviceDuration,
    description: serviceDescription,
    selectedTier: data.selectedTier,
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
  
  // Combine with existing mock orders, current seller mock orders, and converted bookings
  // Sort by orderDate (newest first)
  const allOrders = [...mockOrders, ...currentSellerMockOrders, ...convertedBookings];
  
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
  status: 'completed' | 'pending' | 'failed' | 'cancelled' | 'successful' | 'refunded' | 'unclaimed';
  amount: number;
  currency: string;
  customerPaidAmount: number;
  platformFee: number;
  paymentProcessingFee: number;
  transactionFee: number;
  netToSeller: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'apple_pay' | 'google_pay';
  paymentProcessor: 'Stripe' | 'Paystack' | 'Flutterwave' | 'Square' | 'PayPal' | 'Razorpay';
  customerName: string;
  description: string;
  date: Date;
  settledDate?: Date;
  taxAmount?: number;
  taxRate?: number;
  region: 'US' | 'EU' | 'UK' | 'CA' | 'AU';
  category: 'service_booking' | 'product_order' | 'refund' | 'withdrawal' | 'fee' | 'other';
  // Enhanced fields for Finance 2 modal display
  listingName?: string;
  listingId?: string;
  listingImage?: string;
  serviceCategory?: string;
  completionDate?: Date;
  holdEndDate?: Date;
  availableDate?: Date;
  // Refund metadata (for admin-processed refunds)
  refundMetadata?: {
    originalTransactionId: string;
    processedBy: 'admin' | 'system';
    reason: string;
    processedDate: Date;
    impactedBalance: 'pending' | 'deficit';
  };
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
  // Refund tracking
  totalRefunds: number;
  refundCount: number;
}

// Generate financial transactions from actual completed seller bookings
export const allFinancialTransactions: FinancialTransaction[] = (() => {
  const transactions: FinancialTransaction[] = [];
  const allOrders = getAllOrdersWithBookings();
  const sellerId = CURRENT_SELLER_ID; // Get current seller ID
  
  // Process completed service bookings for CURRENT SELLER ONLY
  // (status='completed' && paymentStatus='paid' && provider.id === sellerId)
  allOrders
    .filter(order => 
      order.type === 'service' && 
      order.status === 'completed' && 
      order.paymentStatus === 'paid' &&
      order.service?.provider?.id === sellerId
    )
    .forEach(booking => {
      const service = booking.service;
      if (!service) return;
      
      // Calculate fees
      const platformFee = booking.totalAmount * 0.025; // 2.5%
      const paymentProcessingFee = booking.totalAmount * 0.029 + 0.30; // 2.9% + $0.30
      const transactionFee = 0.25;
      const netToSeller = booking.totalAmount - platformFee - paymentProcessingFee - transactionFee;
      
      // Settlement timeline dates
      const completionDate = booking.appointmentDate || booking.orderDate;
      const holdEndDate = new Date(completionDate.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days (updated hold period)
      
      transactions.push({
        id: `TXN-${booking.id}`,
        transactionId: `pi_${Math.random().toString(36).substr(2, 15)}`,
        bookingId: booking.id,
    type: 'booking_payment',
    status: 'completed',
        amount: booking.totalAmount,
    currency: 'USD',
        customerPaidAmount: booking.totalAmount,
      platformFee: Math.round(platformFee * 100) / 100,
      paymentProcessingFee: Math.round(paymentProcessingFee * 100) / 100,
      transactionFee,
      netToSeller: Math.round(netToSeller * 100) / 100,
        paymentMethod: 'credit_card',
        paymentProcessor: 'Stripe',
        customerName: booking.customer?.name || `Customer ${booking.id.slice(-3)}`,
        description: service.name,
        date: booking.orderDate,
        settledDate: new Date(booking.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        taxAmount: 0,
        taxRate: 0,
      region: 'US',
        category: 'service_booking',
        // Enhanced fields for Finance 2 modal
        listingName: service.name,
        listingId: service.id,
        listingImage: service.images[0],
        serviceCategory: service.category,
        completionDate,
        holdEndDate,
        availableDate: holdEndDate
      });
    });
  
  // Add refund transactions (admin-processed)
  // Refund 1: Recent refund from pending earnings
  if (transactions.length > 2) {
    const originalTxn = transactions[2];
    transactions.push({
      id: `txn-refund-001`,
      transactionId: 'TXN-REF-001',
      bookingId: originalTxn.bookingId,
      type: 'refund',
      status: 'cancelled', // Refunded bookings are cancelled, not completed
      amount: originalTxn.amount,
      currency: 'USD',
      customerPaidAmount: originalTxn.customerPaidAmount,
      platformFee: 0, // Fees not refunded to seller
      paymentProcessingFee: 0,
      transactionFee: 0,
      netToSeller: -originalTxn.netToSeller, // Negative!
      paymentMethod: originalTxn.paymentMethod,
      paymentProcessor: originalTxn.paymentProcessor,
      customerName: originalTxn.customerName,
      description: 'Refund: Customer cancellation',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      settledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      taxAmount: 0,
      taxRate: 0,
      region: originalTxn.region,
      category: 'refund',
      listingName: originalTxn.listingName,
      listingId: originalTxn.listingId,
      listingImage: originalTxn.listingImage,
      serviceCategory: originalTxn.serviceCategory,
      completionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      availableDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Immediate impact
      refundMetadata: {
        originalTransactionId: originalTxn.transactionId,
        processedBy: 'admin',
        reason: 'Customer requested cancellation within 24-hour policy window',
        processedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        impactedBalance: 'pending'
      }
    });
  }
  
  // Refund 2: Older refund (5 days ago)
  if (transactions.length > 5) {
    const originalTxn2 = transactions[5];
    transactions.push({
      id: `txn-refund-002`,
      transactionId: 'TXN-REF-002',
      bookingId: originalTxn2.bookingId,
      type: 'refund',
      status: 'cancelled', // Refunded bookings are cancelled, not completed
      amount: originalTxn2.amount,
      currency: 'USD',
      customerPaidAmount: originalTxn2.customerPaidAmount,
      platformFee: 0,
      paymentProcessingFee: 0,
      transactionFee: 0,
      netToSeller: -originalTxn2.netToSeller,
      paymentMethod: originalTxn2.paymentMethod,
      paymentProcessor: originalTxn2.paymentProcessor,
      customerName: originalTxn2.customerName,
      description: 'Refund: Service quality issue',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      settledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      taxAmount: 0,
      taxRate: 0,
      region: originalTxn2.region,
      category: 'refund',
      listingName: originalTxn2.listingName,
      listingId: originalTxn2.listingId,
      listingImage: originalTxn2.listingImage,
      serviceCategory: originalTxn2.serviceCategory,
      completionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      availableDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      refundMetadata: {
        originalTransactionId: originalTxn2.transactionId,
        processedBy: 'admin',
        reason: 'Customer reported service quality issue - Admin approved refund',
        processedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        impactedBalance: 'deficit'
      }
    });
  }
  
  return transactions;
})();

// Helper function to generate transaction history for a specific booking
// Simulates the payment flow: pending → successful/failed with possible retries
export function getBookingTransactionHistory(bookingId: string): FinancialTransaction[] {
  const bookingTransactions: FinancialTransaction[] = [];
  const allOrders = getAllOrdersWithBookings();
  const booking = allOrders.find(order => order.id === bookingId);
  
  if (!booking || booking.type !== 'service') {
    return [];
  }

  const service = booking.service;
  if (!service) return [];

  // Calculate fees
  const amount = booking.totalAmount;
  const platformFee = amount * 0.025; // 2.5%
  const paymentProcessingFee = amount * 0.029 + 0.30; // 2.9% + $0.30
  const transactionFee = 0.25;
  const netToSeller = amount - platformFee - paymentProcessingFee - transactionFee;

  const baseTransaction = {
    bookingId: booking.id,
    type: 'booking_payment' as const,
    amount,
    currency: 'USD',
    customerPaidAmount: amount,
    platformFee: Math.round(platformFee * 100) / 100,
    paymentProcessingFee: Math.round(paymentProcessingFee * 100) / 100,
    transactionFee,
    netToSeller: Math.round(netToSeller * 100) / 100,
    paymentMethod: 'credit_card' as const,
    customerName: booking.customer?.name || `Customer ${booking.id.slice(-3)}`,
    description: service.name,
    taxAmount: 0,
    taxRate: 0,
    region: 'US' as const,
    category: 'service_booking' as const,
    listingName: service.name,
    listingId: service.id,
    listingImage: service.images?.[0],
    serviceCategory: service.category,
  };

  // Simulate transaction flow based on booking status
  const bookingStatus = booking.status;
  const paymentStatus = booking.paymentStatus;
  const orderDate = booking.orderDate;

  // Scenario 1: Failed attempt first (simulate for some pending bookings)
  if (bookingStatus === 'pending' && Math.random() > 0.5) {
    // First attempt failed
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-001`,
      transactionId: `0242ac${Math.random().toString(36).substr(2, 6)}`,
      status: 'failed',
      date: new Date(orderDate.getTime() - 2 * 60 * 1000), // 2 mins before
      paymentProcessor: 'Stripe',
      settledDate: new Date(orderDate.getTime() - 2 * 60 * 1000),
    });
    
    // Second attempt pending
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-002`,
      transactionId: `0242ac${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending',
      date: orderDate,
      paymentProcessor: 'Paystack',
    });
  }
  // Scenario 2: Pending payment (awaiting seller confirmation)
  else if (bookingStatus === 'pending' || bookingStatus === 'requested') {
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-001`,
      transactionId: `0242ac${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending',
      date: orderDate,
      paymentProcessor: 'Stripe',
    });
  }
  // Scenario 3: Confirmed booking (payment successful)
  else if (bookingStatus === 'confirmed' || bookingStatus === 'scheduled' || bookingStatus === 'completed') {
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-001`,
      transactionId: `0242ac${Math.random().toString(36).substr(2, 6)}`,
      status: 'successful',
      date: orderDate,
      paymentProcessor: 'Stripe',
      settledDate: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
      completionDate: booking.appointmentDate || orderDate,
      holdEndDate: new Date((booking.appointmentDate || orderDate).getTime() + 7 * 24 * 60 * 60 * 1000),
      availableDate: new Date((booking.appointmentDate || orderDate).getTime() + 7 * 24 * 60 * 60 * 1000),
    });
  }
  // Scenario 4: Cancelled/Declined booking
  else if (bookingStatus === 'cancelled' || bookingStatus === 'declined') {
    // Initial pending transaction
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-001`,
      transactionId: `0242ac${Math.random().toString(36).substr(2, 6)}`,
      status: 'unclaimed',
      date: orderDate,
      paymentProcessor: 'Stripe',
      settledDate: orderDate,
    });
  }
  // Scenario 5: Refunded booking
  else if (bookingStatus === 'refunded' || paymentStatus === 'refunded') {
    // Original successful payment
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-001`,
      transactionId: `0242ac${Math.random().toString(36).substr(2, 6)}`,
      status: 'successful',
      date: orderDate,
      paymentProcessor: 'Stripe',
      settledDate: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
    });
    
    // Refund transaction
    bookingTransactions.push({
      ...baseTransaction,
      id: `TXN-${bookingId}-REF`,
      transactionId: `ref_${Math.random().toString(36).substr(2, 12)}`,
      type: 'refund',
      status: 'refunded',
      date: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days later
      paymentProcessor: 'Stripe',
      settledDate: new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      netToSeller: -Math.round(netToSeller * 100) / 100, // Negative amount
      description: `Refund: ${service.name}`,
    });
  }

  return bookingTransactions;
}

// Helper function to format customer name as "First LastInitial" (e.g., "Sarah M.")
export function formatCustomerNameForDisplay(fullName: string): string {
  if (!fullName) return 'Customer';
  const nameParts = fullName.trim().split(' ');
  if (nameParts.length === 1) return nameParts[0];
  const firstName = nameParts[0];
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase() + '.';
  return `${firstName} ${lastInitial}`;
}

// Calculate if funds are available for withdrawal (hold period passed)
export function isAvailableForWithdrawal(transaction: FinancialTransaction): boolean {
  if (!transaction.availableDate) return false;
  const now = new Date();
  return transaction.availableDate <= now;
}

// Get available balance (transactions past hold period that haven't been paid out)
export function getAvailableBalance(transactions: FinancialTransaction[]): number {
  const now = new Date();
  return transactions
    .filter(t => 
      t.status === 'completed' && 
      t.availableDate && 
      t.availableDate <= now
    )
    .reduce((sum, t) => sum + t.netToSeller, 0);
}

// Get available balance since last payout (completed bookings since last payout)
export function getAvailableBalanceSinceLastPayout(transactions: FinancialTransaction[]): number {
  const now = new Date();
  const lastPayoutDate = getLastPayoutDate();
  
  // Get transactions that:
  // 1. Are completed
  // 2. Have passed hold period (availableDate <= now)
  // 3. Were completed after the last payout date (date >= lastPayoutDate)
  return transactions
    .filter(t => 
      t.status === 'completed' && 
      t.availableDate && 
      t.availableDate <= now &&
      t.date >= lastPayoutDate
    )
    .reduce((sum, t) => sum + t.netToSeller, 0);
}

// Get pending balance (completed but still in 7-day hold period)
export function getPendingBalance(transactions: FinancialTransaction[]): number {
  const now = new Date();
  return transactions
    .filter(t => 
      t.status === 'completed' && 
      t.availableDate && 
      t.availableDate > now
    )
    .reduce((sum, t) => sum + t.netToSeller, 0);
}

// Get projected earnings from confirmed bookings not yet completed
export function getProjectedEarnings(sellerId: string): { amount: number; count: number; earliestDate?: Date; latestDate?: Date } {
  const allOrders = getAllOrdersWithBookings();
  const confirmedBookings = allOrders.filter(order => 
    order.type === 'service' && 
    order.status === 'confirmed' && 
    order.paymentStatus === 'paid' &&
    order.service?.provider?.id === sellerId
  );
  
  const totalAmount = confirmedBookings.reduce((sum, booking) => {
    const platformFee = booking.totalAmount * 0.025;
    const paymentProcessingFee = booking.totalAmount * 0.029 + 0.30;
    const transactionFee = 0.25;
    const netToSeller = booking.totalAmount - platformFee - paymentProcessingFee - transactionFee;
    return sum + netToSeller;
  }, 0);
  
  // Get date range from bookings
  let earliestDate: Date | undefined;
  let latestDate: Date | undefined;
  
  if (confirmedBookings.length > 0) {
    const dates = confirmedBookings
      .map(booking => booking.createdAt || booking.updatedAt)
      .filter((date): date is Date => date !== undefined)
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (dates.length > 0) {
      earliestDate = dates[0];
      latestDate = dates[dates.length - 1];
    }
  }
    
  return {
    amount: Math.round(totalAmount * 100) / 100,
    count: confirmedBookings.length,
    earliestDate,
    latestDate
  };
}

// Calculate financial summary from transactions
export function calculateFinancialSummary(
  transactions: FinancialTransaction[], 
  timeFilter: 'all' | '30d' | '7d' | '24h' = 'all'
): FinancialSummary {
  const now = new Date();
  let filteredTransactions = transactions;
  
  // Apply time filter
  if (timeFilter !== 'all') {
    const daysMap = { '30d': 30, '7d': 7, '24h': 1 };
    const days = daysMap[timeFilter];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    filteredTransactions = transactions.filter(t => t.date >= cutoffDate);
  }
  
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed');
  
  // Separate refunds from regular transactions
  const refundTransactions = completedTransactions.filter(t => t.type === 'refund');
  const earningTransactions = completedTransactions.filter(t => t.type !== 'refund');
  
  const totalRevenue = earningTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netEarnings = completedTransactions.reduce((sum, t) => sum + t.netToSeller, 0); // Includes refunds (negative)
  const totalFees = earningTransactions.reduce((sum, t) => 
    sum + t.platformFee + t.paymentProcessingFee + t.transactionFee, 0
  );
  const totalTaxes = earningTransactions.reduce((sum, t) => sum + (t.taxAmount || 0), 0);
  const pendingEarnings = getPendingBalance(transactions);
  const availableForWithdrawal = getAvailableBalance(transactions);
  
  // Calculate refund metrics
  const totalRefunds = Math.abs(refundTransactions.reduce((sum, t) => sum + t.netToSeller, 0));
  const refundCount = refundTransactions.length;
  const refundRate = completedTransactions.length > 0 
    ? (refundCount / completedTransactions.length) * 100 
    : 0;

  return {
    totalRevenue,
    netEarnings,
    pendingEarnings,
    availableForWithdrawal,
    totalFees,
    totalTaxes,
    completedTransactions: earningTransactions.length, // Don't count refunds
    pendingTransactions: filteredTransactions.filter(t => t.status === 'pending').length,
    revenueGrowth: 12.5, // Mock growth percentage
    transactionVolume30d: transactions.filter(t => {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return t.date >= thirtyDaysAgo && t.type !== 'refund';
    }).length,
    averageOrderValue: earningTransactions.length > 0 
      ? totalRevenue / earningTransactions.length 
      : 0,
    refundRate,
    categoryBreakdown: {},
    monthlyRevenue: [],
    topPerformingServices: [],
    monthlyTarget: 10000,
    // Refund tracking
    totalRefunds,
    refundCount
  };
}

// Get last payout date (1st and 15th of month)
export function getLastPayoutDate(): Date {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Payouts happen on 1st and 15th of each month
  if (currentDay >= 1 && currentDay < 15) {
    // If we're between 1st and 15th, last payout was on 1st of this month
    return new Date(currentYear, currentMonth, 1);
  } else if (currentDay >= 15) {
    // If we're on or after 15th, last payout was on 15th of this month
    return new Date(currentYear, currentMonth, 15);
  } else {
    // If we're before 1st (shouldn't happen, but handle edge case)
    // Last payout was 15th of previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return new Date(prevYear, prevMonth, 15);
  }
}

// Get next payout dates (1st and 15th of month)
export function getNextPayoutDates() {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let payoutDate: Date;
  
  // Payouts happen on 1st and 15th of each month
  if (currentDay < 1) {
    // Before 1st (shouldn't happen, but handle edge case)
    payoutDate = new Date(currentYear, currentMonth, 1);
  } else if (currentDay < 15) {
    // Between 1st and 15th, next payout is 15th of this month
    payoutDate = new Date(currentYear, currentMonth, 15);
  } else {
    // On or after 15th, next payout is 1st of next month
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    payoutDate = new Date(nextYear, nextMonth, 1);
  }

  const earliestArrival = new Date(payoutDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const latestArrival = new Date(payoutDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    payoutDate,
    earliestDate: earliestArrival,
    latestDate: latestArrival,
    windowLabel: payoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

// Generate mock payout records from transactions
// Generate payout records dynamically based on actual transactions
export const mockPayoutRecords: PayoutRecord[] = (() => {
  const completedTransactions = allFinancialTransactions
    .filter(t => t.status === 'completed' && t.availableDate && t.availableDate <= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const payouts: PayoutRecord[] = [];
  
  // Group transactions into payouts (2 transactions per payout for this example)
  if (completedTransactions.length >= 2) {
    const payout1Txns = completedTransactions.slice(0, 2);
    const payout1Total = payout1Txns.reduce((sum, t) => sum + t.netToSeller, 0);
    
    payouts.push({
      id: 'PAYOUT-001',
      amount: Math.round(payout1Total * 100) / 100,
      currency: 'USD',
      status: 'completed',
      method: 'bank_transfer',
      accountDetails: {
        type: 'bank',
        last4: '1234',
        bankName: 'Chase Bank'
      },
      initiatedDate: new Date(new Date().setDate(new Date().getDate() - 10)),
      completedDate: new Date(new Date().setDate(new Date().getDate() - 5)),
      fee: 2.50,
      netAmount: Math.round((payout1Total - 2.50) * 100) / 100,
      transactionIds: payout1Txns.map(t => t.transactionId),
      description: 'Bi-monthly payout'
    });
  }

  if (completedTransactions.length >= 4) {
    const payout2Txns = completedTransactions.slice(2, 4);
    const payout2Total = payout2Txns.reduce((sum, t) => sum + t.netToSeller, 0);
    
    payouts.push({
      id: 'PAYOUT-002',
      amount: Math.round(payout2Total * 100) / 100,
      currency: 'USD',
      status: 'processing',
      method: 'bank_transfer',
      accountDetails: {
        type: 'bank',
        last4: '1234',
        bankName: 'Chase Bank'
      },
      initiatedDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      fee: 2.50,
      netAmount: Math.round((payout2Total - 2.50) * 100) / 100,
      transactionIds: payout2Txns.map(t => t.transactionId),
      description: 'Bi-monthly payout'
    });
  }

  // Add a third payout if we have more transactions
  if (completedTransactions.length >= 6) {
    const payout3Txns = completedTransactions.slice(4, 6);
    const payout3Total = payout3Txns.reduce((sum, t) => sum + t.netToSeller, 0);
    
    payouts.push({
      id: 'PAYOUT-003',
      amount: Math.round(payout3Total * 100) / 100,
      currency: 'USD',
      status: 'pending',
      method: 'bank_transfer',
      accountDetails: {
        type: 'bank',
        last4: '1234',
        bankName: 'Chase Bank'
      },
      initiatedDate: new Date(),
      fee: 2.50,
      netAmount: Math.round((payout3Total - 2.50) * 100) / 100,
      transactionIds: payout3Txns.map(t => t.transactionId),
      description: 'Bi-monthly payout'
    });
  }

  return payouts;
})();

// Export the actual transactions array
export const allFinancialTransactionsExport = allFinancialTransactions;
