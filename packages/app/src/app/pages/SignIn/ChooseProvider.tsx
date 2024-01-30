import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Button as MainButton,
  Element,
  Icon,
  Input,
  Stack,
  Text,
} from '@codesandbox/components';
import {
  AppleIcon,
  github as GitHubIcon,
  CodeSandboxIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import {
  privacyUrl,
  tosUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { Button } from './components/Button';
import type { SignInMode } from './types';

const StyledHeading = styled(Text)`
  margin: 0;
  text-align: center;
  font-family: Everett, sans-serif;
  font-size: 48px;
  font-weight: 500;
  line-height: 1.17;
  letters-pacing: -0.018em;
`;

const StyledGhostButton = styled(MainButton)`
  padding: 4px;
  width: fit-content;

  :hover:not([disabled]),
  :focus:not([disabled]) {
    background: transparent;
  }
`;

type ValidationState =
  | { state: 'IDLE' }
  | { state: 'VALIDATING' }
  | { state: 'VALID' }
  | { state: 'INVALID'; error: string };

type SSOSignInProps = {
  changeSignInMode: () => void;
  onValidInitialize: (ssoURL: string) => void;
};
const SSOSignIn: React.FC<SSOSignInProps> = ({
  changeSignInMode,
  onValidInitialize,
}) => {
  const { api } = useEffects();
  const [validation, setValidation] = React.useState<ValidationState>({
    state: 'IDLE',
  });

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email').toString();
    setValidation({ state: 'VALIDATING' });

    try {
      const { redirectUrl } = await api.initializeSSO(email);
      onValidInitialize(redirectUrl);
      setValidation({ state: 'VALID' });
    } catch (err) {
      setValidation({ state: 'INVALID', error: err.message });
    }
  };

  return (
    <Stack
      as={motion.div}
      align="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      direction="vertical"
      gap={8}
    >
      <StyledHeading as="h1" id="heading">
        Sign in with SSO
      </StyledHeading>
      <Stack
        as="form"
        css={{ width: '100%', maxWidth: '420px' }}
        direction="vertical"
        onSubmit={handleFormSubmit}
        gap={2}
      >
        <Stack direction="vertical" gap={1}>
          <Element css={{ position: 'relative', height: '48px' }}>
            <Input
              aria-labelledby="heading"
              aria-describedby="error"
              css={{
                height: '100%',
                padding: '16px',

                // Want the affordances but not the styling.
                ':disabled': { opacity: 1 },
              }}
              disabled={validation.state !== 'IDLE'}
              placeholder="Enter your email"
              type="email"
              name="email"
              autoFocus
              required
            />
            <Element
              css={{
                position: 'absolute',
                display: 'flexflexflex',
                height: 'fit-content',
                background: '#252525',
                padding: '2px',
                right: '16px',
                left: 'auto',
                top: 0,
                bottom: 0,
                margin: 'auto 0',
              }}
            >
              {
                {
                  VALID: <Icon css={{ color: '#B3FBB4' }} name="simpleCheck" />,
                  INVALID: (
                    <Icon css={{ color: '#ED6C6C' }} name="infoOutline" />
                  ),
                }[validation.state]
              }
            </Element>
          </Element>
          <Element aria-live="polite" id="error">
            {validation.state === 'INVALID' ? (
              <Text
                css={{
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0.005em',
                  color: '#EF7A7A',
                }}
              >
                {validation.error}. Please contact your team admin or{' '}
                <MainButton
                  css={{
                    all: 'unset',
                    textDecoration: 'underline',
                    transition: 'color .3s',
                  }}
                  onClick={changeSignInMode}
                  variant="link"
                >
                  sign in through a different method
                </MainButton>
                .
              </Text>
            ) : null}
          </Element>
        </Stack>
        <Button
          css={{
            width: '100%',
            height: '48px',
          }}
          disabled={validation.state !== 'IDLE'}
          type="submit"
        >
          <Text
            as="span"
            css={{
              lineHeight: 1,
            }}
            size={4}
            weight="medium"
          >
            {['VALIDATING', 'VALID'].includes(validation.state)
              ? 'Signin in...'
              : 'Continue with SSO'}
          </Text>
        </Button>
      </Stack>
    </Stack>
  );
};

type ChooseProviderProps = {
  defaultSignInMode?: SignInMode;
  onSignIn?: () => void;
};
export const ChooseProvider: React.FC<ChooseProviderProps> = ({
  defaultSignInMode,
  onSignIn,
}) => {
  const {
    signInButtonClicked,
    setLoadingAuth,
    toggleSignInModal,
  } = useActions();
  const { loadingAuth, cancelOnLogin, features } = useAppState();

  const [signInMode, setSignInMode] = React.useState<SignInMode>(
    defaultSignInMode
  );

  const showSwitchToSSO = signInMode === 'DEFAULT' && features.loginWithWorkos;
  const showSwitchToDefault =
    signInMode === 'SSO' &&
    (features.loginWithApple ||
      features.loginWithGoogle ||
      features.loginWithGithub);

  const handleSignIn = async (
    provider: 'github' | 'google' | 'apple' | 'sso',
    ssoURL?: string
  ) => {
    setLoadingAuth(provider);
    await signInButtonClicked({ provider, ssoURL });
    if (onSignIn) {
      return onSignIn();
    }

    setLoadingAuth(provider);
  };

  return (
    <AnimatePresence>
      <Stack
        as="section"
        align="center"
        css={{
          width: '100%',
          height: '100%',
          padding: '48px 0',
          color: '#fff',
        }}
        direction="vertical"
        justify="space-between"
      >
        <CodeSandboxIcon width={48} height={48} />
        {signInMode === 'DEFAULT' && (
          <Stack
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            direction="vertical"
            gap={8}
          >
            <Stack direction="vertical" gap={3}>
              <StyledHeading
                as="h1"
                css={{
                  maxWidth: '396px',
                }}
              >
                Sign in to CodeSandbox
              </StyledHeading>
              <Text
                css={{
                  textAlign: 'center',
                  lineHeight: 1.5,
                  opacity: 0.6,
                }}
                size={4}
              >
                Login or register to start building your projects today.
              </Text>
            </Stack>
            <Stack direction="vertical" gap={3}>
              {features.loginWithGithub && (
                <Button
                  css={{
                    width: '100%',
                    height: '48px',
                  }}
                  loading={loadingAuth.github}
                  onClick={() => handleSignIn('github')}
                >
                  <GitHubIcon />
                  <Text
                    as="span"
                    css={{
                      lineHeight: 1,
                    }}
                    size={4}
                    weight="medium"
                  >
                    Sign in with GitHub
                  </Text>
                </Button>
              )}

              <Stack
                css={{
                  '@media screen and (max-width: 440px)': {
                    flexDirection: 'column',
                  },
                }}
                gap={3}
              >
                {features.loginWithGoogle && (
                  <Button
                    css={{
                      width: '100%',
                      height: '40px',
                      flex: 1,
                    }}
                    loading={loadingAuth.google}
                    onClick={() => handleSignIn('google')}
                    secondary
                  >
                    <GoogleIcon />
                    <Text
                      as="span"
                      css={{ lineHeight: 1 }}
                      size={3}
                      weight="medium"
                    >
                      Sign in with Google
                    </Text>
                  </Button>
                )}
                {features.loginWithApple && (
                  <Button
                    css={{
                      width: '100%',
                      height: '40px',
                      flex: 1,
                    }}
                    loading={loadingAuth.apple}
                    onClick={() => handleSignIn('apple')}
                    secondary
                  >
                    <AppleIcon />
                    <Text
                      as="span"
                      css={{ lineHeight: 1 }}
                      size={3}
                      weight="medium"
                    >
                      Sign in with Apple
                    </Text>
                  </Button>
                )}
              </Stack>
            </Stack>
            {cancelOnLogin && (
              <MainButton
                variant="link"
                type="button"
                onClick={() => {
                  cancelOnLogin();
                  toggleSignInModal();
                }}
              >
                <Text>Continue without an account</Text>
              </MainButton>
            )}
          </Stack>
        )}
        {signInMode === 'SSO' && (
          <SSOSignIn
            changeSignInMode={() => setSignInMode('DEFAULT')}
            onValidInitialize={ssoURL => handleSignIn('sso', ssoURL)}
          />
        )}

        <Stack as="footer" align="center" direction="vertical">
          {showSwitchToSSO && (
            <StyledGhostButton
              onClick={() => setSignInMode('SSO')}
              variant="ghost"
            >
              Sign in with SSO
            </StyledGhostButton>
          )}
          {showSwitchToDefault && (
            <Text lineHeight="16px" size={13} variant="muted">
              Not SSO?{''}
              <StyledGhostButton
                onClick={() => setSignInMode('DEFAULT')}
                variant="ghost"
              >
                Sign in
              </StyledGhostButton>
            </Text>
          )}

          <Text
            css={{
              lineHeight: '13px',
              maxWidth: '240px',
              margin: '24px 0 0 0',

              a: {
                color: 'inherit',
              },
            }}
            variant="muted"
            align="center"
            size={12}
            block
          >
            By continuing, you agree to CodeSandbox{' '}
            <a href={tosUrl()} target="_blank" rel="noreferrer">
              Terms of Service
            </a>
            ,{' '}
            <a href={privacyUrl()} target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </Text>
        </Stack>
      </Stack>
    </AnimatePresence>
  );
};
