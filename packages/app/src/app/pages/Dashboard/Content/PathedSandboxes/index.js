import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Sandboxes from '../Sandboxes';
import Navigation from './Navigation';

import { PATHED_SANDBOXES_CONTENT_QUERY } from '../../queries';

export default props => {
  const path = '/' + (props.match.params.path || '');

  return (
    <Query query={PATHED_SANDBOXES_CONTENT_QUERY} variables={{ path }}>
      {({ loading, error, data }) => {
        if (error) {
          return <div>Error!</div>;
        }

        return (
          <Sandboxes
            isLoading={loading}
            Header={<Navigation path={path} />}
            sandboxes={
              loading || !data.me.collection ? [] : data.me.collection.sandboxes
            }
          />
        );
      }}
    </Query>
  );
};
