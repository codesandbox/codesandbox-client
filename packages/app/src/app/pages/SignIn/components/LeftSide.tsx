import React from 'react';
import { Element, Text } from '@codesandbox/components';
import { css } from '@styled-system/css';

export const LeftSide = () => (
  <Element
    padding={8}
    css={css({
      color: 'white',
      backgroundColor: 'grays.800',
      '@media screen and (max-width: 779px)': {
        display: 'none',
      },
    })}
  >
    <Text weight="bold" size={5} paddingBottom={4} block>
      CodeSandbox
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Development & Prototyping
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Online IDE
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Embeds
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      CodeSandbox CI
    </Text>
    <Text block marginBottom={2} variant="muted">
      <Text variant="active" paddingRight={1}>
        ✓
      </Text>
      Teams
    </Text>
  </Element>
);
