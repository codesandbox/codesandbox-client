import React from 'react';
import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';

export const Card = props => (
  <Stack
    {...props}
    direction="vertical"
    css={css({
      minHeight: 200,
      padding: 6,
      background:
        '#1D1D1D' /* file not supporting tokens yet, TODO: change to card.background */,
      border: '1px solid',
      borderColor: 'transparent',
      borderRadius: 'medium',
      ...(props.css || {}),
    })}
  />
);
