import React from 'react';

import FolderIcon from 'react-icons/lib/md/folder';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import RenameIcon from 'react-icons/lib/md/mode-edit';
import TrashIcon from 'react-icons/lib/md/delete';
import { Mutation } from 'react-apollo';
import { DropTarget, DragSource } from 'react-dnd';
import track from '@codesandbox/common/lib/utils/analytics';
import { withRouter } from 'react-router-dom';
import { client } from 'app/graphql/client';

import { Animate as ReactShow } from 'react-show';
import { join, dirname } from 'path';

import theme from '@codesandbox/common/lib/theme';

import { ContextMenu } from 'app/components/ContextMenu';

import Input from '@codesandbox/common/lib/components/Input';
import {
  ARROW_LEFT,
  ARROW_RIGHT,
  ESC,
} from '@codesandbox/common/lib/utils/keycodes';

import {
  PathedSandboxesFoldersQuery,
  PathedSandboxesFoldersQueryVariables,
} from 'app/graphql/types';
import { Tooltip } from '@codesandbox/components';
import { Container, AnimatedChevron, IconContainer } from './elements';

import getDirectChildren from '../../utils/get-direct-children';
import { entryTarget, collectTarget } from '../folder-drop-target';

import { CreateFolderEntry } from './CreateFolderEntry';

import {
  PATHED_SANDBOXES_FOLDER_QUERY,
  PATHED_SANDBOXES_CONTENT_QUERY,
  DELETE_FOLDER_MUTATION,
  RENAME_FOLDER_MUTATION,
} from '../queries';

type Props = {
  name: string;
  path: string;
  disabled?: string | null;
  url?: string;
  readOnly?: string;
  folders: { path: string }[];
  foldersByPath: { [path: string]: { path: string } };
  depth?: number;
  toToggle?: boolean;
  allowCreate?: boolean;
  open?: boolean;
  basePath: string;
  teamId: string;
  onSelect: (params: { teamId: string; path: string }) => void;
  currentPath: string | null;
  currentTeamId: string;

  // dnd handlers
  canDrop?: boolean;
  isOver?: boolean;
  isDragging?: boolean;
  connectDropTarget?: any;
  connectDragSource?: any;
};

type State = {
  open: boolean;
  creatingDirectory: boolean;
  renamingDirectory: boolean;
};

// eslint-disable-next-line import/no-mutable-exports
let DropFolderEntry: React.ComponentClass<Props, State> = null;
class FolderEntry extends React.Component<Props, State> {
  state = {
    open: this.props.open,
    creatingDirectory: false,
    renamingDirectory: false,
  };

  static defaultProps = {
    depth: 0,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
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
    if (!this.props.disabled) {
      this.props.onSelect({
        teamId: this.props.teamId,
        path: this.props.path,
      });
    }
  };

  handleKeyDown = e => {
    if (!this.state.renamingDirectory) {
      if (e.keyCode === ARROW_RIGHT) {
        this.setState({ open: true });
      } else if (e.keyCode === ARROW_LEFT) {
        this.setState({ open: false });
      }
    }
  };

  render() {
    const {
      name,
      path,
      url,
      folders,
      foldersByPath,
      depth,
      isOver,
      toToggle = true,
      canDrop,
      connectDropTarget,
      connectDragSource,
      isDragging,
      basePath,
      teamId,
      onSelect,
      currentPath,
      currentTeamId,
      readOnly,
      disabled,
      allowCreate = !readOnly,
    } = this.props;

    const children = getDirectChildren(path, folders);

    const menuItems = readOnly
      ? []
      : [
          {
            title: 'Rename folder',
            icon: RenameIcon,
            action: () => {
              this.setState({ renamingDirectory: true });
              return true;
            },
          },
          {
            title: 'Delete folder',
            icon: TrashIcon,
            color: theme.red.darken(0.2)(),
            action: () => {
              track('Dashboard - Folder Deleted');

              const params: { path: string; teamId?: string } = {
                path,
              };
              if (teamId) {
                params.teamId = teamId;
              }

              client.mutate({
                mutation: DELETE_FOLDER_MUTATION,
                variables: params,

                refetchQueries: [
                  {
                    query: PATHED_SANDBOXES_CONTENT_QUERY,
                    variables: { path: '/', teamId },
                  },
                ],
                update: (cache, { data: { deleteCollection } }) => {
                  const variables: PathedSandboxesFoldersQueryVariables = {
                    teamId,
                  };

                  const cacheData = cache.readQuery<
                    PathedSandboxesFoldersQuery,
                    PathedSandboxesFoldersQueryVariables
                  >({
                    query: PATHED_SANDBOXES_FOLDER_QUERY,
                    variables,
                  });

                  cache.writeQuery({
                    query: PATHED_SANDBOXES_FOLDER_QUERY,
                    variables,
                    data: {
                      ...cacheData,
                      me: {
                        // @ts-ignore
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
        ];

    if (allowCreate) {
      menuItems.unshift({
        title: 'Create folder',
        icon: AddFolderIcon,
        action: () => {
          this.setState({ creatingDirectory: true, open: true });
          return true;
        },
      });
    }

    // TODO: fix the typings of this container and make sure it works with `as`
    const UnTypedContainer = Container as any;

    return connectDropTarget(
      connectDragSource(
        <div>
          <ContextMenu items={menuItems}>
            <Tooltip label={disabled || null}>
              <UnTypedContainer
                as={onSelect ? 'div' : undefined}
                onClick={onSelect ? this.handleSelect : undefined}
                style={{
                  color: isOver && canDrop ? theme.secondary() : undefined,
                  backgroundColor:
                    isOver && canDrop ? 'rgba(0, 0, 0, 0.3)' : undefined,

                  ...(currentPath &&
                  decodeURIComponent(currentPath) === path &&
                  currentTeamId === teamId
                    ? {
                        borderColor: theme.secondary(),
                        color: 'white',
                      }
                    : {}),
                }}
                disabled={disabled}
                exact
                depth={depth}
                to={url}
                onKeyDown={this.handleKeyDown}
                tabIndex={0}
              >
                <IconContainer>
                  {toToggle ? (
                    <AnimatedChevron
                      onClick={this.toggleOpen}
                      open={this.state.open}
                      style={{ opacity: children.size > 0 ? 1 : 0 }}
                    />
                  ) : null}
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
                            const variables: { teamId?: string } = {};
                            if (teamId) {
                              variables.teamId = teamId;
                            }

                            const cacheData: { me: any } = cache.readQuery({
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
                              if (e.keyCode === ESC) {
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
              </UnTypedContainer>
            </Tooltip>
          </ContextMenu>

          <ReactShow
            show={
              children.size > 0 && !isDragging && this.state.open && toToggle
            }
            duration={250}
            stayMounted={false}
            style={{
              height: 'auto',
              overflow: 'hidden',
            }}
            transitionOnMount
            start={{
              height: 0, // The starting style for the component.
              // If the 'leave' prop isn't defined, 'start' is reused!
            }}
          >
            {Array.from(children)
              .sort()
              .map((childName: string) => {
                const childPath = join(path, childName);
                const childUrl = join(url, encodeURIComponent(childName));

                return (
                  <DropFolderEntry
                    path={childPath}
                    url={childUrl}
                    basePath={basePath}
                    teamId={teamId}
                    folders={folders}
                    foldersByPath={foldersByPath}
                    key={childName}
                    name={childName}
                    depth={this.props.depth + 1}
                    open={currentPath && currentPath.indexOf(childPath) === 0}
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
  canDrag: props => !props.readOnly,

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

DropFolderEntry = (withRouter(
  // @ts-ignore Don't know how to mix dnd and react-router with right typings
  DropTarget(
    ['SANDBOX', 'FOLDER'],
    entryTarget,
    collectTarget
  )(DragSource('FOLDER', entrySource, collectSource)(FolderEntry))
) as unknown) as React.ComponentClass<Props, State>;

export { DropFolderEntry };
