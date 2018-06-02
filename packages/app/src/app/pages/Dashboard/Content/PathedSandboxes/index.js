import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Sandboxes from '../Sandboxes';

const QUERY = gql`
  query collection($path: String!) {
    me {
      collection(path: $path) {
        id
        sandboxes {
          shortid
          title
          description
          insertedAt
          updatedAt

          source {
            template
          }
        }
      }
    }
  }
`;

export default props => {
  const path = '/' + (props.match.params.path || '');

  return (
    <Query query={QUERY} variables={{ path }}>
      {({ loading, error, data }) => {
        if (error) {
          return <div>Error!</div>;
        }

        return (
          <Sandboxes
            isLoading={loading}
            Header={path}
            sandboxes={
              loading || !data.me.collection ? [] : data.me.collection.sandboxes
            }
          />
        );
      }}
    </Query>
  );
};
