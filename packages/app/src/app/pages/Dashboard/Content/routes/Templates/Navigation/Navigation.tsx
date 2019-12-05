import React from 'react';
import { Container, NavigationLink, Number } from './elements';

interface INavigationProps {
  teamId?: string;
  number?: number;
  bookmarked?: boolean;
}

export const Navigation = ({
  teamId,
  number,
  bookmarked,
}: INavigationProps) => (
  <Container>
    {bookmarked ? (
      <NavigationLink
        to={
          teamId
            ? `/dashboard/teams/${teamId}/templates/bookmarked`
            : `/dashboard/templates/bookmarked`
        }
      >
        {teamId ? 'Team Bookmarked Templates' : 'Bookmarked Templates'}
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
