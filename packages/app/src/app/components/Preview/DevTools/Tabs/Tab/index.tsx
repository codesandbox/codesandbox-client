import * as React from 'react';
import {
  DragSource,
  ConnectDragSource,
  DropTarget,
  ConnectDropTarget,
  DropTargetMonitor,
  DropTargetConnector,
} from 'react-dnd';
import CrossIcon from 'react-icons/lib/md/clear';

import { Tab, CloseTab } from './elements';
import { IViewType } from '../..';
import { ITabPosition } from '..';

export interface TabProps {
  active: boolean;
  pane: IViewType;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  moveTab: (currentPosition: ITabPosition, nextPosition: ITabPosition) => void;
  index: number;
  devToolIndex: number;
  canDrag: boolean;
}

interface DragProps {
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  isDragging: boolean;
  isOver: boolean;
}

/**
 * Dims all other elements to make sure the user knows they can drag the tab to the right side
 * only
 */
function useGlobalDim(isDragging: boolean) {
  const blockerRef = React.useRef(null);
  React.useEffect(
    () => {
      const clean = () => {
        if (blockerRef.current) {
          blockerRef.current.parentElement.removeChild(blockerRef.current);
          blockerRef.current = null;
        }
        if (devtools && devtools.parentElement) {
          devtools.parentElement.style.zIndex = '0';
        }
      };

      const devtools = document.getElementById('csb-devtools');
      const container = document.getElementById('workbench.main.container');
      if (devtools && container) {
        if (isDragging) {
          const blocker = document.createElement('div');
          blocker.style.position = 'fixed';
          blocker.style.top = '0';
          blocker.style.right = '0';
          blocker.style.left = '0';
          blocker.style.bottom = '0';
          blocker.style.zIndex = '1000';
          devtools.parentElement.style.zIndex = '2000';
          blocker.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

          container.appendChild(blocker);

          blockerRef.current = blocker;
        } else {
          clean();
        }
      }

      return () => {
        clean();
      };
    },
    [isDragging]
  );
}

export const PaneTab = ({
  active,
  pane,
  onClick,
  onMouseDown,
  connectDragSource,
  connectDropTarget,
  isOver,
  isDragging,
}: TabProps & DragProps) => {
  useGlobalDim(isDragging);

  const component = (
    <div style={{ height: '100%' }}>
      <Tab
        active={active}
        onClick={onClick}
        onMouseDown={onMouseDown}
        key={pane.id}
        isOver={isOver && !isDragging}
      >
        {pane.title}
        {false &&
        active && ( // This will be enabled later on
            <CloseTab>
              <CrossIcon />
            </CloseTab>
          )}
      </Tab>
    </div>
  );

  if (connectDragSource) {
    return connectDropTarget(connectDragSource(component));
  }

  return component;
};

const entryTarget = {
  drop: (props: TabProps, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();

    if (sourceItem == null) {
      return;
    }

    const previousPosition: ITabPosition = {
      tabPosition: sourceItem.index,
      devToolIndex: sourceItem.devToolIndex,
    };
    const nextPosition = {
      tabPosition: props.index,
      devToolIndex: props.devToolIndex,
    };

    props.moveTab(previousPosition, nextPosition);
  },

  canDrop: (props: TabProps, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return (
      props.index !== source.index || props.devToolIndex !== source.devToolIndex
    );
  },
};

const collectTarget = (
  connectMonitor: DropTargetConnector,
  monitor: DropTargetMonitor
) => {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
};

const entrySource = {
  canDrag: (props: TabProps) => props.canDrag,
  beginDrag: (props: TabProps) => ({
    index: props.index,
    devToolIndex: props.devToolIndex,
  }),
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export const PREVIEW_TAB_ID = 'PREVIEW_TAB';

export default DropTarget(PREVIEW_TAB_ID, entryTarget, collectTarget)(
  DragSource(PREVIEW_TAB_ID, entrySource, collectSource)(PaneTab)
);
