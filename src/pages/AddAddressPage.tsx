import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { AddressData } from '../types';

interface AddAddressPageProps {
  onCancel: () => void;
  onSave: (addressData: AddressData) => void;
  existingAddress?: AddressData | null;
}

const AddAddressPage: React.FC<AddAddressPageProps> = ({
  onCancel,
  onSave,
  existingAddress
}) => {
  const [formData, setFormData] = useState<AddressData>({
    id: existingAddress?.id || '',
    recipientName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    type: 'home' as 'home' | 'office' | 'other',
    isDefaultServices: false,
    isDefaultOrders: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (existingAddress) {
      setFormData(existingAddress);
    }
  }, [existingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            isDefaultServices: name === 'isDefaultServices' ? checked : (name === 'isDefaultOrders' ? prev.isDefaultServices : false),
            isDefaultOrders: name === 'isDefaultOrders' ? checked : (name === 'isDefaultServices' ? prev.isDefaultOrders : false),
        }));
        if(name === 'isDefaultServices' && checked) {
            setFormData(prev => ({...prev, isDefaultOrders: false}));
        }
        if(name === 'isDefaultOrders' && checked) {
            setFormData(prev => ({...prev, isDefaultServices: false}));
        }
    } else {
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientName.trim()) newErrors.recipientName = 'Recipient name is required';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isEditing = !!existingAddress;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-4 p-2 text-[#70727F] hover:text-[#383A47] hover:bg-[#E8E9ED] rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#1B1C20]">
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </h1>
            <p className="text-[#70727F] mt-1">
              {isEditing ? 'Update your address details' : 'Enter your address information'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8E9ED]">
          {/* Recipient Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Recipient Information</h3>
            
            <div className="mb-4">
              <label htmlFor="recipientName" className="block text-sm font-medium text-[#383A47] mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] ${
                  errors.recipientName ? 'border-red-500' : 'border-[#E8E9ED]'
                }`}
                placeholder="Enter full name"
              />
              {errors.recipientName && (
                <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#383A47] mb-2">
                Address Type *
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'home', label: 'Home', icon: '🏠' },
                  { value: 'office', label: 'Work', icon: '🏢' },
                  { value: 'other', label: 'Other', icon: '📍' }
                ].map(({ value, label, icon }) => (
                  <label key={value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={formData.type === value}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="mr-1">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Address Details</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-[#383A47] mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] ${
                    errors.street ? 'border-red-500' : 'border-[#E8E9ED]'
                  }`}
                  placeholder="Street address, building number"
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[#383A47] mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] ${
                      errors.city ? 'border-red-500' : 'border-[#E8E9ED]'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-[#383A47] mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] ${
                      errors.state ? 'border-red-500' : 'border-[#E8E9ED]'
                    }`}
                    placeholder="State/Province"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-[#383A47] mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] ${
                      errors.zipCode ? 'border-red-500' : 'border-[#E8E9ED]'
                    }`}
                    placeholder="ZIP / Postal code"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-[#383A47] mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#E8E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560]"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Default Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4">Default Settings</h3>
            <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                    <input 
                        type="checkbox"
                        name="isDefaultServices"
                        checked={formData.isDefaultServices}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#3D1560] focus:ring-[#6D26AB] border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-[#383A47]">Set as default for service bookings</span>
                </label>
                <label className="flex items-center cursor-pointer">
                    <input 
                        type="checkbox"
                        name="isDefaultOrders"
                        checked={formData.isDefaultOrders}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#DF678C] focus:ring-[#DF678C] border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-[#383A47]">Set as default for product orders</span>
                </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white border border-[#CDCED8] text-[#383A47] rounded-lg hover:bg-[#F8F8FA] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-[#3D1560] hover:bg-[#6D26AB] text-white rounded-lg flex items-center font-medium transition-colors shadow-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            {isEditing ? 'Save Changes' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressPage; 