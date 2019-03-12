import React from 'react';
import { withRouter } from 'react-router-dom';
import FolderEntry from '../../../Sidebar/SandboxesItem/FolderEntry';
import getChildCollections from '../../../utils/getChildCollections';

import { Folder } from './elements';

const getPath = name => {
  const slicedPath = window.location.pathname.split('sandboxes');
  const last = slicedPath[slicedPath.length - 1];
  return last && !last.includes('sandboxes')
    ? `${decodeURIComponent(last)}/${name}`
    : '/' + name;
};

const Folders = ({ loading, me, history, teamId }) => {
  let folderInfo = {};
  if (!loading) {
    folderInfo = getChildCollections(
      me.collections,
      (me.collection || {}).path
    );
  }

  const { children, foldersByPath, folders } = folderInfo;

  return (
    <div
      css={`
        display: flex;
        margin-top: 40px;
      `}
    >
      {!loading &&
        Array.from(children)
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
    </div>
  );
};

export default withRouter(Folders);
