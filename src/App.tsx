import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { SellerProfilePage } from './pages/SellerProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import { CartPage } from './pages/CartPage';
import { Service, Product, ListingItem, ServiceProvider } from './types';
import { mockServices, mockProducts, mockListings, mockOrders } from './mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { 
  BarChart, Calendar, DollarSign, ShoppingCart, Package, TrendingUp, 
  ArrowUp, Wallet, ChevronDown, ChevronLeft, ChevronRight, Search, 
  Edit, Trash, Eye, PlusCircle, Zap, BarChart2, Settings, 
  Users, Star, CheckCircle, MoreVertical, Film, X, Bookmark, ChevronUp, LayoutDashboard, Store 
} from 'lucide-react';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { 
  OrderDetailsPage, 
  OrderTrackingPage, 
  OrderCancellationPage,
  OrderReturnPage,
  OrderReviewPage
} from './pages/PlaceholderPages';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { CartItem } from './context/CartContext';
import { ShippingInfoPage } from './pages/ShippingInfoPage';

function App() {
  const [currentPage, setCurrentPage] = useState<
    'landing' | 
    'serviceDetails' | 
    'productDetails' | 
    'booking' | 
    'payment' | 
    'sellerProfile' | 
    'createListing' | 
    'profile' | 
    'myOrders' | 
    'sellerDashboard' | 
    'settings' |
    'sellerDashboard_overview' |
    'sellerDashboard_myShop' |
    'sellerDashboard_orders' |
    'sellerDashboard_appointments' |
    'sellerDashboard_finance' |
    'editListing' |
    'bookings' |
    'home' |
    'cart' |
    'checkout' |
    'order-confirmation'
  >('landing');
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [user, setUser] = useState<{
    name: string;
    email: string;
    imageUrl?: string;
    status?: 'online' | 'offline' | 'away';
    userId: string;
  } | null>(null);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<{
    customerName: string;
    customerEmail: string;
    notes: string;
    timeSlot: any;
  } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderAction, setOrderAction] = useState<string | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'auth' | 'shipping' | 'payment' | 'review'>('auth');
  // Add a state to keep track if the user came from checkout
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Determine if sidebar should be shown
  const shouldShowSidebar = () => {
    // Don't show sidebar on landing, product details, or service details pages
    return ![
      'landing', 
      'serviceDetails', 
      'productDetails'
    ].includes(currentPage);
  };

  const handleListingSelect = (listing: ListingItem) => {
    setSelectedListing(listing);
    setCurrentPage(listing.type === 'service' ? 'serviceDetails' : 'productDetails');
  };

  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setCurrentPage('sellerProfile');
  };

  const handleBookNow = () => {
    setCurrentPage('booking');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setSelectedListing(null);
    setSelectedProvider(null);
  };

  // Update the handleLogin function to ensure it redirects correctly after authentication
  const handleLogin = (email: string, password: string) => {
    console.log('Login attempt with', email, 'isCheckingOut:', isCheckingOut);
    
    // Simulate authentication success
    setIsAuthenticated(true);
    setUser({
      name: email.split('@')[0],
      email: email,
      userId: 'CM7by141boza',
      status: 'online'
    });

    console.log('Authentication successful, redirecting...');
    
    // If user was in checkout flow, return them to checkout
    if (isCheckingOut) {
      console.log('Returning to checkout flow, advancing to shipping step');
      // First reset the checkout flag
      setIsCheckingOut(false);
      // Then ensure we're on the shipping step
      setCheckoutStep('shipping');
      // Finally navigate back to checkout
      setCurrentPage('checkout');
    } else {
      // Default navigation for normal login
      setCurrentPage('landing');
    }
  };

  // Handle signup form submission
  const handleSignup = (email: string, password: string) => {
    console.log('Signup with', email, password);
    // Simulate account creation
    setIsAuthenticated(true);
    setUser({
      name: email.split('@')[0],
      email,
      userId: 'CM7by141boza',
      status: 'online'
    });

    // If user was in checkout flow, return them to checkout
    if (isCheckingOut) {
      setIsCheckingOut(false);
      setCurrentPage('checkout');
      // Skip the auth step since they're now registered
      setCheckoutStep('shipping');
    } else {
      // Default navigation for normal signup
      setCurrentPage('landing');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleHomeClick = () => {
    setCurrentPage('landing');
    setSelectedListing(null);
    setSelectedProvider(null);
  };

  // Update the handleBuyNow function to ensure checkout flag is reset
  const handleBuyNow = () => {
    // Set checking out flag to track the flow
    setIsCheckingOut(false);
    // Reset checkout step to auth
    setCheckoutStep('auth');
    
    // If coming from product details page, use the selected listing
    if (selectedListing) {
      // Add the current product to checkout with quantity 1
      console.log('Buy Now clicked for product:', selectedListing.name);
      handleCheckout([{...(selectedListing as Product), quantity: 1}]);
    } else {
      // Generic fallback if called from elsewhere
      console.log('Buy Now clicked without product');
      handleNavigate('checkout');
    }
  };

  const handleSellNowClick = () => {
    setCurrentPage('createListing');
  };

  // Handler for sidebar navigation
  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
    // Reset scroll position when navigating
    window.scrollTo(0, 0);
  };

  // Handle checkout process
  const handleCheckout = (items: CartItem[] = []) => {
    // Store items being checked out if coming from "Buy Now"
    // If empty, it means we're checking out the entire cart
    setCheckoutItems(items);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  // Simple placeholder component for sidebar pages
  const PlaceholderPage = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {children || (
        <p className="text-gray-600">This is a placeholder for the {title} page. Additional content would go here.</p>
      )}
    </div>
  );

  // Profile page with multiple sections
  const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState<'listed' | 'sold' | 'profile'>('listed');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
    
    // Create a ref for the file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Here you would typically upload the file to your server
        console.log('File selected:', file.name);
        
        // Close the modal after selecting a file
        setIsImageModalOpen(false);
      }
    };

    // Trigger file input click
    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };

    // Add form state to store form data with proper TypeScript types
    const [formData, setFormData] = useState({
      fullName: user?.name || '',
      username: user?.userId || '5F6H2S9J',
      email: user?.email || '',
      phone: '+372 5123 4567',
      currentLocation: 'Tallinn',
      address: {
        street: '',
        city: 'Tallinn',
        postalCode: '',
        country: 'Estonia'
      },
      primaryNationality: 'EE',
      secondaryNationality: '',
      tribes: ['', ''] as string[],
      language: 'en',
      interests: [] as string[]
    });

    // Available cities
    const cities = [
      'Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 
      'Viljandi', 'Rakvere', 'London', 'Berlin', 'Paris', 
      'New York', 'Tokyo', 'Sydney', 'Cape Town', 'Lagos',
      'Nairobi', 'Cairo', 'Dubai', 'Mumbai', 'Singapore'
    ];

    // Tribe options
    const tribeOptions = [
      { value: '', label: '-- Select Tribe --' },
      { value: 'yoruba', label: 'Yoruba' },
      { value: 'igbo', label: 'Igbo' },
      { value: 'hausa', label: 'Hausa' },
      { value: 'maasai', label: 'Maasai' },
      { value: 'zulu', label: 'Zulu' },
      { value: 'xhosa', label: 'Xhosa' },
      { value: 'navajo', label: 'Navajo' },
      { value: 'cherokee', label: 'Cherokee' },
      { value: 'maori', label: 'Māori' },
      { value: 'sami', label: 'Sámi' },
      { value: 'akan', label: 'Akan' },
      { value: 'amhara', label: 'Amhara' },
      { value: 'baganda', label: 'Baganda' },
      { value: 'bambara', label: 'Bambara' },
      { value: 'bemba', label: 'Bemba' },
      { value: 'berber', label: 'Berber' },
      { value: 'chewa', label: 'Chewa' },
      { value: 'edo', label: 'Edo' },
      { value: 'fulani', label: 'Fulani' },
      { value: 'kikuyu', label: 'Kikuyu' },
      { value: 'luba', label: 'Luba' },
      { value: 'luo', label: 'Luo' },
      { value: 'oromo', label: 'Oromo' },
      { value: 'shona', label: 'Shona' },
      { value: 'somali', label: 'Somali' },
      { value: 'swahili', label: 'Swahili' },
      { value: 'tigray', label: 'Tigray' },
      { value: 'tsonga', label: 'Tsonga' },
      { value: 'tswana', label: 'Tswana' }
    ];

    // Interest options
    const interestOptions = [
      { value: 'food', label: 'Food' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'babysitting', label: 'Babysitting' },
      { value: 'cooking', label: 'Cooking Services' },
      { value: 'mentoring', label: 'Mentoring' },
      { value: 'driver', label: 'Driver Services' },
      { value: 'tutoring', label: 'Tutoring' },
      { value: 'handyman', label: 'Handyman' },
      { value: 'landscaping', label: 'Landscaping' },
      { value: 'petcare', label: 'Pet Care' },
      { value: 'haircut', label: 'Haircut' },
      { value: 'tailoring', label: 'Tailoring' },
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'electrical', label: 'Electrical Services' },
      { value: 'painting', label: 'Painting' },
      { value: 'massage', label: 'Massage Therapy' },
      { value: 'yoga', label: 'Yoga Instruction' },
      { value: 'personaltraining', label: 'Personal Training' },
      { value: 'webdesign', label: 'Web Design' },
      { value: 'graphicdesign', label: 'Graphic Design' }
    ];

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // Handle nested address fields
      if (name.startsWith('address.')) {
        const addressField = name.split('.')[1];
        setFormData({
          ...formData,
          address: {
            ...formData.address,
            [addressField]: value
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    };

    // Handle tribe selection
    const handleTribeChange = (index: number, value: string) => {
      const newTribes = [...formData.tribes];
      newTribes[index] = value;
      setFormData({
        ...formData,
        tribes: newTribes
      });
    };

    // Handle interests selection
    const handleInterestToggle = (interest: string) => {
      setFormData({
        ...formData,
        interests: formData.interests.includes(interest)
          ? formData.interests.filter(i => i !== interest)
          : [...formData.interests, interest]
      });
    };

    // Handle searching interests
    const [interestSearch, setInterestSearch] = useState('');
    const filteredInterests = interestSearch 
      ? interestOptions.filter(option => 
          option.label.toLowerCase().includes(interestSearch.toLowerCase()))
      : interestOptions;
    
    // Toggle dropdown visibility
    const [isInterestDropdownOpen, setIsInterestDropdownOpen] = useState(false);

    // Close dropdown when clicking outside
    const interestDropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (interestDropdownRef.current && !interestDropdownRef.current.contains(event.target as Node)) {
          setIsInterestDropdownOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Here you would typically send the data to your backend
      console.log('Profile data being saved:', formData);
      
      // Update user state with the new values (only the editable fields)
      if (user) {
        setUser({
          ...user,
          // We're not updating name and email as they're read-only
          userId: formData.username
        });
      }
      
      // Exit edit mode
      setIsEditMode(false);
      
      // Show success message
      alert('Profile updated successfully!');
    };

    return (
      <div className="p-8">
        {/* Combined Page Path and Heading */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="hover:text-blue-600 cursor-pointer">Account</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-blue-600">Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile Overview</h1>
        </div>

        {!isEditMode ? (
          /* Profile Header Card */
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 mb-6 relative border border-white/20 shadow-[0_8px_32px_rgba(31,38,135,0.15)] overflow-hidden">
            {/* Decorative tech elements - reduced size */}
            <div className="absolute -top-20 -right-20 w-36 h-36 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 rounded-full blur-xl"></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h1v99h-1v1h99v-1h1v-99h-1v-1h-99v1h-1v99zm1%201h98v98h-98v-98z%22%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.15%22%2F%3E%3C%2Fsvg%3E')] opacity-5"></div>
            
            {/* Glass content container */}
            <div className="relative backdrop-blur-sm bg-white/30 rounded-lg p-4 shadow-inner border border-white/40">
              {/* Edit button */}
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="text-gray-100 bg-purple-500/80 hover:bg-purple-600/90 transition-all duration-200 p-1.5 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil group-hover:scale-110 transition-transform duration-200"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar with animated border - 2.5x larger */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(147,51,234,0.5),rgba(79,70,229,0.5),rgba(147,51,234,0.2),rgba(79,70,229,0.5),rgba(147,51,234,0.5))] rounded-full animate-[spin_8s_linear_infinite] blur-sm"></div>
                  <div className="w-48 h-48 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/50 shadow-lg relative z-10 group-hover:ring-4 group-hover:ring-purple-300/50 transition-all duration-300">
                    {/* Cartoon profile image */}
                    <img 
                      src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Round&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light" 
                      alt="Profile Avatar" 
                  className="w-full h-full object-cover"
                />
                  </div>
                  
                  {/* Glowing online status indicator - repositioned */}
                  <div className="absolute bottom-2 right-3 w-8 h-8 rounded-full shadow-lg z-20">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-[pulse_2s_ease-in-out_infinite] opacity-40"></div>
                    <div className="w-full h-full bg-green-500 rounded-full border-2 border-white relative z-10"></div>
                  </div>
                </div>
                
                <div className="flex-grow md:pl-2">
                  {/* Name with highlight effect */}
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-2 tracking-tight relative inline-block">
                    {user?.name || 'Sarah Janet'}
                    <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-transparent rounded-lg blur-md -z-10"></span>
                  </h2>
                  
                  <div className="text-gray-600 mb-3 flex items-center flex-wrap text-sm">
                    <span className="text-gray-500 font-medium inline-flex items-center">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">@{user?.userId || '5F6H2S9J'}</span>
                  </span>
                    <span className="mx-2 text-purple-300">•</span>
                    <span className="text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-indigo-400"><path d="M18.3 5.71a8 8 0 0 0-11.4 0"/><path d="m15 5 4 4"/></svg>
                      Last seen 10 mins ago
                    </span>
                    <span className="mx-2 text-purple-300">•</span>
                    {/* Enhanced star rating */}
                    <div className="flex items-center bg-yellow-400/10 px-2 py-0.5 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-yellow-500">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold ml-1 text-yellow-700 text-xs">3.5</span>
                      <span className="text-gray-500 text-xs ml-1">(21)</span>
                </div>
                  </div>
                  
                  {/* Information cards with glassmorphism */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="flex items-center group">
                      <div className="w-full backdrop-blur-md bg-white/20 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-white/30 hover:border-purple-300/50">
                        <div className="flex items-center">
                          <div className="p-1.5 mr-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
                            <span className="inline-block w-5 h-3.5 rounded-sm overflow-hidden shadow-sm bg-no-repeat bg-cover" style={{backgroundImage: 'url("https://flagcdn.com/w320/ee.png")'}}></span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Location</div>
                            <div className="text-gray-700 text-sm font-medium">Tallinn, Estonia</div>
                          </div>
                        </div>
                      </div>
            </div>
            
                    <div className="flex items-center group">
                      <div className="w-full backdrop-blur-md bg-white/20 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-white/30 hover:border-purple-300/50">
                        <div className="flex items-center">
                          <div className="p-1.5 mr-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Phone</div>
                            <div className="text-gray-700 text-sm font-medium">+372 5123 4567</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center group">
                      <a href={`mailto:${user?.email || 'john.doe@example.com'}`} className="w-full backdrop-blur-md bg-white/20 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-white/30 hover:border-purple-300/50 group">
                        <div className="flex items-center">
                          <div className="p-1.5 mr-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2Z"/></svg>
                          </div>
            <div className="flex-grow">
                            <div className="text-xs text-gray-500 mb-0.5">Email</div>
                            <div className="text-gray-700 text-sm font-medium">{user?.email || 'john.doe@example.com'}</div>
              </div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                        </div>
                      </a>
                    </div>
                    
                    <div className="flex items-center group">
                      <div className="w-full backdrop-blur-md bg-white/20 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-white/30 hover:border-purple-300/50">
                        <div className="flex items-center">
                          <div className="p-1.5 mr-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Member Since</div>
                            <div className="text-gray-700 text-sm font-medium">April 2022</div>
                </div>
                </div>
                </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Profile Edit Form */
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button 
                onClick={() => setIsEditMode(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Profile Image Section with Username Display */}
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative">
                  <div 
                    className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <img 
                      src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Round&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light" 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    onClick={handleUploadClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </button>
                </div>
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {/* Username display (non-editable) */}
                <div className="text-center">
                  <p className="font-medium text-gray-900 text-lg">@{formData.username}</p>
                </div>
              </div>

              {/* Profile Image Modal */}
              {isImageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={() => setIsImageModalOpen(false)}>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-3xl max-h-[90vh]">
                      <div className="relative">
                        <img 
                          src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Round&hairColor=BrownDark&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light" 
                          alt="Profile Avatar" 
                          className="w-full h-auto"
                        />
                        <button 
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-700 hover:text-gray-900"
                          onClick={() => setIsImageModalOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                        <div className="mt-4 flex justify-end">
                          <button 
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
                            onClick={handleUploadClick}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Change Picture
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Form Sections */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-base font-medium text-gray-800 pb-2 mb-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Contact Information</span>
                    </div>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        value={formData.fullName}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                        value={formData.email}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <select 
                        id="language" 
                        name="language"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="et">Estonian</option>
                        <option value="ru">Russian</option>
                        <option value="zh">Chinese (Mandarin)</option>
                        <option value="ja">Japanese</option>
                        <option value="ar">Arabic</option>
                        <option value="hi">Hindi</option>
                        {/* More languages would be listed here */}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Location Information */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-base font-medium text-gray-800 pb-2 mb-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Location Details</span>
                    </div>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                      <select 
                        id="currentLocation" 
                        name="currentLocation"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.currentLocation}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Select City --</option>
                        {cities.map((city, index) => (
                          <option key={index} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      
                      <div>
                        <label htmlFor="address.street" className="block text-xs text-gray-500 mb-1">Street Address</label>
                        <input 
                          type="text" 
                          id="address.street" 
                          name="address.street"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 123 Main St, Apt 4B"
                          value={formData.address.street}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="address.city" className="block text-xs text-gray-500 mb-1">City</label>
                          <input 
                            type="text" 
                            id="address.city" 
                            name="address.city"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.address.city}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="address.postalCode" className="block text-xs text-gray-500 mb-1">Postal Code</label>
                          <input 
                            type="text" 
                            id="address.postalCode" 
                            name="address.postalCode"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.address.postalCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="address.country" className="block text-xs text-gray-500 mb-1">Country</label>
                        <input 
                          type="text" 
                          id="address.country" 
                          name="address.country"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.address.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Information Section */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-base font-medium text-gray-800 pb-2 mb-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Additional Information</span>
                    </div>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Nationality Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">Nationality Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="primaryNationality" className="block text-sm text-gray-700 mb-1">Primary Nationality</label>
                          <select 
                            id="primaryNationality"
                            name="primaryNationality"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.primaryNationality}
                            onChange={handleInputChange}
                          >
                            <option value="">-- Select Primary Nationality --</option>
                            <option value="EE">Estonia</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="NG">Nigeria</option>
                            <option value="KE">Kenya</option>
                            <option value="ZA">South Africa</option>
                            <option value="AU">Australia</option>
                            {/* More countries would be listed here */}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="secondaryNationality" className="block text-sm text-gray-700 mb-1">Secondary Nationality (Optional)</label>
                          <select 
                            id="secondaryNationality"
                            name="secondaryNationality"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.secondaryNationality}
                            onChange={handleInputChange}
                          >
                            <option value="">-- Select Secondary Nationality --</option>
                            <option value="EE">Estonia</option>
                            <option value="US">United States</option>
                            <option value="GB">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="NG">Nigeria</option>
                            <option value="KE">Kenya</option>
                            <option value="ZA">South Africa</option>
                            <option value="AU">Australia</option>
                            {/* More countries would be listed here */}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tribe Selection Section */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">Tribe Affiliation</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Primary Tribe</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.tribes[0]}
                            onChange={(e) => handleTribeChange(0, e.target.value)}
                          >
                            {tribeOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Secondary Tribe (Optional)</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.tribes[1]}
                            onChange={(e) => handleTribeChange(1, e.target.value)}
                          >
                            {tribeOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interests Section */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-base font-medium text-gray-800 pb-2 mb-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span>Product/Service Interests</span>
                    </div>
                  </h3>
                  
                  <div className="relative">
                    {/* Selected interests display */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Selected Interests</label>
                      {formData.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.interests.map((interest) => {
                            const label = interestOptions.find(option => option.value === interest)?.label;
                            return (
                              <div key={interest} className="bg-blue-100 text-blue-800 text-xs rounded-full px-3 py-1 flex items-center">
                                {label}
                                <button 
                                  type="button" 
                                  className="ml-1 text-blue-500 hover:text-blue-700"
                                  onClick={() => handleInterestToggle(interest)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No interests selected yet</p>
                      )}
                    </div>
                    
                    {/* Dropdown toggle button */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsInterestDropdownOpen(!isInterestDropdownOpen)}
                        className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span>Browse and select interests</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform ${isInterestDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Interest selection dropdown - only shows when open */}
                    {isInterestDropdownOpen && (
                      <div 
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200"
                        ref={interestDropdownRef}
                      >
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Search interests..."
                              value={interestSearch}
                              onChange={(e) => setInterestSearch(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Options list */}
                        <div className="max-h-48 overflow-y-auto p-1">
                          {filteredInterests.map((option) => (
                            <div 
                              key={option.value} 
                              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                              onClick={() => handleInterestToggle(option.value)}
                            >
                              <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${formData.interests.includes(option.value) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                {formData.interests.includes(option.value) && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm">{option.label}</span>
                            </div>
                          ))}
                          {filteredInterests.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">No matching interests found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Form Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Convert tabs to cards on the profile homepage */}
        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Saved Items Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-6">Saved Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockProducts.slice(0, 3).map((product, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300 flex flex-col">
                    <div className="relative w-full h-48">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-48 object-cover" 
                      />
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded-tl-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 5.943 7.523 2 12 2c4.478 0 8.268 3.943 9.542 10-1.274 6.057-5.064 10-9.542 10S3.732 18.057 2.458 12z" />
                        </svg>
                        {product.views || 0}
                      </div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.shortDescription}</p>
                      <p className="text-sm text-gray-500 mb-2">Saved: {product.dateSaved || 'N/A'}</p>
                      <p className="text-lg font-bold mb-3">${product.price}</p>
                      <button className="mt-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200">View All Saved Items</button>
            </div>
            
            {/* Recently Viewed Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recently Viewed</h3>
              <p className="text-base text-gray-600 mb-6">Check out your recently viewed items.</p>
              <button className="text-lg text-blue-600 hover:text-blue-800 font-medium">View Details</button>
            </div>
            
            {/* Ongoing Orders Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Orders</h3>
              <p className="text-base text-gray-600 mb-6">Manage your current orders.</p>
              <button 
                onClick={() => handleNavigate('myOrders')}
                className="text-lg text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View Orders <ChevronRight className="ml-1 h-5 w-5" />
              </button>
            </div>
            
            {/* Appointments Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Appointments</h3>
              <p className="text-base text-gray-600 mb-6">View and manage your appointments.</p>
              <button className="text-lg text-blue-600 hover:text-blue-800 font-medium">View Details</button>
            </div>
          </div>
        )}
        
        {/* Other section contents would be here but hidden for brevity */}
        
      </div>
    );
  };

  // Seller Dashboard Overview placeholder
  const SellerDashboardOverview = () => {
    const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Mock data for charts
    const revenueData = {
      '24h': [1200, 950, 1350, 1100, 1450, 1320, 1580],
      '7d': [5200, 4800, 5600, 6100, 5800, 6200, 6500],
      '30d': [18500, 19200, 17800, 21000, 22500, 21300, 23600],
      '90d': [52000, 56000, 49000, 61000, 68000, 72000, 79000]
    };
    
    const navigateTo = (page: string) => {
      handleNavigate(page);
    };
    
    const salesData = {
      '24h': [12, 9, 15, 10, 14, 12, 16],
      '7d': [48, 52, 45, 59, 63, 58, 67],
      '30d': [155, 168, 143, 189, 201, 195, 215],
      '90d': [450, 490, 425, 560, 605, 580, 640]
    };
    
    const viewsData = {
      '24h': [85, 92, 78, 102, 110, 95, 118],
      '7d': [580, 620, 530, 680, 720, 650, 780],
      '30d': [2200, 2350, 2100, 2600, 2800, 2450, 2900],
      '90d': [6500, 7200, 6800, 8100, 8500, 7900, 9200]
    };
    
    const getTimeLabels = () => {
      switch (timeFilter) {
        case '24h':
          return ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];
        case '7d':
          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        case '30d':
          return ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
        case '90d':
          return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        default:
          return [];
      }
    };

    // Status color mapping for consistency
    const getStatusBadgeColor = (status: string) => {
      const statusLower = status.toLowerCase();
      switch (statusLower) {
        case 'pending':
          return 'bg-[#FFF8DD] text-[#DAA520]';
        case 'processing':
          return 'bg-[#F3E8F9] text-[#C7A2E0]';
        case 'new':
          return 'bg-[#F3E8F9] text-[#C7A2E0]';
        case 'confirmed':
          return 'bg-[#E8F5E9] text-[#4CAF50]';
        default:
          return 'bg-[#E8E9ED] text-[#70727F]';
      }
    };

    return (
      <PlaceholderPage title="Seller Dashboard">
        <div className="bg-gradient-to-r from-[#E8E9ED] to-[#EDD9FF] rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-[#1B1C20] flex items-center">
                <BarChart className="h-6 w-6 mr-2 text-[#3D1560]" />
                Performance Overview
              </h2>
              <p className="text-[#70727F] mt-1">Track your metrics and business growth</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setTimeFilter('24h')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeFilter === '24h' 
                    ? 'bg-[#3D1560] text-[#FFFFFF] shadow-md' 
                    : 'bg-[#FFFFFF] text-[#70727F] border border-[#CDCED8] hover:bg-[#E8E9ED]'
                }`}
              >
                Last 24 Hours
              </button>
              <button 
                onClick={() => setTimeFilter('7d')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeFilter === '7d' 
                    ? 'bg-[#3D1560] text-[#FFFFFF] shadow-md' 
                    : 'bg-[#FFFFFF] text-[#70727F] border border-[#CDCED8] hover:bg-[#E8E9ED]'
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setTimeFilter('30d')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeFilter === '30d' 
                    ? 'bg-[#3D1560] text-[#FFFFFF] shadow-md' 
                    : 'bg-[#FFFFFF] text-[#70727F] border border-[#CDCED8] hover:bg-[#E8E9ED]'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeFilter('90d')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeFilter === '90d' 
                    ? 'bg-[#3D1560] text-[#FFFFFF] shadow-md' 
                    : 'bg-[#FFFFFF] text-[#70727F] border border-[#CDCED8] hover:bg-[#E8E9ED]'
                }`}
              >
                Quarterly
              </button>
            </div>
          </div>
        </div>
        
        {/* Key metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          <div 
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-green-500 cursor-pointer"
            onClick={() => navigateTo('sellerDashboard_finance')}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                Total Revenue
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">$23,695</p>
            <div className="flex items-center mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <span className="text-xs text-gray-500 ml-2">78%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">78% of monthly target</p>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-teal-500 cursor-pointer"
            onClick={() => navigateTo('sellerDashboard_orders')}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <ShoppingCart className="h-4 w-4 mr-1 text-teal-500" />
                Orders
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +15%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">248</p>
            <div className="flex justify-between mt-3">
              <div className="text-xs px-2 py-1 ${getStatusBadgeColor('new')} rounded-full">
                New: 42
              </div>
              <div className="text-xs px-2 py-1 ${getStatusBadgeColor('processing')} rounded-full">
                Processing: 17
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Package className="h-4 w-4 mr-1 text-blue-500" />
                Sales
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +8%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">215</p>
            <div className="flex justify-between mt-3">
              <div className="text-xs">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                <span className="text-gray-600">Products: 177</span>
              </div>
              <div className="text-xs">
                <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-1"></span>
                <span className="text-gray-600">Services: 38</span>
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-purple-500 cursor-pointer"
            onClick={() => navigateTo('sellerDashboard_appointments')}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                Appointments
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +15%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800">42</p>
            <div className="flex justify-between mt-3">
              <div className="text-xs px-2 py-1 ${getStatusBadgeColor('pending')} rounded-full">
                Pending: 12
              </div>
              <div className="text-xs px-2 py-1 ${getStatusBadgeColor('confirmed')} rounded-full">
                Confirmed: 30
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-amber-500">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500 flex items-center">
                <Wallet className="h-4 w-4 mr-1 text-amber-500" />
                Pending Payout
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">2 days</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">$4,820</p>
            <div className="flex items-center mt-3 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1 text-amber-500" />
              Next payout: Apr 18
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Revenue Trends
              </h3>
              <p className="text-sm text-gray-500">Analysis for the selected period</p>
            </div>
            <div className="flex items-center">
              <label htmlFor="chart-filter" className="text-sm text-gray-600 mr-2">Filter:</label>
              <select 
                id="chart-filter"
                className="border border-gray-300 rounded-md text-sm p-1.5 bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-200"
              >
                <option>All Listings</option>
                <option>Products Only</option>
                <option>Services Only</option>
              </select>
            </div>
          </div>
          <div className="h-80 w-full relative">
            {/* Chart background grid */}
            <div className="absolute inset-0 grid grid-cols-7 gap-4 pointer-events-none">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="h-full border-r border-gray-100 last:border-r-0"></div>
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-5 gap-4 pointer-events-none">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="w-full border-b border-gray-100 last:border-b-0"></div>
              ))}
            </div>
            
            {/* Chart bars */}
            <div className="h-full flex items-end justify-between px-4 relative z-10">
              {revenueData[timeFilter].map((value, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="relative">
                    {/* Permanent value label on top of each bar */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 text-xs font-medium text-gray-600">
                      ${value.toLocaleString()}
                    </div>
                    
                    <div 
                      className="w-12 md:w-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 hover:from-blue-700 hover:to-blue-500 cursor-pointer" 
                      style={{ height: `${value / 100}px` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2 text-gray-500">{getTimeLabels()[index]}</span>
                </div>
              ))}
            </div>
            
            {/* Chart summary section removed as requested */}
          </div>
        </div>
        
        {/* Second row of metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          {/* Listing Views */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Listing Views</h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +24%
              </span>
            </div>
            <div className="flex items-baseline mb-2">
              <p className="text-3xl font-bold mr-2">3,842</p>
              <p className="text-sm text-gray-500">total views</p>
            </div>
            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Products</span>
                  <span className="text-gray-600">2,516 (65%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Services</span>
                  <span className="text-gray-600">1,326 (35%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Compared to last month</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Conversion Rate</h3>
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                +3.2%
              </span>
            </div>
            <div className="flex justify-center">
              <div className="relative h-36 w-36">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <circle 
                    className="text-indigo-600" 
                    strokeWidth="10" 
                    strokeDasharray={250} 
                    strokeDashoffset={250 - (250 * 5.8) / 10}
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="transparent" 
                    r="40" 
                    cx="50" 
                    cy="50" 
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">5.8%</span>
                  <span className="text-sm text-gray-500">Overall</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Products</p>
                <p className="text-xl font-semibold text-blue-700">6.4%</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Services</p>
                <p className="text-xl font-semibold text-purple-700">4.2%</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm text-gray-600">Up 0.8% from last period</span>
              </div>
            </div>
          </div>

          {/* Review Scores */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Review Scores</h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold mr-2">4.8</p>
              <p className="text-sm text-gray-500">from 127 reviews</p>
            </div>
            
            <div className="space-y-2 mt-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm w-3">{rating}</span>
                  <svg className="w-4 h-4 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                    <div className="bg-yellow-400 h-2 rounded-full" 
                         style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%' }}>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Recent review: 2 days ago</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View all
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Convert tabs to cards on the profile homepage */}
        {!isEditMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Saved Items Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Saved Items</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mockProducts.slice(0, 3).map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                    <img src={item.images[0]} alt={item.name} className="h-48 w-full object-cover rounded-t-xl" />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg text-gray-800 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.shortDescription}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">${item.price}</span>
                        <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <button className="text-md text-indigo-600 hover:text-indigo-800 font-medium flex items-center ml-auto">
                  View All Saved Items
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Recently Viewed Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recently Viewed</h3>
              <p className="text-base text-gray-600 mb-6">Check out your recently viewed items.</p>
              <button className="text-lg text-blue-600 hover:text-blue-800 font-medium">View Details</button>
            </div>
            
            {/* Ongoing Orders Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Orders</h3>
              <p className="text-base text-gray-600 mb-6">Manage your current orders.</p>
              <button 
                onClick={() => handleNavigate('myOrders')}
                className="text-lg text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View Orders <ChevronRight className="ml-1 h-5 w-5" />
              </button>
            </div>
            
            {/* Appointments Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Appointments</h3>
              <p className="text-base text-gray-600 mb-6">View and manage your appointments.</p>
              <button className="text-lg text-blue-600 hover:text-blue-800 font-medium">View Details</button>
            </div>
          </div>
        )}
      </PlaceholderPage>
    );
  };

  // Seller Dashboard My Shop placeholder
  const SellerDashboardMyShop = () => {
    // Mock listing data
    const mockListingsData = {
      active: 8,
      draft: 3,
      inactive: 2,
      pending: 2,
      products: 5,
      services: 8,
      revenue: 12495.75,
      visitorsThisMonth: 1248,
      listings: [
        {
          id: 'lst-001',
          name: 'Premium Haircut & Styling',
          type: 'service',
          category: 'Beauty & Wellness',
          price: 85.00,
          status: 'active',
          createdAt: '2023-03-15',
          lastUpdated: '2023-04-02',
          views: 142,
          saves: 23,
          orders: 18,
          rating: 4.8,
          location: 'In-store only',
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=100&h=100&q=80',
          quantity: 'Unlimited'
        },
        {
          id: 'lst-002',
          name: 'Professional Hair Dryer',
          type: 'product',
          category: 'Beauty Products',
          price: 129.99,
          status: 'active',
          createdAt: '2023-02-20',
          lastUpdated: '2023-04-05',
          views: 208,
          saves: 42,
          orders: 26,
          rating: 4.6,
          location: 'Shipping available',
          image: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=100&h=100&q=80',
          quantity: 24
        },
        {
          id: 'lst-003',
          name: 'Hair Coloring Service',
          type: 'service',
          category: 'Beauty & Wellness',
          price: 120.00,
          status: 'active',
          createdAt: '2023-03-18',
          lastUpdated: '2023-04-10',
          views: 98,
          saves: 15,
          orders: 12,
          rating: 4.7,
          location: 'In-store only',
          image: 'https://images.unsplash.com/photo-1481068164146-e8beb686f4c2?auto=format&fit=crop&w=100&h=100&q=80',
          quantity: 'Unlimited'
        },
        {
          id: 'lst-004',
          name: 'Styling Brush Set',
          type: 'product',
          category: 'Beauty Products',
          price: 45.99,
          status: 'active',
          createdAt: '2023-01-15',
          lastUpdated: '2023-03-28',
          views: 175,
          saves: 38,
          orders: 32,
          rating: 4.5,
          location: 'Shipping available',
          image: 'https://images.unsplash.com/photo-1643509750872-30cb25a6603e?auto=format&fit=crop&w=100&h=100&q=80',
          quantity: 56
        },
        {
          id: 'lst-005',
          name: 'Hair Treatment Pack',
          type: 'product',
          category: 'Beauty Products',
          price: 79.99,
          status: 'draft',
          createdAt: '2023-04-01',
          lastUpdated: '2023-04-01',
          views: 0,
          saves: 0,
          orders: 0,
          rating: 0,
          location: 'Shipping available',
          image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=100&h=100&q=80',
          quantity: 15
        },
        {
          id: 'lst-006',
          name: 'Spa Massage Therapy',
          type: 'service',
          category: 'Wellness',
          price: 110.00,
          status: 'inactive',
          createdAt: '2022-11-12',
          lastUpdated: '2023-03-01',
          views: 320,
          saves: 65,
          orders: 48,
          rating: 4.9,
          location: 'In-store only',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=100&h=100&q=80',
          quantity: 'Unlimited'
        },
        {
          id: '6789',
          name: 'Handmade Ceramic Vase',
          type: 'product',
          category: 'Home Decor',
          price: 79,
          status: 'pending',
          createdAt: '2023-10-10T11:25:00',
          lastUpdated: '2023-10-15T09:40:00',
          views: 87,
          saves: 14,
          orders: 0,
          rating: 0,
          location: 'Chicago',
          image: 'https://placehold.co/100x100',
          quantity: 12
        },
        {
          id: '7890',
          name: 'Online Yoga Classes',
          type: 'service',
          category: 'Health & Wellness',
          price: 25,
          status: 'pending',
          createdAt: '2023-10-08T14:15:00',
          lastUpdated: '2023-10-12T16:30:00',
          views: 56,
          saves: 11,
          orders: 0,
          rating: 0,
          location: 'Remote',
          image: 'https://placehold.co/100x100',
          quantity: 'Unlimited'
        },
      ]
    };

    // Status color mapping
    const getStatusColor = (status: string) => {
      const statusLower = status.toLowerCase();
      const colorMap: Record<string, { bar: string; badge: string }> = {
        'live': { bar: '#4CAF50', badge: 'bg-[#E8F5E9] text-[#4CAF50]' },
        'active': { bar: '#4CAF50', badge: 'bg-[#E8F5E9] text-[#4CAF50]' },
        'draft': { bar: '#C7A2E0', badge: 'bg-[#F3E8F9] text-[#C7A2E0]' },
        'pending': { bar: '#FFD700', badge: 'bg-[#FFF8DD] text-[#DAA520]' },
        'inactive': { bar: '#CDCED8', badge: 'bg-[#E8E9ED] text-[#70727F]' },
      };
      return colorMap[statusLower] || { bar: '#CDCED8', badge: 'bg-[#E8E9ED] text-[#70727F]' };
    };

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    // Handle Create New Listing button click
    const handleCreateListing = () => {
      alert('This would navigate to the Create Listing page');
    };
    
    // State for menu dropdowns
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    
    // State for view listing modal
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedViewListing, setSelectedViewListing] = useState<any>(null);
    
    // Handle menu toggle
    const toggleMenu = (id: string) => {
      if (activeMenu === id) {
        setActiveMenu(null);
      } else {
        setActiveMenu(id);
      }
    };
    
    // Handle menu item clicks
    const handleEdit = (id: string) => {
      // Find the listing details
      const listing = mockListingsData.listings.find(item => item.id === id);
      if (listing) {
        // Set the selected listing and navigate to edit page
        setSelectedListingForEdit(listing);
        setCurrentPage('editListing');
      }
      setActiveMenu(null);
    };
    
    const handlePromote = (id: string) => {
      alert(`Promote listing ${id}`);
      setActiveMenu(null);
    };
    
    // Handle view listing details in modal
    const handleViewListingDetails = (listing: any, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setSelectedViewListing(listing);
      setShowViewModal(true);
    };
    
    // Handle view/edit listing when row is clicked
    const handleViewListing = (listing: any) => {
      setSelectedListingForEdit(listing);
      setCurrentPage('editListing');
    };

    // State for active tab
    const [activeTab, setActiveTab] = useState<'all' | 'product' | 'service'>('all');
    
    // State for controlling shop info expansion
    const [showFullShopInfo, setShowFullShopInfo] = useState(false);

    // Filter listings based on active tab
    const filteredListings = useMemo(() => {
      if (activeTab === 'all') {
        return mockListingsData.listings;
      }
      return mockListingsData.listings.filter(listing => listing.type === activeTab);
    }, [activeTab, mockListingsData.listings]);

    return (
    <PlaceholderPage title="My Shop">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#CDCED8] p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-[#70727F]">Total Listings</p>
                <h3 className="text-2xl font-bold mt-1 text-[#1B1C20]">
                  {mockListingsData.active + mockListingsData.draft + mockListingsData.inactive}
                </h3>
                <p className="text-xs text-[#70727F] mt-1">
                  <span className="text-[#3D1560] font-medium">+3</span> new this month
                </p>
              </div>
              <div className="bg-[#EDD9FF] p-2 rounded-lg">
                <Store className="w-6 h-6 text-[#3D1560]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#CDCED8] p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#70727F]">Live Listings</p>
                <h3 className="text-2xl font-bold mt-1 text-[#1B1C20]">{mockListingsData.active}</h3>
                <div className="flex gap-3 mt-1">
                  <p className="text-xs text-[#70727F]">
                    <span className="font-medium text-[#3D1560]">{mockListingsData.products}</span> products
                  </p>
                  <p className="text-xs text-[#70727F]">
                    <span className="font-medium text-[#DF678C]">{mockListingsData.services}</span> services
                  </p>
                </div>
              </div>
              <div className="bg-[#EDD9FF] p-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#3D1560]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#CDCED8] p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#70727F]">Monthly Revenue</p>
                <h3 className="text-2xl font-bold mt-1 text-[#1B1C20]">{formatCurrency(mockListingsData.revenue)}</h3>
                <p className="text-xs text-[#70727F] mt-1">
                  <span className="text-[#3D1560] font-medium">↑ 12.5%</span> vs last month
                </p>
              </div>
              <div className="bg-[#EDD9FF] p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#3D1560]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#CDCED8] p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#70727F]">Shop Visitors</p>
                <h3 className="text-2xl font-bold mt-1 text-[#1B1C20]">{mockListingsData.visitorsThisMonth}</h3>
                <p className="text-xs text-[#70727F] mt-1">
                  <span className="text-[#3D1560] font-medium">↑ 8.3%</span> vs last month
                </p>
              </div>
              <div className="bg-[#EDD9FF] p-2 rounded-lg">
                <Users className="w-6 h-6 text-[#3D1560]" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Shop Information - Redesigned for compactness */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Shop Information</h3>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowFullShopInfo(prevState => !prevState)} 
                className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center"
              >
                {showFullShopInfo ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Expand
                  </>
                )}
              </button>
              <button className="text-[#3D1560] hover:text-[#6D26AB] text-sm font-medium flex items-center transition-colors duration-200">
                <Edit className="w-4 h-4 mr-1" />
                Edit Shop
              </button>
            </div>
          </div>
          
          {/* Compact View - Always Visible with Summary Info */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-wrap justify-between mb-2">
              <div className="flex items-center mr-6 mb-2">
                <span className="text-gray-500 text-sm">Shop Name:</span>
                <span className="font-medium text-sm ml-2">Urban Style Studio</span>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <span className="text-gray-500 text-sm">Location:</span>
                <span className="font-medium text-sm ml-2">Chicago, US</span>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <span className="text-gray-500 text-sm">Member Since:</span>
                <span className="font-medium text-sm ml-2">March 2023</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-gray-500 text-sm">Response Rate:</span>
                <span className="font-medium text-sm ml-2">98%</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-500 text-sm mr-2">Specialization:</span>
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Beauty & Wellness</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Health Services</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">Home Decor</span>
              </div>
            </div>
          </div>
          
          {/* Expanded View - Toggle Visibility with Full Details */}
          {showFullShopInfo && (
            <div className="p-5">
              <div className="flex flex-col space-y-5">
                {/* Basic Information */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-100">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Shop Name</p>
              <p className="font-medium">Urban Style Studio</p>
            </div>
            <div>
                      <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">March 2023</p>
            </div>
            <div>
                      <p className="text-sm text-gray-500">Response Rate</p>
                      <p className="font-medium">98%</p>
                    </div>
                  </div>
                </div>
                
                {/* Contact & Location */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-100">Contact & Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">Chicago, United States</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
              <p className="font-medium">contact@urbanstylestudio.com</p>
            </div>
            <div>
                      <p className="text-sm text-gray-500">Business Hours</p>
                      <p className="font-medium">Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
                </div>
                
                {/* Specialization & Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-100">Specialization & Description</h4>
                  <div className="grid grid-cols-1 gap-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">Beauty & Wellness</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">Health Services</span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">Home Decor</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shop Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed mt-1">
                        Urban Style Studio specializes in premium beauty services and products, wellness treatments, and curated home decor items. 
                        Our skilled professionals offer services ranging from haircuts and styling to spa massages and online yoga classes, while our 
                        product selection includes professional-grade beauty equipment, hair treatment products, and handcrafted home accessories.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Status Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Listings by Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-1">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Listings by Status</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-2"></div>
                    <span className="text-sm text-gray-700">Live</span>
                  </div>
                  <span className="text-sm font-medium">{mockListingsData.active}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#C7A2E0] mr-2"></div>
                    <span className="text-sm text-gray-700">Draft</span>
                  </div>
                  <span className="text-sm font-medium">{mockListingsData.draft}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#FFD700] mr-2"></div>
                    <span className="text-sm text-gray-700">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{mockListingsData.pending}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#CDCED8] mr-2"></div>
                    <span className="text-sm text-gray-700">Inactive</span>
                  </div>
                  <span className="text-sm font-medium">{mockListingsData.inactive}</span>
                </div>
              </div>
              
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div 
                    className="bg-[#4CAF50] h-full" 
                    style={{ width: `${(mockListingsData.active / (mockListingsData.active + mockListingsData.draft + mockListingsData.pending + mockListingsData.inactive)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-[#C7A2E0] h-full" 
                    style={{ width: `${(mockListingsData.draft / (mockListingsData.active + mockListingsData.draft + mockListingsData.pending + mockListingsData.inactive)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-[#FFD700] h-full" 
                    style={{ width: `${(mockListingsData.pending / (mockListingsData.active + mockListingsData.draft + mockListingsData.pending + mockListingsData.inactive)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-[#CDCED8] h-full" 
                    style={{ width: `${(mockListingsData.inactive / (mockListingsData.active + mockListingsData.draft + mockListingsData.pending + mockListingsData.inactive)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Listings by Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-1">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Listings by Type</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#6D26AB] mr-2"></div>
                    <span className="text-sm text-gray-700">Products</span>
                  </div>
                  <span className="text-sm font-medium">{mockListingsData.products}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#DF678C] mr-2"></div>
                    <span className="text-sm text-gray-700">Services</span>
                  </div>
                  <span className="text-sm font-medium">{mockListingsData.services}</span>
                </div>
              </div>
              
              <div className="mt-4 h-24 w-24 mx-auto relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">{mockListingsData.products + mockListingsData.services}</span>
                </div>
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6D26AB"
                    strokeWidth="3"
                    strokeDasharray={`${(mockListingsData.products / (mockListingsData.products + mockListingsData.services)) * 100}, 100`}
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#DF678C"
                    strokeWidth="3"
                    strokeDasharray={`${(mockListingsData.services / (mockListingsData.products + mockListingsData.services)) * 100}, 100`}
                    strokeDashoffset={`${-1 * (mockListingsData.products / (mockListingsData.products + mockListingsData.services)) * 100}`}
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-1">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleCreateListing}
                  className="flex flex-col items-center justify-center bg-[#EDD9FF] hover:bg-[#9B53D9] transition-colors p-4 rounded-lg border border-[#EDD9FF]"
                >
                  <PlusCircle className="w-8 h-8 text-[#3D1560] mb-2" />
                  <span className="text-sm font-medium text-[#3D1560]">New Listing</span>
                </button>
                
                <button className="flex flex-col items-center justify-center bg-[#EDD9FF] hover:bg-[#9B53D9] transition-colors p-4 rounded-lg border border-[#EDD9FF]">
                  <Zap className="w-8 h-8 text-[#3D1560] mb-2" />
                  <span className="text-sm font-medium text-[#3D1560]">Promote</span>
                </button>
                
                <button className="flex flex-col items-center justify-center bg-[#EDD9FF] hover:bg-[#9B53D9] transition-colors p-4 rounded-lg border border-[#EDD9FF]">
                  <BarChart2 className="w-8 h-8 text-[#3D1560] mb-2" />
                  <span className="text-sm font-medium text-[#3D1560]">Analytics</span>
                </button>
                
                <button className="flex flex-col items-center justify-center bg-[#EDD9FF] hover:bg-[#9B53D9] transition-colors p-4 rounded-lg border border-[#EDD9FF]">
                  <Settings className="w-8 h-8 text-[#3D1560] mb-2" />
                  <span className="text-sm font-medium text-[#3D1560]">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            {/* Header with title and simplified filter row */}
            <div className="flex justify-between items-center px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">All Listings</h3>
              
              {/* Search moved next to the heading */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search listings..." 
                  className="border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            {/* Integrated tabs and filters on the same row */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-100">
              {/* Type tabs */}
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'all' 
                      ? 'bg-[#EDD9FF] text-[#3D1560] border-b-2 border-[#3D1560]' 
                      : 'text-gray-600 hover:text-[#6D26AB] hover:bg-[#EDD9FF]'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveTab('product')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'product' 
                      ? 'bg-[#EDD9FF] text-[#3D1560] border-b-2 border-[#3D1560]' 
                      : 'text-gray-600 hover:text-[#6D26AB] hover:bg-[#EDD9FF]'
                  }`}
                >
                  Products
                </button>
                <button 
                  onClick={() => setActiveTab('service')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'service' 
                      ? 'bg-[#EDD9FF] text-[#3D1560] border-b-2 border-[#3D1560]' 
                      : 'text-gray-600 hover:text-[#6D26AB] hover:bg-[#EDD9FF]'
                  }`}
                >
                  Services
                </button>
              </div>
              
              {/* Status filter on the same row as tabs */}
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Status</option>
                  <option>Live</option>
                  <option>Draft</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewListingDetails(listing)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{listing.name}</div>
                            <div className="text-xs text-gray-500">ID: {listing.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${listing.type === 'product' ? 'bg-[#6D26AB]' : 'bg-[#DF678C]'} mr-2`}></div>
                          <span className="text-sm text-gray-500 capitalize">{listing.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                        {listing.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" onClick={(e) => e.stopPropagation()}>
                        ${listing.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                        {listing.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(listing.status).badge}`}>
                          {listing.status === 'active' ? 'Live' : listing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                        {formatDate(listing.createdAt)}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="text-sm text-gray-900 flex items-center">
                          <Eye className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="mr-3">{listing.views}</span>
                          
                          <ShoppingCart className="w-4 h-4 text-gray-400 mr-1" />
                          <span>{listing.orders}</span>
                        </div>
                        {listing.rating > 0 && (
                          <div className="flex items-center text-xs text-yellow-500 mt-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="ml-1">{listing.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-3 relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(listing.id);
                            }} 
                            className="text-[#3D1560] hover:text-[#6D26AB] transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewListingDetails(listing, e);
                            }} 
                            className="text-[#3D1560] hover:text-[#6D26AB] transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMenu(listing.id);
                              }}
                              className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {activeMenu === listing.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(listing.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromote(listing.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <Zap className="w-4 h-4 mr-2" />
                                  Promote
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                </tr>
                  ))}
              </tbody>
            </table>
          </div>
            
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">13</span> results
        </div>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
          
          {/* View Listing Modal */}
          {showViewModal && selectedViewListing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h3 className="text-lg font-medium text-gray-900">Listing Details</h3>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  {/* Listing details content */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200">
                        <img src={selectedViewListing.image} alt={selectedViewListing.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedViewListing.name}</h2>
                      <div className="flex items-center mb-4">
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedViewListing.status).badge}`}>
                          {selectedViewListing.status === 'active' ? 'Live' : selectedViewListing.status}
                        </div>
                        <div className="mx-2 text-gray-300">•</div>
                        <div className="text-sm text-gray-500 capitalize">{selectedViewListing.type}</div>
                        <div className="mx-2 text-gray-300">•</div>
                        <div className="text-sm text-gray-500">{selectedViewListing.category}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Price</p>
                          <p className="font-semibold text-xl">${selectedViewListing.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Available Quantity</p>
                          <p className="font-semibold">{selectedViewListing.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Created</p>
                          <p className="font-semibold">{formatDate(selectedViewListing.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                          <p className="font-semibold">{formatDate(selectedViewListing.lastUpdated || selectedViewListing.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="font-semibold">{selectedViewListing.location}</p>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 mb-2">Performance</p>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-900 font-medium">{selectedViewListing.views}</span>
                            <span className="text-gray-500 ml-1">views</span>
                          </div>
                          <div className="flex items-center">
                            <ShoppingCart className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-900 font-medium">{selectedViewListing.orders}</span>
                            <span className="text-gray-500 ml-1">orders</span>
                          </div>
                          {selectedViewListing.rating > 0 && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-gray-900 font-medium">{selectedViewListing.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setShowViewModal(false);
                      handleEdit(selectedViewListing.id);
                    }}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#3D1560] hover:bg-[#6D26AB]"
                  >
                    Edit Listing
                  </button>
                  <button 
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#3D1560] hover:bg-[#6D26AB]"
                  >
                    View Live Listing
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </PlaceholderPage>
  );
  };

  // Seller Dashboard Orders placeholder
  const SellerDashboardOrders = () => (
    <PlaceholderPage title="Orders">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <select className="border border-gray-300 rounded-md px-3 py-2 mr-2">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <button className="border border-gray-300 rounded-md px-3 py-2">Filter</button>
        </div>
        <div>
          <input type="text" placeholder="Search orders..." className="border border-gray-300 rounded-md px-3 py-2" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-1234</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Order Item Placeholder</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 12, 2023</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Processing</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$99.99</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">View Details</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-1235</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Order Item Placeholder</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 10, 2023</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Shipped</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$149.99</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900">View Details</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PlaceholderPage>
  );

  // Seller Dashboard Appointments placeholder
  const SellerDashboardAppointments = () => (
    <PlaceholderPage title="Appointments">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button className="bg-blue-600 text-white rounded-md px-4 py-2 mr-2">Today</button>
          <button className="border border-gray-300 rounded-md px-4 py-2 mr-2">This Week</button>
          <button className="border border-gray-300 rounded-md px-4 py-2">This Month</button>
        </div>
        <div>
          <button className="border border-gray-300 rounded-md px-3 py-2">+ Add Appointment</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Appointments</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 border rounded-lg bg-blue-50 border-blue-100">
            <div className="mr-4 text-center">
              <p className="text-sm font-medium text-gray-500">10:00 AM</p>
              <p className="text-xs text-gray-400">1 hour</p>
            </div>
            <div className="flex-grow">
              <p className="font-medium">Premium Haircut & Styling</p>
              <p className="text-sm text-gray-500">Client: Emma W.</p>
            </div>
            <div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Details</button>
            </div>
          </div>
          <div className="flex items-center p-4 border rounded-lg">
            <div className="mr-4 text-center">
              <p className="text-sm font-medium text-gray-500">2:30 PM</p>
              <p className="text-xs text-gray-400">45 min</p>
            </div>
            <div className="flex-grow">
              <p className="font-medium">Hair Coloring</p>
              <p className="text-sm text-gray-500">Client: Michael R.</p>
            </div>
            <div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Details</button>
            </div>
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );

  // Seller Dashboard Finance placeholder
  const SellerDashboardFinance = () => (
    <PlaceholderPage title="Finance">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-gray-500 mb-1">Total Revenue (YTD)</p>
            <p className="text-2xl font-bold text-gray-800">$124,395.28</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>+18.4% from last year</span>
            </div>
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );

  // Mock data for saved items
  const savedItems = [
    { id: 1, name: 'Product 1', description: 'Description for product 1', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', description: 'Description for product 2', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', description: 'Description for product 3', image: 'https://via.placeholder.com/150' },
    // Add more items as needed
  ];

  // Update mockProducts to include a dummy dateSaved value
  mockProducts.forEach(product => {
    product.dateSaved = '2023-10-15';
  });

  // Listing Edit Page
  const EditListingPage = () => {
    const [activeTab, setActiveTab] = useState('details');
    const listing = selectedListingForEdit;
    
    // For handling form submission
    const handleSave = () => {
      alert('Changes saved successfully!');
      setCurrentPage('sellerDashboard_myShop');
    };
    
    // For handling cancel action
    const handleCancel = () => {
      const confirmCancel = window.confirm('Are you sure you want to discard your changes?');
      if (confirmCancel) {
        setCurrentPage('sellerDashboard_myShop');
      }
    };
    
    if (!listing) {
      return (
        <div className="p-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No listing selected for editing. Please go back and select a listing.
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setCurrentPage('sellerDashboard_myShop')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to My Shop
          </button>
        </div>
      );
    }
    
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
            <p className="text-gray-600">ID: {listing.id}</p>
          </div>
          <div className="space-x-3">
            <button 
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('details')}
              >
                Basic Details
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('media')}
              >
                Media
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'attributes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('attributes')}
              >
                Attributes
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'pricing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('pricing')}
              >
                Pricing & Inventory
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'seo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('seo')}
              >
                SEO & Visibility
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Listing Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={listing.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={listing.category}
                    >
                      <option value="Beauty & Wellness">Beauty & Wellness</option>
                      <option value="Beauty Products">Beauty Products</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Home & Garden">Home & Garden</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="type-product" 
                          name="listing-type" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                          defaultChecked={listing.type === 'product'}
                        />
                        <label htmlFor="type-product" className="ml-2 text-sm text-gray-700">Product</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="type-service" 
                          name="listing-type" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                          defaultChecked={listing.type === 'service'}
                        />
                        <label htmlFor="type-service" className="ml-2 text-sm text-gray-700">Service</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={listing.status}
                    >
                      <option value="active">Live</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    defaultValue={`Short description for ${listing.name}`}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    defaultValue={`Detailed description for ${listing.name}. This is where you would provide all the important information about your ${listing.type}.`}
                  ></textarea>
                </div>
              </div>
            )}
            
            {activeTab === 'media' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Listing Images</h3>
                  <p className="text-sm text-gray-600 mb-4">Add up to 8 images to showcase your listing. The first image will be used as the thumbnail.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center flex-col text-center hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="bg-gray-100 rounded-full p-3 mb-2">
                        <PlusCircle className="h-6 w-6 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Add Image</span>
                    </div>
                    
                    <div className="relative group">
                      <img 
                        src={listing.image} 
                        alt={listing.name} 
                        className="w-full h-32 object-cover rounded-lg border border-gray-200" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="p-1 bg-white rounded-full mr-2">
                          <Edit className="h-4 w-4 text-gray-700" />
                        </button>
                        <button className="p-1 bg-white rounded-full">
                          <Trash className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Video (Optional)</h3>
                  <p className="text-sm text-gray-600 mb-4">Add a video to showcase your listing in action.</p>
                  
                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md">
                      <div className="text-center">
                        <div className="mx-auto mb-2 bg-gray-200 rounded-full p-3 inline-flex">
                          <Film className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-500">Drag and drop a video file here or click to upload</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'attributes' && (
              <div>
                <p className="text-sm text-gray-600 mb-6">Add attributes specific to your {listing.type} type to help customers find your listing more easily.</p>
                
                {listing.type === 'product' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Sony, Apple, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., iPhone 13, Galaxy S21, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Black, Red, Blue, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Small, Medium, Large, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Plastic, Metal, Wood, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>New</option>
                          <option>Used - Like New</option>
                          <option>Used - Good</option>
                          <option>Used - Fair</option>
                          <option>Refurbished</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Enter product specifications, features, and other details"
                      ></textarea>
                    </div>
                  </div>
                )}
                
                {listing.type === 'service' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>One-time</option>
                          <option>Recurring</option>
                          <option>Subscription</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 60"
                            defaultValue={listing.name.includes('Haircut') ? '60' : '90'}
                          />
                          <select className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Minutes</option>
                            <option>Hours</option>
                            <option>Days</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue={listing.location === 'In-store only' ? 'in-store' : 'online'}>
                          <option value="in-store">In Store Only</option>
                          <option value="online">Online</option>
                          <option value="both">Both In Store & Online</option>
                          <option value="on-site">On Site (at customer's location)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Weekdays Only</option>
                          <option>Weekends Only</option>
                          <option>All Week</option>
                          <option>Custom Schedule</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements/Prerequisites</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="Enter any requirements or prerequisites for customers"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input 
                        type="text" 
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        defaultValue={listing.price}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input 
                        type="text" 
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  {listing.type === 'product' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input 
                          type="number" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          defaultValue={listing.quantity === 'Unlimited' ? '' : listing.quantity}
                          placeholder="Enter available quantity"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., PRD-12345"
                        />
                      </div>
                    </>
                  )}
                  
                  {listing.type === 'service' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="unlimited-availability" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked={listing.quantity === 'Unlimited'}
                        />
                        <label htmlFor="unlimited-availability" className="text-sm text-gray-700">Unlimited availability</label>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping & Delivery (for products)</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="free-shipping" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="free-shipping" className="text-sm text-gray-700">Offer free shipping</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="local-pickup" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="local-pickup" className="text-sm text-gray-700">Allow local pickup</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={listing.name}
                  />
                  <p className="mt-1 text-sm text-gray-500">Recommended length: 50-60 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    defaultValue={`${listing.name} - ${listing.category} - Best quality ${listing.type} available at competitive prices.`}
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">Recommended length: 150-160 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., beauty, haircut, styling"
                    defaultValue={listing.category.toLowerCase().replace('&', '').split(' ').join(', ')}
                  />
                  <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="visibility-public" 
                        name="visibility" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                        defaultChecked={listing.status === 'active'}
                      />
                      <label htmlFor="visibility-public" className="ml-2 text-sm text-gray-700">Live - Visible to everyone</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="visibility-hidden" 
                        name="visibility" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                        defaultChecked={listing.status === 'inactive'}
                      />
                      <label htmlFor="visibility-hidden" className="ml-2 text-sm text-gray-700">Hidden - Not visible in search or browse</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="visibility-password" 
                        name="visibility" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="visibility-password" className="ml-2 text-sm text-gray-700">Password Protected - Require a password to view</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  const handleProceedToPayment = (details: {
    customerName: string;
    customerEmail: string;
    notes: string;
    timeSlot: any;
  }) => {
    console.log('Proceeding to payment with details:', details);
    // This is where you'd handle the actual payment processing
    setTimeout(() => {
      handlePaymentComplete();
    }, 1500);
  };

  const handlePaymentComplete = () => {
    // After successful payment, return to booking page with confirmation
    setCurrentPage('booking');
  };

  // Add handler functions for order actions
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
    setOrderAction('details');
  };

  const handleOrderAction = (action: string) => {
    setOrderAction(action);
  };

  const handleBackToOrders = () => {
    setOrderAction(null);
  };

  // Function to handle navigation between checkout steps
  const handleCheckoutNavigation = (step: 'auth' | 'shipping' | 'payment' | 'review') => {
    setCheckoutStep(step);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onSellNowClick={handleSellNowClick}
        onListingSelect={(listing) => handleListingSelect(listing as ListingItem)}
        onNavigateTo={handleNavigate}
      />
      
      {shouldShowSidebar() && (
        <Sidebar
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />
      )}
      
      <div className={`pt-16 ${shouldShowSidebar() ? 'ml-64' : ''}`}>
        {currentPage === 'landing' && (
          <LandingPage 
            listings={mockListings}
            onListingSelect={handleListingSelect}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onLogout={handleLogout}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        )}
        
        {currentPage === 'serviceDetails' && selectedListing?.type === 'service' && (
          <ServiceDetailsPage 
            service={selectedListing}
            onBookNow={handleBookNow}
            onBack={handleBackToLanding}
            onProviderSelect={handleProviderSelect}
            onListingSelect={handleListingSelect}
          />
        )}

        {currentPage === 'productDetails' && selectedListing?.type === 'product' && (
          <ProductDetailsPage 
            product={selectedListing}
            onBuyNow={handleBuyNow}
            onBack={handleBackToLanding}
            onProviderSelect={handleProviderSelect}
            onListingSelect={handleListingSelect}
            onNavigateTo={handleNavigate}
          />
        )}
        
        {currentPage === 'booking' && selectedListing?.type === 'service' && (
          <BookingPage 
            selectedService={selectedListing}
            allServices={mockServices.filter(s => s.provider.id === selectedListing.provider.id)}
            onBack={handleBackToLanding}
            onProceedToPayment={handleProceedToPayment}
          />
        )}

        {currentPage === 'payment' && selectedListing?.type === 'service' && bookingDetails && bookingDetails.timeSlot && (
          <PaymentPage
            service={selectedListing}
            selectedSlot={bookingDetails.timeSlot}
            customerName={bookingDetails.customerName}
            customerEmail={bookingDetails.customerEmail}
            onSuccessfulPayment={handlePaymentComplete}
            onBack={() => setCurrentPage('booking')}
          />
        )}

        {currentPage === 'sellerProfile' && selectedProvider && (
          <SellerProfilePage
            provider={selectedProvider}
            listings={mockListings.filter(listing => listing.provider.id === selectedProvider.id)}
            onBack={handleBackToLanding}
            onListingSelect={handleListingSelect}
          />
        )}

        {currentPage === 'createListing' && (
          <CreateListingPage />
        )}

        {currentPage === 'profile' && (
          <ProfilePage />
        )}

        {currentPage === 'myOrders' && orderAction === null && (
          <MyOrdersPage 
            onBack={handleBackToLanding}
            onViewOrderDetails={handleOrderSelect}
            onTrackOrder={(orderId) => {
              setSelectedOrder(orderId);
              setOrderAction('track');
            }}
            onCancelOrder={(orderId) => {
              setSelectedOrder(orderId);
              setOrderAction('cancel');
            }}
            onReturnOrder={(orderId) => {
              setSelectedOrder(orderId);
              setOrderAction('return');
            }}
            onReviewOrder={(orderId) => {
              setSelectedOrder(orderId);
              setOrderAction('review');
            }}
            onReorderItems={(orderId) => {
              // For demo purposes, we'll just show an alert
              alert(`Reordering items from order ${orderId}`);
            }}
          />
        )}

        {currentPage === 'myOrders' && selectedOrder && orderAction === 'details' && (
          <OrderDetailsPage 
            order={mockOrders.find(o => o.id === selectedOrder)!}
            onBack={handleBackToOrders}
          />
        )}

        {currentPage === 'myOrders' && selectedOrder && orderAction === 'track' && (
          <OrderTrackingPage 
            order={mockOrders.find(o => o.id === selectedOrder)!}
            onBack={handleBackToOrders}
          />
        )}

        {currentPage === 'myOrders' && selectedOrder && orderAction === 'cancel' && (
          <OrderCancellationPage 
            order={mockOrders.find(o => o.id === selectedOrder)!}
            onBack={handleBackToOrders}
          />
        )}

        {currentPage === 'myOrders' && selectedOrder && orderAction === 'return' && (
          <OrderReturnPage 
            order={mockOrders.find(o => o.id === selectedOrder)!}
            onBack={handleBackToOrders}
          />
        )}

        {currentPage === 'myOrders' && selectedOrder && orderAction === 'review' && (
          <OrderReviewPage 
            order={mockOrders.find(o => o.id === selectedOrder)!}
            onBack={handleBackToOrders}
          />
        )}

        {currentPage === 'sellerDashboard' && (
          <SellerDashboardOverview />
        )}

        {currentPage === 'sellerDashboard_overview' && (
          <SellerDashboardOverview />
        )}

        {currentPage === 'sellerDashboard_myShop' && (
          <SellerDashboardMyShop />
        )}

        {currentPage === 'sellerDashboard_orders' && (
          <SellerDashboardOrders />
        )}

        {currentPage === 'sellerDashboard_appointments' && (
          <SellerDashboardAppointments />
        )}

        {currentPage === 'sellerDashboard_finance' && (
          <SellerDashboardFinance />
        )}

        {currentPage === 'settings' && (
          <PlaceholderPage title="Settings" />
        )}

        {currentPage === 'editListing' && (
          <EditListingPage />
        )}

        {currentPage === 'bookings' && (
          <PlaceholderPage title="My Bookings" />
        )}
        
        {currentPage === 'home' && (
          <PlaceholderPage title="Home" />
        )}
        
        {currentPage === 'cart' && (
          <CartPage
            onNavigateTo={handleNavigate}
            onCheckout={() => handleCheckout()}
          />
        )}
        {currentPage === 'checkout' && (
          <>
            {checkoutStep === 'auth' && (
              <CheckoutPage
                onBack={() => handleNavigate('cart')}
                onProceedAsGuest={() => {
                  console.log('Proceeding as guest');
                  handleCheckoutNavigation('shipping');
                }}
                onSignIn={() => {
                  console.log('Setting checkout flag and navigating to sign in');
                  setIsCheckingOut(true);
                  handleNavigate('login');
                }}
                onSignUp={() => {
                  console.log('Setting checkout flag and navigating to sign up');
                  setIsCheckingOut(true);
                  handleNavigate('signup');
                }}
                onOrderComplete={() => handleNavigate('order-confirmation')}
              />
            )}
            {checkoutStep === 'shipping' && (
              <ShippingInfoPage
                onBack={() => {
                  console.log('Going back from shipping, isAuthenticated:', isAuthenticated);
                  // If user is logged in, go back to cart
                  // If guest, go back to auth options
                  isAuthenticated ? handleNavigate('cart') : handleCheckoutNavigation('auth');
                }}
                onContinue={() => handleNavigate('order-confirmation')}
                isAuthenticated={isAuthenticated}
                userData={user}
              />
            )}
          </>
        )}
        {currentPage === 'order-confirmation' && (
          <OrderConfirmation 
            onContinueShopping={() => handleNavigate('landing')}
            onViewOrders={() => handleNavigate('my-orders')}
          />
        )}
      </div>
    </div>
  );
}

export default App;