import React from 'react';
import { Element, ThemeProvider } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { motion, AnimatePresence } from 'framer-motion';

export const Wrapper = ({
  children,
  oneCol,
}: {
  children: React.ReactNode;
  oneCol?: boolean;
}) => (
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
            boxSixing: 'border-box',

            color: '#D6D6D6',
            textAlign: 'center',

            overflow: 'hidden',
            margin: 'auto',
            paddingY: 4,

            '@media screen and (min-width: 768px)': {
              // height: 400,
              width: 600,
              maxWidth: '80vw',
            },
          })}
        >
          {children}
        </Element>
      </motion.div>
    </AnimatePresence>
  </ThemeProvider>
);
