// @ts-check
import React from 'react';
import { join } from 'path';

import { Container, FilterContainer } from './elements';
import NavigationLink from './NavigationLink';
import SortOptions from './SortOptions';
import FilterOptions from './FilterOptions';

export default ({ path, possibleTemplates }) => {
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

      <FilterContainer>
        <FilterOptions possibleTemplates={possibleTemplates} />
        <SortOptions />
      </FilterContainer>
    </Container>
  );
};
