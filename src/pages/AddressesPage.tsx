import React, { useState } from 'react';
import { ChevronLeft, PlusCircle, MapPin, MoreVertical, Trash2, Edit } from 'lucide-react';
import { AddressData } from '../types';

interface AddressesPageProps {
  addresses: AddressData[];
  onBack: () => void;
  onEditAddress: (address: AddressData) => void;
  onAddAddress: () => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefault: (addressId: string, type: 'services' | 'orders') => void;
}

const AddressesPage: React.FC<AddressesPageProps> = ({
  addresses,
  onBack,
  onEditAddress,
  onAddAddress,
  onDeleteAddress,
  onSetDefault
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getAddressTypeIcon = (type: 'home' | 'office' | 'other') => {
    switch (type) {
      case 'home': return '🏠';
      case 'office': return '🏢';
      case 'other': return '📍';
      default: return '📍';
    }
  };

  const formatAddress = (address: AddressData) => {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const toggleMenu = (addressId: string) => {
    setActiveMenu(activeMenu === addressId ? null : addressId);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED] rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#1B1C20]">My Addresses</h1>
            <p className="text-[#70727F] mt-1">Manage your delivery and service addresses</p>
          </div>
        </div>
        <button
          onClick={onAddAddress}
          className="bg-[#3D1560] hover:bg-[#6D26AB] text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors shadow-lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Address
        </button>
      </div>

      {/* Addresses Grid - Responsive: 2 columns on desktop/tablet, 1 column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[#E8E9ED] hover:border-[#3D1560] group"
          >
            {/* Address Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center flex-1">
                <span className="text-2xl mr-3 flex-shrink-0">
                  {getAddressTypeIcon(address.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#1B1C20] truncate">
                    {address.recipientName}
                  </h3>
                  <p className="text-sm text-[#70727F] capitalize">
                    {address.type} address
                  </p>
                </div>
              </div>
              
              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu(address.id)}
                  className="p-2 text-[#70727F] hover:text-[#3D1560] hover:bg-[#E8E9ED] rounded-lg transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                
                {/* Dropdown Menu */}
                {activeMenu === address.id && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E8E9ED] z-10">
                    <button
                      onClick={() => {
                        onEditAddress(address);
                        setActiveMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#383A47] hover:bg-[#E8E9ED] flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Address
                    </button>
                    <button
                      onClick={() => {
                        onDeleteAddress(address.id);
                        setActiveMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Address Details */}
            <div className="mb-4">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-[#70727F] mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#383A47] leading-relaxed">
                  {formatAddress(address)}
                </p>
              </div>
            </div>

            {/* Default Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {address.isDefaultServices && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EDD9FF] text-[#3D1560]">
                  Service Default
                </span>
              )}
              {address.isDefaultOrders && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFE5ED] text-[#DF678C]">
                  Order Default
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSetDefault(address.id, 'services')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  address.isDefaultServices
                    ? 'bg-[#3D1560] text-white'
                    : 'bg-[#E8E9ED] text-[#70727F] hover:bg-[#EDD9FF] hover:text-[#3D1560]'
                }`}
              >
                {address.isDefaultServices ? '✓ Service Default' : 'Set Service Default'}
              </button>
              <button
                onClick={() => onSetDefault(address.id, 'orders')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  address.isDefaultOrders
                    ? 'bg-[#DF678C] text-white'
                    : 'bg-[#E8E9ED] text-[#70727F] hover:bg-[#FFE5ED] hover:text-[#DF678C]'
                }`}
              >
                {address.isDefaultOrders ? '✓ Order Default' : 'Set Order Default'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E9ED] rounded-full mb-4">
            <MapPin className="h-8 w-8 text-[#70727F]" />
          </div>
          <h3 className="text-lg font-medium text-[#383A47] mb-2">No addresses yet</h3>
          <p className="text-[#70727F] mb-6">Add your first address to get started with deliveries and services.</p>
          <button
            onClick={onAddAddress}
            className="bg-[#3D1560] hover:bg-[#6D26AB] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressesPage; 