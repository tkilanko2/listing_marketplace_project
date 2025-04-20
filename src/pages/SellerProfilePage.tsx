import React from 'react';
import { ServiceProvider, ListingItem } from '../types';
import { ArrowLeft, Clock, MessageSquare } from 'lucide-react';

interface SellerProfilePageProps {
  provider: ServiceProvider;
  listings: ListingItem[];
  onListingSelect: (listing: ListingItem) => void;
  onBack: () => void;
}

export function SellerProfilePage({ provider, listings, onListingSelect, onBack }: SellerProfilePageProps) {
  return (
    <div className="container mx-auto px-4 py-8 bg-[#F8F8FA]">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-[#70727F] mb-6 hover:text-[#383A47]"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      {/* Provider Profile Header */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-md p-6 mb-8 border border-[#CDCED8]">
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={provider.avatar}
              alt={provider.username}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#FFFFFF] ${
              provider.isOnline ? 'bg-[#3D1560]' : 'bg-[#CDCED8]'
            }`} />
          </div>
          <div className="ml-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#1B1C20]">{provider.username}</h1>
              <span className={`ml-3 text-sm ${
                provider.isOnline ? 'text-[#3D1560]' : 'text-[#70727F]'
              }`}>
                {provider.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center mt-2 text-[#70727F]">
              <span className="mr-4">⭐ {provider.rating.toFixed(1)} ({provider.reviews.length} reviews)</span>
              <span className="mr-4">📦 {provider.totalBookings} sales</span>
              <span>📍 {provider.location.city}, {provider.location.country}</span>
            </div>
            <div className="flex items-center mt-2 space-x-4 text-sm text-[#70727F]">
              <span>Member since {provider.joinedDate.toLocaleDateString()}</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Within 2h</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>98%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-[#1B1C20]">All Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onListingSelect(listing)}
              className="bg-[#FFFFFF] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-[#CDCED8]"
            >
              <img
                src={listing.images[0]}
                alt={listing.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-[#1B1C20]">{listing.name}</h3>
                <p className="text-[#70727F] text-sm mb-2">{listing.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-[#1B1C20]">${listing.price}</span>
                  <span className="text-sm text-[#70727F]">
                    {listing.type === 'service' ? '🕒 ' + listing.duration + ' min' : '📦 ' + listing.condition}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 