import React from 'react';

import { DragSource, DropTarget } from 'react-dnd';

import Tab from '../Tab';

class TabContainer extends React.Component {
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isOver,
      active,
      tabCount,
      isDragging,
      dirty,
      dirName,
      position,
      closeTab,
      innerRef,
      hasError,
      onClick,
      onDoubleClick,
      children,
      isNotSynced,
      title,
      items,
    } = this.props;

    return connectDropTarget(
      connectDragSource(
        <span ref={innerRef} style={{ opacity: isDragging ? 0.8 : 1 }}>
          <Tab
            items={items}
            active={active}
            dirty={dirty}
            isOver={isOver}
            isNotSynced={isNotSynced}
            dirName={dirName}
            hasError={hasError}
            tabCount={tabCount}
            position={position}
            closeTab={closeTab}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            title={title}
          >
            {children}
          </Tab>
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

export default DropTarget(
  'TAB',
  entryTarget,
  collectTarget
)(DragSource('TAB', entrySource, collectSource)(TabContainer));
