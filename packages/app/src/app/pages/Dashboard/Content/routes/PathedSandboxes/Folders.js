import React from 'react';
import { withRouter } from 'react-router-dom';
import FolderEntry from '../../../Sidebar/SandboxesItem/FolderEntry';
import getChildCollections from '../../../utils/get-child-collections';

import { Folder, FoldersWrapper } from './elements';

const Folders = ({ loading, me, history, match: { params }, teamId }) => {
  const getPath = name => (params.path ? `${params.path}/${name}` : '/' + name);

  if (loading) return null;

  const { children, foldersByPath, folders } = getChildCollections(
    me.collections,
    (me.collection || {}).path
  );

  if (children.size === 0) return null;

  return (
    <FoldersWrapper>
      {Array.from(children)
        .sort()
        .map(name => (
          <Folder>
            <FolderEntry
              key={name}
              toToggle={false}
              allowCreate={false}
              basePath={window.location.pathname}
              teamId={teamId}
              path={getPath(name)}
              folders={folders}
              foldersByPath={foldersByPath}
              name={name}
              open={false}
              onSelect={() => {
                history.push(window.location.pathname + '/' + name);
              }}
              currentPath={window.location.pathname}
              currentTeamId={teamId}
            />
          </Folder>
        ))}
    </FoldersWrapper>
  );
};

export default withRouter(Folders);
