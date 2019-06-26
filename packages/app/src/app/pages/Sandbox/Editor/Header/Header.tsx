import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useSignals, useStore } from 'app/store';
import UserMenu from 'app/pages/common/UserMenu';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Logo } from './Logo';
import { SandboxName } from './SandboxName';
import { MenuBar } from './MenuBar';
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
import { HeaderProps } from './types';

export const Header = observer(({ zenMode }: HeaderProps) => {
  const store = useStore();
  const sandbox = store.editor.currentSandbox;
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

      {sandbox.owned && (
        <Centered>
          <SandboxName />
        </Centered>
      )}

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
});
