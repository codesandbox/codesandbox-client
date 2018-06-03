import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import Input from 'common/components/Input';

import {
  CreateDirectoryContainer,
  IconContainer,
  AnimatedChevron,
} from './elements';

import { FOLDER_QUERY } from '../';

const CREATE_FOLDER = gql`
  mutation createCollection($path: String!) {
    createCollection(path: $path) {
      path
    }
  }
`;

export default ({ basePath, noFocus, close, depth }) => {
  let input;
  return (
    <Mutation mutation={CREATE_FOLDER}>
      {mutate => (
        <form
          onSubmit={e => {
            e.preventDefault();
            const path = basePath + '/' + input.value;

            mutate({
              variables: { path },
              optimisticResponse: {
                __typename: 'Mutation',
                createCollection: {
                  path,
                  __typename: 'Collection',
                },
              },
              update: (proxy, { data: { createCollection } }) => {
                // Read the data from our cache for this query.
                const d = proxy.readQuery({
                  query: FOLDER_QUERY,
                });

                // Add our collection from the mutation to the end.
                d.me.collections.push(createCollection);
                // Write our data back to the cache.
                proxy.writeQuery({
                  query: FOLDER_QUERY,
                  data: d,
                });
              },
            });

            input.value = '';

            close();
          }}
        >
          <CreateDirectoryContainer depth={depth + 1}>
            <IconContainer style={{ marginRight: '0.25rem' }}>
              <AnimatedChevron open={false} />
              <AddFolderIcon />
            </IconContainer>{' '}
            <Input
              small
              placeholder="Folder Name"
              style={{ marginRight: '1rem' }}
              onBlur={close}
              onKeyDown={e => {
                if (e.keyCode === 27) {
                  e.preventDefault();
                  close();
                }
              }}
              innerRef={el => {
                if (el) {
                  if (!noFocus) {
                    el.focus();
                    el.select();
                  }
                  input = el;
                }
              }}
              block
            />
          </CreateDirectoryContainer>
        </form>
      )}
    </Mutation>
  );
};
