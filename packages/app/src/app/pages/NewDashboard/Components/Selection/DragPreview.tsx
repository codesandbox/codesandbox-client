import React from 'react';
import { useDragLayer } from 'react-dnd';
import { motion } from 'framer-motion';
import { Stack, Element, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { SIDEBAR_WIDTH } from '../../Sidebar';

export const DragPreview = ({
  sandboxes,
  selectedIds,
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

  const selectedSandboxes = sandboxes.filter(sandbox =>
    selectedIds.includes(sandbox.id)
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
          direction={viewMode === 'list' ? 'vertical' : 'horizontal'}
          as={motion.div}
          css={css({
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
            count: selectedSandboxes.length,
          })}
          animate={getItemStyles({
            initialOffset,
            currentOffset,
            viewMode,
            thumbnailRef,
            count: selectedSandboxes.length,
          })}
        >
          {selectedSandboxes.map((sandbox, index) => (
            <Stack gap={2} align="center" key={sandbox.id}>
              <Element
                css={css({
                  position: viewMode === 'list' ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: viewMode === 'list' ? 32 : '100%',
                  height: viewMode === 'list' ? 32 : '100%',
                  backgroundColor: 'grays.600',
                  backgroundImage: `url(${sandbox.screenshotUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: viewMode === 'list' ? 'small' : 'medium',
                  transform:
                    viewMode === 'list' ? null : `rotate(${index * 2.5}deg)`,
                })}
              />
              {viewMode === 'list' ? (
                <Text size={3} weight="medium" css={{ flexShrink: 0 }}>
                  {sandbox.title || sandbox.alias || sandbox.id}
                </Text>
              ) : null}
            </Stack>
          ))}
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
  count = 1,
}) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  const { x, y } = currentOffset;

  let size: { width: number | string; height: number | string };

  // overlapping with sidebar
  const isOver = currentOffset && currentOffset.x < SIDEBAR_WIDTH;
  let backgroundColor = viewMode === 'list' ? 'rgba(36,36,36,1)' : null; // grays.600

  if (isOver) {
    if (viewMode === 'list') {
      backgroundColor = 'rgba(36,36,36,0.8)'; // grays.600 with 50% opacity
    } else {
      size = { width: 100, height: 50 };
    }
  } else if (viewMode === 'list') {
    size = { width: 'auto', height: 'fit-content' };
  } else {
    const thumbnailElement = thumbnailRef.current;
    const thumbnailRect = thumbnailElement.getBoundingClientRect();
    size = { width: thumbnailRect.width, height: thumbnailRect.height };
  }

  return { x, y, backgroundColor, ...size };
}
