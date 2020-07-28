import React from 'react';
import { useDragLayer } from 'react-dnd';
import { motion } from 'framer-motion';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { SIDEBAR_WIDTH } from '../../Sidebar/constants';

export const DragPreview = ({ name, viewMode, thumbnailRef }) => {
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
        >
          <Stack
            justify="center"
            align="center"
            css={css({
              width: viewMode === 'list' ? 32 : '100%',
              height: viewMode === 'list' ? 32 : '100%',
              backgroundColor: 'grays.600',
              borderRadius: viewMode === 'list' ? 'small' : 'medium',
            })}
          >
            <svg
              width="100%"
              height={viewMode === 'list' ? 24 : '33%'}
              fill="none"
              viewBox="0 0 56 49"
            >
              <path
                fill="#6CC7F6"
                d="M20.721 0H1.591A1.59 1.59 0 000 1.59v45.82C0 48.287.712 49 1.59 49h52.82A1.59 1.59 0 0056 47.41V7.607a1.59 1.59 0 00-1.59-1.59H28L21.788.41A1.59 1.59 0 0020.72 0z"
              />
            </svg>
          </Stack>
          {viewMode === 'list' ? (
            <Text size={3} weight="medium" css={{ flexShrink: 0 }}>
              {name}
            </Text>
          ) : null}
        </Stack>
      )}
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

  let size: { width: number | string; height: number };
  const thumbnailElement = thumbnailRef.current;

  if (viewMode === 'list') {
    size = { width: 'auto', height: 32 + 16 };
  } else if (isOver) {
    size = { width: 100, height: 50 };
  } else if (thumbnailElement) {
    const thumbnailRect = thumbnailElement.getBoundingClientRect();
    size = { width: thumbnailRect.width, height: thumbnailRect.height };
  }

  return { x, y, ...size };
}
