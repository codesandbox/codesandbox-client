import React from 'react';
import PropTypes from 'prop-types';
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
    x: x + props.item.left,
    y: y + props.item.top,
  };
}

class CustomDragLayer extends React.Component {
  renderItem(type, item, { x, y }) {
    return <SelectedSandboxItems x={x} y={y} id={item.id} />;
  }

  render() {
    const { item, itemType, currentOffset, isDragging } = this.props;

    if (!isDragging || !currentOffset) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div id="draglayer-preview">
          {this.renderItem(itemType, item, getItemCoords(this.props))}
        </div>
      </div>
    );
  }
}

CustomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  isDragging: PropTypes.bool.isRequired,
};

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

export default DragLayer(collect)(CustomDragLayer);
