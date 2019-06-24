import React from 'react';
import { DropTarget } from 'react-dnd';
import {
  entryTarget,
  collectTarget,
} from '../../../../Sidebar/SandboxesItem/folder-drop-target';
import { NavigationLink } from './elements';

interface ILinkProps {
  teamId?: string;
  name: string;
  path: string;
  i: number;
  splittedPath: string[];
  connectDropTarget: Function;
}

const Link = ({
  teamId,
  name,
  path,
  splittedPath,
  i,
  connectDropTarget,
}: ILinkProps) =>
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
        path={path}
        teamId={teamId}
      >
        {name}
      </NavigationLink>
    </div>
  );

export default DropTarget('SANDBOX', entryTarget, collectTarget)(Link);
