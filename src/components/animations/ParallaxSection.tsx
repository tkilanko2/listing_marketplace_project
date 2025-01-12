import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxSection({ 
  children, 
  offset = 50,
  className = '' 
}: ParallaxSectionProps) {
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // This will smoothly animate the Y position based on scroll
  const y = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    [-offset, offset]
  );

  useEffect(() => {
    if (!ref) return;
    
    const setValues = () => {
      setElementTop(ref.offsetTop);
      setClientHeight(window.innerHeight);
    };

    setValues();
    window.addEventListener('resize', setValues);
    window.addEventListener('scroll', setValues);

    return () => {
      window.removeEventListener('resize', setValues);
      window.removeEventListener('scroll', setValues);
    };
  }, [ref]);

  if (!isClient) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={setRef} className={`relative ${className}`}>
      <motion.div style={{ y }} initial={{ y: 0 }}>
        {children}
      </motion.div>
    </div>
  );
} 