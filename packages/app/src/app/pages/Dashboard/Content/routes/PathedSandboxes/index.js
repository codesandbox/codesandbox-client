import React from 'react';
import { uniq } from 'lodash-es';
import { withRouter } from 'react-router-dom';
import { inject, observer, Observer } from 'mobx-react';
import { Query } from 'react-apollo';
import { basename } from 'path';
import Sandboxes from '../../Sandboxes';
import Navigation from './Navigation';
import CreateNewSandbox from '../../CreateNewSandbox';
import getMostUsedTemplate from '../../../utils/getMostUsedTemplate';
import getChildCollections from '../../../utils/getChildCollections';
import FolderEntry from '../../../Sidebar/SandboxesItem/FolderEntry';
import { Folder } from './elements';

import { PATHED_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const getPath = name => {
  const slicedPath = window.location.pathname.split('sandboxes');
  const last = slicedPath[slicedPath.length - 1];
  return last && !last.includes('sandboxes') ? `${last}/${name}` : '/' + name;
};

const PathedSandboxes = props => {
  const path = '/' + (props.match.params.path || '');
  const teamId = props.match.params.teamId;

  document.title = `${basename(path) || 'Dashboard'} - CodeSandbox`;
  // {/* <Folder
  //                                 name={name}
  //                                 path={window.location.pathname + '/' + name}
  //                               /> */}
  return (
    <Query query={PATHED_SANDBOXES_CONTENT_QUERY} variables={{ path, teamId }}>
      {({ loading, error, data }) => (
        <Observer>
          {() => {
            if (error) {
              console.error(error);
              return <div>Error!</div>;
            }

            const sandboxes =
              loading || !data.me.collection
                ? []
                : data.me.collection.sandboxes;

            const possibleTemplates = uniq(
              sandboxes.map(x => x.source.template)
            );

            const orderedSandboxes = props.store.dashboard.getFilteredSandboxes(
              sandboxes
            );

            let mostUsedTemplate = null;
            if (!loading) {
              try {
                mostUsedTemplate = getMostUsedTemplate(sandboxes);
              } catch (e) {
                // Not critical
              }
            }

            let folderInfo = {};
            if (!loading) {
              folderInfo = getChildCollections(
                data.me.collections,
                (data.me.collection || {}).path
              );
            }

            const { children, foldersByPath, folders } = folderInfo;

            return (
              <>
                <Sandboxes
                  ExtraElement={({ style }) => (
                    <CreateNewSandbox
                      collectionId={
                        data &&
                        data.me &&
                        data.me.collection &&
                        data.me.collection.id
                      }
                      mostUsedSandboxTemplate={mostUsedTemplate}
                      style={style}
                    />
                  )}
                  isLoading={loading}
                  possibleTemplates={possibleTemplates}
                  Header={<Navigation teamId={teamId} path={path} />}
                  Folders={
                    <div
                      css={`
                        display: flex;
                        margin-top: 40px;
                      `}
                    >
                      {!loading && (
                        <>
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
                                    props.history.push(
                                      window.location.pathname + '/' + name
                                    );
                                  }}
                                  currentPath={window.location.pathname}
                                  currentTeamId={teamId}
                                />
                              </Folder>
                            ))}
                        </>
                      )}
                    </div>
                  }
                  sandboxes={orderedSandboxes}
                />
              </>
            );
          }}
        </Observer>
      )}
    </Query>
  );
};

export default inject('store', 'signals')(
  observer(withRouter(PathedSandboxes))
);
