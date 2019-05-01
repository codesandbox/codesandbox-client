import React from 'react';
import getTemplate from '@codesandbox/common/lib/templates';
import { ALGOLIA_DEFAULT_INDEX } from '@codesandbox/common/lib/utils/config';

import Filter from './Filter';
import Sort from './Filter/Sort';
import { Container } from './elements';

function Filters() {
  return (
    <Container>
      <Sort
        title="Sort By"
        items={[
          { value: ALGOLIA_DEFAULT_INDEX, label: 'Views' },
          { value: `${ALGOLIA_DEFAULT_INDEX}_likes`, label: 'Likes' },
        ]}
        defaultRefinement={ALGOLIA_DEFAULT_INDEX}
      />
      <Filter
        title="Templates"
        operator="or"
        attributeName="template"
        transformItems={items =>
          items.map(({ label, ...item }) => {
            const template = getTemplate(label);

            return {
              ...item,
              label: template.name === label ? template.niceName : label,
            };
          })
        }
      />
      <Filter
        title="Dependencies"
        operator="and"
        attributeName="npm_dependencies.dependency"
      />
      <Filter title="Tags" operator="or" attributeName="tags" />
    </Container>
  );
}

export default Filters;
