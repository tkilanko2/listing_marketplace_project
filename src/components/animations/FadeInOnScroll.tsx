import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeInOnScroll({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '' 
}: FadeInOnScrollProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 0 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 