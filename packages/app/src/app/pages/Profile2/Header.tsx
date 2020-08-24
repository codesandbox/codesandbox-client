import React from 'react';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { Stack, Link } from '@codesandbox/components';
import css from '@styled-system/css';

export const Header = () => (
  <Stack
    as="header"
    justify="space-between"
    align="center"
    paddingX={4}
    css={css({
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      height: 12,
      backgroundColor: 'titleBar.activeBackground',
      color: 'titleBar.activeForeground',
      borderBottom: '1px solid',
      borderColor: 'titleBar.border',
    })}
  >
    <Link href="/?from-app=1" css={css({ display: ['none', 'none', 'block'] })}>
      <LogoIcon
        style={{
          marginLeft: -6, // Logo positioning tweak
        }}
        height={24}
      />
    </Link>
  </Stack>
);
