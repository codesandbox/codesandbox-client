import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import {
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_DOWN,
  ARROW_UP,
  ENTER,
  ALT,
} from '@codesandbox/common/lib/utils/keycodes';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { DragPreview } from './DragPreview';
import { ContextMenu } from './ContextMenu';

const Context = React.createContext({
  sandboxes: [],
  selectedIds: [],
  onClick: (event: React.MouseEvent<HTMLDivElement>, itemId: string) => {},
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {},
  onRightClick: (event: React.MouseEvent<HTMLDivElement>, itemId: string) => {},
  onMenuEvent: (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    itemId?: string
  ) => {},
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => {},
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {},
  onDragStart: (event: React.MouseEvent<HTMLDivElement>, itemId: string) => {},
  onDrop: (droppedResult: any) => {},
  thumbnailRef: null,
  isDragging: false,
  isRenaming: false,
  setRenaming: (renaming: boolean) => {},
});

export const SelectionProvider = ({
  sandboxes = [],
  folders = [],
  ...props
}) => {
  const selectionItems = [
    ...(folders || []).map(folder => folder.path),
    ...(sandboxes || []).map(sandbox => sandbox.id),
  ];
  const [selectedIds, setSelectedIds] = React.useState([]);

  const {
    state: { dashboard },
    actions,
  } = useOvermind();

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

  const [menuVisible, setMenuVisibility] = React.useState(true);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  const onRightClick = (
    event: React.MouseEvent<HTMLDivElement> &
      React.KeyboardEvent<HTMLDivElement>,
    itemId: string
  ) => {
    if (!selectedIds.includes(itemId)) setSelectedIds([itemId]);
    setMenuVisibility(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const onMenuEvent = (
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
    itemId?: string
  ) => {
    if (itemId && !selectedIds.includes(itemId)) setSelectedIds([itemId]);

    const target = event.target as HTMLButtonElement;

    let menuElement = target;
    if (target.dataset.selectionId) {
      // if the event is fired on the sandbox/folder, we find
      // the menu button to correctly position the menu
      menuElement = target.querySelector('button');
    }

    const rect = menuElement.getBoundingClientRect();
    const position = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };

    setMenuVisibility(true);
    setMenuPosition(position);
  };

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.bubbles) {
      // do nothing, another sandbox was selected
    } else {
      // reset selection
      setSelectedIds([]);
    }
  };

  const [isRenaming, setRenaming] = React.useState(false);

  let viewMode: string;
  const location = useLocation();

  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('home')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const history = useHistory();
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selectedIds.length) return;
    // disable keyboard navigation if menu is open
    if (menuVisible) return;

    // disable selection keydowns when renaming
    if (isRenaming) return;

    if (event.keyCode === ALT) onMenuEvent(event);

    // if only one thing is selected, open it
    if (event.keyCode === ENTER && selectedIds.length === 1) {
      const selectedId = selectedIds[0];

      let url;
      if (selectedId.startsWith('/')) {
        // means its a folder
        url = '/new-dashboard/all' + selectedId;
      } else {
        const seletedSandbox = sandboxes.find(
          sandbox => sandbox.id === selectedId
        );
        url = sandboxUrl({
          id: seletedSandbox.id,
          alias: seletedSandbox.alias,
        });
      }

      if (event.ctrlKey || event.metaKey) {
        window.open(url, '_blank');
      } else {
        history.push(url);
      }
    }

    // if isn't one of the handled keys, skip
    if (
      (viewMode === 'grid' &&
        event.keyCode !== ARROW_RIGHT &&
        event.keyCode !== ARROW_LEFT &&
        event.keyCode !== ARROW_UP &&
        event.keyCode !== ARROW_DOWN) ||
      (viewMode === 'list' &&
        event.keyCode !== ARROW_DOWN &&
        event.keyCode !== ARROW_UP)
    ) {
      return;
    }

    // cancel scroll events
    event.preventDefault();

    const lastSelectedItemId = selectedIds[selectedIds.length - 1];

    const index = selectionItems.findIndex(id => id === lastSelectedItemId);

    const direction = [ARROW_RIGHT, ARROW_DOWN].includes(event.keyCode)
      ? 'forward'
      : 'backward';

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
    if (!event.shiftKey) {
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

  const onDragStart = (
    event: React.MouseEvent<HTMLDivElement>,
    itemId: string
  ) => {
    // if the dragged sandbox isn't selected. select it alone
    if (!selectedIds.includes(itemId)) {
      setSelectedIds([itemId]);
    }
  };

  const onDrop = dropResult => {
    if (dropResult.isSamePath) return;

    const sandboxIds = selectedIds.filter(isSandboxId);
    const folderPaths = selectedIds.filter(isFolderPath).filter(notDrafts);

    if (sandboxIds.length) {
      if (dropResult.path === 'deleted') {
        actions.dashboard.deleteSandbox(sandboxIds);
      } else if (dropResult.path === 'templates') {
        actions.dashboard.makeTemplate(sandboxIds);
      } else if (dropResult.path === '/drafts') {
        actions.dashboard.addSandboxesToFolder({
          sandboxIds,
          collectionPath: '/',
        });
      } else {
        actions.dashboard.addSandboxesToFolder({
          sandboxIds,
          collectionPath: dropResult.path,
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
          actions.dashboard.moveFolder({
            path,
            newPath: dropResult.path.replace('all', '') + '/' + name,
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
  const [selectionRect, setSelectionRect] = React.useState({
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

    setDrawingRect(true);
    setSelectionRect({
      start: {
        x: event.clientX,
        y: event.clientY,
      },
      end: { x: null, y: null },
    });
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
        selectionRect.end.x
      );
      const selectionRight = Math.max(
        selectionRect.start.x,
        selectionRect.end.x
      );
      const selectionTop = Math.min(selectionRect.start.y, selectionRect.end.y);
      const selectionBottom = Math.max(
        selectionRect.start.y,
        selectionRect.end.y
      );

      const visibleItems = document.querySelectorAll('[data-selection-id]');
      const overlappingItems = [];

      visibleItems.forEach(item => {
        const rect = item.getBoundingClientRect();

        // left-right doesn't matter for list view
        if (
          (viewMode === 'list' ||
            (rect.left > selectionLeft && rect.left < selectionRight) ||
            (rect.right > selectionLeft && rect.right < selectionRight)) &&
          ((rect.top > selectionTop && rect.top < selectionBottom) ||
            (rect.bottom > selectionTop && rect.bottom < selectionBottom))
        ) {
          overlappingItems.push(item);
        }
      });

      const overlappingIds = [];
      overlappingItems.forEach(item => {
        overlappingIds.push(item.dataset.selectionId);
      });

      setSelectedIds(overlappingIds);
      callbackCalledAt.current = new Date().getTime();
    };

    // performance hack: don't fire the callback again if it was fired 60ms ago
    if (!callbackCalledAt.current) callback();
    else if (new Date().getTime() - callbackCalledAt.current > 60) callback();
  };

  const onContainerMouseUp = event => {
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
        onKeyDown,
        onDragStart,
        onDrop,
        thumbnailRef,
        isDragging,
        isRenaming,
        setRenaming,
      }}
    >
      <Element
        id="selection-container"
        onMouseDown={onContainerMouseDown}
        onMouseMove={onContainerMouseMove}
        onMouseUp={onContainerMouseUp}
        css={css({ paddingTop: 10 })}
      >
        {props.children}
      </Element>
      {drawingRect && selectionRect.end.x && (
        <Element
          id="selection-rectangle"
          css={css({
            position: 'absolute',
            background: '#6CC7F640', // blues.300 with 25% opacity
            border: '1px solid',
            borderColor: 'blues.600',
            left: Math.min(selectionRect.start.x, selectionRect.end.x),
            top: Math.min(selectionRect.start.y, selectionRect.end.y),
            width: Math.abs(selectionRect.end.x - selectionRect.start.x),
            height: Math.abs(selectionRect.end.y - selectionRect.start.y),
            pointerEvents: 'none', // disable selection
          })}
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
        setRenaming={setRenaming}
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
    onKeyDown,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging,
    isRenaming,
    setRenaming,
  } = React.useContext(Context);

  return {
    sandboxes,
    selectedIds,
    onClick,
    onMouseDown,
    onBlur,
    onRightClick,
    onMenuEvent,
    onKeyDown,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging,
    isRenaming,
    setRenaming,
  };
};

const scrollIntoViewport = (id: string) => {
  const gridContainer = document.querySelector('#variable-grid');
  const event = new CustomEvent('scrollToItem', { detail: id });
  gridContainer.dispatchEvent(event);
};

const isFolderPath = id => id.startsWith('/');
const isSandboxId = id => !isFolderPath(id);
const notDrafts = folder => folder.path !== '/drafts';
