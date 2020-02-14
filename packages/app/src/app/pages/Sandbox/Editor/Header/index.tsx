import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { ComponentProps, FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { UserMenu } from 'app/pages/common/UserMenu';

import { Stack, Avatar, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { ReloadIcon, LikeIcon, EmbedIcon, ForkIcon } from './icons';

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
    state: {
      hasLogIn,
      isLoggedIn,
      updateStatus,
      user,
      editor: {
        currentSandbox: { owned, likeCount, userLiked },
      },
    },

    actions: { signInClicked },
  } = useOvermind();

  const handleSignIn = async () => {
    await signInClicked({ useExtraScopes: false });
  };

  let primaryAction;
  if (!isLoggedIn) primaryAction = 'Sign in';
  else primaryAction = owned ? 'Embed' : 'Fork';

  return (
    <>
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

        <Stack
          align="center"
          gap={1}
          marginRight={4}
          css={{
            button: {
              flex: 'none',
              width: 'auto',
            },
          }}
        >
          {(true || updateStatus === 'available') && (
            <Button variant="link">
              <ReloadIcon css={css({ height: 3 })} />
            </Button>
          )}
          <Button variant="link">
            <LikeIcon
              css={css({
                height: 3,
                marginRight: 1,
                color: userLiked ? 'reds.500' : 'inherit',
              })}
            />{' '}
            <span>{likeCount}</span>
          </Button>
          {user?.curatorAt && <Button variant="secondary">Pick</Button>}
          <Button variant={primaryAction === 'Embed' ? 'primary' : 'secondary'}>
            <EmbedIcon css={css({ height: 3, marginRight: 1 })} /> Embed
          </Button>
          <Button variant={primaryAction === 'Fork' ? 'primary' : 'secondary'}>
            <ForkIcon css={css({ height: 3, marginRight: 1 })} /> Fork
          </Button>
          <Button variant="secondary">Create Sandbox</Button>
          {isLoggedIn ? (
            <UserMenuContainer>
              <UserMenu>
                <Avatar
                  user={{ ...user, subscriptionSince: null }}
                  css={css({ img: { size: 6 } })}
                />
              </UserMenu>
            </UserMenuContainer>
          ) : (
            <Button variant="primary" onClick={handleSignIn}>
              Sign in
            </Button>
          )}
        </Stack>
      </Stack>

      {false && (
        <Container>
          <Left />
          <Centered />
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
      )}
    </>
  );
};
