import React from 'react';
import css from '@styled-system/css';
import { Stack, Text } from '@codesandbox/components';
import { GUTTER } from '../VariableGrid';

export const TemplatesRow: React.FC = () => {
  return (
    <Stack
      as="section"
      css={css({
        width: `calc(100% - ${2 * GUTTER}px)`,
        marginX: 'auto',
      })}
      direction="vertical"
      gap={4}
    >
      <Text
        as="h2"
        css={css({
          margin: 0,
        })}
        weight="400"
        size={4}
      >
        Pick up where you left off
      </Text>
    </Stack>
  );
};
