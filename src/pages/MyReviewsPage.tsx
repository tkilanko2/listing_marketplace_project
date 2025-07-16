import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Filter, Star, ExternalLink, MoreHorizontal, Flag, Eye, Calendar, TrendingUp } from 'lucide-react';
import { mockServices } from '../mockData';

interface Review {
  id: string;
  listingId: string;
  listingTitle: string;
  providerId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewTitle: string;
  comment: string;
  rating: number;
  criterias: { name: string; rating: number; }[];
  date: string;
  helpfulCount: number;
  notHelpfulCount: number;
  images: string[];
}

interface MyReviewsPageProps {
  onBack: () => void;
}

// Mock data for reviews given by the buyer
const mockReviewsGiven: Review[] = [
  {
    id: 'review-given-001',
    listingId: 'career-guidance-professional-development-consultation-001',
    listingTitle: 'Career Guidance & Professional Development Consultation',
    providerId: 'provider-001',
    reviewerId: 'current-user',
    reviewerName: 'CurrentUser',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    reviewTitle: 'Excellent career guidance session',
    comment: 'The consultation was incredibly helpful. The advisor provided clear action steps and valuable insights for my career development.',
    rating: 5,
    criterias: [],
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 12,
    notHelpfulCount: 1,
    images: []
  },
  {
    id: 'review-given-002',
    listingId: 'business-strategy-market-analysis-consultation-001',
    listingTitle: 'Business Strategy & Market Analysis Consultation',
    providerId: 'provider-002',
    reviewerId: 'current-user',
    reviewerName: 'CurrentUser',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    reviewTitle: 'Great business insights',
    comment: 'The strategic analysis was thorough and the recommendations were actionable. Really helped me understand my market position.',
    rating: 4,
    criterias: [],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 8,
    notHelpfulCount: 0,
    images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop']
  }
];

// Mock data for reviews received by the buyer (from service providers)
const mockReviewsReceived: Review[] = [
  {
    id: 'review-received-001',
    listingId: 'booking-001',
    listingTitle: 'Service Booking Experience',
    providerId: 'provider-001',
    reviewerId: 'provider-001',
    reviewerName: 'ServiceProvider',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    reviewTitle: 'Excellent customer communication',
    comment: 'The customer was very clear about requirements, punctual, and pleasant to work with. Highly recommend!',
    rating: 5,
    criterias: [],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 5,
    notHelpfulCount: 0,
    images: []
  }
];

export function MyReviewsPage({ onBack }: MyReviewsPageProps) {
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('received');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [openMenuId]);

  const filteredReviews = useMemo(() => {
    const reviews = activeTab === 'given' ? mockReviewsGiven : mockReviewsReceived;
    
    return reviews.filter(review => {
      const matchesSearch = review.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = filterRating === null || review.rating === filterRating;
      
      return matchesSearch && matchesRating;
    });
  }, [activeTab, searchTerm, filterRating]);

  const getServiceFromListingId = (listingId: string) => {
    return mockServices.find(service => service.id === listingId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleReportReview = (reviewId: string) => {
    console.log('Report review:', reviewId);
    setOpenMenuId(null);
    // In a real app, this would open a report modal or navigate to a report page
  };

  const calculateStats = () => {
    const totalGiven = mockReviewsGiven.length;
    const totalReceived = mockReviewsReceived.length;
    const averageGiven = totalGiven > 0 ? mockReviewsGiven.reduce((sum, r) => sum + r.rating, 0) / totalGiven : 0;
    const averageReceived = totalReceived > 0 ? mockReviewsReceived.reduce((sum, r) => sum + r.rating, 0) / totalReceived : 0;
    
    return {
      totalGiven,
      totalReceived,
      averageGiven,
      averageReceived
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-gradient-to-br from-[#F8F8FA] via-[#FFFFFF] to-[#F8F8FA] min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-[#E8E9ED] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={onBack} 
              className="text-[#70727F] hover:text-[#3D1560] hover:bg-[#F8F8FA] transition-all duration-200 flex items-center mr-4 p-2 rounded-lg"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#1B1C20]">My Reviews</h1>
              <p className="text-[#70727F] text-sm mt-1">
                View feedback you've given and received
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-[#E8E9ED] p-5 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-[#1B1C20] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3D1560]" />
              Review Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#EDD9FF] to-[#F8F8FA] p-4 rounded-lg border border-[#E8E9ED] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#3D1560]">Reviews Received</span>
                  <div className="p-1.5 rounded-lg bg-[#3D1560] bg-opacity-10">
                    <Star className="w-4 h-4 text-[#3D1560]" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1B1C20] mb-1">{stats.totalReceived}</div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-[#383A47]">
                    {stats.averageReceived.toFixed(1)} avg
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#FFE5ED] to-[#F8F8FA] p-4 rounded-lg border border-[#E8E9ED] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#DF678C]">Reviews Given</span>
                  <div className="p-1.5 rounded-lg bg-[#DF678C] bg-opacity-10">
                    <Eye className="w-4 h-4 text-[#DF678C]" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1B1C20] mb-1">{stats.totalGiven}</div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium text-[#383A47]">
                    {stats.averageGiven.toFixed(1)} avg
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#F8F8FA] to-[#E8E9ED] p-4 rounded-lg border border-[#E8E9ED] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#70727F]">Total Reviews</span>
                  <div className="p-1.5 rounded-lg bg-[#70727F] bg-opacity-10">
                    <Calendar className="w-4 h-4 text-[#70727F]" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1B1C20] mb-1">{stats.totalGiven + stats.totalReceived}</div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#70727F]" />
                  <span className="text-xs font-medium text-[#383A47]">This month</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#E8F5E9] to-[#F8F8FA] p-4 rounded-lg border border-[#E8E9ED] hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#4CAF50]">Satisfaction</span>
                  <div className="p-1.5 rounded-lg bg-[#4CAF50] bg-opacity-10">
                    <TrendingUp className="w-4 h-4 text-[#4CAF50]" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1B1C20] mb-1">
                  {Math.round(((stats.averageGiven + stats.averageReceived) / 2) * 20)}%
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#4CAF50]" />
                  <span className="text-xs font-medium text-[#383A47]">Overall score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E8E9ED] mb-6 overflow-hidden">
          <div className="flex border-b border-[#E8E9ED]">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === 'received'
                  ? 'text-[#3D1560] border-b-2 border-[#3D1560] bg-gradient-to-r from-[#EDD9FF] to-[#F8F8FA]'
                  : 'text-[#70727F] hover:text-[#383A47] hover:bg-[#F8F8FA]'
              }`}
            >
              Reviews I've Received ({mockReviewsReceived.length})
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === 'given'
                  ? 'text-[#3D1560] border-b-2 border-[#3D1560] bg-gradient-to-r from-[#EDD9FF] to-[#F8F8FA]'
                  : 'text-[#70727F] hover:text-[#383A47] hover:bg-[#F8F8FA]'
              }`}
            >
              Reviews I've Given ({mockReviewsGiven.length})
            </button>
          </div>

          {/* Minimalistic Search & Filter Toolbar */}
          <div className="px-6 py-3 bg-gradient-to-r from-[#F8F8FA] to-[#FFFFFF] border-b border-[#E8E9ED]">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#70727F] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-sm border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] bg-white transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#70727F]" />
                <select
                  value={filterRating || ''}
                  onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-3 py-1.5 text-sm border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] bg-white transition-all duration-200"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg border border-[#E8E9ED] p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#EDD9FF] to-[#F8F8FA] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-12 h-12 text-[#3D1560]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1B1C20] mb-2">No Reviews Found</h3>
              <p className="text-[#70727F] max-w-md mx-auto">
                {activeTab === 'given' 
                  ? "You haven't written any reviews yet. Start by booking a service!"
                  : "You haven't received any reviews yet. Complete a booking to get your first review!"
                }
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => {
              const service = getServiceFromListingId(review.listingId);
              
              return (
                <div 
                  key={review.id} 
                  className="bg-white rounded-xl shadow-lg border border-[#E8E9ED] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-3 border-b border-[#F8F8FA]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={review.reviewerAvatar}
                            alt={review.reviewerName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-[#E8E9ED] shadow-sm"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#4CAF50] rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#1B1C20] text-sm line-clamp-1">
                            {review.reviewerName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-[#70727F] font-medium">
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative" ref={openMenuId === review.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)}
                          className="p-1 hover:bg-[#F8F8FA] rounded-full transition-colors duration-200"
                        >
                          <MoreHorizontal className="w-4 h-4 text-[#70727F]" />
                        </button>
                        {openMenuId === review.id && (
                          <div className="absolute right-0 top-7 bg-white border border-[#E8E9ED] rounded-lg shadow-lg py-1 z-10 min-w-[90px]">
                            <button
                              onClick={() => handleReportReview(review.id)}
                              className="w-full px-3 py-1.5 text-left text-xs text-[#70727F] hover:bg-[#F8F8FA] hover:text-[#3D1560] transition-colors duration-200 flex items-center gap-1.5"
                            >
                              <Flag className="w-3 h-3" />
                              Report
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Service/Listing Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#70727F] font-medium">
                        {activeTab === 'given' ? 'Service:' : 'Reviewed:'}
                      </span>
                      <span className="text-xs font-semibold text-[#3D1560] bg-[#EDD9FF] px-2 py-1 rounded-full line-clamp-1">
                        {review.listingTitle}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-5 pt-3 flex-1">
                    <h4 className="font-semibold text-[#1B1C20] text-sm mb-2 line-clamp-1">
                      {review.reviewTitle}
                    </h4>
                    <p className="text-[#383A47] text-sm leading-relaxed line-clamp-4 mb-4">
                      {review.comment}
                    </p>
                    
                    {/* Review Images */}
                    {review.images.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-3 gap-2">
                          {review.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-full h-14 object-cover rounded-lg border border-[#E8E9ED] shadow-sm hover:shadow-md transition-shadow duration-200"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-[#F8F8FA]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[#70727F]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {review.helpfulCount} helpful
                        </span>
                      </div>
                      {activeTab === 'given' && service && (
                        <button
                          onClick={() => console.log('View service', service.id)}
                          className="flex items-center gap-1.5 text-[#3D1560] hover:text-[#6D26AB] transition-colors duration-200 font-medium text-xs bg-[#F8F8FA] hover:bg-[#EDD9FF] px-3 py-1.5 rounded-full"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Service
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 