// @ts-check
import React, { Fragment } from 'react';
import FolderIcon from 'react-icons/lib/md/folder';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import RenameIcon from 'react-icons/lib/md/mode-edit';
import TrashIcon from 'react-icons/lib/md/delete';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ReactShow from 'react-show';
import { Route } from 'react-router-dom';
import { join, dirname } from 'path';

import theme from 'common/theme';
import { client } from 'app/graphql/client';
import ContextMenu from 'app/components/ContextMenu';

import Input from 'common/components/Input';

import { Container, AnimatedChevron, IconContainer } from './elements';

import getDirectChildren from '../utils/get-direct-children';

import CreateFolderEntry from './CreateFolderEntry';

import { FOLDER_QUERY } from '../';

const DELETE_FOLDER = gql`
  mutation deleteCollection($path: String!) {
    deleteCollection(path: $path) {
      path
    }
  }
`;

const RENAME_FOLDER = gql`
  mutation renameCollection($path: String!, $newPath: String!) {
    renameCollection(path: $path, newPath: $newPath) {
      path
    }
  }
`;

export default class FolderEntry extends React.Component {
  state = {
    open: this.props.open,
    creatingDirectory: false,
    renamingDirectory: false,
  };

  static defaultProps = {
    depth: 0,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.open == null && nextProps.open === true) {
      this.setState({ open: true });
    }
  }

  toggleOpen = e => {
    e.preventDefault();
    this.setState(state => ({ open: !state.open }));
  };

  handleBlur = () => {
    this.setState({ renamingDirectory: false, open: true });
  };

  handleKeyDown = e => {
    if (e.keyCode === 39) {
      // Right arrow

      this.setState({ open: true });
    } else if (e.keyCode === 37) {
      // Left arrow

      this.setState({ open: false });
    }
  };

  render() {
    const { name, path, folders, depth } = this.props;

    const url = `/dashboard/sandboxes${path}`;
    const children = getDirectChildren(path, folders);

    return (
      <Fragment>
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
                client.mutate({
                  mutation: DELETE_FOLDER,
                  variables: { path },
                  update: (cache, { data: { deleteCollection } }) => {
                    const cacheData = cache.readQuery({ query: FOLDER_QUERY });
                    cacheData.me.collections = deleteCollection;

                    cache.writeQuery({ query: FOLDER_QUERY, data: cacheData });
                  },
                });
                return true;
              },
            },
          ]}
        >
          <Container
            activeStyle={{
              borderColor: theme.secondary(),
              color: 'white',
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
              <Mutation mutation={RENAME_FOLDER}>
                {(mutate, { loading }) => {
                  let input;

                  const submit = e => {
                    if (e) {
                      e.preventDefault();
                    }

                    mutate({
                      variables: {
                        path,
                        newPath: join(dirname(path), input.value),
                      },
                      update: (cache, { data: { renameCollection } }) => {
                        const cacheData = cache.readQuery({
                          query: FOLDER_QUERY,
                        });
                        cacheData.me.collections = renameCollection;

                        cache.writeQuery({
                          query: FOLDER_QUERY,
                          data: cacheData,
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
                        innerRef={node => {
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

        <ReactShow show={children.size > 0 && this.state.open} duration={250}>
          {Array.from(children)
            .sort()
            .map(childName => {
              const childPath = join(path, childName);

              return (
                <Route
                  key={childPath}
                  path={`/dashboard/sandboxes${childPath}`}
                >
                  {({ match }) => (
                    <FolderEntry
                      path={childPath}
                      folders={folders}
                      key={childName}
                      name={childName}
                      depth={this.props.depth + 1}
                      open={match ? !!match : match}
                    />
                  )}
                </Route>
              );
            })}
        </ReactShow>
        {this.state.creatingDirectory && (
          <CreateFolderEntry
            depth={this.props.depth}
            close={() => this.setState({ creatingDirectory: false })}
            basePath={path}
          />
        )}
      </Fragment>
    );
  }
}
