import React from 'react';
import { join } from 'path';

import { useOvermind } from 'app/overmind';
import { Container } from './elements';
import { NavigationLink } from './NavigationLink';

interface INavigationProps {
  path: string;
  teamId?: string;
}

export const Navigation: React.FC<INavigationProps> = ({ path, teamId }) => {
  const { state } = useOvermind();

  const splittedPath = path === '/' ? [''] : path.split('/');

  const paths = splittedPath.reduce((bases, next) => {
    if (next === '') {
      return [{ url: '/', name: teamId ? 'Team Sandboxes' : 'My Sandboxes' }];
    }

    const baseUrl = bases[bases.length - 1].url;
    bases.push({ url: join(baseUrl, next), name: next });
    return bases;
  }, []);

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
          // Give this prop to make drag & drop work
          selectedSandboxes={state.dashboard.selectedSandboxes}
        />
      ))}
    </Container>
  );
};
