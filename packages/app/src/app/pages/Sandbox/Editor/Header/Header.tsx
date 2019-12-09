import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { UserMenu } from 'app/pages/common/UserMenu';

import {
  SaveAllButton,
  RefreshButton,
  PreferencesButton,
  NewSandboxButton,
  LikeButton,
  PickButton,
  ShareButton,
  ForkButton,
} from './Buttons';
import {
  Container,
  Right,
  Left,
  Centered,
  DashboardIcon,
  DashboardLink,
  AccountContainer,
  UserMenuContainer,
  SignInButton,
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
    <Container zenMode={zenMode}>
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
