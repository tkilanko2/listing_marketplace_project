import React, { useState } from 'react';
import { Service, Product, ListingItem } from '../types';
import { Eye, ChevronLeft, ChevronRight, Bookmark, Package2, Wrench, LayoutGrid, Bell, UserCircle, ShoppingCart } from 'lucide-react';
import { SearchFilters } from '../components/SearchFilters';
import { CountrySelector } from '../components/CountrySelector';
import { LanguageSelector } from '../components/LanguageSelector';
import { getTranslation } from '../translations';
import { BannerSlider } from '../components/BannerSlider';

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
  const [listingType, setListingType] = useState<'all' | 'services' | 'products'>('all');
  const [searchFilters, setSearchFilters] = useState<{
    query: string;
    category: string;
    cities: string[];
    priceRange: { min: number; max: number } | null;
    condition?: 'new' | 'used' | 'refurbished' | null;
    duration?: number | null;
  }>({
    query: '',
    category: '',
    cities: [],
    priceRange: { min: 0, max: 1000 },
    condition: null,
    duration: null
  });
  const itemsPerPage = 15;
  
  // Filter listings by search criteria and type
  const filteredListings = listings.filter(listing => {
    // Filter by listing type
    if (listingType === 'services' && listing.type !== 'service') return false;
    if (listingType === 'products' && listing.type !== 'product') return false;

    // Filter by search query with related items
    if (searchFilters.query) {
      const searchLower = searchFilters.query.toLowerCase();
      const relatedTerms: Record<string, string[]> = {
        'iphone': ['phone', 'mobile', 'smartphone', 'apple', 'android', 'samsung', 'pixel'],
        'phone': ['iphone', 'mobile', 'smartphone', 'apple', 'android', 'samsung', 'pixel'],
        'apartment': ['condo', 'flat', 'house', 'studio', 'rental', 'property'],
        'house': ['apartment', 'condo', 'property', 'rental', 'home'],
        'party': ['event', 'celebration', 'venue', 'entertainment'],
        'event': ['party', 'venue', 'celebration', 'entertainment'],
      };

      // Get related search terms
      const searchTerms = searchLower.split(' ');
      const relatedSearchTerms = searchTerms.flatMap(term => 
        relatedTerms[term] || [term]
      );

      // Check if any of the related terms match
      const matchesQuery = 
        listing.name.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.shortDescription.toLowerCase().includes(searchLower) ||
        relatedSearchTerms.some(term => 
          listing.name.toLowerCase().includes(term) ||
          listing.description.toLowerCase().includes(term) ||
          listing.shortDescription.toLowerCase().includes(term) ||
          listing.category.toLowerCase().includes(term)
        );

      if (!matchesQuery) return false;
    }

    // Filter by category
    if (searchFilters.category && listing.category !== searchFilters.category) {
      return false;
    }

    // Filter by cities
    if (searchFilters.cities.length > 0) {
      const listingCity = listing.location.city;
      if (!searchFilters.cities.some(city => city.includes(listingCity))) {
        return false;
      }
    }

    // Filter by price range
    if (searchFilters.priceRange) {
      const { min, max } = searchFilters.priceRange;
      if (listing.price < min || listing.price > max) {
        return false;
      }
    }

    // Filter by condition (products only)
    if (listing.type === 'product' && searchFilters.condition) {
      if ((listing as Product).condition !== searchFilters.condition) {
        return false;
      }
    }

    // Filter by duration (services only)
    if (listing.type === 'service' && searchFilters.duration) {
      if ((listing as Service).duration !== searchFilters.duration) {
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
      subtitle: "For Connect Market members",
      imageUrl: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=800&auto=format&fit=crop&q=60",
      actionLabel: "Join Connect Market",
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
      {/* Hero Search Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-4">
          {/* Banner Slider */}
          <div className="-mx-8 -mt-16">
            <BannerSlider banners={banners} />
          </div>

          <div className="max-w-3xl mx-auto mt-2">
            {/* Listing Type Tabs */}
            <div className="flex justify-end mb-3">
              <div className="inline-flex rounded-xl p-0.5 bg-white shadow-sm border border-gray-100">
                <button
                  onClick={() => setListingType('all')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    listingType === 'all'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>All</span>
                </button>
                <button
                  onClick={() => setListingType('products')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    listingType === 'products'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package2 className="w-4 h-4" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => setListingType('services')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    listingType === 'services'
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Services</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-2">
              <SearchFilters
                selectedLanguage={selectedLanguage}
                listingType={listingType}
                onSearch={(filters) => setSearchFilters(filters)}
                listings={listings}
              />
            </div>
            {/* Country selector positioned outside the search box */}
            <div className="flex justify-end mt-2 space-x-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <CountrySelector
                  onCountryChange={setSelectedCountry}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col space-y-6">
          {/* Trending Items Section */}
          <ListingGrid 
            items={trendingItems} 
            title={getTranslation(selectedLanguage, 'trending_services')} 
          />

          {/* Recommended Items Section */}
          <ListingGrid 
            items={recommendedItems} 
            title={getTranslation(selectedLanguage, 'recommended_for_you')} 
          />

          {/* Recently Listed Section */}
          <ListingGrid 
            items={recentlyListed.slice(0, 5)} 
            title={getTranslation(selectedLanguage, 'recently_listed')} 
          />

          {/* All Listings Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {getTranslation(selectedLanguage, 'all_services')}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {currentItems.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}