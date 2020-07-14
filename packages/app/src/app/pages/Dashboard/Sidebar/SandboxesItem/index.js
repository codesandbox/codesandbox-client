import React from 'react';
import { withRouter } from 'react-router-dom';
import { DropTarget } from 'react-dnd';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import { Query } from 'react-apollo';
import { DelayedAnimation } from 'app/components/DelayedAnimation';
import InfoIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/sandbox.svg';
import { Item } from '../Item';
import { Container } from './elements';
import { DropFolderEntry } from './FolderEntry';
import { CreateFolderEntry } from './FolderEntry/CreateFolderEntry';

import { entryTarget, collectTarget } from './folder-drop-target';

import getChildCollections from '../../utils/get-child-collections';

import { PATHED_SANDBOXES_FOLDER_QUERY } from '../../queries';

class SandboxesItemComponent extends React.Component {
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
      isOver,
      canDrop,
      teamId,
      teamName,
      connectDropTarget,
      openByDefault,
      onSelect,
      currentPath,
      currentTeamId,
      selectedSandboxes,
    } = this.props;

    const basePath = teamId
      ? `/dashboard/teams/${teamId}/sandboxes`
      : '/dashboard/sandboxes';

    return connectDropTarget(
      <div>
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

            if (error || !data.me) {
              return <div>Error!</div>;
            }
            const { children, folders, foldersByPath } = getChildCollections(
              data.me.collections
            );

            return (
              <Container>
                <DropFolderEntry
                  selectedSandboxes={selectedSandboxes}
                  basePath={basePath}
                  teamId={teamId}
                  path="/Drafts"
                  url="/"
                  folders={[]}
                  foldersByPath={{}}
                  readOnly
                  name="Drafts"
                  open
                  onSelect={onSelect}
                  currentPath={currentPath}
                  currentTeamId={currentTeamId}
                />

                <DropFolderEntry
                  selectedSandboxes={selectedSandboxes}
                  basePath={basePath}
                  teamId={teamId}
                  path="/"
                  url="/"
                  folders={folders}
                  foldersByPath={foldersByPath}
                  name="All Sandboxes"
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

export const SandboxesItem = DropTarget(
  ['SANDBOX', 'FOLDER'],
  entryTarget,
  collectTarget
)(withRouter(SandboxesItemComponent));
