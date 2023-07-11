import * as t from 'app/graphql/types';
import { gql, Query } from 'overmind-graphql';

export const onSubscriptionChanged: Query<
  { teamEvents: t.TeamEvent },
  t.RootSubscriptionTypeTeamEventsArgs
> = gql`
  subscription TeamEvents($teamId: ID!) {
    teamEvents(teamId: $teamId) {
      ... on TeamSubscriptionEvent {
        subscription {
          active
        }
      }
    }
  }
`;
