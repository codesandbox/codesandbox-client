import React from 'react';
import { css } from '@styled-system/css';
import { Element, ThemeProvider } from '@codesandbox/components';
import { motion, AnimatePresence } from 'framer-motion';

export const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <Element
          css={css({
            boxSizing: 'border-box',
            backgroundColor: '#1D1D1D',
            borderRadius: '4px',
            overflow: 'hidden',
            margin: 'auto',
            padding: '24px',
            width: '100%',

            // With tokens
            boxShadow: '2',
          })}
        >
          {children}
        </Element>
      </motion.div>
    </AnimatePresence>
  </ThemeProvider>
);
