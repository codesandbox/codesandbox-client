import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Button, Stack, Text } from '@codesandbox/components';
import { Card } from '../../components';

const List = styled(Stack)`
  padding-left: 1em;
  margin: 0;

  ${Text} {
    list-style: disc;
    display: list-item;
  }
`;

export const Upgrade: React.FC<{
  loading: boolean;
  onUpgrade: () => void;
}> = ({ loading, onUpgrade }) => {
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

        <Button loading={loading} onClick={onUpgrade} variant="trial">
          Upgrade to Pro
        </Button>
      </Stack>
    </Card>
  );
};
