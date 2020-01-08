import React from 'react';
import { Collapsible } from '.';
import { Text } from '../Text';
import { Element } from '../Element';

export default {
  title: 'components/Collapsible',
  component: Collapsible,
};

export const Basic = () => (
  <Collapsible title="Sandbox Info">
    <Text weight="medium" marginX={2} marginBottom={2}>
      The move from Cerebral
    </Text>
    <Text variant="muted" marginX={2}>
      This is a static template with no bundling
    </Text>
  </Collapsible>
);

export const DefaultOpen = () => (
  <Collapsible title="Sandbox Info" defaultOpen>
    <Element marginX={2}>
      <Text as="div" weight="medium" marginBottom={2}>
        The move from Cerebral
      </Text>
      <Text variant="muted">This is a static template with no bundling</Text>
    </Element>
  </Collapsible>
);
