import React, { FunctionComponent } from 'react';
import {
  DragLayer as DNDDragLayer,
  DragLayerCollector,
  DragLayerMonitor,
} from 'react-dnd';

import { Container } from './elements';
import { SelectedSandboxItems } from './SelectedSandboxItems';

type OwnProps = {};
type Props = OwnProps & CollectedProps;
const DragLayerComponent: FunctionComponent<Props> = ({
  currentOffset,
  isDragging,
  isOverPossibleTargets,
  item,
  itemType,
}) => {
  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <Container>
      {itemType === 'SANDBOX' ? (
        <SelectedSandboxItems
          isOverPossibleTargets={isOverPossibleTargets}
          x={currentOffset.x}
          y={currentOffset.y}
          id={item.id}
        />
      ) : null}
    </Container>
  );
};

const collect: DragLayerCollector<OwnProps, CollectedProps> = monitor => {
  // @ts-ignore
  const isOverPossibleTargets = monitor.getTargetIds().length > 0;

  return {
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    isOverPossibleTargets,
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
  };
};

type CollectedProps = {
  currentOffset: ReturnType<DragLayerMonitor['getSourceClientOffset']>;
  isDragging: ReturnType<DragLayerMonitor['isDragging']>;
  isOverPossibleTargets: boolean;
  item: ReturnType<DragLayerMonitor['getItem']>;
  itemType: ReturnType<DragLayerMonitor['getItemType']>;
};
export const DragLayer = DNDDragLayer<OwnProps, CollectedProps>(collect)(
  DragLayerComponent
);
