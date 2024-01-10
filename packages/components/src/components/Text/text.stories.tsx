import React from 'react';
import { Text } from '.';
import { Icon } from '../Icon';
import { Stack } from '../Stack';

export default {
  title: 'components/Text',
  component: Text,
};

export const Basic = () => <Text>Plan old boring text</Text>;

export const Block = () => (
  <Text block marginX={2}>
    Sometimes a block needs to stand on its own block, especially when it needs
    margins
  </Text>
);

export const Variants = () => (
  <>
    <Text variant="body" block marginBottom={4}>
      body is the default variant which inherits color from it&apos;s container
    </Text>
    <Text variant="muted" block marginBottom={4}>
      Use muted when you don&apos;t want to ask for too much attention
    </Text>
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
  <Text block align="right">
    sometimes, just sometimes you need to align right
  </Text>
);

export const MaxWidth = () => (
  <Text maxWidth={200}>this text will get cropped beyond 200px</Text>
);

export const Truncate = () => (
  <Stack css={{ width: 200 }}>
    <Icon name="branch" />
    <Text truncate>This text will get cropped somewhere, over the rainbow</Text>
  </Stack>
);
