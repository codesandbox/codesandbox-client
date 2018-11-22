import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import { DropTarget } from 'react-dnd';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import { inject, observer } from 'mobx-react';

import { Query } from 'react-apollo';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import DelayedAnimation from 'app/components/DelayedAnimation';

import Item from '../Item';

import { Container } from './elements';
import FolderEntry from './FolderEntry';
import CreateFolderEntry from './FolderEntry/CreateFolderEntry';

import { entryTarget, collectTarget } from './folder-drop-target';

import getDirectChildren from './utils/get-direct-children';

import { PATHED_SANDBOXES_FOLDER_QUERY } from '../../queries';

class SandboxesItem extends React.Component {
  state = {
    creatingDirectory: false,
  };

  render() {
    const {
      isOver,
      canDrop,
      teamId,
      connectDropTarget,
      openByDefault,
    } = this.props;

    const basePath = teamId
      ? `/dashboard/teams/${teamId}/sandboxes`
      : '/dashboard/sandboxes';

    return connectDropTarget(
      <div>
        <Item
          openByDefault={openByDefault}
          path={basePath}
          Icon={InfoIcon}
          name={teamId ? 'Our Sandboxes' : 'My Sandboxes'}
          style={
            isOver && canDrop ? { backgroundColor: 'rgba(0, 0, 0, 0.3)' } : {}
          }
          contextItems={[
            {
              title: 'Create Folder',
              icon: AddFolderIcon,
              action: () => {
                this.setState({ creatingDirectory: true, open: true });
                return true;
              },
            },
          ]}
        >
          {() => (
            <Query variables={{ teamId }} query={PATHED_SANDBOXES_FOLDER_QUERY}>
              {({ data, loading, error }) => {
                if (loading) {
                  return (
                    <DelayedAnimation
                      style={{
                        margin: '1rem',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                      delay={0.6}
                    >
                      Loading...
                    </DelayedAnimation>
                  );
                }

                if (error) {
                  return <div>Error!</div>;
                }

                const folders = data.me.collections;
                const foldersByPath = {};

                folders.forEach(collection => {
                  foldersByPath[collection.path] = collection;
                });
                const children = getDirectChildren('/', folders);

                return (
                  <Container>
                    {Array.from(children)
                      .sort()
                      .map(name => {
                        const path = '/' + name;
                        return (
                          <Route key={path} path={`${basePath}${path}`}>
                            {({ match: childMatch }) => (
                              <FolderEntry
                                basePath={basePath}
                                teamId={teamId}
                                path={path}
                                folders={folders}
                                foldersByPath={foldersByPath}
                                name={name}
                                open={childMatch ? !!childMatch : childMatch}
                              />
                            )}
                          </Route>
                        );
                      })}
                    {(this.state.creatingDirectory || children.size === 0) && (
                      <CreateFolderEntry
                        teamId={teamId}
                        noFocus={!this.state.creatingDirectory}
                        basePath=""
                        close={() => {
                          this.setState({ creatingDirectory: false });
                        }}
                      />
                    )}
                  </Container>
                );
              }}
            </Query>
          )}
        </Item>
      </div>
    );
  }
}

export default inject('store', 'signals')(
  DropTarget(['SANDBOX', 'FOLDER'], entryTarget, collectTarget)(
    withRouter(observer(SandboxesItem))
  )
);
