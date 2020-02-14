import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import React from 'react';
import { useOvermind } from 'app/overmind';

import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';

import { DashboardIcon, DashboardLink } from './elements';
import { Logo } from './Logo';
import { MenuBar } from './MenuBar';
import { SandboxName } from './SandboxName';

import { Actions } from './Actions';

export const Header = ({ zenMode }) => {
  const {
    state: { hasLogIn },
  } = useOvermind();

  return (
    <Stack
      as="header"
      justify="space-between"
      align="center"
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
          <DashboardLink to={dashboardUrl()}>
            <DashboardIcon />
          </DashboardLink>
        ) : (
          <Logo />
        )}
        <MenuBar />
      </Stack>

      <SandboxName />

      <Actions />
    </Stack>
  );
};
