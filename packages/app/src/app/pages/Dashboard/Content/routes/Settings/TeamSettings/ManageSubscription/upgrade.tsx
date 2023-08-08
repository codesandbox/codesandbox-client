import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Stack, Text } from '@codesandbox/components';
import { TeamSubscriptionOptions } from 'app/pages/Dashboard/Components/TeamSubscriptionOptions/TeamSubscriptionOptions';

import { Card } from '../../components';

const StyledList = styled(Stack)`
  padding-left: 1em;
  margin: 0;

  ${Text} {
    list-style: disc;
    display: list-item;
  }
`;

export const Upgrade = () => {
  return (
    <Card
      css={{
        backgroundColor: 'white',
      }}
    >
      <Stack
        direction="vertical"
        gap={4}
        css={css({ color: 'grays.800', fontWeight: '500' })}
      >
        <Text size={4}>Upgrade to Pro</Text>
        <StyledList
          direction="vertical"
          gap={1}
          as="ul"
          css={css({ fontWeight: '400' })}
        >
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
        </StyledList>

        <TeamSubscriptionOptions
          buttonVariant="trial"
          trackingLocation="Team Settings"
        />
      </Stack>
    </Card>
  );
};
