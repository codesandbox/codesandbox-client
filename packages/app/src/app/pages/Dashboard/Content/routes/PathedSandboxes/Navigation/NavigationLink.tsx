import React from 'react';
import { DropTarget, ConnectDropTarget } from 'react-dnd';
import {
  entryTarget,
  collectTarget,
} from '../../../../Sidebar/SandboxesItem/folder-drop-target';
import { NavigationLink as StyledLink } from './elements';

interface ICollectedProps {
  connectDropTarget: ConnectDropTarget;
}

interface IOwnProps {
  teamId?: string;
  name: string;
  path: string;
}

type Props = ICollectedProps & IOwnProps;

const Link: React.FC<Props> = ({ teamId, name, path, connectDropTarget }) =>
  connectDropTarget(
    <div>
      <StyledLink
        to={
          teamId
            ? `/dashboard/teams/${teamId}/sandboxes${path}`
            : `/dashboard/sandboxes${path}`
        }
      >
        {name}
      </StyledLink>
    </div>
  );

// TODO: remove generic when entryTarget(DropTargetSpec) and collectTarget(DropTargetCollector) are typed
export const NavigationLink = DropTarget<IOwnProps, ICollectedProps>(
  'SANDBOX',
  entryTarget,
  collectTarget
)(Link);
