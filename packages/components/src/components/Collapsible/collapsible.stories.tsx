import React from 'react';

import { Element, Text } from '../..';

import { Collapsible } from '.';

export default {
  title: 'components/Collapsible',
  component: Collapsible,
};

export const Basic = () => (
  <Collapsible title="Sandbox Info">
    <Element marginX={2}>
      <Text weight="medium" block marginBottom={2}>
        The move from Cerebral
      </Text>

      <Text variant="muted">This is a static template with no bundling</Text>
    </Element>
  </Collapsible>
);

export const DefaultOpen = () => (
  <Collapsible title="Sandbox Info" defaultOpen>
    <Element marginX={2}>
      <Text as="div" weight="medium" block marginBottom={2}>
        The move from Cerebral
      </Text>

      <Text variant="muted">This is a static template with no bundling</Text>
    </Element>
  </Collapsible>
);
