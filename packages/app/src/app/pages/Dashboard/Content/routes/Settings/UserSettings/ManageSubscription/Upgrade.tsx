import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Button, Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { Card } from '../../components';

const List = styled(Stack)`
  padding-left: 1em;
  margin: 0;

  ${Text} {
    list-style: disc;
    display: list-item;
  }
`;

export const Upgrade: React.FC<{ userCanStartTrial: boolean }> = ({
  userCanStartTrial,
}) => {
  return (
    <Card
      css={{
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 4,
      }}
    >
      <Stack direction="vertical" gap={4} css={css({ color: 'grays.800' })}>
        <Text size={4} weight="500">
          Experience the full CodeSandbox experience
        </Text>

        <List direction="vertical" gap={1} as="ul">
          <Text as="li" size={3}>
            Unlimited editors
          </Text>
          <Text as="li" size={3}>
            Unlimited private sandboxes & repositories
          </Text>
          <Text as="li" size={3}>
            Advanced privacy settings
          </Text>
          <Text as="li" size={3}>
            Higher upload limits
          </Text>
          <Text as="li" size={3}>
            Flexible permissions
          </Text>
        </List>

        <Button
          onClick={() => {
            track('User settings - Upgrade to Pro clicked', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            window.location.href = '/pro';
          }}
          variant="trial"
        >
          {userCanStartTrial ? 'Start trial' : 'Upgrade to Pro'}
        </Button>
      </Stack>
    </Card>
  );
};
