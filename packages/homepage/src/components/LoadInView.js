import React, { useEffect, useState } from 'react';
import { useInView } from 'react-hook-inview';
import { motion } from 'framer-motion';

const LoadInView = ({ children }) => {
  const [ref, inView] = useInView({ unobserveOnEnter: true });
  const [animations, setAnimations] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) setAnimations(false);
  }, []);

  if (!animations) return children;

  return (
    <div ref={ref}>
      {inView ? (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        >
          {children}
        </motion.section>
      ) : (
        <div
          css={`
            visibility: hidden;
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default LoadInView;
