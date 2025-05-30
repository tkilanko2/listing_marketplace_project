import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  ArrowRight, 
  Heart,
  Shield,
  Award,
  Zap,
  Monitor,
  Home,
  Building
} from 'lucide-react';

interface EnhancedServiceCardProps {
  service: {
    id: string;
    title: string;
    provider: {
      name: string;
      rating: number;
      reviews: number;
      verified: boolean;
      badge?: string;
    };
    price: number;
    originalPrice?: number;
    deliveryMode: 'at_seller' | 'at_buyer' | 'remote';
    duration: string;
    category: string;
    image: string;
    description: string;
    features: string[];
    availability: 'immediate' | 'within_week' | 'custom';
    responseTime: string;
  };
  onBook: () => void;
  onSave?: () => void;
}

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({
  service,
  onBook,
  onSave
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getDeliveryIcon = () => {
    switch (service.deliveryMode) {
      case 'at_seller': return <Building className="w-4 h-4" />;
      case 'at_buyer': return <Home className="w-4 h-4" />;
      case 'remote': return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeliveryText = () => {
    switch (service.deliveryMode) {
      case 'at_seller': return 'At business location';
      case 'at_buyer': return 'At your location';
      case 'remote': return 'Remote service';
    }
  };

  const getAvailabilityColor = () => {
    switch (service.availability) {
      case 'immediate': return 'text-green-600 bg-green-50';
      case 'within_week': return 'text-blue-600 bg-blue-50';
      case 'custom': return 'text-orange-600 bg-orange-50';
    }
  };

  const getAvailabilityText = () => {
    switch (service.availability) {
      case 'immediate': return 'Available now';
      case 'within_week': return 'Within a week';
      case 'custom': return 'Custom schedule';
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const discountPercentage = service.originalPrice 
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : 0;

  return (
    <div 
      className={`
        group relative bg-white rounded-2xl border border-gray-200/60 
        transition-all duration-500 ease-out cursor-pointer
        hover:border-purple-200 hover:shadow-2xl hover:-translate-y-1
        ${isHovered ? 'shadow-2xl -translate-y-1 border-purple-200' : 'shadow-md'}
        overflow-hidden backdrop-blur-sm
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          {service.provider.verified && (
            <div className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </div>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className={`
              p-2 rounded-full backdrop-blur-sm transition-all duration-300
              ${isSaved 
                ? 'bg-red-500/90 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }
            `}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Bottom Left - Category */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {service.category}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>
        
        {/* Provider Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {service.provider.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{service.provider.name}</p>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{service.provider.rating}</span>
                </div>
                <span className="text-gray-400 text-xs">({service.provider.reviews})</span>
                {service.provider.badge && (
                  <div className="flex items-center gap-1 ml-1">
                    <Award className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-600 font-medium">{service.provider.badge}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            {getDeliveryIcon()}
            <span>{getDeliveryText()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Zap className="w-4 h-4 text-green-500" />
            <span>{service.responseTime}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </div>
        </div>
        
        {/* Features */}
        {service.features.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">What's included:</p>
            <div className="flex flex-wrap gap-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full border border-purple-100"
                >
                  {feature}
                </span>
              ))}
              {service.features.length > 3 && (
                <span className="text-xs text-gray-500">+{service.features.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">${service.price}</span>
              {service.originalPrice && (
                <span className="text-lg text-gray-400 line-through">${service.originalPrice}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">Starting price</p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className="
              group/btn bg-gradient-to-r from-purple-600 to-purple-700 
              hover:from-purple-700 hover:to-purple-800
              text-white px-6 py-3 rounded-xl font-semibold
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              flex items-center gap-2 relative overflow-hidden
            "
          >
            <span className="relative z-10">Book Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 relative z-10" />
            
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-all duration-700" />
          </button>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 via-purple-100 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 blur-xl" />
    </div>
  );
};

export default EnhancedServiceCard; 