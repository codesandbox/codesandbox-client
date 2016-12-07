import React from 'react';
import styled, { keyframes } from 'styled-components';
import { DropTarget } from 'react-dnd';

import DeleteIcon from 'react-icons/lib/md/delete';

const fadein = keyframes`
  0%   { opacity: 0 }
  100% { opacity: 1 }
`;

const Container = styled.div`
  animation: ${fadein} 0.3s;
  transition: 0.3s ease all;

  position: fixed;
  top: 2.875rem;
  min-width: inherit;

  background-color: ${props => (
    props.isOver ? props.theme.redBackground.lighten(0.1)
                 : props.theme.redBackground.lighten(0.5)
  )};

  text-align: center;
  line-height: 2.75rem;
  font-size: 1.5rem;
  color: white;
  z-index: 11;
`;

const DeleteTarget = ({ isDragging, canDrop, isOver, connectDropTarget }) => (
  isDragging && canDrop &&
    connectDropTarget(<div style={{ minWidth: 'inherit' }}>
      <Container isOver={isOver}><DeleteIcon /></Container>
    </div>)
);

const moduleTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();
    props.deleteModule(sourceItem.id);
  },
};

function collectTarget(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    isDragging: monitor.getItem() != null,
  };
}


export default DropTarget('MODULE', moduleTarget, collectTarget)(DeleteTarget);
