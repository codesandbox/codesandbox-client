import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';
import React from 'react';

import {
  ForkButton,
  LikeButton,
  NewSandboxButton,
  PickButton,
  PreferencesButton,
  RefreshButton,
  SaveAllButton,
  ShareButton,
} from './Buttons';
import {
  AccountContainer,
  Centered,
  Container,
  DashboardIcon,
  DashboardLink,
  Left,
  Right,
  SignInButton,
  UserMenuContainer,
} from './elements';
import { Logo } from './Logo';
import { MenuBar } from './MenuBar';
import { SandboxName } from './SandboxName';
import { IHeaderProps } from './types';

export const Header: React.FC<IHeaderProps> = ({ zenMode }) => {
  const {
    state: {
      preferences: {
        settings: { experimentVSCode: vscode },
      },
      updateStatus,
      hasLogIn,
      isLoggedIn,
      user,
    },
  } = useOvermind();

  return (
    <Container zenMode={zenMode} as="header">
      <Left>
        {hasLogIn ? (
          <DashboardLink to={dashboardUrl()}>
            <DashboardIcon />
          </DashboardLink>
        ) : (
          <Logo />
        )}

        {vscode ? <MenuBar /> : <SaveAllButton />}
      </Left>

      <Centered>
        <SandboxName />
      </Centered>

      <Right>
        {updateStatus === 'available' && <RefreshButton />}
        {!isLoggedIn && <PreferencesButton />}
        <NewSandboxButton />
        {isLoggedIn && <LikeButton />}
        {user && user.curatorAt && <PickButton />}
        <ShareButton />
        <ForkButton />
        <AccountContainer>
          {isLoggedIn ? (
            <UserMenuContainer>
              <UserMenu />
            </UserMenuContainer>
          ) : (
            <SignInButton />
          )}
        </AccountContainer>
      </Right>
    </Container>
  );
};
