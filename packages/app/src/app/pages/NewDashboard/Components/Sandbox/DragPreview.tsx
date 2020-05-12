import React from 'react';
import { useDragLayer } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { SIDEBAR_WIDTH } from '../../Sidebar';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(initialOffset, currentOffset, isOver) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }
  const { x, y } = currentOffset;

  const size = isOver
    ? { width: 100, height: 50 }
    : { width: 200, height: 100 };

  return { x, y, ...size };
}

export const DragPreview = () => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  const isOver = currentOffset && currentOffset.x < SIDEBAR_WIDTH;

  return (
    <div style={layerStyles}>
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={getItemStyles(initialOffset, currentOffset, isOver)}
            animate={getItemStyles(initialOffset, currentOffset, isOver)}
            exit={{
              ...initialOffset,
              transition: {
                duration: 0.2,
                ease: progress => progress * progress,
              },
            }}
            style={{
              border: '1px dashed black',
              background: 'grey',
              marginBottom: '1.5rem',
            }}
          >
            {item && item.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
