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
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      <div 
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="min-w-full h-full relative"
            style={{ backgroundColor: banner.backgroundColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
              <div className="flex flex-col md:flex-row items-center justify-between h-full py-8 md:py-0">
                <div className="text-center md:text-left md:flex md:items-center md:space-x-12 z-10">
                  <div>
                    <h3 className="text-white font-semibold text-2xl md:text-3xl mb-2 md:mb-4">{banner.title}</h3>
                    <p className="text-white/90 text-lg md:text-xl mb-4 md:mb-0">{banner.subtitle}</p>
                  </div>
                  <a
                    href={banner.actionUrl}
                    className="inline-block px-6 md:px-8 py-2 md:py-3 bg-white rounded-full text-base md:text-lg font-medium hover:bg-opacity-90 transition-all duration-200 hover:scale-105 shadow-sm"
                    style={{ color: banner.backgroundColor }}
                  >
                    {banner.actionLabel}
                  </a>
                </div>
                <div className="hidden md:block h-full w-[400px] relative overflow-hidden">
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
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex === index 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
} 