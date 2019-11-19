import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubNav } from './elements';

export default ({ components, name, openedNav }) => {
  const [hovered, setHovered] = useState(null);

  const variants = {
    normal: { scale: 1 },
    hover: { scale: 1.2 },
  };
  return (
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
            zIndex: 99,
            boxShadow:
              '0, 8px, 1rem rgba(0, 0, 0, 0.12), 0, 4px, 2px rgba(0, 0, 0, 0.24)',
          }}
          transition={{
            duration: 0.2,
            ease: 'easeIn',
          }}
        >
          <SubNav>
            <nav>
              <ul>
                {components.map((Component, i) => {
                  const { Icon, Label } = Component;
                  return (
                    <li>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: (i + 1) * 0.05,
                          duration: 0.25,
                          type: 'spring',
                        }}
                      >
                        <motion.div
                          animate={hovered === i ? 'hover' : 'normal'}
                          variants={variants}
                        >
                          <div
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <Icon />
                          </div>
                        </motion.div>
                        <div
                          onMouseEnter={() => setHovered(i)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          <Label />
                        </div>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SubNav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
