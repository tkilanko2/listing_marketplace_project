import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  actionLabel: string;
  actionUrl: string;
  backgroundColor: string;
}

interface BannerSliderProps {
  banners: Banner[];
  autoSlideInterval?: number;
}

export function BannerSlider({ banners, autoSlideInterval = 5000 }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoSlideInterval);

    return () => clearInterval(intervalId);
  }, [banners.length, autoSlideInterval]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative h-[240px] overflow-hidden rounded-lg shadow-md">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="w-full h-full flex-shrink-0 relative"
            style={{ backgroundColor: banner.backgroundColor }}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-12">
                  <div>
                    <h3 className="text-white font-semibold text-3xl mb-4">{banner.title}</h3>
                    <p className="text-white/90 text-xl">{banner.subtitle}</p>
                  </div>
                  <a
                    href={banner.actionUrl}
                    className="px-8 py-3 bg-white rounded-full text-lg font-medium hover:bg-opacity-90 transition-all duration-200 hover:scale-105 shadow-sm"
                    style={{ color: banner.backgroundColor }}
                  >
                    {banner.actionLabel}
                  </a>
                </div>
                <div className="h-full w-[400px] relative overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 