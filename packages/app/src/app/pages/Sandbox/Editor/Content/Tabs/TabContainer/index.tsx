import * as React from 'react';
import { ConnectDragSource, ConnectDropTarget, DragSource, DropTarget } from 'react-dnd';
import { Module } from 'app/store/modules/editor/types'

import Tab from '../Tab';

type Props = {
  setCurrentModule: (id: string) => void
  module: Module
  connectDragSource: ConnectDragSource,
  connectDropTarget: ConnectDropTarget
  isOver: boolean
  active: boolean
  tabCount: number
  isDragging: boolean
  dirty: boolean
  dirName: string
  position: number
  closeTab: () => void
  innerRef: (node: HTMLElement) => void
  hasError: boolean
  isNotSynced: boolean
  markNotDirty: () => void
}

class TabContainer extends React.Component<Props> {
  setCurrentModule = () => {
    this.props.setCurrentModule(this.props.module.id);
  };

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isOver,
      module,
      active,
      tabCount,
      isDragging,
      dirty,
      dirName,
      position,
      closeTab,
      innerRef,
      hasError,
      isNotSynced,
    } = this.props;

    return connectDropTarget(
      connectDragSource(
        <span ref={innerRef} style={{ opacity: isDragging ? 0.8 : 1 }}>
          <Tab
            active={active}
            dirty={dirty}
            isOver={isOver}
            module={module}
            isNotSynced={isNotSynced}
            dirName={dirName}
            hasError={hasError}
            tabCount={tabCount}
            position={position}
            closeTab={closeTab}
            onClick={this.setCurrentModule}
            onDoubleClick={this.props.markNotDirty}
          />
        </span>
      )
    );
  }
}

const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();

    if (sourceItem == null) {
      return;
    }

    props.moveTab(sourceItem.position, props.position);
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return props.position !== source.position;
  },
};

function collectTarget(connectMonitor, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

const entrySource = {
  canDrag: () => true,
  beginDrag: props => ({ position: props.position }),
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DropTarget('TAB', entryTarget, collectTarget)(
  DragSource('TAB', entrySource, collectSource)(TabContainer)
);
