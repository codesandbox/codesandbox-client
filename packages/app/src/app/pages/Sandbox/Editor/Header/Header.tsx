import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import UserMenu from 'app/pages/common/UserMenu';

import {
  SaveAllButton,
  RefreshButton,
  PatronButton,
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
import { HeaderProps } from './types';

export const Header = inject('store')(
  hooksObserver(({ zenMode, store }: HeaderProps & { store: any }) => {
    const vscode = store.preferences.settings.experimentVSCode;

    return (
      <Container zenMode={zenMode}>
        <Left>
          {store.hasLogIn ? (
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
          {store.updateStatus === 'available' && <RefreshButton />}
          {!store.isLoggedIn || (!store.isPatron && <PatronButton />)}
          {!store.isLoggedIn && <PreferencesButton />}
          <NewSandboxButton />
          {store.isLoggedIn && <LikeButton />}
          {store.user && store.user.curatorAt && <PickButton />}
          <ShareButton />
          <ForkButton />
          <AccountContainer>
            {store.isLoggedIn ? (
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
  })
);
