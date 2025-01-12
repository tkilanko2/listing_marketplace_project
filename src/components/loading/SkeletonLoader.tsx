import React from 'react';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function SkeletonLoader({
  width,
  height,
  className = '',
  variant = 'rectangular'
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <SkeletonLoader height={200} className="w-full mb-4" />
      <SkeletonLoader width={200} height={24} variant="text" className="mb-2" />
      <SkeletonLoader width={100} height={20} variant="text" className="mb-4" />
      <div className="flex justify-between items-center">
        <SkeletonLoader width={80} height={24} variant="text" />
        <SkeletonLoader width={40} height={40} variant="circular" />
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-4">
        <SkeletonLoader width={40} height={40} variant="circular" />
        <div className="space-y-2">
          <SkeletonLoader width={120} height={20} variant="text" />
          <SkeletonLoader width={80} height={16} variant="text" />
        </div>
      </div>
      <SkeletonLoader width="100%" height={16} variant="text" className="mb-2" />
      <SkeletonLoader width="90%" height={16} variant="text" className="mb-2" />
      <SkeletonLoader width="95%" height={16} variant="text" />
    </div>
  );
} 