import React from 'react';

import { DragLayer } from 'react-dnd';

import SelectedSandboxItems from './SelectedSandboxItems';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemCoords(props) {
  const { currentOffset } = props;

  const { x, y } = currentOffset;

  return {
    x,
    y,
    left: props.item.left,
    top: props.item.top,
  };
}

class CustomDragLayer extends React.Component {
  renderItem(type, item, isOverPossibleTargets, { x, y, left, top }) {
    if (type !== 'SANDBOX') {
      return null;
    }
    return (
      <SelectedSandboxItems
        isOverPossibleTargets={isOverPossibleTargets}
        x={x}
        y={y}
        left={left}
        top={top}
        id={item.id}
      />
    );
  }

  render() {
    const {
      item,
      itemType,
      isOverPossibleTargets,
      currentOffset,
      isDragging,
    } = this.props;

    if (!isDragging || !currentOffset) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div>
          {this.renderItem(
            itemType,
            item,
            isOverPossibleTargets,
            getItemCoords(this.props)
          )}
        </div>
      </div>
    );
  }
}

function collect(monitor) {
  const isOverPossibleTargets = monitor.getTargetIds().length > 0;
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    isOverPossibleTargets,
  };
}

export default DragLayer(collect)(CustomDragLayer);
