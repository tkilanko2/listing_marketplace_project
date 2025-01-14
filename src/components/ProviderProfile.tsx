import React from 'react';
import { ServiceProvider, ListingItem } from '../types';
import { Star, MapPin, Calendar, Clock, MessageSquare } from 'lucide-react';

interface ProviderProfileProps {
  provider: ServiceProvider;
  otherListings?: ListingItem[];
  onProviderSelect?: (provider: ServiceProvider) => void;
  onListingSelect?: (listing: ListingItem) => void;
}

export function ProviderProfile({ provider, otherListings, onProviderSelect, onListingSelect }: ProviderProfileProps) {
  return (
    <div>
      <div className="border-t pt-6">
        <div 
          className="flex items-center mb-4 cursor-pointer hover:opacity-80"
          onClick={() => onProviderSelect?.(provider)}
        >
          <div className="relative">
            <img
              src={provider.avatar}
              alt={provider.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
              provider.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="font-medium hover:text-blue-600">{provider.username}</h3>
              <span className={`ml-2 text-xs ${
                provider.isOnline ? 'text-green-500' : 'text-gray-500'
              }`}>
                {provider.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span>{provider.rating} ({provider.reviews.length} reviews)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{provider.location.city}, {provider.location.country}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Member since {provider.joinedDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-600 mb-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">Response Time</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Within 2 hours</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-600 mb-1">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-sm">Response Rate</span>
            </div>
            <p className="text-sm font-medium text-gray-900">98%</p>
          </div>
        </div>

        {otherListings && otherListings.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">More from this provider</h4>
            <div className="space-y-3">
              {otherListings.slice(0, 3).map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                  onClick={() => onListingSelect?.(item)}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-12 rounded object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium hover:text-blue-600">{item.name}</p>
                    <p className="text-sm text-gray-500">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}