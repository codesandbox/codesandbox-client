import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Button, Stack, Text } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';

import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useAppState } from 'app/overmind';
import { useSubscription } from 'app/hooks/useSubscription';

import { Card } from '../../components';

const List = styled(Stack)`
  padding-left: 1em;
  margin: 0;

  ${Text} {
    list-style: disc;
    display: list-item;
  }
`;

export const Upgrade = () => {
  const { activeTeam } = useAppState();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { hasActiveSubscription } = useSubscription();
  const checkout = useGetCheckoutURL({
    team_id:
      (isTeamAdmin || isPersonalSpace) && !hasActiveSubscription
        ? activeTeam
        : undefined,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: dashboardUrls.settings(activeTeam),
  });

  return (
    <Card
      css={{
        backgroundColor: 'white',
      }}
    >
      <Stack direction="vertical" gap={4} css={css({ color: 'grays.800' })}>
        <Text size={4} weight="bold">
          Upgrade to Team Pro
        </Text>
        <List direction="vertical" gap={1} as="ul">
          <Text as="li" size={3}>
            Advanced privacy settings
          </Text>
          <Text as="li" size={3}>
            Private NPM packages
          </Text>
          <Text as="li" size={3}>
            Unlimited editor seats
          </Text>
          <Text as="li" size={3}>
            Centralized billing
          </Text>
        </List>

        <Button
          as="a"
          href={checkout.state === 'READY' ? checkout.url : '/pro'}
          marginTop={2}
          variant="secondary"
        >
          Upgrade to Pro
        </Button>
      </Stack>
    </Card>
  );
};
