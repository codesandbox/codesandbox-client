import React from 'react';
import { useDragLayer } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Stack, Element, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { SIDEBAR_WIDTH } from '../../Sidebar';

export const DragPreview = ({
  sandbox,
  sandboxTitle,
  viewMode,
  thumbnailRef,
}) => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer(
    monitor => ({
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
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
          <Stack
            gap={2}
            align="center"
            as={motion.div}
            css={css({
              backgroundColor: viewMode === 'list' ? 'grays.600' : 'none',
              border: viewMode === 'list' ? '1px solid' : 'none',
              borderColor: 'grays.700',
              padding: viewMode === 'list' ? 2 : 0,
              borderRadius: 'medium',
              boxShadow: 2,
            })}
            initial={getItemStyles({
              initialOffset,
              currentOffset,
              viewMode,
              thumbnailRef,
            })}
            animate={getItemStyles({
              initialOffset,
              currentOffset,
              viewMode,
              thumbnailRef,
            })}
            exit={{
              ...initialOffset,
              transition: {
                duration: 0.2,
                ease: progress => progress * progress,
              },
            }}
          >
            <Element
              css={css({
                width: viewMode === 'list' ? 32 : '100%',
                height: viewMode === 'list' ? 32 : '100%',
                backgroundColor: 'grays.600',
                backgroundImage: `url(${sandbox.screenshotUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                borderRadius: viewMode === 'list' ? 'small' : 'medium',
              })}
            />
            {viewMode === 'list' ? (
              <Text size={3} weight="medium" css={{ flexShrink: 0 }}>
                {sandboxTitle}
              </Text>
            ) : null}
          </Stack>
        )}
      </AnimatePresence>
    </Stack>
  );
};

function getItemStyles({
  initialOffset,
  currentOffset,
  viewMode,
  thumbnailRef,
}) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  const { x, y } = currentOffset;
  const isOver = currentOffset && currentOffset.x < SIDEBAR_WIDTH;

  let size: { width: number; height: number };

  if (viewMode === 'list') {
    size = { width: 'auto', height: 32 + 16 };
  } else if (isOver) {
    size = { width: 100, height: 50 };
  } else {
    const thumbnailElement = thumbnailRef.current;
    const thumbnailRect = thumbnailElement.getBoundingClientRect();
    size = { width: thumbnailRect.width, height: thumbnailRect.height };
  }

  return { x, y, ...size };
}
