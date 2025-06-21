import React from 'react';
import { AddressData } from '../types';
import { X, MapPin, Home, Briefcase, Tag } from 'lucide-react';

interface AddressDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: AddressData | null;
}

const AddressDetailsModal: React.FC<AddressDetailsModalProps> = ({ isOpen, onClose, address }) => {
  if (!isOpen || !address) {
    return null;
  }

  const getAddressIcon = (type: 'home' | 'office' | 'other') => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5 text-[#3D1560]" />;
      case 'office':
        return <Briefcase className="h-5 w-5 text-[#3D1560]" />;
      default:
        return <Tag className="h-5 w-5 text-[#3D1560]" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md m-auto p-8 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#70727F] hover:text-[#1B1C20] transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-[#EDD9FF] p-3 rounded-full mr-4">
            {getAddressIcon(address.type)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1B1C20] capitalize">{address.type} Address</h2>
            <p className="text-sm text-[#70727F]">Details for this location</p>
          </div>
        </div>

        <div className="space-y-4 text-[#383A47]">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-[#6D26AB] mr-4 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#1B1C20]">{address.recipientName}</p>
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>
          </div>

          <div className="border-t border-[#E8E9ED] my-6"></div>

          <h3 className="text-lg font-semibold text-[#1B1C20] mb-3">Default Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#F8F8FA] p-3 rounded-lg">
              <span className="font-medium">Default for Services</span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                address.isDefaultServices 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {address.isDefaultServices ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F8F8FA] p-3 rounded-lg">
              <span className="font-medium">Default for Orders</span>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                address.isDefaultOrders 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {address.isDefaultOrders ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
            <button
                onClick={onClose}
                className="w-full bg-[#3D1560] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6D26AB] transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B53D9]"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsModal; 