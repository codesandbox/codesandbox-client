import React from 'react';
import { join } from 'path';

import { Container } from './elements';
import NavigationLink from './NavigationLink';

interface INavigationProps {
  path: string;
  teamId?: string;
}

export const Navigation: React.FC<INavigationProps> = ({ path, teamId }) => {
  const splittedPath = path === '/' ? [''] : path.split('/');

  const paths: Array<{ url: string; name: string }> = splittedPath.reduce(
    (bases, next) => {
      if (next === '') {
        return [{ url: '/', name: teamId ? 'Team Sandboxes' : 'My Sandboxes' }];
      }

      const baseUrl = bases[bases.length - 1].url;
      bases.push({ url: join(baseUrl, next), name: next });
      return bases;
    },
    []
  );

  return (
    <Container>
      {paths.map(({ name, url }, i) => (
        <NavigationLink
          teamId={teamId}
          name={name}
          path={url}
          splittedPath={splittedPath}
          i={i}
          key={url}
        />
      ))}
    </Container>
  );
};
