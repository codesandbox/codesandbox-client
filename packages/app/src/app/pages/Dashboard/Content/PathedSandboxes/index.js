import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Sandboxes from '../Sandboxes';

const QUERY = gql`
  {
    me {
      collections {
        id
        sandboxes {
          id
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
  const path = props.match.params.path || '/';

  console.log(path);

  return (
    <Query query={QUERY}>
      {({ loading, error, data }) => {
        if (error) {
          return <div>Error!</div>;
        }

        console.log(data);

        return loading ? (
          <div>Loading...</div>
        ) : (
          <Sandboxes Header={'/'} sandboxes={[]} />
        );
      }}
    </Query>
  );
};
