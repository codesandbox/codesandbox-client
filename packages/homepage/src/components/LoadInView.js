import React from 'react';
import { useInView } from 'react-hook-inview';
import { motion } from 'framer-motion';

const LoadInView = ({ children }) => {
  const [ref, inView] = useInView({ unobserveOnEnter: true });
  return (
    <div ref={ref}>
      {inView && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
          css={`
            margin-bottom: 8rem;
          `}
        >
          {children}
        </motion.section>
      )}
    </div>
  );
};

export default LoadInView;
