import React from 'react';
import { Collapsible } from '.';

export default {
  title: 'components/Collapsible',
  component: Collapsible,
};

// replace the text inside with Text variants when available
export const Basic = () => (
  <Collapsible title="Files">
    The move from Cerebral
    <br />
    This is a static template with no bundling
  </Collapsible>
);

export const DefaultOpen = () => (
  <Collapsible title="Files" defaultOpen>
    The move from Cerebral
    <br />
    This is a static template with no bundling
  </Collapsible>
);
