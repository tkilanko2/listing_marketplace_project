import React, { useMemo, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Camera, Filter, Calendar, CheckCircle } from 'lucide-react';
import { DetailedReview } from '../types/Review';

interface EnhancedReviewsProps {
  reviews: DetailedReview[];
  onVoteHelpful: (reviewId: string, isHelpful: boolean) => void;
}

export function EnhancedReviews({ reviews, onVoteHelpful }: EnhancedReviewsProps) {
  const [activeFilters, setActiveFilters] = useState<{
    rating: number | null;
    hasPhotos: boolean;
    isVerified: boolean;
    sortBy: 'recent' | 'helpful';
  }>({
    rating: null,
    hasPhotos: false,
    isVerified: false,
    sortBy: 'recent',
  });

  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / total;
    const ratingDistribution = Array.from({ length: 5 }, (_, i) => ({
      stars: 5 - i,
      count: reviews.filter(review => review.rating === 5 - i).length,
      percentage: (reviews.filter(review => review.rating === 5 - i).length / total) * 100,
    }));
    const photosCount = reviews.filter(review => review.images && review.images.length > 0).length;
    const verifiedCount = reviews.filter(review => review.isVerified).length;

    return {
      total,
      averageRating,
      ratingDistribution,
      photosCount,
      verifiedCount,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (activeFilters.rating) {
      filtered = filtered.filter(review => review.rating === activeFilters.rating);
    }

    if (activeFilters.hasPhotos) {
      filtered = filtered.filter(review => review.images && review.images.length > 0);
    }

    if (activeFilters.isVerified) {
      filtered = filtered.filter(review => review.isVerified);
    }

    return filtered.sort((a, b) => {
      if (activeFilters.sortBy === 'recent') {
        return b.date.getTime() - a.date.getTime();
      }
      return (b.helpfulCount - b.notHelpfulCount) - (a.helpfulCount - a.notHelpfulCount);
    });
  }, [reviews, activeFilters]);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Review Summary */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gray-900">{reviewStats.averageRating.toFixed(1)}</span>
              <div className="flex flex-col">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(reviewStats.averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 mt-1">{reviewStats.total} reviews</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{reviewStats.photosCount}</div>
              <div className="text-sm text-gray-500">With photos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{reviewStats.verifiedCount}</div>
              <div className="text-sm text-gray-500">Verified purchases</div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {reviewStats.ratingDistribution.map(({ stars, count, percentage }) => (
            <button
              key={stars}
              onClick={() => setActiveFilters(prev => ({
                ...prev,
                rating: prev.rating === stars ? null : stars,
              }))}
              className={`w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors ${
                activeFilters.rating === stars ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-1 w-24">
                <span>{stars}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-16 text-sm text-gray-500 text-right">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[#CDCED8] flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveFilters(prev => ({ ...prev, hasPhotos: !prev.hasPhotos }))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            activeFilters.hasPhotos
              ? 'border-[#3D1560] bg-[#EDD9FF] text-[#3D1560]'
              : 'border-[#CDCED8] hover:border-[#6D26AB]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>With photos</span>
        </button>
        <button
          onClick={() => setActiveFilters(prev => ({ ...prev, isVerified: !prev.isVerified }))}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            activeFilters.isVerified
              ? 'border-[#3D1560] bg-[#EDD9FF] text-[#3D1560]'
              : 'border-[#CDCED8] hover:border-[#6D26AB]'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Verified purchases</span>
        </button>
        <button
          onClick={() => setActiveFilters(prev => ({
            ...prev,
            sortBy: prev.sortBy === 'recent' ? 'helpful' : 'recent',
          }))}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#CDCED8] hover:border-[#6D26AB]"
        >
          {activeFilters.sortBy === 'recent' ? (
            <>
              <Calendar className="w-4 h-4" />
              <span>Most recent</span>
            </>
          ) : (
            <>
              <ThumbsUp className="w-4 h-4" />
              <span>Most helpful</span>
            </>
          )}
        </button>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100">
        {filteredReviews.map(review => (
          <div key={review.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{review.author}</span>
                  {review.isVerified && (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Verified purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.date.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {review.title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
            )}
            <p className="text-gray-600 mb-4">{review.content}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span>{review.date.toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => onVoteHelpful(review.id, true)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                    review.userVote === 'helpful'
                      ? 'bg-[#EDD9FF] text-[#3D1560]'
                      : 'hover:bg-[#E8E9ED] text-[#383A47]'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpfulCount}</span>
                </button>
                <button
                  onClick={() => onVoteHelpful(review.id, false)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                    review.userVote === 'not-helpful'
                      ? 'bg-[#EDD9FF] text-[#3D1560]'
                      : 'hover:bg-[#E8E9ED] text-[#383A47]'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{review.notHelpfulCount}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 