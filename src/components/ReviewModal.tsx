import React, { useState } from 'react';
import { X, Star, Upload, Trash2 } from 'lucide-react';

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    rating: number;
    reviewTitle: string;
    review: string;
    images: File[];
  }) => void;
  reviewType: 'provider' | 'customer';
  revieweeName: string;
  serviceName?: string;
  bookingId: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  reviewType,
  revieweeName,
  serviceName,
  bookingId
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = clickX < starWidth / 2;
    
    const newRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setRating(newRating);
  };

  const handleStarHover = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = hoverX < starWidth / 2;
    
    const newHoveredRating = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
    setHoveredRating(newHoveredRating);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).filter(file => 
        file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
      );
      setImages(prev => [...prev, ...newImages].slice(0, 3)); // Max 3 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        reviewTitle: reviewTitle.trim(),
        review: review.trim(),
        images
      });
      
      // Reset form
      setRating(0);
      setReviewTitle('');
      setReview('');
      setImages([]);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewTitle('');
    setReview('');
    setImages([]);
    onClose();
  };

  const getRatingText = (rating: number) => {
    if (rating === 0) return '';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  };

  const getStarFill = (starIndex: number, currentRating: number) => {
    const starValue = starIndex + 1;
    if (currentRating >= starValue) {
      return 'full'; // Full star
    } else if (currentRating >= starValue - 0.5) {
      return 'half'; // Half star
    }
    return 'empty'; // Empty star
  };

  const getPlaceholderText = () => {
    if (reviewType === 'provider') {
      return 'Share your experience with this service provider. How was the quality of work, communication, and professionalism?';
    } else {
      return 'Share your experience working with this customer. How was their communication, punctuality, and overall collaboration?';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FFFFFF] rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform-gpu"
           style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
        {/* Header */}
        <div className="bg-[#3D1560] text-white p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {reviewType === 'provider' ? `Review ${revieweeName}` : `Review Customer`}
          </h3>
          <button 
            onClick={handleClose}
            className="text-white hover:text-[#CDCED8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Context */}
          <div className="bg-[#F8F8FA] p-4 rounded-lg border border-[#E8E9ED]">
            <h4 className="font-semibold text-[#1B1C20] mb-2">Booking Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[#70727F]">Booking ID:</span>
                <span className="text-[#383A47] font-medium">#{bookingId}</span>
              </div>
              {serviceName && (
                <div className="flex justify-between">
                  <span className="text-[#70727F]">Service:</span>
                  <span className="text-[#383A47] font-medium">{serviceName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#70727F]">{reviewType === 'provider' ? 'Provider:' : 'Customer:'}</span>
                <span className="text-[#383A47] font-medium">{revieweeName}</span>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div>
            <label className="block text-sm font-semibold text-[#1B1C20] mb-3">
              Rate your experience *
            </label>
                         <div className="flex items-center gap-1 mb-2" style={{ minHeight: '32px' }}>
               {[0, 1, 2, 3, 4].map((starIndex) => {
                 const currentRating = hoveredRating || rating;
                 const fillType = getStarFill(starIndex, currentRating);
                 
                 return (
                   <button
                     key={starIndex}
                     type="button"
                     onClick={(e) => handleStarClick(starIndex, e)}
                     onMouseMove={(e) => handleStarHover(starIndex, e)}
                     onMouseLeave={() => setHoveredRating(0)}
                     className="relative transition-none duration-0 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:ring-opacity-50 rounded"
                   >
                     {fillType === 'half' ? (
                       <div className="relative w-8 h-8">
                         {/* Background empty star */}
                         <Star className="absolute inset-0 w-8 h-8 text-[#CDCED8]" />
                         {/* Half-filled star using clip path */}
                         <div className="absolute inset-0 w-4 h-8 overflow-hidden">
                           <Star className="w-8 h-8 text-[#FFC107] fill-current" />
                         </div>
                       </div>
                     ) : (
                       <Star
                         className={`w-8 h-8 ${
                           fillType === 'full'
                             ? 'text-[#FFC107] fill-current'
                             : 'text-[#CDCED8]'
                         }`}
                       />
                     )}
                   </button>
                 );
               })}
            </div>
                         <div className="min-h-[1.25rem] mb-2">
               {(hoveredRating || rating) > 0 && (
                 <p className="text-sm text-[#3D1560] font-medium">
                   {(hoveredRating || rating).toFixed(1)} - {getRatingText(hoveredRating || rating)}
                 </p>
               )}
             </div>
          </div>

          {/* Review Title Section */}
          <div>
            <label className="block text-sm font-semibold text-[#1B1C20] mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Summarize your experience in a few words..."
              maxLength={100}
              className="w-full border border-[#CDCED8] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] text-sm"
            />
            <p className="text-xs text-[#70727F] mt-1">
              {reviewTitle.length}/100
            </p>
          </div>

          {/* Written Review Section */}
          <div>
            <label className="block text-sm font-semibold text-[#1B1C20] mb-2">
              Write a review
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={getPlaceholderText()}
              rows={6}
              maxLength={1000}
              className="w-full border border-[#CDCED8] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#3D1560] focus:border-[#3D1560] resize-none text-sm leading-relaxed"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-[#70727F]">
                Share specific details to help others make informed decisions
              </p>
              <p className="text-xs text-[#70727F]">
                {review.length}/1000
              </p>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-[#1B1C20] mb-2">
              Add photos (optional)
            </label>
            <p className="text-xs text-[#70727F] mb-3">
              Upload up to 3 photos to showcase your experience
            </p>
            
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-[#E8E9ED]"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-[#DF678C] text-white rounded-full p-1 hover:bg-[#C5587A] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 3 && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#CDCED8] rounded-lg p-4 text-center hover:border-[#3D1560] hover:bg-[#F8F8FA] transition-colors">
                  <Upload className="w-8 h-8 text-[#70727F] mx-auto mb-2" />
                  <p className="text-sm text-[#70727F]">
                    Click to upload images
                  </p>
                  <p className="text-xs text-[#CDCED8] mt-1">
                    PNG, JPG up to 5MB each
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#E8E9ED]">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-[#CDCED8] text-[#70727F] rounded-lg hover:bg-[#F8F8FA] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-4 py-3 bg-[#3D1560] text-white rounded-lg hover:bg-[#6D26AB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 