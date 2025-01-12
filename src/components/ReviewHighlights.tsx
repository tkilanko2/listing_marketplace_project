import React from 'react';
import { Star, ThumbsUp, Camera } from 'lucide-react';

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  withPhotos: number;
  verifiedPurchases: number;
  helpfulVotes: number;
  topMentions: Array<{ term: string; count: number }>;
}

interface ReviewHighlightsProps {
  summary: ReviewSummary;
  onFilterClick: (filter: string) => void;
}

export function ReviewHighlights({ summary, onFilterClick }: ReviewHighlightsProps) {
  const calculatePercentage = (count: number) => {
    return ((count / summary.totalReviews) * 100).toFixed(1);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      {/* Rating Overview */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">
              {summary.averageRating.toFixed(1)}
            </span>
            <span className="text-lg text-gray-500 ml-2">out of 5</span>
          </div>
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(summary.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {summary.totalReviews} reviews
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div className="flex items-center justify-end mb-1">
            <Camera className="w-4 h-4 mr-1" />
            <span>{summary.withPhotos} with photos</span>
          </div>
          <div>
            {summary.verifiedPurchases} verified purchases
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="mt-6 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = summary.ratingDistribution[rating] || 0;
          const percentage = calculatePercentage(count);
          return (
            <button
              key={rating}
              onClick={() => onFilterClick(`rating-${rating}`)}
              className="w-full flex items-center group hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <div className="w-24 flex items-center">
                <span className="text-sm text-gray-600 mr-1">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all group-hover:bg-yellow-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-16 text-right text-sm text-gray-600">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => onFilterClick('verified')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
        >
          Verified Purchases
        </button>
        <button
          onClick={() => onFilterClick('with-photos')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
        >
          With Photos
        </button>
        <button
          onClick={() => onFilterClick('most-helpful')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
        >
          Most Helpful
        </button>
        <button
          onClick={() => onFilterClick('most-recent')}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50"
        >
          Most Recent
        </button>
      </div>

      {/* Top Mentions */}
      {summary.topMentions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Top Mentions
          </h4>
          <div className="flex flex-wrap gap-2">
            {summary.topMentions.map(({ term, count }) => (
              <button
                key={term}
                onClick={() => onFilterClick(`mention-${term}`)}
                className="px-3 py-1.5 bg-blue-50 rounded-full text-sm text-blue-700 hover:bg-blue-100"
              >
                {term} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helpful Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <ThumbsUp className="w-4 h-4 mr-2" />
          <span>
            {summary.helpfulVotes} people found these reviews helpful
          </span>
        </div>
      </div>
    </div>
  );
} 