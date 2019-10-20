import React from 'react';
import { DropTarget, ConnectDropTarget } from 'react-dnd';
import {
  entryTarget,
  collectTarget,
} from '../../../../Sidebar/SandboxesItem/folder-drop-target';
import { NavigationLink } from './elements';

interface ICollectedProps {
  connectDropTarget: ConnectDropTarget;
}

interface IOwnProps {
  teamId?: string;
  name: string;
  path: string;
  splittedPath: string[];
  i: number;
}

type Props = ICollectedProps & IOwnProps;

const Link: React.FC<Props> = ({
  teamId,
  name,
  path,
  splittedPath,
  i,
  connectDropTarget,
}) =>
  connectDropTarget(
    <div>
      <NavigationLink
        to={
          teamId
            ? `/dashboard/teams/${teamId}/sandboxes${path}`
            : `/dashboard/sandboxes${path}`
        }
        last={i === splittedPath.length - 1 ? 'true' : undefined}
        first={i === 0 ? 'true' : undefined}
      >
        {name}
      </NavigationLink>
    </div>
  );

// TODO: remove generic when entryTarget(DropTargetSpec) and collectTarget(DropTargetCollector) are typed
export default DropTarget<IOwnProps, ICollectedProps>(
  'SANDBOX',
  entryTarget,
  collectTarget
)(Link);
