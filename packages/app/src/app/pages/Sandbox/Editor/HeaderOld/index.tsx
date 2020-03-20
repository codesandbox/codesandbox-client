import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';
import React, { ComponentProps, FunctionComponent } from 'react';

import {
  ForkButton,
  LikeButton,
  NewSandboxButton,
  PickButton,
  PreferencesButton,
  RefreshButton,
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

type Props = Pick<ComponentProps<typeof Container>, 'zenMode'>;
export const Header: FunctionComponent<Props> = ({ zenMode }) => {
  const {
    state: { hasLogIn, isLoggedIn, updateStatus, user },
  } = useOvermind();

  return (
    <Container as="header" zenMode={zenMode}>
      <Left>
        {hasLogIn ? (
          <DashboardLink to={dashboardUrl()}>
            <DashboardIcon />
          </DashboardLink>
        ) : (
          <Logo />
        )}
        <MenuBar />
      </Left>
      <Centered>
        <SandboxName />
      </Centered>

      <Right>
        {updateStatus === 'available' && <RefreshButton />}
        {!isLoggedIn && <PreferencesButton />}
        <NewSandboxButton />
        {isLoggedIn && <LikeButton />}
        {user?.curatorAt && <PickButton />}
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
