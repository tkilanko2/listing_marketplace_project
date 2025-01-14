import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, MessageSquare } from 'lucide-react';

interface ServiceGalleryProps {
  images: string[];
  responseTime?: string;
  responseRate?: string;
}

export function ServiceGallery({ images, responseTime = "Within 2h", responseRate = "98%" }: ServiceGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
        <img
          src={images[currentImage]}
          alt="Service"
          className="w-full h-full object-contain"
          onClick={() => setShowLightbox(true)}
        />
        
        {/* Response Metrics Overlay */}
        <div className="absolute bottom-4 left-4 flex space-x-3">
          <div className="flex items-center backdrop-blur-md bg-black/30 text-white px-3 py-1.5 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-2" />
            {responseTime}
          </div>
          <div className="flex items-center backdrop-blur-md bg-black/30 text-white px-3 py-1.5 rounded-full text-sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            {responseRate}
          </div>
        </div>
        
        {images.length > 1 && (
          <>
            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100
                ${currentImage === index ? 'ring-2 ring-blue-500' : 'hover:opacity-80'}
                transition-all duration-200`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-7xl w-full">
            <img
              src={images[currentImage]}
              alt="Service"
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}