import React from 'react';
import { useDragLayer } from 'react-dnd';
import { motion } from 'framer-motion';
import { Stack, Text, Icon, Element } from '@codesandbox/components';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import css from '@styled-system/css';
import { SIDEBAR_WIDTH } from '../../Sidebar/constants';
import { getTemplateIcon } from '../Sandbox/TemplateIcon';
import {
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
} from '../../types';
import { Position } from '.';

interface DragPreviewProps {
  sandboxes: Array<DashboardSandbox | DashboardTemplate>;
  folders: Array<DashboardFolder>;
  selectionItems: string[];
  selectedIds: string[];
  viewMode: 'list' | 'grid';
  thumbnailRef: React.RefObject<HTMLDivElement>;
  setDragging: (value: boolean) => void;
}

const ROTATION_DEGREE = 5;
/**
 * Find an even rotation that distributes the cards nicely
 */
function getRotation(i: number, length: number) {
  return (i - Math.floor(length / 2)) * ROTATION_DEGREE;
}

export const DragPreview: React.FC<DragPreviewProps> = React.memo(
  ({
    sandboxes,
    folders,
    selectionItems,
    selectedIds,
    viewMode,
    thumbnailRef,
    setDragging,
  }) => {
    const { isDragging, initialOffset, currentOffset } = useDragLayer(
      monitor => ({
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
      })
    );

    setDragging(isDragging);
    React.useEffect(() => {
      // if (isDragging) debugger;
    }, [isDragging]);

    // can be a sandbox or folder
    const selectedItems = React.useMemo(
      () =>
        selectionItems
          .filter(id => selectedIds.includes(id))
          .map(id => {
            if (id.startsWith('/')) {
              const folder = folders.find(f => f.path === id);
              return {
                type: 'folder',
                title: folder.name,
                path: folder.path,
              };
            }

            const dashboardEntry = sandboxes.find(s => s.sandbox.id === id);
            if (!dashboardEntry?.sandbox) {
              return null;
            }

            const sandbox = dashboardEntry.sandbox;

            let screenshotUrl = sandbox.screenshotUrl;
            // We set a fallback thumbnail in the API which is used for
            // both old and new dashboard, we can move this logic to the
            // backend when we deprecate the old dashboard
            if (
              screenshotUrl === 'https://codesandbox.io/static/img/banner.png'
            ) {
              screenshotUrl = '/static/img/default-sandbox-thumbnail.png';
            }

            const TemplateIcon = getTemplateIcon(sandbox);

            return {
              type: 'sandbox',
              id: sandbox.id,
              title: getSandboxName(sandbox),
              url: screenshotUrl,
              Icon: TemplateIcon,
            };
          })
          .filter(Boolean)
          .slice(0, 4),
      [folders, sandboxes, selectedIds, selectionItems]
    );

    const mousePosition = useMousePosition();

    const thumbnailElement = thumbnailRef.current;
    const thumbnailSize = React.useMemo(() => {
      if (!thumbnailElement) {
        return { width: 318, height: 154 };
      }

      const thumbnailRect = thumbnailElement.getBoundingClientRect();
      return { width: thumbnailRect.width, height: thumbnailRect.height };
    }, [thumbnailElement]);

    const animatedStyles = React.useMemo(
      () =>
        getItemStyles({
          initialOffset,
          currentOffset,
          viewMode,
          thumbnailSize,
          mousePosition,
        }),
      [initialOffset, currentOffset, viewMode, thumbnailSize, mousePosition]
    );

    return (
      <Stack
        css={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 100,
          left: 0,
          top: 0,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {isDragging && (
          <Stack
            gap={2}
            direction={viewMode === 'list' ? 'vertical' : 'horizontal'}
            as={motion.div}
            css={css({
              position: 'absolute',
              border: viewMode === 'list' ? '1px solid' : 'none',
              borderColor: 'grays.700',
              padding: viewMode === 'list' ? 2 : 0,
              borderRadius: 'medium',
              boxShadow: 2,
            })}
            initial={animatedStyles}
            animate={animatedStyles}
            transition={{
              type: 'spring',
              damping: 100,
              stiffness: 1000,
            }}
          >
            {selectedIds.length > 1 ? (
              <Element
                css={css({
                  position: 'fixed',
                  top: '-1rem',
                  right: '-1rem',
                  zIndex: 20,
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  backgroundColor: 'blues.600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                })}
              >
                {selectedIds.length}
              </Element>
            ) : null}
            {selectedItems.map((item, index) => (
              <Stack gap={2} align="center" key={item.id || item.path}>
                <Stack
                  justify="center"
                  align="center"
                  style={{
                    transform:
                      viewMode === 'list'
                        ? null
                        : `rotate(${getRotation(
                            index,
                            selectedItems.length
                          )}deg)`,
                    opacity: item.url ? 0.5 : 1,
                    backgroundImage: item.url ? `url(${item.url})` : null,
                  }}
                  css={css({
                    position: viewMode === 'list' ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    width: viewMode === 'list' ? 32 : '100%',
                    height: viewMode === 'list' ? 32 : '100%',
                    backgroundColor: 'grays.600',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: viewMode === 'list' ? 'small' : 'medium',
                    boxShadow: '0 3px 3px rgba(0, 0, 0, 0.3)',
                    border:
                      viewMode === 'list'
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.1)',
                  })}
                >
                  {item.type === 'folder' ? (
                    <Icon name="folder" size={32} color="#E3FF73" />
                  ) : null}
                  {item.type === 'sandbox' && !item.url ? (
                    <Stack
                      css={{ svg: { filter: 'grayscale(1)', opacity: 0.1 } }}
                    >
                      <item.Icon
                        width={viewMode === 'list' ? '16' : '60'}
                        height={viewMode === 'list' ? '16' : '60'}
                      />
                    </Stack>
                  ) : null}
                </Stack>

                {viewMode === 'list' ? (
                  <Text size={3} weight="medium" css={{ flexShrink: 0 }}>
                    {item.title}
                  </Text>
                ) : null}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    );
  }
);

function getItemStyles({
  initialOffset,
  currentOffset,
  viewMode,
  thumbnailSize,
  mousePosition,
}) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  let { x, y } = currentOffset;

  let size: {
    width: number | string;
    height: number | string;
    minWidth?: number;
  };

  // overlapping with sidebar
  const isOver = currentOffset && currentOffset.x < SIDEBAR_WIDTH;
  let backgroundColor = viewMode === 'list' ? 'rgba(36,36,36,1)' : null; // grays.600

  if (isOver) {
    if (viewMode === 'list') {
      backgroundColor = 'rgba(36,36,36,0.8)'; // grays.600 with 50% opacity
      size = { width: 'auto', minWidth: 320, height: 'fit-content' };
    } else {
      size = { width: 100, height: 50 };
    }
    x = mousePosition.x;
    y = mousePosition.y;
  } else if (viewMode === 'list') {
    size = { width: 'auto', minWidth: 320, height: 'fit-content' };
  } else {
    size = thumbnailSize;
  }

  return {
    x,
    y,
    backgroundColor,
    width: size.width,
    height: size.height,
    minWidth: size.minWidth,
  };
}

const useMousePosition = () => {
  const [position, setPosition] = React.useState<Position>({
    x: null,
    y: null,
  });

  React.useEffect(() => {
    const handler = event =>
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });

    document.addEventListener('dragover', handler);
    return () => document.removeEventListener('dragover', handler);
  }, []);

  return position;
};
