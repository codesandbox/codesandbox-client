import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { ComponentProps, FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';

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

type Props = Pick<ComponentProps<typeof Container>, 'zenMode'>;
export const Header: FunctionComponent<Props> = ({ zenMode }) => {
  const {
    state: {
      hasLogIn,
      isLoggedIn,
      isPatron,
      preferences: {
        settings: { experimentVSCode: vscode },
      },
      updateStatus,
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

        {!(isLoggedIn && isPatron) && <PatronButton />}

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
