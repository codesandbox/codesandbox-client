import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubNav } from './elements';

export default ({ children, name, openedNav }) => (
  <AnimatePresence>
    {openedNav === name && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeIn',
        }}
      >
        <SubNav>
          <ul>{children}</ul>
        </SubNav>
      </motion.div>
    )}
  </AnimatePresence>
);
