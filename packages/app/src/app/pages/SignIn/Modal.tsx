import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import {
  github as GitHubIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import {
  Element,
  Stack,
  Text,
  Button as MainButton,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import history from 'app/utils/history';
import { MainTitle, Paragraph } from './components/v2';

import { LeftSide } from './components/LeftSide';
import { Wrapper } from './components/Wrapper';
import { Button, ButtonV2 } from './components/Button';
import { UserNameSelection } from './components/UserNameSelection';
import { DuplicateAccount } from './components/DuplicateAccount';

import '../WaitList/fonts/index.css';

type SignInModalElementProps = {
  redirectTo?: string;
  onSignIn?: () => void;
  v2Style?: boolean;
};

export const SignInModalElement = ({
  redirectTo,
  onSignIn,
  v2Style,
}: SignInModalElementProps) => {
  const {
    duplicateAccountStatus,
    pendingUser,
    pendingUserId,
    loadingAuth,
    cancelOnLogin,
  } = useAppState();
  const {
    signInButtonClicked,
    getPendingUser,
    setLoadingAuth,
    toggleSignInModal,
  } = useActions();

  useEffect(() => {
    if (pendingUserId) {
      getPendingUser();
    }
  }, [getPendingUser, pendingUserId]);

  const handleSignIn = async () => {
    setLoadingAuth('github');
    await signInButtonClicked({ provider: 'github', useExtraScopes: false });

    if (onSignIn) {
      return onSignIn();
    }

    if (redirectTo) {
      if (redirectTo.startsWith('https')) {
        window.location.replace(redirectTo);

        return null;
      }

      return history.push(redirectTo.replace(location.origin, ''));
    }
    setLoadingAuth('github');

    return null;
  };

  const handleGoogleSignIn = async () => {
    setLoadingAuth('google');
    await signInButtonClicked({ provider: 'google' });

    if (onSignIn) {
      return onSignIn();
    }

    if (redirectTo) {
      if (redirectTo.startsWith('https')) {
        window.location.replace(redirectTo);

        return null;
      }

      return history.push(redirectTo.replace(location.origin, ''));
    }

    setLoadingAuth('google');

    return null;
  };

  if (duplicateAccountStatus) {
    return (
      <Wrapper oneCol>
        <DuplicateAccount provider={duplicateAccountStatus.provider} />
      </Wrapper>
    );
  }

  if (pendingUser) {
    return (
      <Wrapper oneCol>
        <UserNameSelection />
      </Wrapper>
    );
  }

  if (v2Style) {
    return (
      <Stack
        padding={8}
        direction="vertical"
        gap={3}
        css={{ textAlign: 'center' }}
      >
        <svg
          width="284"
          height="284"
          viewBox="0 0 284 284"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: '0 auto -80px' }}
        >
          <g filter="url(#filter0_d_419_3989)">
            <rect
              x="108"
              y="114"
              width="68"
              height="68"
              rx="34"
              fill="url(#paint0_linear_419_3989)"
            />
          </g>
          <rect
            x="129"
            y="136"
            width="27"
            height="27"
            stroke="black"
            strokeWidth="4"
          />
          <defs>
            <filter
              id="filter0_d_419_3989"
              x="0"
              y="0"
              width="284"
              height="284"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="-6" />
              <feGaussianBlur stdDeviation="54" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.909277 0 0 0 0 0.914178 0 0 0 0 0.889672 0 0 0 0.4 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_419_3989"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_419_3989"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_419_3989"
              x1="153.5"
              y1="167"
              x2="108"
              y2="118"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D6D6D6" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
          </defs>
        </svg>

        <MainTitle>Sign in to CodeSandbox</MainTitle>
        <Paragraph>Get a free account, no credit card required</Paragraph>

        <Stack
          direction="vertical"
          gap={3}
          css={{ width: 200, margin: '20px auto' }}
        >
          <ButtonV2 onClick={handleSignIn}>
            <GitHubIcon width="20" height="20" />
            <Element css={css({ width: '100%' })}>Sign in with GitHub</Element>
          </ButtonV2>
          <ButtonV2 css={{ background: 'white' }} onClick={handleGoogleSignIn}>
            <GoogleIcon width="20" height="20" />
            <Element css={css({ width: '100%' })}>Sign in with Google</Element>
          </ButtonV2>
        </Stack>
      </Stack>
    );
  }

  return (
    <Wrapper>
      {!v2Style && <LeftSide />}
      <Element padding={8}>
        <Text weight="bold" size={23} paddingBottom={1} block>
          Sign in to CodeSandbox
        </Text>
        <Text variant="muted" size={3} paddingBottom={30} block>
          Get a free account, no credit card required
        </Text>

        <Button loading={loadingAuth.github} onClick={handleSignIn}>
          <GitHubIcon width="20" height="20" />
          <Element css={css({ width: '100%' })}>Sign in with GitHub</Element>
        </Button>
        <Button loading={loadingAuth.google} onClick={handleGoogleSignIn}>
          <GoogleIcon width="20" height="20" />
          <Element css={css({ width: '100%' })}>Sign in with Google</Element>
        </Button>

        {cancelOnLogin && (
          <MainButton
            variant="link"
            type="button"
            css={{
              marginBottom: 53,
              color: '#000',
              '&:hover:not(:disabled)': {
                color: '#000',
                opacity: 0.7,
              },
            }}
            onClick={() => {
              cancelOnLogin();
              toggleSignInModal();
            }}
          >
            <Text>Continue without an account</Text>
          </MainButton>
        )}

        <Text
          variant="muted"
          align="center"
          size={10}
          block
          css={css({
            lineHeight: '13px',
            maxWidth: '200px',
            margin: 'auto',

            a: {
              color: 'inherit',
            },
          })}
        >
          By continuing, you agree to CodeSandbox{' '}
          <a href="https://codesandbox.io/legal/terms">Terms of Service</a>,{' '}
          <a href="https://codesandbox.io/legal/privacy">Privacy Policy</a>
        </Text>
      </Element>
    </Wrapper>
  );
};
