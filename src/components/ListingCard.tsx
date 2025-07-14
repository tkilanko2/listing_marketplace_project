import React from 'react';
import { Bookmark, Clock, DollarSign, Star, MapPin, Eye, Package2, Wrench, CreditCard, Layers } from 'lucide-react';
import { Service, Product, ListingItem } from '../types';
import { getServiceTiers } from '../mockData';

interface ListingCardProps {
  item: ListingItem;
  onClick?: () => void;
}

export function ListingCard({ item, onClick }: ListingCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        {item.type === 'service' && (
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <div className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              Service
            </div>
            {(() => {
              const tiers = getServiceTiers(item.serviceType);
              return tiers.length > 1 ? (
                <div className="flex items-center px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                  <Layers className="w-3 h-3 mr-1" />
                  {tiers.length} tiers
                </div>
              ) : null;
            })()}
          </div>
        )}
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
              {item.type === 'service' ? (() => {
                const tiers = getServiceTiers(item.serviceType);
                if (tiers.length > 1) {
                  const prices = tiers.map(t => t.price).sort((a, b) => a - b);
                  return `$${prices[0]} - $${prices[prices.length - 1]}`;
                }
                return `$${item.price.toLocaleString()}`;
              })() : `$${item.price.toLocaleString()}`}
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
        {item.provider.rating && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(item.provider.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({item.provider.reviews.length})</span>
          </div>
        )}
        {item.type === 'service' && (
          <div className="flex space-x-1 mt-1">
            {item.paymentOptions.onlinePayment && (
              <div className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                <CreditCard className="w-3 h-3 mr-1" />
                Online Pay
              </div>
            )}
            {item.paymentOptions.payAtService && (
              <div className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                <DollarSign className="w-3 h-3 mr-1" />
                Pay Later
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 