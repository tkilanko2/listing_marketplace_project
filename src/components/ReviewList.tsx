import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Check, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: Date;
  title?: string;
  content: string;
  isVerified: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  images?: string[];
  userVote?: 'helpful' | 'not-helpful';
}

interface ReviewListProps {
  reviews: Review[];
  activeFilters: string[];
  onVoteHelpful: (reviewId: string, isHelpful: boolean) => void;
}

export function ReviewList({ reviews, activeFilters, onVoteHelpful }: ReviewListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [expandedImageSets, setExpandedImageSets] = useState<Set<string>>(new Set());

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const toggleImageSetExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedImageSets);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedImageSets(newExpanded);
  };

  return (
    <div className="space-y-8">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const isImageSetExpanded = expandedImageSets.has(review.id);
        const hasImages = review.images && review.images.length > 0;

        return (
          <div key={review.id} className="border-b border-gray-200 pb-8">
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.isVerified && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                {review.title && (
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    {review.title}
                  </h3>
                )}
                <p className="mt-1 text-sm text-gray-600">
                  By {review.author} on {review.date.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div className="mt-4">
              <div className={`prose prose-sm max-w-none ${
                !isExpanded && review.content.length > 300 ? 'line-clamp-3' : ''
              }`}>
                <p className="text-gray-800">{review.content}</p>
              </div>
              {review.content.length > 300 && (
                <button
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  {isExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Read more
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Review Images */}
            {hasImages && (
              <div className="mt-4">
                <button
                  onClick={() => toggleImageSetExpansion(review.id)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 mb-2"
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  {review.images!.length} Photos
                  {isImageSetExpanded ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
                {isImageSetExpanded && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {review.images!.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Review Actions */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onVoteHelpful(review.id, true)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    review.userVote === 'helpful'
                      ? 'bg-green-50 text-green-700'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{review.helpfulCount}</span>
                </button>
                <button
                  onClick={() => onVoteHelpful(review.id, false)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    review.userVote === 'not-helpful'
                      ? 'bg-red-50 text-red-700'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">{review.notHelpfulCount}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 