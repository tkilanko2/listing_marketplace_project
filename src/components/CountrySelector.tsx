import React, { useState, useEffect, useRef } from 'react';
import { Globe, Search, Loader2 } from 'lucide-react';
import countries from './countryList';

interface CountrySelectorProps {
  onCountryChange: (country: string) => void;
  variant?: 'button' | 'input';
}

export function CountrySelector({ onCountryChange, variant = 'button' }: CountrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('global');
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const hasAttemptedDetection = useRef(false);

  // Function to detect user's country
  const detectCountry = async () => {
    if (hasAttemptedDetection.current) return;
    
    try {
      setIsLoading(true);
      hasAttemptedDetection.current = true;

      // Try multiple geolocation APIs for redundancy
      const apis = [
        'https://ipapi.co/json/',
        'https://api.ipify.org?format=json',
        'https://ip-api.com/json'
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api);
          if (!response.ok) continue;
          
          const data = await response.json();
          console.log('API Response:', api, data);

          // Handle different API response formats
          const countryCode = data.country_code || data.country || data.countryCode;
          if (!countryCode) continue;

          const normalizedCountryCode = countryCode.toUpperCase();
          console.log('Normalized country code:', normalizedCountryCode);

          const foundCountry = countries.find(
            c => c.code.toUpperCase() === normalizedCountryCode
          );

          if (foundCountry) {
            console.log('Found matching country:', foundCountry);
            setSelectedCountry(foundCountry.code);
            onCountryChange(foundCountry.code);
            break; // Exit loop if successful
          }
        } catch (error) {
          console.error('Error with API:', api, error);
          continue; // Try next API
        }
      }
    } catch (error) {
      console.error('Error detecting country:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial detection on mount
  useEffect(() => {
    detectCountry();
    
    // Cleanup function
    return () => {
      hasAttemptedDetection.current = false;
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCountryData = countries.find(
    c => c.code.toLowerCase() === selectedCountry.toLowerCase()
  );

  const handleRetryDetection = async () => {
    hasAttemptedDetection.current = false;
    await detectCountry();
  };

  const trigger = (
    <button
      className={
        variant === 'input'
          ? 'w-full text-left px-3 py-2 rounded-md border border-[#CDCED8] bg-white text-[#383A47] focus:outline-none focus:ring-2 focus:ring-[#6D26AB]'
          : 'flex items-center space-x-2 px-3 py-2 rounded-md text-[#383A47] hover:bg-[#E8E9ED] border border-[#CDCED8] focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560]'
      }
      onClick={() => setIsOpen(!isOpen)}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {selectedCountry === 'global' ? (
            <>
              <Globe className="w-5 h-5 inline-block mr-2" />
              <span className="text-sm">{variant === 'input' ? 'Enter your Country' : 'Global'}</span>
            </>
          ) : (
            <>
              {selectedCountryData?.flag && <span className="mr-2">{selectedCountryData.flag}</span>}
              <span className="text-sm">{selectedCountryData?.name}</span>
            </>
          )}
        </>
      )}
    </button>
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={variant === 'input' ? 'relative w-full' : 'relative flex flex-col items-center'}>
      {variant === 'input' ? trigger : (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Your Current Country:</span>
          {trigger}
        </div>
      )}

      {isOpen && (
        <div className={`absolute mt-1 ${variant === 'input' ? 'w-full' : 'w-64'} bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100`}>
          {/* Search input */}
          <div className="px-3 pb-2">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-[#CDCED8] rounded-md focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] focus:border-[#3D1560]"
              />
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-[#70727F]" />
            </div>
          </div>

          {/* Country list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country.code);
                  onCountryChange(country.code);
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-[#E8E9ED] focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[#3D1560] ${
                  selectedCountry === country.code 
                    ? 'text-[#3D1560] bg-[#EDD9FF]' 
                    : 'text-[#383A47]'
                }`}
              >
                {country.code === 'global' ? (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    <span>{country.name}</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">{country.flag}</span>
                    <span>{country.name}</span>
                  </>
                )}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 