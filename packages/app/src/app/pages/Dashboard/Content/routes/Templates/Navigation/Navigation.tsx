import React from 'react';
import { Container, NavigationTitle, Number } from './elements';

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
      <NavigationTitle>
        {teamId ? 'Bookmarked Templates' : 'Bookmarked Templates'}
      </NavigationTitle>
    ) : (
      <NavigationTitle>
        {teamId ? 'Team Templates' : 'My Templates'}
      </NavigationTitle>
    )}

    {number != null && <Number>{number}</Number>}
  </Container>
);
