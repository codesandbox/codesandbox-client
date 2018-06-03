// @ts-check
import React from 'react';
import { join } from 'path';
import { Container, NavigationLink } from './elements';

export default ({ path }: { path: string }) => {
  const splittedPath = path === '/' ? [''] : path.split('/');

  const paths = splittedPath.reduce((bases, next) => {
    if (next === '') {
      return [{ url: '/', name: 'My Sandboxes' }];
    }

    const baseUrl = bases[bases.length - 1].url;
    bases.push({ url: join(baseUrl, next), name: next });
    return bases;
  }, []);

  return (
    <Container>
      {paths.map(({ name, url }, i) => (
        <NavigationLink
          to={`/dashboard/sandboxes${url}`}
          last={i === splittedPath.length - 1}
        >
          {name}
        </NavigationLink>
      ))}
    </Container>
  );
};
