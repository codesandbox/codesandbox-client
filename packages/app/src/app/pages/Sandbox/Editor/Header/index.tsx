import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { ComponentProps, FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';

import { Container, DashboardIcon, DashboardLink } from './elements';
import { Logo } from './Logo';
import { MenuBar } from './MenuBar';
import { SandboxName } from './SandboxName';

import { Actions } from './Actions';

type Props = Pick<ComponentProps<typeof Container>, 'zenMode'>;
export const Header: FunctionComponent<Props> = ({ zenMode }) => {
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
