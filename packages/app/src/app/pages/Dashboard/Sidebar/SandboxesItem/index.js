import React from 'react';
import FolderIcon from 'react-icons/lib/md/folder';
import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import ReactShow from 'react-show';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import Input from 'common/components/Input';

import Item from '../Item';

import { Container } from './elements';
import FolderEntry from './FolderEntry';

import getDirectChildren from './utils/get-direct-children';

const FOLDER_QUERY = gql`
  {
    me {
      collections {
        id
        path
      }
    }
  }
`;

// eslint-disable-next-line react/prefer-stateless-function
export default class SandboxesItem extends React.Component {
  state = {
    open: false,
  };

  toggleOpen = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    return (
      <Item
        onClick={this.toggleOpen}
        path={'/dashboard/sandboxes'}
        Icon={InfoIcon}
        name="Sandboxes"
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
                  return <div>Loading...</div>;
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
                      .map(name => (
                        <FolderEntry path={'/' + name} key={name} name={name} />
                      ))}

                    {/* <FolderEntry>
                      <IconContainer>
                        <AddFolderIcon />
                      </IconContainer>
                      <Input block placeholder="Create Directory" />
                    </FolderEntry> */}
                  </Container>
                );
              }}
            </Query>
          </ReactShow>
        )}
      </Item>
    );
  }
}
