import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, User, Calendar, MessageCircle, ExternalLink, Filter, Search } from 'lucide-react';
import { Review } from '../types/Review';
import { mockServices } from '../mockData';

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
    criterias: [
      { name: 'Communication', rating: 5.0 },
      { name: 'Professionalism', rating: 5.0 },
      { name: 'Value for Money', rating: 4.5 }
    ],
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
    criterias: [
      { name: 'Communication', rating: 4.0 },
      { name: 'Quality', rating: 4.5 },
      { name: 'Punctuality', rating: 4.0 }
    ],
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
    criterias: [
      { name: 'Communication', rating: 5.0 },
      { name: 'Punctuality', rating: 5.0 },
      { name: 'Cooperation', rating: 4.5 }
    ],
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulCount: 5,
    notHelpfulCount: 0,
    images: []
  }
];

export function MyReviewsPage({ onBack }: MyReviewsPageProps) {
  const [activeTab, setActiveTab] = useState<'given' | 'received'>('given');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);

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
            className={`w-4 h-4 ${
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

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#E8E9ED]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#70727F] hover:text-[#3D1560] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-[#1B1C20]">My Reviews</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] mb-6">
          <div className="flex border-b border-[#E8E9ED]">
            <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'given'
                  ? 'text-[#3D1560] border-b-2 border-[#3D1560] bg-[#EDD9FF]'
                  : 'text-[#70727F] hover:text-[#383A47]'
              }`}
            >
              Reviews I've Given ({mockReviewsGiven.length})
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'received'
                  ? 'text-[#3D1560] border-b-2 border-[#3D1560] bg-[#EDD9FF]'
                  : 'text-[#70727F] hover:text-[#383A47]'
              }`}
            >
              Reviews I've Received ({mockReviewsReceived.length})
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-[#E8E9ED]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#70727F] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#70727F]" />
                <select
                  value={filterRating || ''}
                  onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-4 py-2 border border-[#CDCED8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560]"
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

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-8 text-center">
              <MessageCircle className="w-16 h-16 text-[#CDCED8] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#383A47] mb-2">No reviews found</h3>
              <p className="text-[#70727F]">
                {activeTab === 'given' 
                  ? "You haven't given any reviews yet. Complete a service to leave your first review!"
                  : "You haven't received any reviews yet. Provide excellent service to earn your first review!"
                }
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => {
              const service = getServiceFromListingId(review.listingId);
              
              return (
                <div key={review.id} className="bg-white rounded-lg shadow-sm border border-[#E8E9ED] p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={review.reviewerAvatar}
                      alt={review.reviewerName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#E8E9ED]"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[#1B1C20]">{review.reviewTitle}</h3>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-[#70727F]">{formatDate(review.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-[#70727F]">
                          {activeTab === 'given' ? 'Service:' : 'Reviewed by:'}
                        </span>
                        <span className="text-sm font-medium text-[#383A47]">{review.listingTitle}</span>
                      </div>
                      
                      <p className="text-[#383A47] mb-4 leading-relaxed">{review.comment}</p>
                      
                      {/* Criteria Ratings */}
                      {review.criterias.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#1B1C20] mb-2">Detailed Ratings:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {review.criterias.map((criteria, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-[#70727F]">{criteria.name}</span>
                                <span className="text-sm font-medium text-[#383A47]">{criteria.rating}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Review Images */}
                      {review.images.length > 0 && (
                        <div className="mb-4">
                          <div className="flex gap-2">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-[#E8E9ED]"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#70727F]">
                          {review.helpfulCount} people found this helpful
                        </span>
                        {activeTab === 'given' && service && (
                          <button
                            onClick={() => console.log('View service', service.id)}
                            className="flex items-center gap-1 text-[#3D1560] hover:text-[#6D26AB] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Service
                          </button>
                        )}
                      </div>
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