import React, { useState } from 'react';
import { Service, Product, ListingItem } from '../types';
import { Eye, ChevronLeft, ChevronRight, Bookmark, Package2, Wrench, LayoutGrid, Bell, UserCircle, ShoppingCart } from 'lucide-react';
import { SearchFilters } from '../components/SearchFilters';
import { CountrySelector } from '../components/CountrySelector';
import { LanguageSelector } from '../components/LanguageSelector';
import { getTranslation } from '../translations';
import { BannerSlider } from '../components/BannerSlider';
import { ListingCard } from '../components/ListingCard';
import { SkeletonLoader } from '../components/loading/SkeletonLoader';

interface LandingPageProps {
  listings: ListingItem[];
  onListingSelect: (listing: ListingItem) => void;
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string) => void;
  onLogout: () => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  isLoading?: boolean;
  error?: string;
}

interface SearchFiltersState {
  query: string;
  category: string;
  cities: string[];
  priceRange: { min: number; max: number } | null;
  condition?: 'new' | 'used' | 'refurbished' | null;
  duration?: number | null;
}

export function LandingPage({ 
  listings,
  onListingSelect,
  isAuthenticated,
  user,
  onLogin,
  onSignup,
  onLogout,
  selectedLanguage,
  onLanguageChange,
  isLoading = false,
  error
}: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [listingType, setListingType] = useState<'all' | 'products' | 'services'>('all');
  const [searchFilters, setSearchFilters] = useState<SearchFiltersState>({
    query: '',
    category: '',
    cities: [],
    priceRange: { min: 0, max: 1000 },
    condition: null,
    duration: null
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const itemsPerPage = 15;
  
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Automotive',
    'Services',
    'Real Estate',
    'Others'
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleListingClick = (item: ListingItem) => {
    onListingSelect(item);
  };

  const filteredListings = listings.filter(item => {
    if (listingType === 'products' && item.type !== 'product') {
      return false;
    }
    if (listingType === 'services' && item.type !== 'service') {
      return false;
    }
    
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    if (searchFilters.query) {
      const searchTerm = searchFilters.query.toLowerCase();
      if (!item.name.toLowerCase().includes(searchTerm) &&
          !item.description.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    if (searchFilters.category && item.category !== searchFilters.category) {
      return false;
    }
    if (searchFilters.cities.length > 0 && !searchFilters.cities.includes(item.location.city)) {
      return false;
    }
    if (searchFilters.priceRange) {
      const { min, max } = searchFilters.priceRange;
      if (item.price < min || item.price > max) {
        return false;
      }
    }
    if (searchFilters.condition && item.type === 'product') {
      if (item.condition !== searchFilters.condition) {
        return false;
      }
    }
    if (searchFilters.duration && item.type === 'service') {
      if (item.duration !== searchFilters.duration) {
        return false;
      }
    }
    return true;
  });

  // Filter by category
  const trendingItems = filteredListings.filter(item => item.trending);
  const recommendedItems = filteredListings.filter(item => item.recommended);
  const recentlyListed = filteredListings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters, listingType]);

  const ListingGrid = ({ items, title }: { items: ListingItem[], title: string }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.slice(0, 5).map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

  const ListingCard = ({ item }: { item: ListingItem }) => (
    <div
      onClick={() => onListingSelect(item)}
      onKeyDown={(e) => e.key === 'Enter' && onListingSelect(item)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${item.name}`}
      className="group bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-100 shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(59,130,246,0.15)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add view tracking logic here
            }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2.5 py-1.5 flex items-center space-x-1 transition-all duration-300 hover:scale-105 hover:bg-white/20"
            aria-label={`${item.views} views`}
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-medium text-white">{item.views}</span>
          </button>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-1.5 transition-all duration-300">
            {item.type === 'product' ? (
              <Package2 className="w-4 h-4 text-white" aria-label="Product" />
            ) : (
              <Wrench className="w-4 h-4 text-white" aria-label="Service" />
            )}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-2.5 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <p className="text-xs text-white line-clamp-2">
              {item.shortDescription}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/0 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 relative line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-center justify-between mt-2 relative">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ${item.price.toLocaleString()}
            </span>
            {item.trending && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded-full border border-red-100">
                Trending
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add bookmark logic here
            }}
            className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            aria-label={`Save ${item.name} (${item.saves} saves)`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-xs">{item.saves}</span>
          </button>
        </div>
        {item.rating && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(item.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({item.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );

  const banners = [
    {
      id: 1,
      title: "Free Worldwide Shipping",
      subtitle: "For ExpatTray members",
      imageUrl: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=800&auto=format&fit=crop&q=60",
      actionLabel: "Join ExpaTray",
      actionUrl: "#",
      backgroundColor: "#146eb4"
    },
    {
      id: 2,
      title: "Summer Sale",
      subtitle: "Up to 70% off",
      imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=60",
      actionLabel: "Shop Now",
      actionUrl: "#",
      backgroundColor: "#e31837"
    },
    {
      id: 3,
      title: "New Arrivals",
      subtitle: "Fresh picks for you",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60",
      actionLabel: "Explore",
      actionUrl: "#",
      backgroundColor: "#2d8653"
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Hero Section */}
        <div className="relative">
          {/* Banner Slider */}
          <div className="-mx-4 md:-mx-8 -mt-16">
            <BannerSlider banners={banners} />
          </div>

          <div className="max-w-3xl mx-auto mt-2 px-4 md:px-0">
            {/* Listing Type Tabs */}
            <div className="flex justify-end mb-3">
              <div className="inline-flex rounded-xl p-0.5 bg-white shadow-sm border border-gray-100">
                <button
                  onClick={() => setListingType('all')}
                  className={`flex items-center space-x-2 px-2 md:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    listingType === 'all'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden md:inline">All</span>
                </button>
                <button
                  onClick={() => setListingType('products')}
                  className={`flex items-center space-x-2 px-2 md:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    listingType === 'products'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package2 className="w-4 h-4" />
                  <span className="hidden md:inline">Products</span>
                </button>
                <button
                  onClick={() => setListingType('services')}
                  className={`flex items-center space-x-2 px-2 md:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    listingType === 'services'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden md:inline">Services</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-2 md:p-4">
              <SearchFilters
                selectedLanguage={selectedLanguage}
                listingType={listingType}
                onSearch={(filters) => setSearchFilters(filters)}
                listings={listings}
              />
            </div>
            
            {/* Country selector */}
            <div className="flex justify-end mt-2 space-x-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <CountrySelector
                  onCountryChange={setSelectedCountry}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories */}
          {/* <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 md:p-4 rounded-xl border text-sm md:text-base font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-600 hover:text-blue-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div> */}

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredListings.map((item) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  onClick={() => handleListingClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}