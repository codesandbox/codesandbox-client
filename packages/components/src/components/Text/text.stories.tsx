import React from 'react';
import { Text } from '.';

export default {
  title: 'components/Text',
  component: Text,
};

// replace the text inside with Text variants when available
export const Basic = () => (
  <Text>This is a static template with no bundling</Text>
);

export const Variants = () => (
  <>
    <Text variant="body">
      body is the default variant which inherits color from it&apos;s container
    </Text>
    <br />
    <br />
    <Text variant="muted">
      Use muted when you don&apos;t want to ask for too much attention
    </Text>
    <br />
    <br />
    <Text variant="danger">Now, we really want your atttention, hello!</Text>
  </>
);

export const Weight = () => (
  <>
    <Text weight="thin">thin: These are all the weights Inter supports</Text>
    <br />
    <Text weight="light">light: These are all the weights Inter supports</Text>
    <br />
    <br />
    <Text weight="normal">
      normal (default): Most of our interface uses these 3 sizes
    </Text>
    <br />
    <Text weight="medium">
      medium: Most of our interface uses these 3 sizes
    </Text>
    <br />
    <Text weight="semibold">
      semibold: Most of our interface uses these 3 sizes
    </Text>
    <br />
    <br />
    <Text weight="bold">bold: These are all the weights Inter supports</Text>
    <br />
    <Text weight="extrabold">
      extrabold: These are all the weights Inter supports
    </Text>
    <br />
    <Text weight="black">black: These are all the weights Inter supports</Text>
    <br />
  </>
);

export const Size = () => (
  <Text size={3}>Takes the size from fontSizes tokens</Text>
);

export const Align = () => (
  <Text as="div" align="right">
    sometimes, just sometimes you need to align right
  </Text>
);
