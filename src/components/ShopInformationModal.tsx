import React, { useState } from 'react';
import { X, Store, MapPin, Mail, Clock, Tag, Plus } from 'lucide-react';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface ShopInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    shopName?: string;
    description?: string;
    location?: string;
    contactEmail?: string;
    businessHours?: string;
    specializations?: string[];
  };
}

export function ShopInformationModal({ isOpen, onClose, initialData }: ShopInformationModalProps) {
  // Parse location into city and country/state
  const locationParts = initialData?.location?.split(', ') || [];
  const [city, setCity] = useState(locationParts[0] || '');
  const [stateOrCountry, setStateOrCountry] = useState(locationParts.slice(1).join(', ') || '');

  // Parse business hours
  const parseBusinessHours = (hoursString?: string): BusinessHours[] => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const defaultHours: BusinessHours[] = days.map(day => ({
      day,
      open: '09:00',
      close: '17:00',
      closed: false
    }));

    // If hours string is like "Mon-Fri: 9AM-6PM", set those days
    if (hoursString && hoursString.includes('Mon-Fri')) {
      const times = hoursString.match(/(\d+)(AM|PM)-(\d+)(AM|PM)/);
      if (times) {
        const openHour = parseInt(times[1]);
        const openPeriod = times[2];
        const closeHour = parseInt(times[3]);
        const closePeriod = times[4];
        
        const open24 = openPeriod === 'PM' && openHour !== 12 ? openHour + 12 : openHour === 12 && openPeriod === 'AM' ? 0 : openHour;
        const close24 = closePeriod === 'PM' && closeHour !== 12 ? closeHour + 12 : closeHour === 12 && closePeriod === 'AM' ? 0 : closeHour;

        defaultHours.forEach((hour, index) => {
          if (index < 5) { // Mon-Fri (0-4)
            hour.open = `${open24.toString().padStart(2, '0')}:00`;
            hour.close = `${close24.toString().padStart(2, '0')}:00`;
            hour.closed = false;
          } else {
            hour.closed = true;
          }
        });
      }
    }

    return defaultHours;
  };

  const [shopName, setShopName] = useState(initialData?.shopName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [contactEmail, setContactEmail] = useState(initialData?.contactEmail || '');
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(parseBusinessHours(initialData?.businessHours));
  const [specializations, setSpecializations] = useState<string[]>(initialData?.specializations || []);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !specializations.includes(newTag.trim())) {
      setSpecializations([...specializations, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSpecializations(specializations.filter(tag => tag !== tagToRemove));
  };

  const handleHourChange = (index: number, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  const handleSave = () => {
    // TODO: Save shop information to backend
    const shopData = {
      shopName,
      description,
      location: stateOrCountry ? `${city}, ${stateOrCountry}` : city,
      contactEmail,
      businessHours: businessHours.map(h => h.closed ? `${h.day}: Closed` : `${h.day}: ${h.open} - ${h.close}`).join(', '),
      specializations
    };
    console.log('Saving shop information:', shopData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform-gpu"
           style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
        {/* Header */}
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-semibold flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Edit Shop Information
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-[#CDCED8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
            <h4 className="text-base font-semibold text-[#1B1C20] mb-4 flex items-center">
              <Store className="w-4 h-4 mr-2 text-[#3D1560]" />
              Basic Information
            </h4>
            <div className="space-y-4">
              {/* Shop Name */}
              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-1.5">
                  Shop Name <span className="text-[#DF678C]">*</span>
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Enter shop name"
                  className="w-full px-4 py-2.5 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] transition-all"
                />
              </div>

              {/* Shop Description */}
              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-1.5">
                  Shop Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your shop, services, and what makes you unique..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] resize-none transition-all"
                />
                <p className="text-xs text-[#70727F] mt-1.5">Help customers understand what your shop offers</p>
              </div>
            </div>
          </div>

          {/* Contact & Location Section */}
          <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
            <h4 className="text-base font-semibold text-[#1B1C20] mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#3D1560]" />
              Contact & Location
            </h4>
            <div className="space-y-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-1.5">
                  Location
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-2.5 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] transition-all"
                  />
                  <input
                    type="text"
                    value={stateOrCountry}
                    onChange={(e) => setStateOrCountry(e.target.value)}
                    placeholder="State/Country"
                    className="w-full px-4 py-2.5 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] transition-all"
                  />
                </div>
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium text-[#383A47] mb-1.5 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-[#3D1560]" />
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-4 py-2.5 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Business Hours Section */}
          <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
            <h4 className="text-base font-semibold text-[#1B1C20] mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#3D1560]" />
              Business Hours
            </h4>
            <div className="space-y-2.5">
              {businessHours.map((hour, index) => (
                <div key={hour.day} className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all ${hour.closed ? 'border-[#E8E9ED] opacity-60' : 'border-[#CDCED8] hover:border-[#3D1560]'}`}>
                  <div className="w-20 text-sm font-medium text-[#383A47]">
                    {hour.day.slice(0, 3)}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => handleHourChange(index, 'open', e.target.value)}
                      disabled={hour.closed}
                      className="px-3 py-2 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] disabled:bg-[#F8F8FA] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-all"
                    />
                    <span className="text-[#70727F] text-sm">to</span>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => handleHourChange(index, 'close', e.target.value)}
                      disabled={hour.closed}
                      className="px-3 py-2 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] disabled:bg-[#F8F8FA] disabled:text-[#CDCED8] disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                  <label className="flex items-center cursor-pointer shrink-0">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={hour.closed}
                        onChange={(e) => handleHourChange(index, 'closed', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="block bg-[#E8E9ED] w-9 h-5 rounded-full peer-checked:bg-[#3D1560] transition-colors"></div>
                      <div className="dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform peer-checked:translate-x-4 shadow-sm"></div>
                    </div>
                    <span className="ml-2 text-sm text-[#70727F] whitespace-nowrap">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Specialization Tags Section */}
          <div className="bg-[#F8F8FA] rounded-lg p-5 border border-[#E8E9ED]">
            <h4 className="text-base font-semibold text-[#1B1C20] mb-4 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-[#3D1560]" />
              Specialization Tags
            </h4>
            {specializations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-lg border border-[#E8E9ED] min-h-[3rem]">
                {specializations.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-[#EDD9FF] text-[#3D1560] text-sm font-medium px-3 py-1.5 rounded-full hover:bg-[#DF678C] hover:text-white transition-colors"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:scale-110 transition-transform"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add specialization tag (e.g., Beauty, Wellness)"
                className="flex-1 px-4 py-2.5 border border-[#CDCED8] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-[#383A47] transition-all"
              />
              <button
                onClick={handleAddTag}
                className="px-5 py-2.5 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#70727F] mt-2">Press Enter or click the + button to add a tag</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E9ED]">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-[#CDCED8] text-[#70727F] font-medium rounded-lg hover:border-[#70727F] hover:bg-[#E8E9ED] hover:text-[#383A47] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#3D1560] text-white font-medium rounded-lg hover:bg-[#6D26AB] active:bg-[#9B53D9] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:ring-offset-2 shadow-sm hover:shadow-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

