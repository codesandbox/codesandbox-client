import React from 'react';

import { Button as BaseButton } from '@codesandbox/components';
import { css } from '@styled-system/css';

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  secondary?: boolean;
} & React.ComponentProps<typeof BaseButton>;

export const Button = ({ children, secondary, loading, ...props }: Props) => (
  <BaseButton
    loading={loading}
    css={css({
      width: 150,
      height: 'auto',
      display: 'flex',
      marginY: '4px',
      paddingY: '8px',
      borderRadius: '4px',
      gap: 1,

      color: secondary ? '#999999' : '#151515',

      background: secondary ? '#2A2A2A' : '#EDFFA5',
      border: secondary ? 'solid 1px #373737' : 'solid 1px #EDFFA5',
      outline: secondary ? 'transparent solid 2px' : 'none',

      '&:hover, &:focus': {
        border: secondary ? 'solid 1px transparent' : 'solid 1px #EDFFA5',
        background: secondary ? '#2A2A2A!important' : '#EDFFA5',
        outline: secondary ? '#2A2A2A solid 2px' : 'none',
        color: secondary ? '#D6D6D6' : '#151515',
      },

      '&:focus': {
        outline: '#7B61FF solid 1px',
        border: secondary ? 'solid 1px transparent' : 'solid 1px #1D1D1D',
      },
    })}
    {...props}
  >
    {children}
  </BaseButton>
);
