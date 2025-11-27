import {
  ProfileCollectionsQuery,
  ProfileCollectionsQueryVariables,
} from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

import { COLLECTION_BASIC } from '../common/fragments';

export const getProfileCollections: Query<
  ProfileCollectionsQuery,
  ProfileCollectionsQueryVariables
> = gql`
  query ProfileCollections($teamId: ID) {
    me {
      id
      
      collections(teamId: $teamId) {
        ...collectionBasic
      }
    }
  }
  ${COLLECTION_BASIC}
`;

