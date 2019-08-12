import React from 'react';
import { Container, NavigationLink, Number } from './elements';

interface INavigationProps {
  teamId?: string;
  number?: number;
  following?: boolean;
}

export const Navigation = ({ teamId, number, following }: INavigationProps) => (
  <Container>
    {following ? (
      <NavigationLink
        to={
          teamId
            ? `/dashboard/teams/${teamId}/templates/followed`
            : `/dashboard/templates/followed`
        }
      >
        {teamId ? 'Team Followed Templates' : 'Followed Templates'}
      </NavigationLink>
    ) : (
      <NavigationLink
        to={
          teamId
            ? `/dashboard/teams/${teamId}/templates`
            : `/dashboard/templates`
        }
      >
        {teamId ? 'Team Templates' : 'My Templates'}
      </NavigationLink>
    )}

    {number == null && <Number>{number}</Number>}
  </Container>
);
