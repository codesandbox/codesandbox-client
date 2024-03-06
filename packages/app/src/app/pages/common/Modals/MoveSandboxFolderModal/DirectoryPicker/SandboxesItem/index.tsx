import React from 'react';
import { withRouter } from 'react-router-dom';
import { DropTarget } from 'react-dnd';
import { Query } from 'react-apollo';
import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { ROOT_COLLECTION_NAME } from 'app/pages/Dashboard/Sidebar';
import { Container } from './elements';
import { DropFolderEntry } from './FolderEntry';
import { CreateFolderEntry } from './FolderEntry/CreateFolderEntry';

import { entryTarget, collectTarget } from './folder-drop-target';

import getChildCollections from '../utils/get-child-collections';

import { PATHED_SANDBOXES_FOLDER_QUERY } from './queries';

export interface SandboxesItemComponentProps {
  teamId: string | null;
  onSelect: (args: { path: string | null; teamId: string | null }) => void;
  currentPath: string | null;
  currentTeamId: string | null;
  connectDropTarget?: any;
}

class SandboxesItemComponent extends React.Component<
  SandboxesItemComponentProps
> {
  state = {
    creatingDirectory: false,
  };

  handleSelect = () => {
    this.props.onSelect({
      path: '/',
      teamId: this.props.teamId,
    });
  };

  render() {
    const {
      teamId,
      connectDropTarget,
      onSelect,
      currentPath,
      currentTeamId,
    } = this.props;

    const basePath = teamId
      ? `/dashboard/teams/${teamId}/sandboxes`
      : '/dashboard/sandboxes';

    return connectDropTarget(
      <div>
        <Query
          variables={{ teamId }}
          query={PATHED_SANDBOXES_FOLDER_QUERY}
          fetchPolicy="network-only"
        >
          {result => {
            if (result.loading) {
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

            const { data } = result;
            if (result.error || !data.me) {
              return <div>Error!</div>;
            }
            const { children, folders, foldersByPath } = getChildCollections(
              data.me.collections
            );

            const disabledMessage =
              teamId == null
                ? "It's currently not possible to move sandboxes to 'Sandboxes' in a personal account"
                : null;

            return (
              <Container>
                <DropFolderEntry
                  basePath={basePath}
                  teamId={teamId}
                  path="/"
                  url="/"
                  folders={folders}
                  foldersByPath={foldersByPath}
                  name={ROOT_COLLECTION_NAME}
                  disabled={disabledMessage}
                  open
                  onSelect={onSelect}
                  currentPath={currentPath}
                  currentTeamId={currentTeamId}
                />

                {(this.state.creatingDirectory || children.size === 0) && (
                  <CreateFolderEntry
                    teamId={teamId}
                    noFocus={!this.state.creatingDirectory}
                    basePath=""
                    depth={1}
                    close={() => {
                      this.setState({ creatingDirectory: false });
                    }}
                  />
                )}
              </Container>
            );
          }}
        </Query>
      </div>
    );
  }
}

export const SandboxesItem = (DropTarget(
  ['FOLDER'],
  entryTarget,
  collectTarget
  // @ts-ignore
)(withRouter(SandboxesItemComponent)) as unknown) as React.ComponentClass<
  SandboxesItemComponentProps
>;
