import React from 'react';

import Filter from './Filter';

export default () => (
  <div style={{ flex: 1 }}>
    <Filter title="Templates" operator="or" attributeName="template" noSearch />
    <Filter
      title="Dependencies"
      operator="and"
      attributeName="npm_dependencies.dependency"
    />
    <Filter title="Tags" operator="or" attributeName="tags" />
  </div>
);
