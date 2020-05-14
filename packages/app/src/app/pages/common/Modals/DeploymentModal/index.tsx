import React, { FunctionComponent } from 'react';
import { Element, Button, Text, Stack, Link } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import track from '@codesandbox/common/lib/utils/analytics';
import { Alert } from '../Common/Alert';
import { ZeitIcon } from './ZeitLogo';

export const DeploymentModal: FunctionComponent = () => {
  const {
    state: {
      user,
      deployment: { deploying, url },
    },
    actions: {
      deployment: { deployClicked },
      signInZeitClicked,
    },
  } = useOvermind();

  if (!user) {
    return null;
  }

  const {
    integrations: { zeit },
  } = user;
  const zeitSignedIn = Boolean(zeit);

  return (
    <Alert
      title="Deployment"
      description="Deploy a production version of your Sandbox to Vercel"
    >
      {url ? (
        <Element marginBottom={4}>
          <Text weight="bold" block size={4} align="center" paddingBottom={4}>
            Deployed!
          </Text>
          <Link variant="muted" block size={3} align="center" href={url}>
            {url}
          </Link>
          <Text paddingTop={4} block size={3} align="center">
            You can manage your deployments{' '}
            <Link
              variant="muted"
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noreferrer noopener"
            >
              here
            </Link>
            .
          </Text>
        </Element>
      ) : (
        <Stack
          align="center"
          marginBottom={4}
          css={css({
            border: '1px solid',
            borderColor: 'sideBar.border',
            borderRadius: 'medium',
          })}
        >
          <ZeitIcon />
          <Element paddingLeft={4}>
            {zeitSignedIn ? (
              <>
                <Text size={3} block paddingBottom={1} variant="muted">
                  Signed in with
                </Text>
                <Text size={3}>{zeit.email || 'Loading...'}</Text>
              </>
            ) : (
              <>
                <Text size={3} block paddingBottom={1}>
                  Please sign in
                </Text>
                <Button onClick={signInZeitClicked}>Sign In</Button>
              </>
            )}
          </Element>
        </Stack>
      )}
      <Stack justify="flex-end">
        <Button
          css={css({ width: 'auto' })}
          onClick={() => {
            track('Deploy Clicked', { provider: 'zeit' });
            deployClicked();
          }}
          disabled={!zeitSignedIn || deploying}
        >
          {deploying ? 'Deploying' : 'Deploy Sandbox'}
        </Button>
      </Stack>
    </Alert>
  );
};
