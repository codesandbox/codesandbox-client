import React from 'react';
import { Stack, Text, Icon } from '@codesandbox/components';

import {
  StyledCard,
  StyledSubscriptionLink,
} from '../components/SubscriptionCard';

export const PaymentSuccess = () => (
  <Stack gap={10} direction="vertical" align="center">
    <Stack gap={3} direction="vertical">
      <Text
        as="h1"
        fontFamily="everett"
        size={48}
        weight="500"
        align="center"
        lineHeight="56px"
        margin={0}
      >
        Your payment was successful.
      </Text>
    </Stack>
    <Stack>
      <StyledCard isHighlighted>
        <Stack direction="vertical" gap={4}>
          <Stack justify="center">
            <Icon name="simpleCheck" color="#5DCC67" size={48} />
          </Stack>
          <Text>We sent the details of your order to your email address.</Text>
          <StyledSubscriptionLink
            href="/dashboard/settings"
            variant="highlight"
          >
            Go to dashboard
          </StyledSubscriptionLink>
        </Stack>
      </StyledCard>
    </Stack>
  </Stack>
);
