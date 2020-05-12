import React from 'react';
import { useDragLayer } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { SIDEBAR_WIDTH } from '../../Sidebar';

function getItemStyles(initialOffset, currentOffset, thumbnailRef) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  const { x, y } = currentOffset;
  const isOver = currentOffset && currentOffset.x < SIDEBAR_WIDTH;

  const thumbnailElement = thumbnailRef.current;
  const thumbnailRect = thumbnailElement.getBoundingClientRect();

  const size = isOver
    ? { width: 100, height: 50 }
    : {
        width: thumbnailRect.width,
        height: thumbnailRect.height,
      };

  return { x, y, ...size };
}

export const DragPreview = ({ sandbox, thumbnailRef }) => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer(
    monitor => ({
      isDragging: monitor.isDragging(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    })
  );

  return (
    <Stack
      css={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={getItemStyles(initialOffset, currentOffset, thumbnailRef)}
            animate={getItemStyles(initialOffset, currentOffset, thumbnailRef)}
            exit={{
              ...initialOffset,
              transition: {
                duration: 0.2,
                ease: progress => progress * progress,
              },
            }}
          >
            <Stack
              css={css({
                width: '100%',
                height: '100%',
                backgroundColor: 'grays.600',
                backgroundImage: `url(${sandbox.screenshotUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 'medium',
                boxShadow: 2,
              })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};
