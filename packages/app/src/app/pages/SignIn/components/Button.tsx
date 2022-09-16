import React from 'react';

import { Button as BaseButton } from '@codesandbox/components';
import { css } from '@styled-system/css';

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  onClick: () => void;
};

export const Button = ({ children, secondary, loading, ...props }: Props) => (
  <BaseButton
    loading={loading}
    css={css({
      width: 'auto',
      height: 'auto',
      display: 'flex',
      marginY: '4px',
      paddingY: '8px',
      borderRadius: '4px',
      gap: 1,

      background: secondary ? 'transparent' : '#EDFFA5',
      color: secondary ? '#999999' : '#151515',
    })}
    {...props}
  >
    {children}
  </BaseButton>
);
