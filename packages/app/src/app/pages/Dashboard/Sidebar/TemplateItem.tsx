import React, { FunctionComponent } from 'react';
import {
  DropTarget,
  DropTargetCollector,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd';

import { MAKE_TEMPLATE_DROP_KEY } from '../Content/SandboxGrid/SandboxCard';

import { Item } from './Item';

import TemplateIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/template.svg';

type OwnProps = {
  currentPath: string;
  teamId?: string;
};
type Props = OwnProps & CollectedProps;
const TemplateItemComponent: FunctionComponent<Props> = ({
  canDrop,
  connectDropTarget,
  currentPath,
  isOver,
  teamId,
}) => {
  const url = teamId
    ? `/dashboard/teams/${teamId}/templates`
    : `/dashboard/templates`;

  return connectDropTarget(
    <div>
      <Item
        active={currentPath === url}
        Icon={TemplateIcon}
        name="Templates"
        path={url}
        style={
          canDrop && isOver
            ? { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
            : undefined
        }
      />
    </div>
  );
};

const entryTarget: DropTargetSpec<OwnProps> = {
  canDrop: (_props, monitor) => monitor.getItem() !== null,
  drop: ({ teamId }, monitor) => {
    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) {
      return {};
    }

    // Used in SandboxCard
    return {
      [MAKE_TEMPLATE_DROP_KEY]: true,
      teamId,
    };
  },
};

const collectTarget: DropTargetCollector<CollectedProps, unknown> = (
  connect,
  monitor
) => ({
  canDrop: monitor.canDrop(),
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver({ shallow: true }),
});

type CollectedProps = {
  canDrop: ReturnType<DropTargetMonitor['canDrop']>;
  connectDropTarget: ReturnType<DropTargetConnector['dropTarget']>;
  isOver: ReturnType<DropTargetMonitor['isOver']>;
};
export const TemplateItem = DropTarget<OwnProps, CollectedProps>(
  ['SANDBOX'],
  entryTarget,
  collectTarget
)(TemplateItemComponent);
