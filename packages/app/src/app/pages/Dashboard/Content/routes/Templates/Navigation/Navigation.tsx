import React from 'react';
import { Container, NavigationLink, Number } from './elements';

interface INavigationProps {
  teamId?: string;
  number?: number;
}

export const Navigation = ({ teamId, number }: INavigationProps) => (
  <Container>
    <NavigationLink
      to={
        teamId ? `/dashboard/teams/${teamId}/templates` : `/dashboard/templates`
      }
    >
      {teamId ? 'Team Templates' : 'My Templates'}
    </NavigationLink>

    {number == null && <Number>{number}</Number>}
  </Container>
);
