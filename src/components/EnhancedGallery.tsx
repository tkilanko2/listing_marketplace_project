import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Grid,
  ZoomIn
} from 'lucide-react';

interface EnhancedGalleryProps {
  images: string[];
  onFullscreen?: () => void;
}

export function EnhancedGallery({ images, onFullscreen }: EnhancedGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isZoomed) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : ''
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }
              : undefined
          }
        />

        {/* Zoom Instruction */}
        {!isZoomed && (
          <div className="absolute bottom-4 left-4 flex items-center bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
            <ZoomIn className="w-4 h-4 mr-2" />
            Hover to zoom
          </div>
        )}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Photo Count */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm">
          {currentIndex + 1}/{images.length} photos
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <button
            onClick={onFullscreen}
            className="p-2 rounded-full bg-black/70 text-white hover:bg-black/80 transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {}} // Add view all photos handler
            className="flex items-center px-3 py-2 rounded-full bg-black/70 text-white hover:bg-black/80 transition-colors"
          >
            <Grid className="w-4 h-4 mr-2" />
            View all photos
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-square rounded-md overflow-hidden ${
              index === currentIndex
                ? 'ring-2 ring-blue-500'
                : 'hover:ring-2 hover:ring-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
    </div>
  );
} 