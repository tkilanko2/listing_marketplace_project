import React, { useState, useEffect } from 'react';
import { Service, ServiceProvider, ListingItem } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Star, 
  User, 
  Calendar, 
  MapPin, 
  Home, 
  Building2,
  Globe,
  Languages,
  Briefcase,
  CheckCircle,
  Eye,
  Bookmark,
  Heart,
  Share2,
  Mail,
  Shield,
  Flag,
  FileText,
  CreditCard
} from 'lucide-react';
import { ServiceGallery } from '../components/ServiceGallery';
import { ProviderProfile } from '../components/ProviderProfile';
import { mockServices, getServiceTiers } from '../mockData';
import { TrustElements } from '../components/TrustElements';
import { EnhancedReviews } from '../components/EnhancedReviews';
import { Review } from '../types/Review';
import { FadeInOnScroll } from '../components/animations/FadeInOnScroll';
import { ParallaxSection } from '../components/animations/ParallaxSection';
import { HeartAnimation } from '../components/animations/HeartAnimation';
import { ProductCardSkeleton, ReviewSkeleton } from '../components/loading/SkeletonLoader';

interface ServiceDetailsPageProps {
  service: Service;
  onBookNow: () => void;
  onBack: () => void;
  onProviderSelect: (provider: ServiceProvider) => void;
  onListingSelect: (listing: ListingItem) => void;
  onNavigateToMessages?: (listingInfo?: {
    id: string;
    type: 'listing';
    title: string;
    sellerName: string;
    sellerId: string;
    buyerId?: string;
    buyerName?: string;
  }) => void; // Navigate to messaging with listing context
  isItemSaved: boolean;
  toggleSaveItem: () => void;
}

export function ServiceDetailsPage({ service, onBookNow, onBack, onProviderSelect, onListingSelect, onNavigateToMessages, isItemSaved, toggleSaveItem }: ServiceDetailsPageProps) {
  const [provider, setProvider] = useState(service.provider);
  // Show other tiers of the same service type, plus other services from the same provider
  const serviceTiers = getServiceTiers(service.serviceType).filter(s => s.id !== service.id);
  const otherProviderServices = mockServices.filter(s => 
    s.provider.id === provider.id && s.id !== service.id && s.serviceType !== service.serviceType
  );
  const otherServices = [...serviceTiers, ...otherProviderServices];

  const trustData = {
    monthlyPurchases: 124,
    responseRate: 99,
    responseTime: 'Within 1 hour',
    verifiedBusiness: true,
  };

  // Load all reviews for the provider (across all their services)
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (!service?.provider?.id) return [];
    const providerServices = mockServices.filter(s => s.provider.id === service.provider.id);
    return providerServices.flatMap(s => s.reviews || []);
  });

  // Update provider rating when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const total = reviews.length;
      const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / total;
      setProvider(prev => ({
        ...prev,
        rating: Number(averageRating.toFixed(1))
      }));
    }
  }, [reviews]);

  const handleReviewVote = (reviewId: string, isHelpful: boolean) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const previousVote = review.userVote;
        const newVote = isHelpful ? 'helpful' as const : 'not-helpful' as const;
        
        let helpfulCount = review.helpfulCount;
        let notHelpfulCount = review.notHelpfulCount;
        
        if (previousVote === 'helpful') {
          helpfulCount--;
        } else if (previousVote === 'not-helpful') {
          notHelpfulCount--;
        }
        
        if (newVote === 'helpful') {
          helpfulCount++;
        } else {
          notHelpfulCount++;
        }

        return {
          ...review,
          helpfulCount,
          notHelpfulCount,
          userVote: previousVote === newVote ? undefined : newVote,
        };
      }
      return review;
    }));
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!service || !service.provider) {
      return;
    }

    try {
      setProvider(service.provider);
    } catch (error) {
      console.error('Error setting provider:', error);
    }
  }, [service]);

  useEffect(() => {
    // This effect could be used for other on-mount logic if needed.
    // For now, it's empty as addRecentlyViewedItem will be called by App.tsx
  }, [service.id]); // Re-run if service changes

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-[#F8F8FA]">
      {/* Navigation and Breadcrumb */}
      <FadeInOnScroll>
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-[#70727F] hover:text-[#383A47] mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Back to listings</span>
          </button>
          <div className="text-sm text-[#70727F]">
            Home / {service.category} / {service.name}
          </div>
        </div>
      </FadeInOnScroll>

      {/* Service Title and Stats */}
      <FadeInOnScroll delay={0.2}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1">
            <div className="mb-4">
              <span className="text-[#3D1560] text-sm font-medium tracking-wider uppercase">{service.category}</span>
              <h1 className="text-4xl font-bold text-[#1B1C20] leading-tight mt-1">
                {service.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#70727F]">
              <div className="flex items-center bg-[#E8E9ED] px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-[#3D1560] mr-1" />
                <span className="font-medium">{provider.rating}</span>
                <span className="text-[#70727F] ml-1">({provider.reviews.length} reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-[#70727F] mr-1" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-[#70727F] mr-1" />
                <span>{service.location.city}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 text-[#70727F] mr-1" />
                <span>{service.views} views</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center mt-4 md:mt-0">
            <button 
              onClick={toggleSaveItem}
              className={`p-2 rounded-full border border-[#CDCED8] text-[#383A47] hover:bg-[#EDD9FF] hover:text-[#6D26AB] transition-colors duration-200 ${isItemSaved ? 'bg-[#FFE5ED]' : ''}`}
              title={isItemSaved ? "Unsave item" : "Save item"}
            >
              {isItemSaved ? (
                <HeartAnimation isActive={true} onClick={toggleSaveItem} />
              ) : (
                <Heart className="w-5 h-5 text-[#383A47]" />
              )}
            </button>
            <button className="p-2 rounded-full border border-[#CDCED8] text-[#383A47] hover:bg-[#EDD9FF] hover:text-[#6D26AB] transition-colors duration-200">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full border border-[#CDCED8] text-[#383A47] hover:bg-[#EDD9FF] hover:text-[#6D26AB] transition-colors duration-200">
              <Mail className="w-5 h-5" />
            </button>
            <button 
              onClick={onBookNow}
              className="px-6 py-3 bg-[#3D1560] text-white rounded-md hover:bg-[#6D26AB] transition-colors duration-200 font-medium"
            >
              Book Now
            </button>
          </div>
        </div>
      </FadeInOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery and Details */}
        <div className="lg:col-span-2">
          {/* Service Gallery */}
          <ParallaxSection offset={20}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-[#CDCED8]">
              <ServiceGallery 
                images={service.images} 
                responseTime={service.provider.responseTime || "Within 2h"}
                responseRate={service.provider.responseRate || "98%"}
              />
            </div>
          </ParallaxSection>

          {/* Overview Section */}
          <div className="space-y-8">
            {/* Short Description */}
            <FadeInOnScroll>
              <div className="bg-gradient-to-r from-[#EDD9FF] to-[#E8E9ED] p-6 rounded-xl border border-[#CDCED8]">
                <p className="text-[#383A47] font-medium leading-relaxed">{service.shortDescription}</p>
              </div>
            </FadeInOnScroll>

            {/* Detailed Description */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">About this service</h2>
                <p className="text-[#383A47] leading-relaxed whitespace-pre-line">{service.longDescription}</p>
              </div>
            </FadeInOnScroll>

            {/* Service Features */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">Service Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                    <Clock className="w-8 h-8 text-[#3D1560]" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Duration</p>
                      <p className="text-[#70727F]">{service.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                    <MapPin className="w-8 h-8 text-[#3D1560]" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Location</p>
                      <p className="text-[#70727F]">{service.location.city}, {service.location.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                    <Home className="w-8 h-8 text-[#3D1560]" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Category</p>
                      <p className="text-[#70727F]">{service.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                    <Globe className="w-8 h-8 text-[#3D1560]" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Service Area</p>
                      <p className="text-[#70727F]">Within {service.location.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                    <Languages className="w-8 h-8 text-[#3D1560]" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Languages</p>
                      <p className="text-[#70727F]">English</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-[#E8E9ED] rounded-lg">
                    <Briefcase className="w-8 h-8 text-[#3D1560]" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Experience</p>
                      <p className="text-[#70727F]">{service.provider.totalBookings}+ bookings</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* What's Included */}
            <FadeInOnScroll>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-[#1B1C20]">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start p-4 bg-[#E8E9ED] rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#3D1560] flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Professional Service</p>
                      <p className="text-[#70727F] text-sm mt-1">Experienced and verified provider</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-[#E8E9ED] rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#3D1560] flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Satisfaction Guaranteed</p>
                      <p className="text-[#70727F] text-sm mt-1">100% satisfaction or money back</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-[#E8E9ED] rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#3D1560] flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">Flexible Scheduling</p>
                      <p className="text-[#70727F] text-sm mt-1">Book at your convenience</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-[#E8E9ED] rounded-lg">
                    <CheckCircle className="w-6 h-6 text-[#3D1560] flex-shrink-0 mt-0.5" />
                    <div className="ml-4">
                      <p className="font-semibold text-[#383A47]">On-location Service</p>
                      <p className="text-[#70727F] text-sm mt-1">Service provided at your location</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Reviews Section */}
            <FadeInOnScroll>
              <div className="mt-16 lg:mt-24">
                <h2 className="text-2xl font-bold text-[#1B1C20] mb-8">Customer Reviews</h2>
                <EnhancedReviews
                  reviews={reviews}
                  onVoteHelpful={handleReviewVote}
                  currentListingId={service?.id}
                />
              </div>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Right Column - Provider Profile and Booking */}
        <div className="lg:col-span-1">
          <FadeInOnScroll delay={0.4}>
            <div className="space-y-6">
              {/* Service Tier Selector */}
              {serviceTiers.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#CDCED8]">
                  <h3 className="text-lg font-semibold mb-4 text-[#1B1C20]">Other {service.serviceType} Tiers</h3>
                  <div className="space-y-3">
                    {serviceTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between p-3 border border-[#CDCED8] rounded-lg hover:border-[#6D26AB] cursor-pointer transition-colors"
                        onClick={() => onListingSelect(tier)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-[#1B1C20] text-sm">{tier.name}</h4>
                          <p className="text-xs text-[#70727F] mt-1">{tier.duration} min</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#3D1560]">${tier.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Booking Section */}
              <div className="bg-white pt-8 px-8 pb-6 rounded-xl shadow-sm border border-[#CDCED8]">
                {/* Price and Booking Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-3xl font-bold text-[#1B1C20]">${service.price}</span>
                      <span className="text-[#70727F] ml-2">per service</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#3D1560] font-medium bg-[#EDD9FF] px-3 py-1.5 rounded-full">
                        Available Today
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <button 
                      onClick={onBookNow}
                      className="w-full bg-[#3D1560] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#6D26AB] transition-colors shadow-sm hover:shadow-md"
                    >
                      Book Now
                    </button>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={toggleSaveItem}
                        className={`flex items-center justify-center px-4 py-3 rounded-lg border border-[#CDCED8] text-xs font-medium transition-colors ${isItemSaved ? 'bg-[#FFE5ED] text-[#DF678C] border-[#DF678C]' : 'text-[#70727F] hover:bg-[#E8E9ED]'}`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${isItemSaved ? 'fill-current' : ''}`} />
                        <span>{isItemSaved ? "Saved" : "Save"}</span>
                      </button>
                      <button className="flex items-center justify-center px-4 py-3 rounded-lg border border-[#CDCED8] text-xs font-medium text-[#70727F] hover:bg-[#E8E9ED] transition-colors">
                        <Share2 className="w-4 h-4 mr-1" />
                        <span>Share</span>
                      </button>
                      <button 
                        onClick={() => {
                          if (onNavigateToMessages) {
                            const listingInfo = {
                              id: service.id,
                              type: 'listing' as const,
                              title: `${service.name} - ${service.serviceType}`,
                              sellerName: service.provider?.username || 'Provider',
                              sellerId: service.provider?.id || 'unknown',
                              buyerName: 'You'
                            };
                            onNavigateToMessages(listingInfo);
                          }
                        }}
                        className="flex items-center justify-center px-4 py-3 rounded-lg border border-[#CDCED8] text-xs font-medium text-[#70727F] hover:bg-[#E8E9ED] transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        <span>Contact</span>
                      </button>
                    </div>
                  </div>

                  {/* Mini Trust Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="flex items-center p-3 bg-[#E8E9ED] rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#3D1560] mr-2" />
                      <span className="text-xs font-medium text-[#383A47]">Instant Booking</span>
                    </div>
                    <div className="flex items-center p-3 bg-[#E8E9ED] rounded-lg">
                      <CreditCard className="w-4 h-4 text-[#3D1560] mr-2" />
                      <span className="text-xs font-medium text-[#383A47]">Secure Payment</span>
                    </div>
                    <div className="flex items-center p-3 bg-[#E8E9ED] rounded-lg">
                      <Clock className="w-4 h-4 text-[#3D1560] mr-2" />
                      <span className="text-xs font-medium text-[#383A47]">24h Free Cancel</span>
                    </div>
                    <div className="flex items-center p-3 bg-[#EDD9FF] rounded-lg">
                      <Shield className="w-4 h-4 text-[#3D1560] mr-2" />
                      <span className="text-xs font-medium text-[#3D1560]">Verified Business</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Protection Section - Normal Flow */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#CDCED8]">
                <div className="p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
                  <h3 className="text-sm font-semibold text-[#1B1C20] mb-4 flex items-center">
                    <Shield className="w-4 h-4 text-[#3D1560] mr-2" />
                    Terms & Protection
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Refund Policy */}
                    <div className="flex items-start space-x-3">
                      <FileText className="w-3 h-3 text-[#70727F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[#383A47]">Refund Policy</p>
                        <p className="text-xs text-[#70727F] mt-1">
                          Full refund if cancelled 24+ hours before service. 50% refund within 24 hours.
                        </p>
                      </div>
                    </div>

                    {/* Payment Protection */}
                    <div className="flex items-start space-x-3">
                      <CreditCard className="w-3 h-3 text-[#70727F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[#383A47]">Payment Protection</p>
                        <p className="text-xs text-[#70727F] mt-1">
                          Your payment is protected. Money held securely until service completion.
                        </p>
                      </div>
                    </div>

                    {/* Service Terms */}
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-3 h-3 text-[#70727F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[#383A47]">Service Terms</p>
                        <p className="text-xs text-[#70727F] mt-1">
                          Service provided as described. Provider follows platform guidelines and standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View Full Terms Link */}
                  <div className="mt-3 pt-3 border-t border-[#E8E9ED]">
                    <button className="text-xs text-[#3D1560] hover:text-[#6D26AB] font-medium transition-colors">
                      View full terms and conditions
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust & Verification Section - Normal Flow */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#CDCED8]">
                <div className="p-4 bg-[#F8F8FA] rounded-lg border border-[#E8E9ED]">
                  <h3 className="text-sm font-semibold text-[#1B1C20] mb-4 flex items-center">
                    <Shield className="w-4 h-4 text-[#3D1560] mr-2" />
                    Trust & Verification
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Monthly Purchases */}
                    <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#CDCED8]">
                      <p className="text-xs text-[#70727F]">
                        <span className="font-medium text-[#383A47]">{trustData.monthlyPurchases}</span> purchases in the last month
                      </p>
                      <div className="mt-2 h-1.5 bg-[#CDCED8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3D1560] rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((trustData.monthlyPurchases / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Report Button */}
                  <div className="mt-3 pt-3 border-t border-[#E8E9ED]">
                    <button
                      onClick={() => {
                        console.log('Report listing');
                      }}
                      className="flex items-center text-[#70727F] hover:text-[#DF678C] text-xs transition-colors duration-200"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      <span>Report this listing</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Provider Profile Card - Normal Flow */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#CDCED8]">
                <ProviderProfile 
                  provider={provider}
                  otherListings={otherServices}
                  onProviderSelect={onProviderSelect}
                  onListingSelect={onListingSelect}
                />
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
}