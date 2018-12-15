// @ts-check
import React from 'react';

import FolderIcon from 'react-icons/lib/md/folder';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import RenameIcon from 'react-icons/lib/md/mode-edit';
import TrashIcon from 'react-icons/lib/md/delete';
import { Mutation } from 'react-apollo';
import { DropTarget, DragSource } from 'react-dnd';
import { inject, observer } from 'mobx-react';
import track from 'common/utils/analytics';
import { client } from 'app/graphql/client';

import ReactShow from 'react-show';
import { join, dirname } from 'path';

import theme from 'common/theme';

import ContextMenu from 'app/components/ContextMenu';

import Input from 'common/components/Input';

import { Container, AnimatedChevron, IconContainer } from './elements';

import getDirectChildren from '../utils/get-direct-children';
import { entryTarget, collectTarget } from '../folder-drop-target';

import CreateFolderEntry from './CreateFolderEntry';

import {
  PATHED_SANDBOXES_FOLDER_QUERY,
  PATHED_SANDBOXES_CONTENT_QUERY,
  DELETE_FOLDER_MUTATION,
  RENAME_FOLDER_MUTATION,
} from '../../../queries';

// eslint-disable-next-line import/no-mutable-exports
let DropFolderEntry = null;
class FolderEntry extends React.Component {
  state = {
    open: this.props.open,
    creatingDirectory: false,
    renamingDirectory: false,
  };

  static defaultProps = {
    depth: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (
      (this.state.open == null || this.state.open === false) &&
      nextProps.open === true
    ) {
      this.setState({ open: true });
    }
  }

  toggleOpen = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(state => ({ open: !state.open }));
  };

  handleBlur = () => {
    this.setState({ renamingDirectory: false, open: true });
  };

  handleSelect = () => {
    this.props.onSelect({
      teamId: this.props.teamId,
      path: this.props.path,
    });
  };

  handleKeyDown = e => {
    if (!this.state.renamingDirectory) {
      if (e.keyCode === 39) {
        // Right arrow

        this.setState({ open: true });
      } else if (e.keyCode === 37) {
        // Left arrow

        this.setState({ open: false });
      }
    }
  };

  render() {
    const {
      name,
      path,
      folders,
      foldersByPath,
      depth,
      isOver,
      canDrop,
      connectDropTarget,
      connectDragSource,
      isDragging,
      basePath,
      teamId,
      onSelect,
      currentPath,
      currentTeamId,
    } = this.props;

    const url = `${basePath}${path}`;
    const children = getDirectChildren(path, folders);

    return connectDropTarget(
      connectDragSource(
        <div>
          <ContextMenu
            items={[
              {
                title: 'Create Folder',
                icon: AddFolderIcon,
                action: () => {
                  this.setState({ creatingDirectory: true, open: true });
                  return true;
                },
              },
              {
                title: 'Rename Folder',
                icon: RenameIcon,
                action: () => {
                  this.setState({ renamingDirectory: true });
                  return true;
                },
              },
              {
                title: 'Delete Folder',
                icon: TrashIcon,
                color: theme.red.darken(0.2)(),
                action: () => {
                  track('Dashboard - Folder Deleted');
                  client.mutate({
                    mutation: DELETE_FOLDER_MUTATION,
                    variables: { path, teamId },

                    refetchQueries: [
                      {
                        query: PATHED_SANDBOXES_CONTENT_QUERY,
                        variables: { path: '/', teamId },
                      },
                    ],
                    update: (cache, { data: { deleteCollection } }) => {
                      const variables = {};
                      if (teamId) {
                        variables.teamId = teamId;
                      }

                      const cacheData = cache.readQuery({
                        query: PATHED_SANDBOXES_FOLDER_QUERY,
                        variables,
                      });

                      cache.writeQuery({
                        query: PATHED_SANDBOXES_FOLDER_QUERY,
                        variables,
                        data: {
                          ...cacheData,
                          me: {
                            ...cacheData.me,
                            collections: deleteCollection,
                          },
                        },
                      });
                    },
                  });
                  return true;
                },
              },
            ]}
          >
            <Container
              as={onSelect ? 'div' : undefined}
              onClick={onSelect ? this.handleSelect : undefined}
              style={{
                color: isOver && canDrop ? theme.secondary() : undefined,
                backgroundColor:
                  isOver && canDrop ? 'rgba(0, 0, 0, 0.3)' : undefined,

                ...(currentPath === path && currentTeamId === teamId
                  ? {
                      borderColor: theme.secondary(),
                      color: 'white',
                    }
                  : {}),
              }}
              exact
              depth={depth}
              to={url}
              onKeyDown={this.handleKeyDown}
              tabIndex={0}
            >
              <IconContainer>
                <AnimatedChevron
                  onClick={this.toggleOpen}
                  open={this.state.open}
                />
                <FolderIcon />
              </IconContainer>{' '}
              {this.state.renamingDirectory ? (
                <Mutation mutation={RENAME_FOLDER_MUTATION}>
                  {(mutate, { loading }) => {
                    let input;

                    const submit = e => {
                      track('Dashboard - Folder Renamed');
                      if (e) {
                        e.preventDefault();
                      }

                      mutate({
                        variables: {
                          path,
                          newPath: join(dirname(path), input.value),
                          teamId,
                          newTeamId: teamId,
                        },
                        update: (cache, { data: { renameCollection } }) => {
                          const variables = {};
                          if (teamId) {
                            variables.teamId = teamId;
                          }

                          const cacheData = cache.readQuery({
                            query: PATHED_SANDBOXES_FOLDER_QUERY,
                            variables,
                          });

                          cache.writeQuery({
                            query: PATHED_SANDBOXES_FOLDER_QUERY,
                            data: {
                              ...cacheData,
                              me: {
                                ...cacheData.me,
                                collections: renameCollection,
                              },
                            },
                            variables,
                          });
                        },
                      });

                      this.handleBlur();
                    };

                    return loading ? (
                      input.value
                    ) : (
                      <form onSubmit={submit}>
                        <Input
                          block
                          ref={node => {
                            if (node) {
                              input = node;
                              node.focus();
                              node.select();
                            }
                          }}
                          defaultValue={name}
                          onBlur={this.handleBlur}
                          onKeyDown={e => {
                            if (e.keyCode === 27) {
                              // Escape

                              this.handleBlur();
                            }
                          }}
                        />
                      </form>
                    );
                  }}
                </Mutation>
              ) : (
                name
              )}
            </Container>
          </ContextMenu>

          <ReactShow
            show={children.size > 0 && !isDragging && this.state.open}
            duration={250}
          >
            {Array.from(children)
              .sort()
              .map(childName => {
                const childPath = join(path, childName);

                return (
                  <DropFolderEntry
                    path={childPath}
                    basePath={basePath}
                    teamId={teamId}
                    folders={folders}
                    foldersByPath={foldersByPath}
                    key={childName}
                    name={childName}
                    depth={this.props.depth + 1}
                    open={currentPath.indexOf(childPath) === 0}
                    onSelect={onSelect}
                    currentPath={currentPath}
                    currentTeamId={currentTeamId}
                  />
                );
              })}
          </ReactShow>
          {this.state.creatingDirectory && (
            <CreateFolderEntry
              teamId={teamId}
              depth={this.props.depth}
              close={() => this.setState({ creatingDirectory: false })}
              basePath={path}
            />
          )}
        </div>
      )
    );
  }
}

const entrySource = {
  canDrag: () => true,

  beginDrag: props => {
    if (props.closeTree) props.closeTree();
    return {
      path: props.path,
      teamId: props.teamId,
    };
  },
};
const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

DropFolderEntry = inject('store', 'signals')(
  DropTarget(['SANDBOX', 'FOLDER'], entryTarget, collectTarget)(
    DragSource('FOLDER', entrySource, collectSource)(observer(FolderEntry))
  )
);

export default DropFolderEntry;
