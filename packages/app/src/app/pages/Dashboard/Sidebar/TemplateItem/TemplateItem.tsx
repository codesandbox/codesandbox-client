import React from 'react';
import { DropTarget } from 'react-dnd';
// @ts-ignore
import TemplateIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/template.svg';

import { withRouter } from 'react-router-dom';
import { inject, observer } from 'app/componentConnectors';

import Item from '../Item';
import { MAKE_TEMPLATE_DROP_KEY } from '../../Content/SandboxCard';

interface Props {
  currentPath: string;
  teamId?: string;

  canDrop?: boolean;
  isOver?: boolean;
  connectDropTarget?: any;
}

const TemplateItemComponent = ({
  currentPath,
  isOver,
  canDrop,
  connectDropTarget,
  teamId,
}: Props) => {
  const url = teamId
    ? `/dashboard/teams/${teamId}/templates`
    : `/dashboard/templates`;

  return connectDropTarget(
    <div>
      <Item
        active={currentPath === url}
        path={url}
        Icon={TemplateIcon}
        name={teamId ? 'Team Templates' : 'My Templates'}
        style={
          isOver && canDrop ? { backgroundColor: 'rgba(0, 0, 0, 0.3)' } : {}
        }
      />
    </div>
  );
};

export const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return {};

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return {};

    // Used in SandboxCard
    return { [MAKE_TEMPLATE_DROP_KEY]: true, teamId: props.teamId };
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return !props.removedAt;
  },
};

export function collectTarget(connectMonitor, monitor) {
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

export const TemplateItem = inject('store', 'signals')(
  DropTarget(['SANDBOX'], entryTarget, collectTarget)(
    withRouter(observer(TemplateItemComponent))
  )
);
