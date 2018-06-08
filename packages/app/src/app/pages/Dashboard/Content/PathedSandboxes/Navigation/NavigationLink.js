import React from 'react';
import { DropTarget } from 'react-dnd';
import { inject, observer } from 'mobx-react';
import {
  entryTarget,
  collectTarget,
} from '../../../Sidebar/SandboxesItem/folder-drop-target';
import { NavigationLink } from './elements';

const Link = ({ name, path, isOver, splittedPath, i, connectDropTarget }) =>
  connectDropTarget(
    <div>
      <NavigationLink
        to={`/dashboard/sandboxes${path}`}
        isLast={i === splittedPath.length - 1}
        style={isOver ? { color: 'white' } : {}}
        path={path}
      >
        {name}
      </NavigationLink>
    </div>
  );

export default inject('signals', 'store')(
  DropTarget('SANDBOX', entryTarget, collectTarget)(observer(Link))
);
