import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Element, SkipNav, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import {
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_DOWN,
  ARROW_UP,
  ENTER,
  ALT,
  TAB,
} from '@codesandbox/common/lib/utils/keycodes';
import { isEqual } from 'lodash-es';
import {
  sandboxUrl,
  dashboard as dashboardUrls,
} from '@codesandbox/common/lib/utils/url-generator';

import { DragPreview } from './DragPreview';
import { ContextMenu } from './ContextMenu';
import {
  DashboardTemplate,
  DashboardSandbox,
  DashboardFolder,
  DashboardGridItem,
  DashboardSyncedRepo,
  PageTypes,
  DashboardBranch,
  DashboardRepository,
} from '../../types';
import { DndDropType } from '../../utils/dnd';

export type Position = {
  x: null | number;
  y: null | number;
};

interface SelectionContext {
  sandboxes: Array<DashboardSandbox | DashboardTemplate>;
  selectedIds: string[];
  onClick: (event: React.MouseEvent<HTMLDivElement>, itemId: string) => void;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onRightClick: (
    event: React.MouseEvent<HTMLDivElement>,
    itemId: string
  ) => void;
  onMenuEvent: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    itemId?: string
  ) => void;
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => void;
  onDragStart: (
    event: React.MouseEvent<HTMLDivElement>,
    itemId: string,
    draggableType?: 'sandbox' | 'folder'
  ) => void;
  onDrop: (droppedResult: any) => void;
  thumbnailRef: React.Ref<HTMLDivElement> | null;
  isDragging: boolean;
  isRenaming: boolean;
  setRenaming: (renaming: boolean) => void;
  activeTeamId: string | null;
}

const Context = React.createContext<SelectionContext>({
  sandboxes: [],
  selectedIds: [],
  onClick: () => {},
  onMouseDown: () => {},
  onRightClick: () => {},
  onMenuEvent: () => {},
  onBlur: () => {},
  onDragStart: () => {},
  onDrop: () => {},
  thumbnailRef: null,
  isDragging: false,
  isRenaming: false,
  setRenaming: renaming => {},
  activeTeamId: null,
});

interface SelectionProviderProps {
  items: Array<DashboardGridItem>;
  createNewFolder?: () => void;
  createNewSandbox?: () => void;
  createNewDevbox?: () => void;
  activeTeamId: string | null;
  page: PageTypes;
  interactive?: boolean;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({
  items = [],
  createNewFolder,
  createNewSandbox,
  createNewDevbox,
  activeTeamId,
  page,
  children,
  interactive = true,
}) => {
  const possibleItems = (items || []).filter(
    item =>
      item.type === 'sandbox' ||
      item.type === 'template' ||
      item.type === 'folder' ||
      item.type === 'synced-sandbox-repo' ||
      item.type === 'branch'
  ) as Array<
    | DashboardSandbox
    | DashboardTemplate
    | DashboardFolder
    | DashboardSyncedRepo
    | DashboardBranch
    | DashboardRepository
  >;

  const selectionItems = possibleItems.map(item => {
    if (item.type === 'branch') return item.branch.id;
    if (item.type === 'repository') {
      const { repository: providerRepository } = item.repository;
      return `${providerRepository.owner}-${providerRepository.name}`;
    }
    if (item.type === 'folder') return item.path;
    if (item.type === 'synced-sandbox-repo') return item.name;
    return item.sandbox.id;
  });

  const folders = (items || []).filter(
    item => item.type === 'folder'
  ) as DashboardFolder[];
  const sandboxes = (items || []).filter(
    item => item.type === 'sandbox' || item.type === 'template'
  ) as Array<DashboardSandbox | DashboardTemplate>;
  const branches = (items || []).filter(
    item => item.type === 'branch'
  ) as DashboardBranch[];
  const repositories = (items || []).filter(
    item => item.type === 'repository'
  ) as DashboardRepository[];

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const actions = useActions();
  const { dashboard, activeTeam } = useAppState();
  const { analytics } = useEffects();

  const onClick = (event: React.MouseEvent<HTMLDivElement>, itemId: string) => {
    if (event.ctrlKey || event.metaKey) {
      // select multiple with modifier

      if (selectedIds.includes(itemId)) {
        setSelectedIds(selectedIds.filter(id => id !== itemId));
      } else {
        setSelectedIds([...selectedIds, itemId]);
      }

      event.stopPropagation();
    } else if (event.shiftKey) {
      // start = find index for last inserted
      // end = find index for itemId
      // find everything in between and add them
      const start = selectionItems.findIndex(
        id => id === selectedIds[selectedIds.length - 1]
      );
      const end = selectionItems.findIndex(id => id === itemId);

      const itemsInRange = [];

      if (start >= 0 && end >= 0) {
        const increment = end > start ? +1 : -1;

        for (
          let index = start;
          increment > 0 ? index <= end : index >= end;
          index += increment
        ) {
          itemsInRange.push(selectionItems[index]);
        }
      } else {
        itemsInRange.push(itemId);
      }

      // Missing feature: When you create a new selection that overlaps
      // with the existing selection, you're probably trying to unselect them
      // commonIds = itemsInRange.filter(id => selectedIds.length)
      // remove the common ones while adding the rest

      setSelectedIds([...selectedIds, ...itemsInRange]);

      event.stopPropagation();
    } else {
      setSelectedIds([itemId]);
      event.stopPropagation();
    }
  };

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // prevent collisions with mouse down on container
    event.stopPropagation();
  };

  const [menuVisible, setMenuVisibility] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  const onRightClick = React.useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> &
        React.KeyboardEvent<HTMLDivElement>,
      itemId: string
    ) => {
      setSelectedIds(s => {
        if (!s.includes(itemId)) {
          return [itemId];
        }
        return s;
      });

      setMenuVisibility(true);
      setMenuPosition({ x: event.clientX, y: event.clientY });
    },
    [setMenuVisibility, setMenuPosition]
  );

  const onMenuEvent = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.KeyboardEvent<HTMLDivElement>,
      itemId: string
    ) => {
      setSelectedIds(s => {
        if (itemId && !s.includes(itemId)) {
          return [itemId];
        }

        return s;
      });

      let menuElement: HTMLElement;
      if (event.type === 'click') {
        const target = event.target as HTMLButtonElement;
        menuElement = target;
      } else {
        // if the event is fired on the sandbox/folder, we find
        // the menu button to correctly position the menu
        menuElement = document.querySelector(
          `[data-selection-id="${itemId}"] button`
        );
      }

      const rect = menuElement.getBoundingClientRect();
      const position = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      };

      setMenuVisibility(true);
      setMenuPosition(position);
    },
    [setSelectedIds, setMenuVisibility, setMenuPosition]
  );

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.bubbles) {
      // do nothing, another sandbox was selected
    } else {
      // reset selection
      setSelectedIds([]);
    }
  };

  const [isRenaming, setRenaming] = React.useState(false);

  let viewMode: 'grid' | 'list';
  const location = useLocation();

  if (location.pathname.includes('deleted')) viewMode = 'list';
  else viewMode = dashboard.viewMode;

  const history = useHistory();

  React.useEffect(() => {
    if (!location.state || !selectionItems.length) return;

    if (location.state.sandboxId) {
      const sandboxId = location.state.sandboxId;

      setSelectedIds([sandboxId]);
      scrollIntoViewport(sandboxId);
      // clear push state
      history.replace(location.pathname, {});
    } else if (location.state.focus === 'FIRST_ITEM') {
      setSelectedIds([selectionItems[0]]);
      // imperatively move focus to content-block
      const skipToContent = document.querySelector(
        '#reach-skip-nav'
      ) as HTMLDivElement;
      skipToContent.focus();

      // clear push state
      history.replace(location.pathname, {});
    }
  }, [location, history, selectionItems]);

  const onContainerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selectedIds.length) return;
    // disable keyboard navigation if menu is open
    if (menuVisible) return;

    // disable selection keydowns when renaming
    if (isRenaming) return;

    if (event.keyCode === ALT)
      onMenuEvent(event, selectedIds[selectedIds.length - 1]);

    // if only one thing is selected, open it
    if (event.keyCode === ENTER && selectedIds.length === 1) {
      const selectedId = selectedIds[0];

      let url: string;
      if (selectedId.startsWith('/')) {
        // means its a folder
        url = dashboardUrls.sandboxes(selectedId, activeTeamId);
      } else {
        const selectedItem = sandboxes.find(
          item => item.sandbox.id === selectedId
        );
        url = sandboxUrl(selectedItem.sandbox);
      }

      if (event.ctrlKey || event.metaKey) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }

    // if isn't one of the handled keys, skip
    if (
      (viewMode === 'grid' &&
        event.keyCode !== ARROW_RIGHT &&
        event.keyCode !== ARROW_LEFT &&
        event.keyCode !== ARROW_UP &&
        event.keyCode !== ARROW_DOWN &&
        event.keyCode !== TAB) ||
      (viewMode === 'list' &&
        event.keyCode !== ARROW_DOWN &&
        event.keyCode !== ARROW_UP &&
        event.keyCode !== TAB)
    ) {
      return;
    }

    // cancel scroll events
    event.preventDefault();
    event.stopPropagation();

    const lastSelectedItemId = selectedIds[selectedIds.length - 1];

    const index = selectionItems.findIndex(id => id === lastSelectedItemId);

    let direction = [ARROW_RIGHT, ARROW_DOWN].includes(event.keyCode)
      ? 'forward'
      : 'backward';

    if (event.keyCode === TAB) {
      if (event.shiftKey) direction = 'backward';
      else direction = 'forward';
    }

    // column count is set by SandboxGrid
    // to keep the state easy to manage, we imperatively
    // read this value from data-column-count
    const gridElement = document.querySelector(
      '#variable-grid'
    ) as HTMLButtonElement;
    const columnCount = parseInt(gridElement.dataset.columnCount, 10);

    const steps = [ARROW_UP, ARROW_DOWN].includes(event.keyCode)
      ? columnCount
      : 1;

    const nextItem =
      selectionItems[index + (direction === 'forward' ? steps : -1 * steps)];

    // boundary conditions
    if (!nextItem) return;

    // scroll to newly selected element into view imperatively
    scrollIntoViewport(nextItem);

    // just moving around
    if (!event.shiftKey || event.keyCode === TAB) {
      setSelectedIds([nextItem]);
      return;
    }

    // selection:
    // going back! remove the last one
    if (selectedIds.includes(nextItem)) {
      setSelectedIds(selectedIds.slice(0, -1));
      return;
    }

    // select one more
    setSelectedIds([...selectedIds, nextItem]);
  };

  const onDragStart = React.useCallback(
    (
      event: React.MouseEvent<HTMLDivElement>,
      itemId: string,
      draggableType?: 'sandbox' | 'folder'
    ) => {
      analytics.track('Dashboard - On drag start', { type: draggableType });
      // if the dragged sandbox isn't selected. select it alone
      setSelectedIds(s => (s.includes(itemId) ? s : [itemId]));
    },
    [setSelectedIds]
  );

  const onDrop = async (dropResult: DndDropType) => {
    analytics.track('Dashboard - On drop', {
      isSamePath: dropResult.isSamePath,
    });

    if (dropResult.isSamePath) return;

    const sandboxIds = selectedIds.filter(isSandboxId);
    const folderPaths = selectedIds.filter(isFolderPath).filter(notDrafts);
    const dropPage = dropResult.page;

    if (page === 'templates') {
      // First unmake them from templates
      await actions.dashboard.unmakeTemplates({ templateIds: sandboxIds });
    }

    if (sandboxIds.length) {
      if (dropPage === 'deleted') {
        actions.dashboard.deleteSandbox({ ids: sandboxIds });
      } else if (dropPage === 'templates') {
        actions.dashboard.makeTemplates({ sandboxIds });
      } else if (dropPage === 'drafts') {
        actions.dashboard.addSandboxesToFolder({
          sandboxIds,
          collectionPath: activeTeam ? null : '/',
          privacy: 2,
        });
      } else if (dropPage === 'sandboxes') {
        actions.dashboard.addSandboxesToFolder({
          sandboxIds,
          collectionPath: dropResult.path,
          deleteFromCurrentPath:
            page === 'sandboxes' ||
            page === 'deleted' ||
            page === 'templates' ||
            page === 'drafts',
          privacy: null,
        });
      }
    }

    if (folderPaths.length) {
      if (dropResult.path === 'deleted') {
        folderPaths.forEach(path => actions.dashboard.deleteFolder({ path }));
      } else if (dropResult.path === 'templates') {
        // folders can't be dropped into templates
      } else if (dropResult.path === 'drafts') {
        // folders can't be dropped into drafts
      } else {
        // moving folders into another folder
        // is the same as changing it's path
        folderPaths.forEach(path => {
          const { name } = folders.find(folder => folder.path === path);

          let newPath: string;
          if (dropResult.path.endsWith('/')) newPath = dropResult.path + name;
          else newPath = dropResult.path + '/' + name;

          actions.dashboard.moveFolder({
            path,
            newPath,
            teamId: activeTeam,
            newTeamId: activeTeam,
          });
        });
      }
    }
  };

  // attach to thumbnail, we use this to calculate size
  const thumbnailRef = React.useRef<HTMLDivElement>();

  // is anything being dragged?
  const [isDragging, setDragging] = React.useState(false);

  const [drawingRect, setDrawingRect] = React.useState(false);
  const [selectionRect, setSelectionRect] = React.useState<{
    start: Position;
    end: Position;
  }>({
    start: { x: null, y: null },
    end: { x: null, y: null },
  });
  const resetSelectionRect = () => {
    setDrawingRect(false);
    setSelectionRect({
      start: { x: null, y: null },
      end: { x: null, y: null },
    });
  };

  const onContainerMouseDown = event => {
    setSelectedIds([]); // global blur

    // right click
    if (event.button === 2) return;

    setRenaming(false);
    setDrawingRect(true);
    setSelectionRect({
      start: {
        x: event.clientX,
        y: event.clientY,
      },
      end: { x: null, y: null },
    });
  };

  const onContainerContextMenu = event => {
    // global context menu is only relevent inside All sandboxes/*
    if (typeof createNewFolder !== 'function') return;

    event.preventDefault();
    setMenuVisibility(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const callbackCalledAt = React.useRef(null);

  const onContainerMouseMove = event => {
    if (!drawingRect) return;

    setSelectionRect({
      start: selectionRect.start,
      end: { x: event.clientX, y: event.clientY },
    });

    const callback = () => {
      const selectionLeft = Math.min(
        selectionRect.start.x,
        selectionRect.end.x || Infinity
      );
      const selectionRight = Math.max(
        selectionRect.start.x,
        selectionRect.end.x || 0
      );
      const selectionTop = Math.min(
        selectionRect.start.y,
        selectionRect.end.y || Infinity
      );
      const selectionBottom = Math.max(
        selectionRect.start.y,
        selectionRect.end.y || 0
      );

      const visibleItems = document.querySelectorAll('[data-selection-id]');
      const overlappingItems = [];

      visibleItems.forEach(item => {
        const rect = item.getBoundingClientRect();

        // left-right doesn't matter for list view
        if (
          (viewMode === 'list' ||
            (rect.left > selectionLeft && rect.left < selectionRight) ||
            (rect.right > selectionLeft && rect.right < selectionRight) ||
            (rect.left < selectionLeft && rect.right > selectionRight)) &&
          ((rect.top > selectionTop && rect.top < selectionBottom) ||
            (rect.bottom > selectionTop && rect.bottom < selectionBottom) ||
            (rect.top < selectionTop && rect.bottom > selectionBottom))
        ) {
          overlappingItems.push(item);
        }
      });

      const overlappingIds = [];
      overlappingItems.forEach(item => {
        overlappingIds.push(item.dataset.selectionId);
      });

      if (!isEqual(selectedIds, overlappingIds)) {
        setSelectedIds(overlappingIds);
        callbackCalledAt.current = new Date().getTime();
      }
    };

    // performance hack: don't fire the callback again if it was fired 60ms ago
    if (!callbackCalledAt.current) callback();
    else if (new Date().getTime() - callbackCalledAt.current > 60) callback();
  };

  const onContainerMouseUp = () => {
    if (drawingRect) resetSelectionRect();
  };

  return (
    <Context.Provider
      value={{
        sandboxes,
        selectedIds,
        onClick,
        onMouseDown,
        onBlur,
        onRightClick,
        onMenuEvent,
        onDragStart,
        onDrop,
        thumbnailRef,
        isDragging,
        isRenaming,
        setRenaming,
        activeTeamId,
      }}
    >
      <Stack
        id="selection-container"
        onContextMenu={onContainerContextMenu}
        css={css({
          paddingTop: page === 'recent' ? 0 : 3, // In the recent page, this component is nested so the padding top isn't needed.
          width: '100%',
          height: '100%',
        })}
        direction="vertical"
        {...(interactive
          ? {
              onKeyDown: onContainerKeyDown,
              onMouseDown: onContainerMouseDown,
              onMouseMove: onContainerMouseMove,
              onMouseUp: onContainerMouseUp,
            }
          : {})}
      >
        <SkipNav.Content
          tabIndex={0}
          onFocus={() => setSelectedIds([selectionItems[0]])}
        />
        {children}
      </Stack>
      {drawingRect && selectionRect.end.x && (
        <Element
          id="selection-rectangle"
          css={css({
            position: 'absolute',
            background: '#6CC7F640', // blues.300 with 25% opacity
            border: '1px solid',
            borderColor: 'focusBorder',
            pointerEvents: 'none', // disable selection
          })}
          style={{
            left: Math.min(selectionRect.start.x, selectionRect.end.x),
            top: Math.min(selectionRect.start.y, selectionRect.end.y),
            width: Math.abs(selectionRect.end.x - selectionRect.start.x),
            height: Math.abs(selectionRect.end.y - selectionRect.start.y),
          }}
        />
      )}
      <DragPreview
        sandboxes={sandboxes || []}
        folders={folders || []}
        selectionItems={selectionItems}
        selectedIds={selectedIds}
        thumbnailRef={thumbnailRef}
        viewMode={viewMode}
        setDragging={setDragging}
      />
      <ContextMenu
        visible={menuVisible}
        position={menuPosition}
        setVisibility={setMenuVisibility}
        selectedIds={selectedIds}
        sandboxes={sandboxes || []}
        folders={folders || []}
        branches={branches || []}
        repositories={repositories || []}
        setRenaming={setRenaming}
        page={page}
        createNewFolder={createNewFolder}
        createNewSandbox={createNewSandbox}
        createNewDevbox={createNewDevbox}
      />
    </Context.Provider>
  );
};

export const useSelection = () => {
  const {
    sandboxes,
    selectedIds,
    onClick,
    onMouseDown,
    onBlur,
    onRightClick,
    onMenuEvent,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging,
    isRenaming,
    setRenaming,
    activeTeamId,
  } = React.useContext(Context);

  return {
    sandboxes,
    selectedIds,
    onClick,
    onMouseDown,
    onBlur,
    onRightClick,
    onMenuEvent,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging,
    isRenaming,
    setRenaming,
    activeTeamId,
  };
};

let scrollTimer: number;
let retries = 0;
const MAX_RETRIES = 3;
const startingWaitTime = 50; // ms
const incrementalWaitTime = 100; // ms

const scrollIntoViewport = (id: string) => {
  const gridContainer = document.querySelector('#variable-grid');
  const event = new CustomEvent('scrollToItem', { detail: id });

  if (scrollTimer) window.clearTimeout(scrollTimer);

  if (!gridContainer && retries < MAX_RETRIES) {
    // we can call scroll when the grid is still loading,
    // in that event, we schedule to scroll into viewport
    // we incrementally increase wait time with each retry
    // and give up after 3 retries
    const waitTime = startingWaitTime + retries * incrementalWaitTime;
    retries++;
    scrollTimer = window.setTimeout(() => scrollIntoViewport(id), waitTime);
  } else {
    retries = 0;
    gridContainer.dispatchEvent(event);
  }
};

const isFolderPath = (id: string) => id.startsWith('/');
const isSandboxId = (id: string) => !isFolderPath(id);
const notDrafts = folder => folder.path !== '/drafts';
