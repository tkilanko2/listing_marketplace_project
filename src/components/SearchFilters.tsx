import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Tag, Clock, Globe, X, Filter } from 'lucide-react';
import { getTranslation } from '../translations';
import { categorySpecificFilters, FilterOption, ListingItem } from '../types';

interface SearchFiltersProps {
  selectedLanguage: string;
  listingType?: 'all' | 'services' | 'products';
  onSearch?: (filters: SearchFilters) => void;
  listings: ListingItem[];
}

interface SearchFilters {
  query: string;
  category: string;
  cities: string[];
  priceRange: { min: number; max: number } | null;
  condition?: 'new' | 'used' | 'refurbished' | null;
  duration?: number | null;
  categorySpecificFilters?: Record<string, any>;
}

export function SearchFilters({ 
  selectedLanguage, 
  listingType = 'all', 
  onSearch,
  listings 
}: SearchFiltersProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished' | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Define category keywords for smart filtering
  const categoryKeywords: Record<string, string[]> = {
    'Real Estate': ['rent', 'apartment', 'house', 'condo', 'studio', 'office', 'lease', 'property', 'room', 'furnished'],
    'Event Spaces': ['rent', 'venue', 'party', 'wedding', 'conference', 'event', 'space', 'hall', 'concert'],
    'Electronics': ['phone', 'laptop', 'camera', 'tv', 'console', 'computer', 'tablet', 'gadget', 'electronic'],
    'Beauty & Wellness': ['salon', 'spa', 'massage', 'hair', 'nail', 'facial', 'beauty', 'wellness', 'treatment']
  };

  // Filter relevant categories based on search query
  const getRelevantCategories = () => {
    if (!searchQuery.trim()) {
      return Object.keys(categorySpecificFilters);
    }

    const searchTerms = searchQuery.toLowerCase().split(' ');
    return Object.entries(categoryKeywords)
      .filter(([category, keywords]) => 
        searchTerms.some(term => 
          keywords.some(keyword => keyword.includes(term) || term.includes(keyword))
        )
      )
      .map(([category]) => category);
  };

  // City-related data and functions
  const cities = [
    'New York, USA',
    'London, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia',
    'Dubai, UAE',
    'Singapore',
    'Toronto, Canada',
    'Berlin, Germany',
    'Mumbai, India',
    'Hong Kong',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Seoul, South Korea',
    'São Paulo, Brazil'
  ];

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(cityInput.toLowerCase()) &&
    !selectedCities.includes(city)
  );

  const handleAddCity = (city: string) => {
    if (selectedCities.length < 5) {
      setSelectedCities([...selectedCities, city]);
      setCityInput('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  // Get available filters for the selected category
  const availableFilters = selectedCategory ? categorySpecificFilters[selectedCategory] || [] : [];

  // Update category filters when category changes
  useEffect(() => {
    setCategoryFilters({});
  }, [selectedCategory]);

  // Add debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedCities, priceRange, condition, duration, categoryFilters]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        query: searchQuery,
        category: selectedCategory,
        cities: selectedCities,
        priceRange,
        condition: listingType === 'products' ? condition : null,
        duration: listingType === 'services' ? duration : null,
        categorySpecificFilters: categoryFilters
      });
    }
  };

  const renderFilter = (filter: FilterOption) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <select
              value={categoryFilters[filter.id] || ''}
              onChange={(e) => setCategoryFilters({ ...categoryFilters, [filter.id]: e.target.value })}
              className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560]"
            >
              <option value="">{getTranslation(selectedLanguage, 'any')}</option>
              {filter.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'range':
        return (
          <div key={filter.id} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={filter.min}
                max={filter.max}
                value={categoryFilters[filter.id]?.min || ''}
                onChange={(e) => setCategoryFilters({
                  ...categoryFilters,
                  [filter.id]: { ...categoryFilters[filter.id], min: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560]"
                placeholder={`Min ${filter.unit}`}
              />
              <span>-</span>
              <input
                type="number"
                min={filter.min}
                max={filter.max}
                value={categoryFilters[filter.id]?.max || ''}
                onChange={(e) => setCategoryFilters({
                  ...categoryFilters,
                  [filter.id]: { ...categoryFilters[filter.id], max: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-[#CDCED8] rounded-md focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560]"
                placeholder={`Max ${filter.unit}`}
              />
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div key={filter.id} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filter.label}
            </label>
            <div className="space-y-2">
              {filter.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={categoryFilters[filter.id]?.includes(option) || false}
                    onChange={(e) => {
                      const currentValues = categoryFilters[filter.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      setCategoryFilters({ ...categoryFilters, [filter.id]: newValues });
                    }}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Update isExpanded when search query changes
  useEffect(() => {
    if (searchQuery.length > 0 && !isExpanded) {
      setIsExpanded(true);
    } else if (searchQuery.length === 0 && isExpanded) {
      // Optional: Add a delay before collapsing to prevent jarring UX
      const timer = setTimeout(() => {
        setIsExpanded(false);
        setShowFilters(false);
        setSelectedCategory('');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  return (
    <div className="relative bg-white p-4 rounded-3xl shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col space-y-4">
          {/* Search Input */}
          <div className="relative pt-2 pb-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!getRelevantCategories().includes(selectedCategory)) {
                  setSelectedCategory('');
                }
              }}
              placeholder={getTranslation(selectedLanguage, 'search_placeholder')}
              className="w-full h-12 pl-10 pr-4 py-2 text-sm bg-white border border-[#CDCED8] rounded-xl focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560] transition-shadow duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-[#70727F]" />
            </div>
          </div>

          {/* Additional Fields - Only shown when expanded */}
          <div className={`transition-all duration-300 ease-in-out ${
            isExpanded 
              ? 'opacity-100 max-h-[500px]' 
              : 'opacity-0 max-h-0 overflow-hidden'
          }`}>
            <div className="flex gap-3">
              {/* Category Selector */}
              <div className="relative flex-1">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-12 pl-12 pr-10 py-2 rounded-xl border border-[#CDCED8] bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] cursor-pointer"
                >
                  <option value="">{getTranslation(selectedLanguage, 'select_category')}</option>
                  {getRelevantCategories().map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#70727F] pointer-events-none" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="h-4.5 w-4.5 text-[#70727F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Additional Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 h-12 rounded-xl border border-[#CDCED8] bg-white hover:bg-[#E8E9ED] focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] text-[#383A47] transition-colors duration-200"
              >
                <Filter className="h-4.5 w-4.5 text-[#70727F]" />
                <span>{getTranslation(selectedLanguage, 'additional_filters')}</span>
              </button>
            </div>

            {/* Additional Filters */}
            {showFilters && (
              <div className="mt-4 p-6 bg-white rounded-2xl border border-[#CDCED8] shadow-sm animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#383A47]">
                      {getTranslation(selectedLanguage, 'price_range')}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560] transition-all duration-300"
                        placeholder={getTranslation(selectedLanguage, 'min')}
                      />
                      <span className="text-[#70727F]">-</span>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560] transition-all duration-300"
                        placeholder={getTranslation(selectedLanguage, 'max')}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="relative space-y-2">
                    <label className="block text-sm font-medium text-[#383A47]">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={getTranslation(selectedLanguage, 'search_cities')}
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="w-full pl-14 pr-4 py-3 rounded-lg border border-[#CDCED8] focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560] transition-all duration-300"
                      />
                      <MapPin className="absolute left-5 top-3.5 h-5 w-5 text-[#70727F]" />
                      
                      {cityInput && filteredCities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-[#CDCED8] rounded-lg shadow-lg max-h-60 overflow-auto">
                          {filteredCities.map((city) => (
                            <button
                              key={city}
                              onClick={() => handleAddCity(city)}
                              className="w-full px-4 py-3 text-left hover:bg-[#EDD9FF] disabled:opacity-50 disabled:hover:bg-white transition-colors duration-200"
                              disabled={selectedCities.length >= 5}
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedCities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedCities.map((city) => (
                          <span
                            key={city}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-[#EDD9FF] text-[#3D1560] border border-[#EDD9FF] transition-all duration-200 hover:bg-[#EDD9FF]/80"
                          >
                            {city}
                            <button
                              onClick={() => handleRemoveCity(city)}
                              className="ml-1.5 hover:text-[#6D26AB] focus:outline-none"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category-specific filters */}
                  {selectedCategory && availableFilters.map((filter) => (
                    <div key={filter.id} className="space-y-2">
                      {renderFilter(filter)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}