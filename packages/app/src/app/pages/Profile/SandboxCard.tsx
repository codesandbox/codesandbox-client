import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useOvermind } from 'app/overmind';
import {
  Stack,
  Text,
  Stats,
  IconButton,
  SkeletonText,
  isMenuClicked as isTargetInMenu,
} from '@codesandbox/components';
import designLanguage from '@codesandbox/components/lib/design-language/theme';
import css from '@styled-system/css';
import { Sandbox } from '@codesandbox/common/lib/types';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';
import { ENTER, SPACE, ALT } from '@codesandbox/common/lib/utils/keycodes';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { SandboxType, DropTarget } from './constants';

type DragItem = { type: SandboxType; sandboxId: string; index: number | null };
type DropResult = { name: DropTarget };

export const SandboxCard: React.FC<{
  type?: SandboxType;
  sandbox: Sandbox | SandboxFragmentDashboardFragment;
  index?: number | null;
}> = ({
  type = SandboxType.DEFAULT_SANDBOX,
  sandbox,
  index = null,
  ...props
}) => {
  const {
    state: {
      user: loggedInUser,
      profile: {
        current: { username, featuredSandboxes },
        contextMenu,
      },
    },
    actions: {
      profile: {
        addFeaturedSandboxesInState,
        addFeaturedSandboxes,
        reorderFeaturedSandboxesInState,
        saveFeaturedSandboxesOrder,
        removeFeaturedSandboxesInState,
        newSandboxShowcaseSelected,
        openContextMenu,
      },
    },
  } = useOvermind();

  const ref = React.useRef<HTMLDivElement>(null);
  let previousPosition: number;

  const [{ isDragging }, drag] = useDrag({
    item: { type, sandboxId: sandbox.id, index },
    collect: monitor => {
      const dragItem: DragItem = monitor.getItem();
      return {
        isDragging: dragItem?.sandboxId === sandbox.id,
      };
    },

    begin: () => {
      if (type === SandboxType.PINNED_SANDBOX) {
        previousPosition = index;
      }
    },
    end: (item: DragItem, monitor) => {
      const dropResult: DropResult = monitor.getDropResult();

      if (!dropResult) {
        // This is the cancel event
        if (item.type === SandboxType.PINNED_SANDBOX) {
          // Rollback any reordering
          reorderFeaturedSandboxesInState({
            startPosition: index,
            endPosition: previousPosition,
          });
        } else {
          // remove newly added from featured in state
          removeFeaturedSandboxesInState({ sandboxId: item.sandboxId });
        }

        return;
      }

      if (dropResult.name === DropTarget.PINNED_SANDBOXES) {
        if (featuredSandboxes.find(s => s.id === item.sandboxId)) {
          saveFeaturedSandboxesOrder();
        } else {
          addFeaturedSandboxes({ sandboxId: item.sandboxId });
        }
      } else if (dropResult.name === DropTarget.SHOWCASED_SANDBOX) {
        newSandboxShowcaseSelected(item.sandboxId);
      }
    },
  });

  const [, drop] = useDrop({
    accept: [SandboxType.ALL_SANDBOX, SandboxType.PINNED_SANDBOX],
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;

      const hoverIndex = index;
      let dragIndex = -1; // not in list

      if (item.type === SandboxType.PINNED_SANDBOX) {
        dragIndex = item.index;
      }

      if (item.type === SandboxType.ALL_SANDBOX) {
        // When an item from ALL_SANDOXES is hoverered over
        // an item in pinned sandboxes, we insert the sandbox
        // into featuredSandboxes in state.
        if (
          hoverIndex &&
          !featuredSandboxes.find(s => s.id === item.sandboxId)
        ) {
          addFeaturedSandboxesInState({ sandboxId: item.sandboxId });
        }
        dragIndex = featuredSandboxes.findIndex(s => s.id === item.sandboxId);
      }

      // If the item doesn't exist in featured sandboxes yet, return
      if (dragIndex === -1) return;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;

      // Determine rectangle for hoverered item
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get offsets for dragged item
      const dragOffset = monitor.getClientOffset();
      const hoverClientX = dragOffset.x - hoverBoundingRect.left;

      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Only perform the move when the mouse has crossed half of the items width

      // Dragging forward
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;

      // Dragging backward
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      reorderFeaturedSandboxesInState({
        startPosition: dragIndex,
        endPosition: hoverIndex,
      });
      // We're mutating the monitor item here to avoid expensive index searches!
      item.index = hoverIndex;
    },
    drop: () => ({ name: DropTarget.PINNED_SANDBOXES }),
  });

  const myProfile = loggedInUser?.username === username;

  if (myProfile) {
    if (type === SandboxType.ALL_SANDBOX) drag(ref);
    else if (type === SandboxType.PINNED_SANDBOX) drag(drop(ref));
  }

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // we use on click instead of anchor tag so that safari renders
    // the html5 drag thumbnail instead of text
    if (isTargetInMenu(event)) return;
    const url = sandboxUrl({ id: sandbox.id });
    if (event.ctrlKey || event.metaKey) window.open(url, '_blank');
    else window.open(url);
  };

  const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    openContextMenu({
      sandboxId: sandbox.id,
      sandboxType: type,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.keyCode === ALT ||
      (isTargetInMenu(event) && [ENTER, SPACE].includes(event.keyCode))
    ) {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      openContextMenu({
        sandboxId: sandbox.id,
        sandboxType: type,
        position: { x: rect.right, y: rect.bottom },
      });
    } else if (event.keyCode === ENTER) {
      event.preventDefault();
      window.location.href = sandboxUrl({ id: sandbox.id });
    }
  };

  return (
    <div ref={ref}>
      <Stack
        direction="vertical"
        gap={4}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onContextMenu={onContextMenu}
        style={{
          opacity: isDragging ? 0 : 1,
          // we transition the thumbnail out so that
          // the dragged thumbnail is 100% opacity
          transition: 'opacity 75ms',
          transitionDelay: '16ms',
        }}
        css={css({
          backgroundColor: 'grays.700',
          border: '1px solid',
          borderColor:
            contextMenu.sandboxId === sandbox.id ? 'blues.600' : 'grays.600',
          borderRadius: 'medium',
          cursor: 'pointer',
          overflow: 'hidden',
          ':hover, :focus, :focus-within': {
            boxShadow: (theme: typeof designLanguage) =>
              '0 4px 16px 0 ' + theme.colors.grays[900],
          },
          ':focus, :focus-within': {
            outline: 'none',
            borderColor: 'blues.600',
          },
        })}
        {...props}
      >
        <div
          css={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 160 + 1,
            borderBottom: '1px solid',
            backgroundColor: 'grays.600',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            borderColor: 'grays.600',
          })}
          style={{
            backgroundImage: `url(${
              sandbox.screenshotUrl ||
              `/api/v1/sandboxes/${sandbox.id}/screenshot.png`
            })`,
          }}
        />
        <Stack justify="space-between">
          <Stack
            direction="vertical"
            marginX={4}
            marginBottom={4}
            css={{ width: '100%' }}
          >
            <Text
              size={3}
              maxWidth="calc(100% - 24px)"
              css={css({ height: 7 })}
            >
              {sandbox.title || sandbox.alias || sandbox.id}
            </Text>
            <Stats sandbox={sandbox} />
          </Stack>
          <IconButton
            name="more"
            size={9}
            title="Sandbox actions"
            onClick={onContextMenu}
            onKeyDown={onKeyDown}
          />
        </Stack>
      </Stack>
    </div>
  );
};

export const SkeletonCard = () => (
  <div>
    <Stack
      direction="vertical"
      gap={4}
      css={css({
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor: 'grays.600',
        borderRadius: 'medium',
      })}
    >
      <SkeletonText
        css={css({
          width: '100%',
          height: 160 + 1,
          borderBottom: '1px solid',
          borderColor: 'grays.600',
        })}
      />
      <Stack direction="vertical" gap={2} marginX={4} marginBottom={5}>
        <SkeletonText />
        <SkeletonText />
      </Stack>
    </Stack>
  </div>
);
