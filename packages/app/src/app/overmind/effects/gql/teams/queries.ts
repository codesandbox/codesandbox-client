import { TeamsQuery, TeamsQueryVariables } from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

export const teams: Query<TeamsQuery, TeamsQueryVariables> = gql`
  query Teams {
    me {
      workspaces {
        id
        name
      }
    }
  }
`;
