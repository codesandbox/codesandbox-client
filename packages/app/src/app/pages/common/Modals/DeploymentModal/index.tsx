import track from '@codesandbox/common/es/utils/analytics';
import { Button, Element, Link, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { Alert } from '../Common/Alert';
import { VercelIcon } from './VercelLogo';

export const DeploymentModal: FunctionComponent = () => {
  const {
    state: {
      user,
      deployment: { deploying, url },
    },
    actions: {
      deployment: { deployClicked },
      signInVercelClicked,
    },
  } = useOvermind();

  if (!user) {
    return null;
  }

  const {
    integrations: { zeit: vercel },
  } = user;
  const vercelSignedIn = Boolean(vercel);

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
          <VercelIcon />
          <Element paddingLeft={4}>
            {vercelSignedIn ? (
              <>
                <Text size={3} block paddingBottom={1} variant="muted">
                  Signed in with
                </Text>
                <Text size={3}>{vercel.email || 'Loading...'}</Text>
              </>
            ) : (
              <>
                <Text size={3} block paddingBottom={1}>
                  Please sign in
                </Text>
                <Button onClick={signInVercelClicked}>Sign In</Button>
              </>
            )}
          </Element>
        </Stack>
      )}
      <Stack justify="flex-end">
        <Button
          css={css({ width: 'auto' })}
          onClick={() => {
            track('Deploy Clicked', { provider: 'vercel' });
            deployClicked();
          }}
          disabled={!vercelSignedIn || deploying}
        >
          {deploying ? 'Deploying' : 'Deploy Sandbox'}
        </Button>
      </Stack>
    </Alert>
  );
};
