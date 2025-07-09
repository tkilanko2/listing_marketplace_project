import React, { useRef, useState, useEffect } from 'react';
import { Clock, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Service } from '../types';

interface ServiceListProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
}

export function ServiceList({ services, selectedService, onServiceSelect }: ServiceListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const updateArrowVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    updateArrowVisibility();
    const handleResize = () => updateArrowVisibility();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [services]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 208; // Width of one service card (192px) plus gap (16px)
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#CDCED8] rounded-full p-1.5 shadow-md hover:border-[#6D26AB] hover:bg-[#F8F8FA] transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-[#3D1560]" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#CDCED8] rounded-full p-1.5 shadow-md hover:border-[#6D26AB] hover:bg-[#F8F8FA] transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-[#3D1560]" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onScroll={updateArrowVisibility}
      >
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex-shrink-0 w-48 rounded-lg border cursor-pointer transition-all
              ${
                selectedService?.id === service.id
                  ? 'border-[#3D1560] bg-[#EDD9FF]'
                  : 'border-[#CDCED8] hover:border-[#6D26AB]'
              }`}
            onClick={() => onServiceSelect(service)}
          >
            <div className="p-3 flex flex-col h-full">
              <h3 className="font-semibold text-base text-[#1B1C20] mb-2">{service.name}</h3>
              <p className="text-[#70727F] text-xs line-clamp-2 mb-3 flex-grow">{service.description}</p>
              
              <div className="flex items-center justify-between text-xs mt-auto">
                <div className="flex items-center text-[#70727F]">
                  <Clock className="w-3 h-3 mr-1 text-[#3D1560]" />
                  <span>{service.duration} min</span>
                </div>
                <div className="flex items-center text-[#70727F]">
                  <DollarSign className="w-3 h-3 mr-1 text-[#3D1560]" />
                  <span>${service.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}