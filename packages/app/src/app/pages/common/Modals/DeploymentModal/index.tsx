import React, { FunctionComponent } from 'react';
import { Element, Button, Text, Stack, Link } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import css from '@styled-system/css';
import track from '@codesandbox/common/lib/utils/analytics';
import { VercelIntegration } from 'app/pages/common/VercelIntegration';
import { Alert } from '../Common/Alert';

export const DeploymentModal: FunctionComponent = () => {
  const {
    user,
    deployment: {
      deploying,
      vercel: { url },
    },
  } = useAppState();
  const {
    deployPreviewClicked,
    deployProductionClicked,
  } = useActions().deployment;

  if (!user) {
    return null;
  }

  const {
    integrations: { vercel },
  } = user;
  const vercelSignedIn = Boolean(vercel);

  return (
    <Alert
      title="Deployment"
      description="Deploy a production version of your Sandbox to Vercel"
    >
      {url ? (
        <Element marginBottom={4}>
          <Text
            weight="regular"
            block
            size={4}
            align="center"
            paddingBottom={4}
          >
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
          <VercelIntegration />
        </Stack>
      )}
      {!vercelSignedIn || deploying ? (
        <Stack justify="flex-end">
          <Button css={css({ width: 'auto' })} disabled>
            Deploying
          </Button>
        </Stack>
      ) : (
        <Stack gap={4} justify="flex-end">
          <Button
            css={css({ width: 'auto' })}
            onClick={() => {
              track('Production Deploy Clicked', { provider: 'vercel' });
              deployProductionClicked();
            }}
          >
            Deploy Sandbox to Production
          </Button>
          <Button
            css={css({ width: 'auto' })}
            onClick={() => {
              track('Preview Deploy Clicked', { provider: 'vercel' });
              deployPreviewClicked();
            }}
          >
            Deploy Sandbox to Preview
          </Button>
        </Stack>
      )}
    </Alert>
  );
};
