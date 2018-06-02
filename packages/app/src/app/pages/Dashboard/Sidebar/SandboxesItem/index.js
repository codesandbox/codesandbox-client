import React from 'react';
import ReactShow from 'react-show';
import { Route } from 'react-router-dom';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import DelayedAnimation from 'app/components/DelayedAnimation';
import ContextMenu from 'app/components/ContextMenu';

import Item from '../Item';

import { Container } from './elements';
import FolderEntry from './FolderEntry';
import CreateFolderEntry from './FolderEntry/CreateFolderEntry';

import getDirectChildren from './utils/get-direct-children';

export const FOLDER_QUERY = gql`
  {
    me {
      collections {
        path
      }
    }
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
export default class SandboxesItem extends React.Component {
  state = {
    open: false,
    creatingDirectory: false,
  };

  toggleOpen = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    return (
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
        ]}
      >
        <Item
          onClick={this.toggleOpen}
          path={'/dashboard/sandboxes'}
          Icon={InfoIcon}
          name="My Sandboxes"
        >
          {({ match }) => (
            <ReactShow
              show={this.state.open || !!match}
              duration={250}
              unmountOnHide
            >
              <Query query={FOLDER_QUERY}>
                {({ data, loading, error }) => {
                  if (loading) {
                    return (
                      <DelayedAnimation
                        style={{
                          margin: '1rem',
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                        delay={600}
                      >
                        Loading...
                      </DelayedAnimation>
                    );
                  }

                  if (error) {
                    return <div>Error!</div>;
                  }

                  const folders = data.me.collections;
                  const children = getDirectChildren('/', folders);

                  return (
                    <Container>
                      {Array.from(children)
                        .sort()
                        .map(name => {
                          const path = '/' + name;
                          return (
                            <Route
                              key={path}
                              path={`/dashboard/sandboxes${path}`}
                            >
                              {({ match: childMatch }) => (
                                <FolderEntry
                                  path={path}
                                  folders={data.me.collections}
                                  name={name}
                                  open={!!childMatch}
                                />
                              )}
                            </Route>
                          );
                        })}
                      {(this.state.creatingDirectory ||
                        children.size === 0) && (
                        <CreateFolderEntry
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
            </ReactShow>
          )}
        </Item>
      </ContextMenu>
    );
  }
}
