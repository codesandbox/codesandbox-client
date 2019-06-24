import React from 'react';
import { Container } from './elements';
import { NavigationLink } from './elements';

interface INavigationProps {
  teamId?: string;
}

export const Navigation = ({ teamId }: INavigationProps) => (
  <Container>
    <NavigationLink
      to={
        teamId ? `/dashboard/teams/${teamId}/templates` : `/dashboard/templates`
      }
    >
      {teamId ? 'Our Templates' : 'My Templates'}
    </NavigationLink>
  </Container>
);
