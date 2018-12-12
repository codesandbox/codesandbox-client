import React from 'react';
import getTemplate from 'common/templates';

import Filter from './Filter';
import { Container } from './elements';

function Filters() {
  return (
    <Container>
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
