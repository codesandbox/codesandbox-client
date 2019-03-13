import React from 'react';
import { withRouter } from 'react-router-dom';
import FolderEntry from '../../../Sidebar/SandboxesItem/FolderEntry';
import getChildCollections from '../../../utils/get-child-collections';

import { Folder, FoldersWrapper } from './elements';

const Folders = ({ loading, me, history, teamId }) => {
  const getPath = name => {
    const slicedPath = window.location.pathname.split('sandboxes');
    const last = slicedPath[slicedPath.length - 1];
    return last && !last.includes('sandboxes')
      ? `${decodeURIComponent(last)}/${name}`
      : '/' + name;
  };

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
