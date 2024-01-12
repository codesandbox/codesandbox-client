import * as React from 'react';

import {
  Banner,
  Button,
  Stack,
  Text,
  Icon,
  IconNames,
} from '@codesandbox/components';

import { useDismissible } from 'app/hooks';
import { Link } from 'react-router-dom';

export const UBBBetaBanner: React.FC = () => {
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_UBB_BETA_WELCOME'
  );

  if (isBannerDismissed) {
    return null;
  }

  return (
    <Banner onDismiss={dismissBanner}>
      <Stack gap={2} direction="vertical">
        <Text color="#EDFFA5" size={6} weight="500">
          Welcome to the usage-based billing beta
        </Text>
        <Text>
          This workspace has been added to an early beta experience. You can
          now:
        </Text>
      </Stack>

      <StyledFeatures />

      <Stack
        align="center"
        gap={6}
        css={{
          marginTop: '24px',
        }}
      >
        <Button autoWidth>Learn more</Button>
        <Button autoWidth variant="ghost">
          Dismiss
        </Button>
      </Stack>
    </Banner>
  );
};

const StyledFeatures: React.FC = () => {
  return (
    <Stack
      gap={6}
      as="ul"
      css={{
        listStyle: 'none',
        padding: '12px 0 24px 0',
        maxWidth: 724,
      }}
    >
      <Stack gap={3} as="li">
        <Icon css={{ flexShrink: 0, color: '#C2C2C2' }} name="lock" />
        <Text css={{ color: '#999' }} size={3}>
          Create private sandboxes and devboxes for free.
        </Text>
      </Stack>

      <Stack gap={3} as="li">
        <Icon css={{ flexShrink: 0, color: '#C2C2C2' }} name="server" />
        <Text css={{ color: '#999' }} size={3}>
          Customize Virtual Machine specs through the new{' '}
          <Link to="TODO">customer portal.</Link>
        </Text>
      </Stack>

      <Stack gap={3} as="li">
        <Icon css={{ flexShrink: 0, color: '#C2C2C2' }} name="sandbox" />
        <Text css={{ color: '#999' }} size={3}>
          Run devboxes and repositories on credits.
        </Text>
      </Stack>
    </Stack>
  );
};
