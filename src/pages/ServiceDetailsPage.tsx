import React, { useState, useEffect } from 'react';
import { Service, Review, ServiceProvider, ListingItem } from '../types';
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
  Mail
} from 'lucide-react';
import { ServiceGallery } from '../components/ServiceGallery';
import { ProviderProfile } from '../components/ProviderProfile';
import { mockServices } from '../mockData';
import { TrustElements } from '../components/TrustElements';
import { EnhancedReviews } from '../components/EnhancedReviews';
import { DetailedReview } from '../types/Review';
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
  isItemSaved: boolean;
  toggleSaveItem: () => void;
}

export function ServiceDetailsPage({ service, onBookNow, onBack, onProviderSelect, onListingSelect, isItemSaved, toggleSaveItem }: ServiceDetailsPageProps) {
  const [provider, setProvider] = useState(service.provider);
  const otherServices = mockServices.filter(s => 
    s.provider.id === provider.id && s.id !== service.id
  );

  const trustData = {
    monthlyPurchases: 124,
    responseRate: 99,
    responseTime: 'Within 1 hour',
    verifiedBusiness: true,
  };

  const [reviews, setReviews] = useState<DetailedReview[]>([
    {
      id: '1',
      author: 'Emily W.',
      rating: 5,
      date: new Date('2023-03-15'),
      title: 'Exceptional Service',
      content: 'The attention to detail was remarkable. The service provider was professional, punctual, and went above and beyond my expectations. I particularly appreciated their clear communication throughout the process.',
      isVerified: true,
      helpfulCount: 32,
      notHelpfulCount: 1,
      images: ['/images/service-review1.jpg', '/images/service-review2.jpg'],
      userVote: 'helpful',
    },
    {
      id: '2',
      author: 'David K.',
      rating: 4,
      date: new Date('2023-03-10'),
      content: 'Great service overall. The provider was knowledgeable and efficient. The only minor issue was scheduling flexibility, but the quality of work made up for it.',
      isVerified: true,
      helpfulCount: 18,
      notHelpfulCount: 2,
      images: ['/images/service-review3.jpg'],
    },
    {
      id: '3',
      author: 'Rachel M.',
      rating: 5,
      date: new Date('2023-03-05'),
      title: 'Highly Recommended',
      content: 'This is my second time using this service, and they maintain consistently high standards. The provider is skilled, professional, and a pleasure to work with.',
      isVerified: true,
      helpfulCount: 24,
      notHelpfulCount: 0,
    },
  ]);

  // Update provider rating when reviews change
  useEffect(() => {
    const total = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / total;
    setProvider(prev => ({
      ...prev,
      rating: Number(averageRating.toFixed(1)),
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.content,
        createdAt: review.date,
        customerName: review.author
      }))
    }));
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
                />
              </div>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Right Column - Provider Profile and Booking */}
        <div className="lg:col-span-1">
          <FadeInOnScroll delay={0.4}>
            <div className="bg-white p-6 rounded-xl shadow-sm lg:sticky lg:top-6">
              {/* Price and Booking Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-3xl font-bold text-[#1B1C20]">${service.price}</span>
                    <span className="text-[#70727F] ml-2">per service</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={onBookNow}
                    className="w-full bg-[#3D1560] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#6D26AB] transition-colors shadow-sm hover:shadow-md"
                  >
                    Book Now
                  </button>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-[#70727F]">
                    <button 
                      onClick={toggleSaveItem}
                      className="flex items-center hover:text-[#DF678C] transition-colors"
                    >
                      <Heart className={`w-4 h-4 mr-1 ${isItemSaved ? 'fill-current text-[#DF678C]' : ''}`} />
                      <span>{isItemSaved ? "Unsave" : "Save"}</span>
                    </button>
                    <span>•</span>
                    <button className="flex items-center hover:text-[#DF678C] transition-colors">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span>Share</span>
                    </button>
                    <span>•</span>
                    <button className="flex items-center hover:text-[#DF678C] transition-colors">
                      <Mail className="w-4 h-4 mr-1" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#E8E9ED] rounded-lg">
                  <div className="flex items-center text-sm text-[#70727F]">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>

              {/* Trust Elements */}
              <TrustElements
                monthlyPurchases={trustData.monthlyPurchases}
                verifiedBusiness={trustData.verifiedBusiness}
                onReport={() => {
                  // Handle report action
                  console.log('Report listing');
                }}
              />

              {/* Provider Profile */}
              <ProviderProfile 
                provider={provider}
                otherListings={otherServices}
                onProviderSelect={onProviderSelect}
                onListingSelect={onListingSelect}
              />
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </div>
  );
}