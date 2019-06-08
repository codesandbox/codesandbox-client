import * as React from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useSignals, useStore } from 'app/store';
import UserMenu from 'app/pages/common/UserMenu';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import Logo from './Logo';
import CollectionInfo from './CollectionInfo';
import { MenuBarContainer } from './MenuBar';
import {
  SaveAllButton,
  RefreshButton,
  PatronButton,
  PreferencesButton,
  NewSandboxButton,
  LikeButton,
  ToggleFrozenButton,
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
  const signals = useSignals();
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

        {vscode ? <MenuBarContainer /> : <SaveAllButton />}
      </Left>

      {sandbox.owned && (
        <Centered style={{ margin: '0 3rem' }}>
          <CollectionInfo
            isLoggedIn={store.isLoggedIn}
            // Passing a clone of observable requires it to be called in render of observer
            sandbox={toJS(sandbox)}
          />
        </Centered>
      )}

      <Right>
        {store.updateStatus === 'available' && <RefreshButton />}
        {!store.isLoggedIn || (!store.isPatron && <PatronButton />)}
        {!store.isLoggedIn && <PreferencesButton />}
        <NewSandboxButton />
        {store.isLoggedIn && <LikeButton />}
        {sandbox.owned && <ToggleFrozenButton />}
        {store.user && store.user.curatorAt && <PickButton />}
        <ShareButton />
        <ForkButton />
        <AccountContainer>
          {store.isLoggedIn ? (
            <UserMenuContainer>
              <UserMenu store={store} signals={signals} />
            </UserMenuContainer>
          ) : (
            <SignInButton />
          )}
        </AccountContainer>
      </Right>
    </Container>
  );
});
