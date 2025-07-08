import React from 'react';
import { Banner, Link, Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { BannerProps } from './types';

export const SDKWorkspaceBanner: React.FC<BannerProps> = ({ onDismiss }) => {
  return (
    <Banner
      onDismiss={() => {
        track('SDK Workspace Bzanner - Dismiss');
        onDismiss();
      }}
    >
      <Stack direction="vertical" gap={2}>
        <Text color="#EDFFA5" size={6} weight="500">
          Welcome to the CodeSandbox dashboard
        </Text>
        <Stack direction="vertical" gap={2}>
          <Text>
            We are in the process of creating a dashboard that is curated
            specifically for your SDK usage. Check out the{' '}
            <Link href="/t/usage">usage page</Link> for information related to
            your subscription and usage. Check out the{' '}
            <Link href="TODO">
              CLI docs
            </Link>{' '}
            on how to view and inspect sandboxes created via the SDK.
          </Text>
        </Stack>
      </Stack>
    </Banner>
  );
};
