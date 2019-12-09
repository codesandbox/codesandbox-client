import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SubNav } from './elements';

export default ({ components, name, openedNav, hasOpened }) => {
  const [hovered, setHovered] = useState(null);
  const variants = {
    normal: { scale: 1 },
    hover: { scale: 1.2 },
  };

  return (
    openedNav === name && (
      <SubNav>
        <nav>
          <ul>
            {components.map((Component, i) => {
              const { Icon, Label } = Component;
              return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i}>
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: hasOpened ? 1 : 0,
                    }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: hasOpened ? 0 : (i + 1) * 0.05,
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
    )
  );
};
