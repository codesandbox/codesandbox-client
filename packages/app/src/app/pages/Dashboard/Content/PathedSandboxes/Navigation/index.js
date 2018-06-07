// @ts-check
import React from 'react';
import { join } from 'path';

import { Container } from './elements';
import NavigationLink from './NavigationLink';
import SortOptions from './SortOptions';

export default ({ path }) => {
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
          name={name}
          path={url}
          splittedPath={splittedPath}
          i={i}
          key={url}
        />
      ))}

      <SortOptions />
    </Container>
  );
};
