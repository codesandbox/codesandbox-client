import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubNav } from './elements';

export default ({ components, name, openedNav }) => (
  <AnimatePresence initial={false}>
    {openedNav === name && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 109 }}
        exit={{ opacity: 0, height: 0 }}
        style={{
          position: 'absolute',
          width: '100%',
          background: '#151515',
          overflow: 'hidden',
          borderBottom: '1px solid #242424',
          boxShadow:
            '0, 8px, 16px rgba(0, 0, 0, 0.12), 0, 4px, 2px rgba(0, 0, 0, 0.24)',
        }}
        transition={{
          duration: 0.2,
          ease: 'easeIn',
        }}
      >
        <SubNav>
          <nav>
            <ul>
              {components.map(Component => (
                <li>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeIn',
                    }}
                  >
                    <Component />
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
        </SubNav>
      </motion.div>
    )}
  </AnimatePresence>
);
