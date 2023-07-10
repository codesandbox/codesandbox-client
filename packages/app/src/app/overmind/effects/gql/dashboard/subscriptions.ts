import * as t from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

export const onSubscriptionChanged: Query<
  t.TeamEvent,
  t.RootSubscriptionTypeTeamEventsArgs
> = gql`
  subscription TeamEvents {
    teamEvents(teamId: $teamId) {
      ... on TeamSubscriptionEvent {
        subscription {
          active
        }
      }
    }
  }
`;
