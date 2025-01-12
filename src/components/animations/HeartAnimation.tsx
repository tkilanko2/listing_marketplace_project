import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartAnimationProps {
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export function HeartAnimation({ isActive, onClick, className = '' }: HeartAnimationProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className={`relative ${className}`}
    >
      <motion.div
        initial={false}
        animate={isActive ? {
          scale: [1, 1.2, 1],
          transition: { duration: 0.3 }
        } : {}}
      >
        <Heart
          className={`w-6 h-6 transition-colors ${
            isActive
              ? 'fill-current text-red-500'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        />
      </motion.div>
      {isActive && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: 1.5,
            opacity: 0,
            transition: { duration: 0.4 }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Heart className="w-6 h-6 text-red-500 fill-current" />
        </motion.div>
      )}
    </motion.button>
  );
} 