import React from 'react';
import { Stack, Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const AnonymousAvatar = () => (
  <Stack
    justify="center"
    align="center"
    css={css({
      size: 6,
      borderRadius: 'small',
      border: '1px solid',
      borderColor: 'grays.500',
    })}
  >
    <Element
      css={css({ size: 2, border: '1px solid', borderColor: 'white' })}
    />
  </Stack>
);
