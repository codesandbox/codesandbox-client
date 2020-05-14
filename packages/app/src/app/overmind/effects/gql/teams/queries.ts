import { TeamsQuery, TeamsQueryVariables } from 'app/graphql/types';
import gql from 'graphql-tag';
import { Query } from 'overmind-graphql';

export const teams: Query<TeamsQuery, TeamsQueryVariables> = gql`
  query Teams {
    me {
      teams {
        id
        name
      }
    }
  }
`;
