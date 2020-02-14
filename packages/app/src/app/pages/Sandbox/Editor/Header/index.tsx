import React from 'react';
import { useOvermind } from 'app/overmind';

import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import { Stack, Link } from '@codesandbox/components';
import css from '@styled-system/css';

import { DashboardIcon } from './icons';
import { MenuBar } from './MenuBar';
import { SandboxName } from './SandboxName';
import { Actions } from './Actions';

export const Header = () => {
  const {
    state: { hasLogIn },
  } = useOvermind();

  return (
    <Stack
      as="header"
      justify="space-between"
      align="center"
      paddingX={2}
      css={css({
        boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        height: 12,
        backgroundColor: 'titleBar.activeBackground',
        color: 'titleBar.activeForeground',
        borderBottom: '1px solid',
        borderColor: 'titleBar.border',
      })}
    >
      <Stack align="center">
        {hasLogIn ? (
          <Link
            variant="muted"
            href={dashboardUrl()}
            css={{ lineHeight: 0 /* micro adjustment */ }}
          >
            <DashboardIcon />
          </Link>
        ) : (
          <Link href="/" css={{ padding: '2px' /* micro adjustment */ }}>
            <LogoIcon height={24} />
          </Link>
        )}
        <MenuBar />
      </Stack>

      <SandboxName />

      <Actions />
    </Stack>
  );
};
