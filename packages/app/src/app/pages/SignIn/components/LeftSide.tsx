import React from 'react';
import { Element, Text } from '@codesandbox/components';
import { css } from '@styled-system/css';

export const LeftSide = () => (
  <Element
    padding={8}
    css={css({
      color: 'white',
      backgroundColor: 'grays.800',
      lineHeight: 1.2,
      '@media screen and (max-width: 779px)': {
        display: 'none',
      },
    })}
  >
    <Text weight="bold" size={5} paddingBottom={9} block>
      Join millions of people prototyping what’s next
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Code Anywhere
      <Text size={3} block marginTop={2} marginBottom={8}>
        An instant IDE on any device with a web browser.
      </Text>
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Start Quickly
      <Text size={3} block marginTop={2} marginBottom={8}>
        No setup, and templates for all popular frameworks.
      </Text>
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Prototype Rapidly
      <Text size={3} block marginTop={2} marginBottom={8}>
        Create web apps, test ideas, and share creations easily.
      </Text>
    </Text>
  </Element>
);
