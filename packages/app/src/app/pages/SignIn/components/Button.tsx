import React from 'react';

import { Button as BaseButton } from '@codesandbox/components';
import { css } from '@styled-system/css';

export const Button = ({ children, ...props }) => (
  <BaseButton
    {...props}
    css={css({
      fontSize: '1em',
      backgroundColor: 'white',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      color: 'grays.900',
      height: 'auto',
      padding: '12px 24px',
      justifyContent: 'flex-start',
      marginBottom: 8,
      borderRadius: 'medium',
      transition: 'all 200ms ease',

      '&:hover': {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.24)',
        transform: 'scale(1.05)',
      },

      '&:focus': {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.24)',
        transform: 'scale(1)',
      },

      ':hover, :focus': {
        background: 'transparent !important',
        backgroundColor: 'white',
        color: 'grays.900',
      },
    })}
  >
    {children}
  </BaseButton>
);
