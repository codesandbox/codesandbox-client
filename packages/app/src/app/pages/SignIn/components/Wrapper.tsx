import React from 'react';
import { Element, ThemeProvider } from '@codesandbox/components';
import { css } from '@styled-system/css';
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
            backgroundColor: '#1D1D1D',

            boxSizing: 'border-box',
            boxShadow: '2',
            borderRadius: '4px',

            color: '#D6D6D6',

            overflow: 'hidden',
            margin: 'auto',
          })}
        >
          {children}
        </Element>
      </motion.div>
    </AnimatePresence>
  </ThemeProvider>
);
