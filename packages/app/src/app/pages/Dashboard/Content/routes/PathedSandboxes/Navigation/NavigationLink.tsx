import React from 'react';
import { DropTarget, ConnectDropTarget } from 'react-dnd';
import {
  entryTarget,
  collectTarget,
} from '../../../../Sidebar/SandboxesItem/folder-drop-target';
import { NavigationLink as StyledLink } from './elements';

interface ICollectedProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
}

interface IOwnProps {
  teamId?: string;
  name: string;
  path: string;
  splittedPath: string[];
  i: number;
  // We need this to make drag & drop work
  selectedSandboxes: string[];
}

type Props = ICollectedProps & IOwnProps;

const Link: React.FC<Props> = ({
  teamId,
  name,
  path,
  isOver,
  splittedPath,
  i,
  connectDropTarget,
}) =>
  connectDropTarget(
    <div>
      <StyledLink
        to={
          teamId
            ? `/dashboard/teams/${teamId}/sandboxes${path}`
            : `/dashboard/sandboxes${path}`
        }
        last={i === splittedPath.length - 1 ? 'true' : undefined}
        first={i === 0 ? 'true' : undefined}
        style={isOver ? { color: 'white' } : {}}
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
