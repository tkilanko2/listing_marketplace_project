import React from 'react';
import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { SellerProfilePage } from './pages/SellerProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import { Service, Product, ListingItem, ServiceProvider } from './types';
import { mockServices, mockProducts, mockListings } from './mockData';
import { Navbar } from './components/Navbar';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'serviceDetails' | 'productDetails' | 'booking' | 'sellerProfile' | 'createListing'>('landing');
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

  const handleLogin = (email: string, password: string) => {
    // Enhanced login logic with user ID and status
    setIsAuthenticated(true);
    setUser({
      name: email.split('@')[0],
      email,
      userId: 'CM7by141boza',
      status: 'online'
    });
  };

  const handleSignup = (email: string, password: string) => {
    // Enhanced signup logic with user ID and status
    setIsAuthenticated(true);
    setUser({
      name: email.split('@')[0],
      email,
      userId: 'CM7by141boza',
      status: 'online'
    });
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

  const handleBuyNow = () => {
    // Mock payment behavior
    alert('Processing payment...');
    setTimeout(() => {
      alert('Payment successful! Your order has been confirmed.');
      handleBackToLanding();
    }, 1500);
  };

  const handleSellNowClick = () => {
    setCurrentPage('createListing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      />
      
      <div className="pt-16">
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
          />
        )}
        
        {currentPage === 'booking' && selectedListing?.type === 'service' && (
          <BookingPage 
            selectedService={selectedListing}
            allServices={mockServices.filter(s => s.provider.id === selectedListing.provider.id)}
            onBack={handleBackToLanding}
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
      </div>
    </div>
  );
}

export default App;