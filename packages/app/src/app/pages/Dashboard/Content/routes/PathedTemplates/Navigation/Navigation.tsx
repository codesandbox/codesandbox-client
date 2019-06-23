import React from 'react';
import { join } from 'path';
import { Container } from './elements';
import NavigationLink from './NavigationLink';

interface INavigationProps {
  path: string;
  teamId?: string;
}

export const Navigation = ({ path, teamId }: INavigationProps) => {
  const splitPath = path === '/' ? [''] : path.split('/');

  const paths = splitPath.reduce((bases, next) => {
    if (next === '') {
      return [{ url: '/', name: teamId ? 'Our Templates' : 'My Templates' }];
    }

    const baseUrl = bases[bases.length - 1].url;
    return [...bases, { url: join(baseUrl, next), name: next }];
  }, []);

  return (
    <Container>
      {paths.map(({ name, url }, i: number) => (
        // @ts-ignore
        <NavigationLink
          teamId={teamId}
          name={name}
          path={url}
          splittedPath={splitPath}
          i={i}
          key={url}
        />
      ))}
    </Container>
  );
};
