import React, { FunctionComponent } from 'react';
import {
  DropTarget,
  DropTargetCollector,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
} from 'react-dnd';

import { MAKE_TEMPLATE_DROP_KEY } from '../Content/SandboxCard';

import { Item } from './Item';

import TemplateIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/template.svg';

type ComponentProps = {
  currentPath: string;
  teamId?: string;
};
type Props = ComponentProps & CollectedProps;
const TemplateItemComponent: FunctionComponent<Props> = ({
  canDrop,
  connectDropTarget,
  currentPath,
  isOver,
  teamId,
}) => {
  const path = teamId
    ? `/dashboard/teams/${teamId}/templates`
    : `/dashboard/templates`;

  return connectDropTarget(
    <Item
      active={currentPath === path}
      Icon={TemplateIcon}
      name={teamId ? 'Team Templates' : 'My Templates'}
      path={path}
      style={isOver && canDrop ? { backgroundColor: 'rgba(0, 0, 0, 0.3)' } : {}}
    />
  );
};

const entryTarget: DropTargetSpec<ComponentProps> = {
  canDrop: (_props, { getItem }) => getItem() !== null,
  drop: ({ teamId }, { isOver }) => {
    // Check if only child is selected:
    if (!isOver({ shallow: true })) {
      return {};
    }

    // Used in SandboxCard
    return {
      [MAKE_TEMPLATE_DROP_KEY]: true,
      teamId,
    };
  },
};

const collectTarget: DropTargetCollector<CollectedProps> = (
  { dropTarget },
  { canDrop, isOver }
) => ({
  canDrop: canDrop(),
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: isOver({ shallow: true }),
});

type CollectedProps = {
  canDrop: ReturnType<DropTargetMonitor['canDrop']>;
  connectDropTarget: ReturnType<DropTargetConnector['dropTarget']>;
  isOver: ReturnType<DropTargetMonitor['isOver']>;
};
export const TemplateItem = DropTarget<ComponentProps, CollectedProps>(
  ['SANDBOX'],
  entryTarget,
  collectTarget
)(TemplateItemComponent);
